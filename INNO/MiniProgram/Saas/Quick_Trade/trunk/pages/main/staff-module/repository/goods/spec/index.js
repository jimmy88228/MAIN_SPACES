// pages/main/staff-module/repository/goods/spec/index.js
const App = getApp();
Page(App.BP({   
    data: {
        specInfo:{
            "size":{
                name:"规格",
                list:[{name:"大",id:1},{name:"中",id:2}]
            },
            "color":{
                name:"颜色",
                list:[{name:"红",id:3},{name:"黑",id:4}]
            }
        },
        curSel:"size"
    },
    
}))