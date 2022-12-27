// pages/main/staff-module/repository/index.js
const App = getApp();
Page(App.BP({  
    data: {
        isSelect:false,
        categoryList:[{
            name:"全部"
        }], 
    }, 
    onLoad: function (options) {
        this.options = options;
        this.setData({
            isSelect:options.fromType == 'activity'
        })
        this.loadData();
    },  
    loadData(){
        getGoodsInfo({activityId:(this.options.activity_id||0)}).then(res=>{
            if(res.code==1){
                let goodsList = res.data||[];
                this.setData({goodsList});
            }
            return res;
        })
    },
    onSelect(e){
        let detail = e.detail||{};
        let {index,item} = detail; 
        if(item){
            this.setData({[`goodsList[${index}]`]:item})
        }
    },
    onSelectAll(e){
        let detail = e.detail||{};
        let {goodsList} = detail; 
        if(goodsList){
            this.setData({goodsList})
        }
    },
    save(e){
        let detail = e.detail ||{};
        let goodsList = detail.goodsList||[];
        App.StorageH.set('curGetGoodsList',{activity_id:this.options.activity_id,goodsList}) || ""; 
        wx.navigateBack()
    }
}))
function getGoodsInfo(params){
    return App.Http.QT_GoodsApi.getGoodsInfo({
        data: params,
    })
}