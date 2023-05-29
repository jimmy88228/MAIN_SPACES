const app = getApp();
Page(app.BP({
  data: {
    giftGoods: {}
  },
  page: 0,
  hasMore: true,
  onLoad(options) { },
  onReady() {

  },
  onShow() {
    getExchangeList.call(this,1);
  },
  getExchangeDetail(e){
    let orderId = this.getDataset(e,'orderId')||0;
    let exchangeId = this.getDataset(e,'exchangeId')||0;
    let activityId = this.getDataset(e,'activityId')||0;
    let productId = this.getDataset(e,'productId')||0;
    console.log(e)
    if(orderId){
      wx.navigateTo({
        url: '/pages/micro_mall/order/order_info?order_id=' + orderId,
      })
    } else if(exchangeId){
      wx.navigateTo({
        url: `/pages/micro_mall/order_gift/confirm_gift/confirm_gift?exchangeId=${exchangeId}&activityId=${activityId}&pId=${productId}`,
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
      let list = data.list || [];
      if(list.length > 0){
        this.page = page;
        let listKey = `giftGoods.${this.page}`;
        this.setData({
          [listKey]: list
        })
      }
      if(page == 1 && list.length <=0){
        this.setData({
          empty:true
        })
      }
      this.hasMore = list.length > 0 ? true : false
      return Promise.resolve(e);
    }else{
      return Promise.reject(e);
    }
  })
}
