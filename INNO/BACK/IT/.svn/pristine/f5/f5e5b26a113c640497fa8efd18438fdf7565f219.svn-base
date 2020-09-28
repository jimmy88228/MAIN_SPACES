import Vue from "vue";
import Models from "@/models/model-config";
import LM from "@/helper/manager/login-manager";

function saveOpenedPages(tags) {
    sessionStorage.setItem("openedPagesTags", JSON.stringify(tags));
}

function readOpenedPages() {
    let tagsJson = sessionStorage.getItem("openedPagesTags");
    try {
        return JSON.parse(tagsJson);
    } catch (e) {}
}

function filterMenus(menus, senior) {
    menus || (menus = []);
    menus.map(e => {
        e.isHide = !senior && e.extra && e.extra.senior;
    });
    return menus;
}
const PageHelper = new Vue({
    data: {
        menus: filterMenus(Models.menus, LM.isSenior),
        menuCurrent: {},
        breadcrumbList: [],
        openedPagesTags: readOpenedPages()
    },
    computed: {
        isSenior() {
            return LM.isSenior;
        }
    },
    watch: {
        isSenior(val) {
            this.menus = filterMenus(Models.menus, val);
        }
    },
    methods: {
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
                                params: { ...to.params },
                                query: { ...to.query }
                            }
                        }
                    });
                    return true;
                } else if (to.meta.senior && !LM.isSenior) {
                    next({
                        path: "/"
                    });
                    return true;
                }
            }
        },
        setNewPage(route) {
            this.setCurrent(route);
            // this.addOpenedPageTag(route);
        },
        setCurrent(route) {
            let menuName = route.meta && route.meta.menu;
            let menu = Models.menusMap[menuName];
            this.menuCurrent = menu || {};

            let breadcrumbList = [];
            let parentMenu = Models.menusMap[menu.parent];
            if (parentMenu) {
                breadcrumbList.push({
                    name: parentMenu.name,
                    title: parentMenu.title,
                    to: parentMenu.to
                });
            }
            if (menu.to !== route.name) {
                breadcrumbList.push({
                    name: menu.name,
                    title: menu.title,
                    to: menu.to
                });
                breadcrumbList.push({
                    name: route.name,
                    title: route.meta.title
                });
            } else {
                breadcrumbList.push({
                    name: menu.name,
                    title: menu.title
                });
            }
            this.breadcrumbList = breadcrumbList;
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
        removeOpenedPageTag({ route, name, cb }) {
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
        moveOpenedPageTag({ oldIndex, newIndex }) {
            let movedRow = this.openedPagesTags[oldIndex];
            this.openedPagesTags.splice(oldIndex, 1);
            this.openedPagesTags.splice(newIndex, 0, movedRow);
            saveOpenedPages(this.openedPagesTags);
        },
        clearOpenedPageTag({ route, cb }) {
            if (route) {
                this.openedPagesTags = [
                    {
                        title: route.meta && route.meta.title,
                        name: route.name,
                        path: route.path,
                        query: route.query,
                        params: route.params
                    }
                ];
            } else {
                this.openedPagesTags = [];
                let item = {
                    path: "/"
                };
                cb && cb(item);
            }
            saveOpenedPages(this.openedPagesTags);
        }
    }
});

export default PageHelper;
