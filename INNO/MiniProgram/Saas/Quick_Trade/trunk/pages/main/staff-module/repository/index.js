// pages/main/staff-module/repository/index.js
const App = getApp();
Page(App.BP({  
    data: {
        isSelect:false,
        categoryList:[{
            id:0,
            catName:"全部"
        }],
        domainPath: "",
        goodsList:[]
    }, 
    onLoad: function (options) {
        this.options = options;
        this.hasMore = true;
        this.pageParams = {
          pageIndex:1,
          pageSize:20,
          searchStr:"",
          catId:0,
        }; 
        this.setData({
            isSelect:options.fromType == 'activity'
        })
    },  
    onShow(){
      this.onRefresh();
      this.getGoodsCategoryInfo();
    },
    loadData(onRefresh=false){
      this.showLoading();
        let {pageIndex,pageSize,searchStr,catId}=this.pageParams;
        return getGoodsInfo({searchStr,pageIndex,pageSize,catId}).then(res=>{
            if(res.code==1){
                let goodsList = res.data && res.data.goodsInfoSimpleInfos ||[];
                let domainPath = res.data && res.data.domainPath || "";
                this.hasMore = ((this.pageParams.pageIndex * this.pageParams.pageSize) < res.data.allRowsCount)
                this.pageParams.pageIndex += 1;
                this.setData({
                  goodsList:onRefresh?goodsList:[...this.data.goodsList,...goodsList],
                  domainPath
                });
            }
            return res;
        }).finally(() => {this.hideLoading()})
    },
    getGoodsCategoryInfo(){
      let pageIndex = 1, pageSize = 2000;
      return getGoodsCategoryInfo({pageIndex, pageSize}).then(data=>{ 
        this.setData({
          categoryList: [this.data.categoryList[0], ...(data.goodsCategoryInfoResps||[])]});
        console.log('categoryList',this.data.categoryList)
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
    onDelete(e){
        let detail = e.detail||{};
        let {item} = detail;  
        let params = {
            goodsId:item.goods_id
        }
        return deleteGoodsInfo(params).then(res=>{
            if(res.code==1){
                return this.onRefresh().then(()=>{
                    App.SMH.showToast({title:"删除成功"});
                })
            }else{
                App.SMH.showToast({title:res.msg||"删除失败"});
                return res;
            }
        })
    },
    save(e){
        let detail = e.detail ||{};
        let goodsList = detail.goodsList||[];
        App.StorageH.set('curGetGoodsList',{activity_id:this.options.activity_id,goodsList,domainPath:this.data.domainPath||''}) || ""; 
        wx.navigateBack()
    },
    onRefresh() { // 刷新
      this.pageParams.pageIndex = 1;
      this.hasMore = true;
      this.loadData(true); 
    },
    onConfirm(e){
      let detail = e.detail||"";
      this.pageParams.searchStr = detail; 
      this.onRefresh();
    },
    scrolltolower(){
      if(this.hasMore){
        this.loadData();
      }
    },
    onCatSelect(e){
      let detail = e.detail;
      this.pageParams.catId = detail;
      this.onRefresh();
    }
}))
function getGoodsInfo(params){
    return App.Http.QT_GoodsApi.getGoodsInfo({
        data: params,
    })
}
function deleteGoodsInfo(params){
    return App.Http.QT_GoodsApi.deleteGoodsInfo({
        data: params,
    })
}
function getGoodsCategoryInfo(params) { 
  return App.Http.QT_GoodsApi.getGoodsCategoryInfo({
    params
  })
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "获取分类列表失败")
    })
}