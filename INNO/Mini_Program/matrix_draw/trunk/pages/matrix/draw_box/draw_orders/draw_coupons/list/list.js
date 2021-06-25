// pages/matrix/draw_box/draw_orders/draw_coupons/list/list.js
const app = getApp();
Page.PagingPage({
  data: { 
    list:[]
  },
  onLoad: function (options) {
    this.options = options || {}; 
  },
  onShow: function () {
    if(this.readyed){
      this.refresh();
    }
  },
  onReady: function () {
    this.setData({
      isAttached: true,
      showRefresh: true,
    })
    this.readyed = true;
    this.refresh();
  },
	refresh() {
		this.checkLoginChange();
		return this.loadData(true)
			.finally(() => {
				wx.stopPullDownRefresh();
				this.setData({ showRefresh: false });
			});
  },
  onPullDownRefresh() {
		this.refresh();
	},
  onReachBottom(){
    this.setData({ showLoadMore: true })
		this.loadData()
			.finally(() => this.setData({ showLoadMore: false }));
  },
  loadData(refresh = false){
    if (this.isLoading || (!refresh && this.data.isEnd)) {
			return Promise.reject();
    }
    this.isLoading = true;
		return getList(this.nextDataIndex(refresh))
			.then(data => this.setDataList(refresh, data&&data.list||[]))
			.finally(() => this.isLoading = false).showError();
  },
  jump(e){
    let dataset = this.getDataset(e);
    let info = dataset.info||{};
    app.StorageH.set('Cur_Coupon_Detail',info);
    wx.navigateTo({
      url: `/pages/matrix/draw_box/draw_orders/draw_coupons/detail/detail`,
    })
  }
})

function getList(index){
  return app.UserApi.getUserBonusList({
    params:{
      type:0,
      pageIndex:index,
      pageSize:app.Conf.PAGE_SIZE
    }
  }).netData()
}