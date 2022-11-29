import Vue from "vue";
import routerConfig from "@/models/router-config";
import LM from "@/helper/manager/login-manager";
import Utils from "@/helper/utils/index";
import routesConfig from "@/models/router-config.js";

function saveOpenedPages(tags) {
    sessionStorage.setItem("openedPagesTags", JSON.stringify(tags));
}

function readOpenedPages() {
    let tagsJson = sessionStorage.getItem("openedPagesTags");
    try {
        return JSON.parse(tagsJson);
    } catch (e) {}
}

function getCacheMenus() {
    let menus, hasAction, actionCodeMap;
    if (Utils.cache) {
        menus = Utils.cache.get("initialMenu");
        hasAction = Utils.cache.get("hasAction");
        actionCodeMap = Utils.cache.get("actionCodeMap");
    }
    return {
        menus: menus || [],
        hasAction: hasAction || [],
        actionCodeMap: actionCodeMap || {}
    };
}

function assemMenu(menus, parent = [], codeData = {}) {
    parent = parent || [];
    if (menus instanceof Array && menus.length > 0) {
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i] || {};
            let actionCode = menu.actionCode || "";
            menus[i].parent = parent;
            menus[i].opened = false;
            // 收集actionCode信息
            if (!codeData[actionCode]) {
                codeData[actionCode] = {}
            }
            codeData[actionCode].parent = parent;
            codeData[actionCode].title = menu.title;
            // codeData[actionCode].isAction = 1;
            if (menu.children instanceof Array && menu.children.length > 0) {
                let _parent = JSON.parse(JSON.stringify(parent));
                if (actionCode) {
                    _parent.push(actionCode);
                }
                let {
                    menus: _menus
                } = assemMenu(menu.children, _parent, codeData);
                menu.children = _menus;
            }
        }
    }
    return {
        menus,
        codeData
    }
}

