class ModuleManager {
    addModule(...modules) {
        if (modules) {
            for (let i = 0, n = modules.length; i < n; i++) {
                let e = modules[i];
                if (e.routes && e.routes.length > 0) {
                    this.routesSrc || (this.routesSrc = []);
                    this.routesSrc.splice(this.routesSrc.length, 0, ...e.routes);
                }
                if (e.menus && e.menus.length > 0) {
                    this.menusSrc || (this.menusSrc = []);
                    this.menusSrc.splice(this.menusSrc.length, 0, ...e.menus);
                }
            }
        }
        return this;
    }
    addMenusGroup(groups) {
        if (groups && groups.length > 0) {
            this.menusGroups || (this.menusGroups = []);
            this.menusGroups.splice(this.menusGroups.length, 0, ...groups);
        }
        return this;
    }
    setSort(sort) {
        this.sortSrc = {};
        if (sort) {
            for (let i = 0, n = sort.length; i < n; i++) {
                this.sortSrc[sort[i]] = n - i;
            }
        }
        return this;
    }
    createRoutes() {
        let routes;
        if (this.routesSrc && this.routesSrc.length > 0) {
            routes = [];
            for (let i = 0, n = this.routesSrc.length; i < n; i++) {
                let e = this.routesSrc[i];
                routes.push(e);
            }
        }
        return {
            get routes() {
                return [...routes];
            }
        };
    }
    createMenus() {
        let menus;
        let menusMap;
        let groups = {};
        if (this.menusGroups && this.menusGroups.length > 0) {
            menus = [];
            menusMap = {};
            for (let i = 0, n = this.menusGroups.length; i < n; i++) {
                let _menu = this.menusGroups[i];
                let name = _menu.name;
                if (_menu.childs && _menu.childs.length > 0) {
                    for (let j = 0, jn = _menu.childs.length; j < jn; j++) {
                        groups[_menu.childs[j]] = name;
                    }
                }
                let sort = this.sortSrc[name] || 0;
                let menu = {
                    name: name,
                    title: _menu.title,
                    icon: _menu.icon,
                    sort: sort,
                    extra: _menu.extra
                };
                menus.push(menu);
                menusMap[name] = menu;
            }
        }
        if (this.menusSrc && this.menusSrc.length > 0) {
            menus || (menus = []);
            menusMap || (menusMap = {});
            for (let i = 0, n = this.menusSrc.length; i < n; i++) {
                let _menu = this.menusSrc[i];
                let name = _menu.name;
                let sort = this.sortSrc[name] || 0;
                let menu = {
                    name: name,
                    title: _menu.title,
                    icon: _menu.icon,
                    to: _menu.to,
                    sort: sort,
                    extra: _menu.extra
                };
                let groupName = groups[name];
                if (groupName) {
                    let group = menusMap[groupName];
                    if (!group) {
                        continue;
                    }
                    menu.parent = groupName;
                    group.childs || (group.childs = []);
                    group.childs.push(menu);
                } else {
                    menus.push(menu);
                }
                menusMap[name] = menu;
            }
        }
        menusSort(menus);
        return {
            get menus() {
                return [...menus];
            },
            get menusMap() {
                return { ...menusMap };
            }
        };
    }
    create() {
        return {
            ...this.createRoutes(),
            ...this.createMenus()
        };
    }
}

function menusSort(menus) {
    menus.sort(compare);
    for (let i = 0, n = menus.length; i < n; i++) {
        let item = menus[i];
        if (item.childs && item.childs.length > 0) {
            menusSort(item.childs);
        }
    }
}

function compare(x, y) {
    let xSort = x.sort || 0;
    let ySort = y.sort || 0;
    if (xSort < ySort) {
        return 1;
    } else if (xSort > ySort) {
        return -1;
    } else {
        return 0;
    }
}
export default ModuleManager;
