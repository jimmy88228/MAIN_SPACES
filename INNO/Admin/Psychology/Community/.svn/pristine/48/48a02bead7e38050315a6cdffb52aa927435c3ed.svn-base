const User = r => require.ensure([], () => r(require("@/models/user/pages/index")), "user");
const UserDetails = r => require.ensure([], () => r(require("@/models/user/pages/details")), "user");
const menuInfos = {
    menu: "User"
};
const routes = [{
        name: "User",
        path: "/user",
        component: User,
        meta: {
            ...menuInfos,
            title: "会员管理"
        }
    },
    {
        name: "UserDetails",
        path: "/user/details",
        component: UserDetails,
        meta: {
            ...menuInfos,
            title: "会员查看"
        }
    }
];

const menus = [{
    name: "User",
    title: "会员管理",
    icon: "icon-user",
    to: "User"
}];
export default {
    routes,
    menus
};
