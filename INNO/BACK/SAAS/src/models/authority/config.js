const AuthorityIndex = r => require.ensure([], () => r(require("@/models/authority/pages/index")), "authorityIndex");
const SetAuthority = r => require.ensure([], () => r(require("@/models/authority/pages/set-authority")), "setAuthority");
const menuInfos = {
    menu: "Authority"
};
const routes = [
    {
        name: "Authority",
        path: "/authority",
        component: AuthorityIndex,
        meta: {
            ...menuInfos,
            title: "权限角色"
        }
    },
    {
        name: "SetAuthority",
        path: "/authority/setAuthority",
        component: SetAuthority,
        meta: {
            ...menuInfos,
            title: "编辑权限",
        }
    },
];

const menus = [{
    name: "Authority",
    title: "权限设置",
    icon: "icon-admin",
    to: "Authority"
}];

export default {
    routes,
    menus
};