const PageHelper = new Vue({
    data: {
        menus: getCacheMenus.call(this).menus,
        hasAction: getCacheMenus.call(this).hasAction,
        actionCodeMap: getCacheMenus.call(this).actionCodeMap,
        routesMenuMap: routesConfig.routesMenuMap,
        menuCurrent: {},
        breadcrumbList: Utils.cache.get("breadcrumbList") || [],
        openedPagesTags: readOpenedPages(),
    },
    computed: {
        isHideUserCenter(){
            let userInfos = LM.userInfos || {};
            let mainData = userInfos.main_data || {};
            return false //mainData.customer_type == 'platform' // self(独立版) , platform(平台版)
        }
    },
    watch: {
    },
    methods: {
        setMenus(initMenus, hasAction) {
            let {
                menus,
                codeData
            } = assemMenu(initMenus);
            this.menus = menus;
            this.hasAction = hasAction || [];
            Utils.cache.set("initialMenu", this.menus);
            Utils.cache.set("hasAction", this.hasAction);
            this.setActionCodeMap(codeData, hasAction);
        },
        setActionCodeMap(codeData = {}, hasAction = []) {
            let tempCode = JSON.parse(JSON.stringify(codeData));
            if (hasAction instanceof Array && hasAction.length > 0) {
                for (let i = 0; i < hasAction.length; i++) {
                    let action = hasAction[i] || '';
                    if (action) {
                        let allI = action.indexOf('.all');
                        if (allI != -1) {
                            let mainAction = action.substring(0, allI);
                            for (let key in tempCode) {
                                let parent = codeData[key].parent;
                                if(key == 'personalCenter' && this.isHideUserCenter){
                                    // 平台版屏蔽个人中心
                                    continue;
                                }
                                if ((key == mainAction || parent.indexOf(mainAction) != -1)) {
                                    codeData[key].isAction = 1;
                                    delete tempCode[key]; // 避免重复遍历；
                                }
                            }
                        } else {
                            if(action == 'personalCenter' && this.isHideUserCenter){
                                // 平台版屏蔽个人中心
                                continue;
                            }
                            if (!codeData[action]) {
                                codeData[action] = {}
                            }
                            codeData[action].isAction = 1;
                            delete tempCode[action];
                        }
                    }

                }
            }
            this.actionCodeMap = codeData;
            Utils.cache.set("actionCodeMap", this.actionCodeMap);
        },
        checkLogin(to, from, next) {
            if (to.name === "Login" && LM.isLogin) {
                next({
                    path: "/",
                    query: {
                        $isReplace: true
                    }
                });
                return true;
            } else if (to.name !== "Login") {
                if (!LM.isLogin) {
                    next({
                        name: "Login",
                        query: {
                            $isReplace: true
                        },
                        params: {
                            target: {
                                name: to.name,
                                path: to.path,
                                params: {
                                    ...to.params
                                },
                                query: {
                                    ...to.query
                                }
                            }
                        }
                    });
                    this.setMenus();
                    return true;
                }
            }
        },
        setNewPage(route, from) {
            this.setCurrent(route, from);
            this.addOpenedPageTag(route);
        },
        setCurrent(route, from) {
            if (route.name) {
                let actionCodeMap = this.actionCodeMap || {};
                let meta = route.meta || {};
                let actTionMenu = meta.menu || "";
                let thisAction = actionCodeMap[actTionMenu] || {};
                let parent = JSON.parse(JSON.stringify(thisAction.parent || []))
                this.menuCurrent = {
                    ...route,
                    parent: parent
                };

                // 增加菜单路由面包屑
                let currentBread = {
                    name: route.name,
                    title: meta.title,
                    to: route.name,
                    query: route.query,
                    params: route.params
                }
                let breadcrumbList =  this.breadcrumbList || [];
                let breadcrumbNames = breadcrumbList.map((item)=>{
                    if(item.name) { return item.name } else { return "" }
                })
                if (from && from.meta && from.meta.menu == actTionMenu || (!from)) { // 同一个菜单下
                    let hasRouteIndex = -1, breadcrumbLen = breadcrumbList.length || 0;
                    hasRouteIndex = breadcrumbNames.indexOf(route.name);
                    if(hasRouteIndex >= 0){ // 存在相同，剔除到相同位置
                        breadcrumbList.splice(hasRouteIndex + 1, breadcrumbLen - 1)
                    } else { // 不存在，添加
                        breadcrumbList.push(currentBread);
                    }
                } else {
                    breadcrumbList = [{
                        name: "home",
                        title: "HOME",
                        to: "homw",
                    }]
                    if(route.name != 'home'){
                        if(actTionMenu){
                            let menuRoute = routerConfig.routesMenuMap[actTionMenu]; // 菜单路由
                            if(menuRoute.name != route.name){
                                breadcrumbList.push({
                                    name: menuRoute.name,
                                    title: menuRoute.title,
                                    to: menuRoute.name
                                })
                            }
                        }
                        breadcrumbList.push(currentBread);
                    }
                    this.breadcrumbList = breadcrumbList;
                }
                Utils.cache.set("breadcrumbList", this.breadcrumbList);
            }
        },
        addOpenedPageTag(route) {
            this.openedPagesTags || (this.openedPagesTags = []);
            let index = -1;
            for (let i = 0, n = this.openedPagesTags.length; i < n; i++) {
                let e = this.openedPagesTags[i];
                if (e.name === route.name) {
                    index = i;
                }
            }
            let newTag = {
                title: route.meta && route.meta.title,
                name: route.name,
                path: route.path,
                query: route.query,
                params: route.params
            };
            if (index >= 0) {
                this.openedPagesTags.splice(index, 1, newTag);
            } else {
                this.openedPagesTags.push(newTag);
            }
            saveOpenedPages(this.openedPagesTags);
        },
        removeOpenedPageTag({
            route,
            name,
            cb
        }) {
            if (!this.openedPagesTags) {
                return;
            }
            let index = -1;
            for (let i = 0, n = this.openedPagesTags.length; i < n; i++) {
                let e = this.openedPagesTags[i];
                if (e.name === name) {
                    index = i;
                }
            }
            if (index >= 0) {
                this.openedPagesTags.splice(index, 1);
            }
            saveOpenedPages(this.openedPagesTags);
            if (route.name === name && cb) {
                index = Math.min(this.openedPagesTags.length - 1, index);
                index >= 0 && cb(this.openedPagesTags[index]);
            }
        },
        moveOpenedPageTag({
            oldIndex,
            newIndex
        }) {
            let movedRow = this.openedPagesTags[oldIndex];
            this.openedPagesTags.splice(oldIndex, 1);
            this.openedPagesTags.splice(newIndex, 0, movedRow);
            saveOpenedPages(this.openedPagesTags);
        },
        clearOpenedPageTag({
            route,
            cb
        }) {
            if (route) {
                this.openedPagesTags = [{
                    title: route.meta && route.meta.title,
                    name: route.name,
                    path: route.path,
                    query: route.query,
                    params: route.params
                }];
            } else {
                this.openedPagesTags = [];
                let item = {
                    path: "/",
                    params: {}
                };
                cb && cb(item);
            }
            saveOpenedPages(this.openedPagesTags);
        },
    }
});

export default PageHelper;