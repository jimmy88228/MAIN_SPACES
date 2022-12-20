// pages/main/staff-module/activity/index.js
const App = getApp();
Page(App.BP({
    data:{
        acInfo:{}
    }, 
    onShow(){
        this.loadData();
    },
    loadData(){
        return getActivityNoCachDetail().then(res=>{
            if(res.code==1){
                let acInfo = res.data||{};
                this.setData({acInfo})
            }
        })
    },
}))
function  getActivityNoCachDetail(){
    return App.Http.QT_GoodsApi.getActivityNoCachDetail({
        data:{},
    })
}