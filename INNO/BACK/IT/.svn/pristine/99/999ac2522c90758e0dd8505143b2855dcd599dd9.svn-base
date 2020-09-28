const Admins = r => require.ensure([], () => r(require("@/models/admins/pages/index")), "admins");
const routes = [
    {
        name: "Admins",
        path: "/admins",
        component: Admins,
        meta: {
            menu: "Admins",
            title: "账号管理",
            senior: true
        }
    }
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
