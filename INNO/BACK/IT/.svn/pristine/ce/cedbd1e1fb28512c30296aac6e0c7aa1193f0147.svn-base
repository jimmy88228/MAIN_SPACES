const CustomLayout = r => require.ensure([], () => r(require("@/models/custom-layout/pages/index")), "customlayout");
const CustomModuleList = r => require.ensure([], () => r(require("@/models/custom-layout/pages/module-list")), "customlayout");
const CustomModuleEdit = r => require.ensure([], () => r(require("@/models/custom-layout/pages/module-edit")), "customlayout");

const menuInfos = {
    menu: "CustomLayout"
};
const routes = [{
    name: "CustomLayout",
    path: "/customlayout",
    component: CustomLayout,
    meta: {
        ...menuInfos,
        title: "自定义页面"
    }
}, {
    name: "CustomModuleList",
    path: "/customlayout/module",
    component: CustomModuleList,
    meta: {
        ...menuInfos,
        title: "自定义模块列表"
    }
}, {
    name: "CustomModuleEdit",
    path: "/customlayout/module/edit",
    component: CustomModuleEdit,
    meta: {
        ...menuInfos,
        title: "自定义模块编辑"
    }
}];

const menus = [{
    name: "CustomLayout",
    title: "自定义页面",
    icon: "icon-layout",
    to: "CustomLayout"
}];
export default {
    routes,
    menus
};
