// pages/main/staff-module/activity/cps/goods-list/index.js
const App = getApp();
Component(App.BC({ 
    options: {
        addGlobalClass: true,
    },
    properties: {
        list:{
            type:Array,
            value:[]
        }
    },
    data: {
        msgList:[{
            key:"name",
            name:"商品名称",
        },{
            key:"price",
            name:"抢购价格",
        },{
            key:"num",
            name:"抢购数量",
        }]
    },
    methods: {
        
    }
}))
