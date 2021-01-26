const Admins = r => require.ensure([], () => r(require("@/models/admins/pages/index")), "admins");
// const SetAuthority = r => require.ensure([], () => r(require("@/models/admins/pages/set-authority")), "setAuthority");
const menuInfos = {
    menu: "Admins"
};
const routes = [
    {
        name: "Admins",
        path: "/admins",
        component: Admins,
        meta: {
            ...menuInfos,
            title: "账号管理",
            senior: true
        }
    },
    // {
    //     name: "SetAuthority",
    //     path: "/admins/setAuthority",
    //     component: SetAuthority,
    //     meta: {
    //         ...menuInfos,
    //         title: "编辑权限",
    //     }
    // }
];

const menus = [
    {
        name: "Admins",
        title: "账号管理",
        icon: "icon-admin",
        to: "Admins",
        extra: {
            senior: true
        }
    }
];

export default {
    routes,
    menus
};
