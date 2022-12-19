const app = getApp();
Page(app.BP({
  data: {
    giftGoods: {}
  },
  page: 0,
  hasMore: true,
  onLoad(options) {
    getExchangeList.call(this);
  },
  onReady() {

  },
  onShow() {
  },
  getExchangeDetail(e){
    let dataset = e.currentTarget.dataset || {};
    if(dataset.orderId){
      wx.navigateTo({
        url: '/pages/micro_mall/order/order_info?order_id=' + dataset.orderId,
      })
    } else if(dataset.exchangeId){
      wx.navigateTo({
        url: '/pages/micro_mall/order_gift/confirm_gift/confirm_gift?exchangeId=' + dataset.exchangeId,
      })
    }
  },
  onPullDownRefresh() {
    getExchangeList.call(this, 1).finally(()=>{
      wx.stopPullDownRefresh();
      app.SMH.showToast({
        title: '已刷新',
      })
    })
  },
  onReachBottom() {
    if(this.hasMore){
      getExchangeList.call(this);
    } else {
      app.SMH.showToast({
        title: '已经到底了',
      })
    }
  },
}))
function getExchangeList(page){
  page = page || this.page + 1;
  return app.UserApi.getExchangeList({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      pageIndex: page,
      pageSize: app.Conf.PAGE_SIZE
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    if(e.code == 1){
      let data = e.data || {};
      let  list = data.list || [];
      if(list.length > 0){
        this.page = page;
        let listKey = `giftGoods.${this.page}`;
        this.setData({
          [listKey]: list
        })
      }
      this.hasMore = list.length > 0 ? true : false
      return Promise.resolve(e);
    }else{
      return Promise.reject(e);
    }
  })
}
