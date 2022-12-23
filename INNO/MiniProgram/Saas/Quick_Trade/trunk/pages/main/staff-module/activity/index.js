// pages/main/staff-module/activity/index.js
const App = getApp();
Page(App.BP({
    data:{
        acInfo:{},
        goodsList:[],
        inited:false,
        dateString:"",
        setting:false,
        today:getToday().replace(/\//g, "-"),
    }, 
    onShow(){
        this.loadData();
    },
    loadData(){
        this.setData({inited:true})
        return getActivityNoCachDetail().then(res=>{
            if(res.code==1){
                let acInfo = res.data||{};
                this.setData({acInfo,dateString:acInfo.status == 1 && acInfo.end_time || ""})
                console.log('dateString',this.data.dateString)
            }
        })
    },
    setTime(){ 
        let acInfo = this.data.acInfo||{};
        let storeInfo = App.StoreH.storeInfo||{};
        let start_time = acInfo.id && acInfo.status == 1 && acInfo.start_time || this.data.today;
        let params = {
            "ActityId": acInfo.id||0,
            "start_time": start_time,
            "end_time": this.data.dateString||"", 
            "store_id": storeInfo.storeId||0,
        }
        return activityUpdateOrInsert(params);
    },
    onTimeChange(e){
        console.log(e);
        this.setData({setting:true})
        let detail = e.detail||{};
        let dateString = detail.dateString||"";
        this.setData({dateString})
    },
    save(){
        if(!this.data.dateString){
            App.SMH.showToast({title:"请先设置活动结束时间"});
            return
        }
        return Promise.all([this.setTime()]).then(res=>{
            console.log('all',res);
            let title="保存成功";
            for(let i = 0,len=res.length;i<len;i++){
                let item = res[i]||{};
                if(item.code!=1){
                    title = "保存失败,请确认数据无误";
                    break;
                }
            } 
            App.SMH.showToast({title});
            return res
        })
    }

}))
function  getActivityNoCachDetail(){
    return App.Http.QT_GoodsApi.getActivityNoCachDetail({
        data:{},
    })
}

function activityUpdateOrInsert(params){
    return App.Http.QT_GoodsApi.activityUpdateOrInsert({
        data:params
    })
}

function getToday(){
    let date = new Date();
    return date.toLocaleDateString() + " " + tenChar(date.getHours()) + ":" + tenChar(date.getMinutes()) + ":" + tenChar(date.getSeconds());
}

function tenChar(num){
    return num < 10 ? '0' + num : num;
}