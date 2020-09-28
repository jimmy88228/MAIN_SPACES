const Draw = r => require.ensure([], () => r(require("@/models/draw/pages/index")), "draw");
const menuInfos = {
    menu: "Draw"
};
const routes = [
    {
        name:"Draw",
        path:"/draw",
        component:Draw,
        meta:{
            ...menuInfos,
            title:"抽签"
        }
    },

]
const menus = [{
    name: "Draw",
    title: "抽签活动",
    icon: "icon-activity",
    to: "Draw"
}]
export default {
    routes,
    menus
}