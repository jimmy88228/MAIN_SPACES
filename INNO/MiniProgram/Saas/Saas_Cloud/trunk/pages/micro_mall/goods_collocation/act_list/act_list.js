// pages/micro_mall/goods_collocation/act_list/act_list.js
import PageJump from "../../../../common/helper/page-jump.js";
const app = getApp();
const PAGE_TYPE = "COLLOCATE_GOODS";
Page(app.BP({ 
  data: {
    list:[]
  },
  pageIndex:1,
  detail:"",
  onLoad: function (options) {
    this.loadData();
  },
  onReady: function () {

  },
  onShareAppMessage: function () {

  },
  loadData(){
    if(this.isLoading)return;
    let  params = {
      activityIds: "",
      searchStr:this.detail,
      pageIndex:this.pageIndex,
      pageSize:app.Conf.PAGE_SIZE,
      brandCode:app.Conf.BRAND_CODE,
    }
    this.isLoading = true;
    return app.RunApi.go('GoodsApi','getValidGoodsPackageList',params).then(res=>{
      if(res.code == '1'){
        let data = res.data||[];
        let list = data.dataList||[];
        this.setData({
          list:[...this.data.list,...list],
          empty: this.pageIndex == 1 && list.length < 1
        });
        this.hasMore = this.pageIndex * app.Conf.PAGE_SIZE <  data.totalCount;
        this.pageIndex += 1;
      }
    }).finally(()=>{
      this.isLoading = false;
    })
  },
  goLink: function(e) {
    let dataset = e.currentTarget.dataset || {};
    let url = `/pages/micro_mall/goods_collocation/goods_collocation?package_id=${dataset.activity_id}`;
    wx.navigateTo({
      url: url,
    })
  },
  onTapConfirm(e){
    this.detail = e.detail|| "";
    this.reset();
    this.loadData();
  },
  reset(){
    this.isLoading = false;
    this.hasMore = true;
    this.pageIndex = 1;
    this.data.list = [];
  },
  scrollTap(){
    if(this.hasMore){
      this.loadData();
    }
  }
}))