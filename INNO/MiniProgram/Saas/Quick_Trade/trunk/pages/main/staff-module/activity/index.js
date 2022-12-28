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
        acGoodsInfo:{}
    },
    onShow(){
        this.checkSet();
    }, 
    onLoad(){ 
        this.loadData();
    },
    checkSet(){
        if(this.data.inited){
            let curSetGoodsInfo = App.StorageH.get('curSetGoodsInfo') || {}; 
            let curGetGoodsList = App.StorageH.get('curGetGoodsList') || {}; 
            let acGoodsInfo = this.data.acGoodsInfo||{};
            console.log('checkSet',curSetGoodsInfo,curGetGoodsList,curGetGoodsList.activity_id , curGetGoodsList.activity_id , acGoodsInfo.activity_id);
            if(curGetGoodsList.activity_id && (curGetGoodsList.activity_id == acGoodsInfo.activity_id)){
                let goodsList = curGetGoodsList.goodsList||[];
                
                goodsList = goodsList.filter(item=>item.isSelected).map(item=>{
                    return {
                        sale_price:item.market_price||0,
                        goods_number:item.goods_number||0,
                        goods_name:item.goods_name||"",
                        goods_img:item.goods_img||"",
                        goods_id:item.goods_id||0,
                        // product_sn:item.product_sn
                    }
                })
                acGoodsInfo.goods_Infos = goodsList;
                this.setData({acGoodsInfo});
                console.log('看看',acGoodsInfo);
                App.StorageH.remove('curGetGoodsList')
            }
            if(curSetGoodsInfo.activity_id && (curSetGoodsInfo.activity_id == acGoodsInfo.activity_id)){
                let goodsInfo = curSetGoodsInfo.goodsInfo||{};
                let index = acGoodsInfo.goods_Infos.findIndex(item=>item.goods_id == goodsInfo.goods_id);
                if(index>-1){
                    goodsInfo.goods_img = goodsInfo.goodsImgs[0];
                    delete goodsInfo.goodsImgs;
                    acGoodsInfo.goods_Infos[index] = goodsInfo
                    console.log('看看',index,goodsInfo,acGoodsInfo);
                    this.setData({acGoodsInfo})
                    App.StorageH.remove('curSetGoodsInfo')
                }
            }
        }
    },
    loadData(){
        return this.getActivityNoCachDetail().then(()=>{
            return this.activityGoodsInfo();
        });
    },
    getActivityNoCachDetail(){ 
        return getActivityNoCachDetail().then(res=>{
            if(res.code==1){
                let acInfo = res.data||{};
                this.setData({acInfo,dateString:acInfo.status == 1 && acInfo.end_time || ""})
                console.log('dateString',this.data.dateString)
            }
            return res
        })
    },
    activityGoodsInfo(){
        return activityGoodsInfo({activityId:this.data.acInfo.id||0}).then(res=>{
            if(res.code==1){ 
                let acGoodsInfo = res.data||{};  
                acGoodsInfo.insertOrupdate = acGoodsInfo.goods_Infos.length>0 ? 1:0;
                this.setData({acGoodsInfo,inited:true});
                console.log('goods_Infos',this.data.acGoodsInfo)
            }
            return res
        })
    },
    activityGoodsUpdateOrInsert(){
        let acGoodsInfo = this.data.acGoodsInfo||{};
        return activityGoodsUpdateOrInsert({...acGoodsInfo,insertOrupdate:acGoodsInfo.insertOrupdate}).then(res=>{
        // return activityGoodsUpdateOrInsert({...acGoodsInfo,insertOrupdate:acGoodsInfo.goods_Infos.length==0?1:acGoodsInfo.insertOrupdate}).then(res=>{
            if(res.code==1){  
            }
            return res
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
        this.checkValid();
        return Promise.all([this.setTime(),this.activityGoodsUpdateOrInsert(this.data.acGoodsInfo||{})]).then(res=>{
            console.log('all',res);
            let title="保存成功",success=true;
            for(let i = 0,len=res.length;i<len;i++){
                let item = res[i]||{};
                if(item.code!=1){
                    title = item.msg||"保存失败,请确认数据无误";
                    success = false;
                    break;
                }
            } 
            !success && App.SMH.showToast({title});
            return success && this.loadData().then(()=>{
                App.SMH.showToast({title});
            })
        })
    },
    checkValid(){ 
        let title = "";
        if(!this.data.dateString){
            title = '请先设置活动结束时间'; 
        } else if(this.data.acGoodsInfo.goods_Infos<=0){
            title = '请先添加活动商品'; 
        }
        if(title){
            App.SMH.showToast({title});
            throw title
        }
    },
    onChangeList(e){
        let detail = e.detail||{};
        let list = detail.list||[]; 
        console.log(list);
        this.setData({
            'acGoodsInfo.goods_Infos':list
        })
    },

}))
function  getActivityNoCachDetail(){
    return App.Http.QT_GoodsApi.getActivityNoCachDetail({
        data:{},
    })
}
function  activityGoodsInfo(params){
    return App.Http.QT_GoodsApi.activityGoodsInfo({
        data:params||{},
    })
}

function activityUpdateOrInsert(params){
    return App.Http.QT_GoodsApi.activityUpdateOrInsert({
        data:params
    })
}

function activityGoodsUpdateOrInsert(params){
    console.log(params,'activityGoodsUpdateOrInsert');
    return App.Http.QT_GoodsApi.activityGoodsUpdateOrInsert({
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