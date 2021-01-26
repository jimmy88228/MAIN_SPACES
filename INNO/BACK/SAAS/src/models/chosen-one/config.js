const ChosenOne = r => require.ensure([], () => r(require("@/models/chosen-one/pages/index")), "chosenOne");
const ChosenOneEdit = r => require.ensure([], () => r(require("@/models/chosen-one/pages/ac-edit/activity-edit")), "chosenOneEdit");
const ChosenOneEnrollList = r => require.ensure([], () => r(require("@/models/chosen-one/pages/enroll-list")), "enrollList");
const menuInfos = {
    menu: "ChosenOne"
};
const routes = [{
        name: "ChosenOne",
        path: "/chosenOne",
        component: ChosenOne,
        meta: {
            ...menuInfos,
            title: "天选之子"
        }
    },
    {
        name: "ChosenOneNew",
        path: "/chosenOne/chosenOneNew",
        component: ChosenOneEdit,
        meta: {
            ...menuInfos,
            title: "新建活动",
            isAdd: true
        }
    },
    {
        name: "ChosenOneEdit",
        path: "/chosenOne/chosenOneEdit",
        component: ChosenOneEdit,
        meta: {
            ...menuInfos,
            title: "编辑活动"
        }
    },
    {
        name: "ChosenOneEnrollList",
        path: "/chosenOne/enrollList",
        component: ChosenOneEnrollList,
        meta: {
            ...menuInfos,
            title: "查看名单"
        }
    }
];

const menus = [{
    name: "ChosenOne",
    title: "天选之子",
    icon: "icon-goods",
    to: "ChosenOne"
}];

export default {
    routes,
    menus
};
