// pages/matrix/draw_box/draw_records/draw_records.js
const app = getApp();
Page.PagingPage({
  data: { 
    list:[]
  },
  onLoad: function (options) {
    this.options = options || {}; 
  },
  onReady: function () {
    this.setData({
      isAttached: true,
      showRefresh: true,
    })
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
      let prizeType = dataset.prizeType||0;
      if(prizeType != 2)return
      let recordId = dataset.recordId||0;
      wx.navigateTo({
        url: `/pages/matrix/draw_box/draw_details/draw_details?recordId=${recordId}`,
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