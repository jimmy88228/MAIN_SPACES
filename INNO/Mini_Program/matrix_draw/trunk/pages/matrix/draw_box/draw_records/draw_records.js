// pages/matrix/draw_box/draw_records/draw_records.js
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
		return getRecord(this.nextDataIndex(refresh),this.options.activityId)
			.then(data => this.setDataList(refresh, data&&data.list||[]))
			.finally(() => this.isLoading = false).showError();
  },
  onTap(e){
    let dataset = this.getDataset(e);
    let type = dataset.type || "";
    console.log(e,dataset)
    if(type == 'detail'){
      let info = dataset.info||0;
      let recordId = info.winningRecordId||0;
      let url;
      if(info.prizeType == 1){
        url = `/pages/matrix/draw_box/draw_orders/draw_points/draw_points`
      }else if(info.prizeType == 4){
        url = `/pages/matrix/draw_box/draw_orders/draw_coupons/list/list`
      }else if(info.prizeType == 2){
        if(info.isReceive == 1){
          let orderId = info.orderId||0;
          url = `/pages/matrix/draw_box/draw_orders/draw_details/draw_details?orderId=${orderId}&type=order`
        }else{
          url = `/pages/matrix/draw_box/draw_orders/draw_details/draw_details?recordId=${recordId}&type=details`;
        }
      }
      url && wx.navigateTo({
        url,
      })
    }
  }
})

function getRecord(index,id){
  return app.LotteryApi.get_UserLotteryActivityWinningRecord({
    params:{
      activityId:id,
      pageIndex:index,
      pageSize:app.Conf.PAGE_SIZE
    }
  }).netData()
}