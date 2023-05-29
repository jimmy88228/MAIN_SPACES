const app = getApp();
Page(app.BP({
  data: {
    giftActDetail: {},
    giftData: {},
    hasFew: "--",
  },
  onLoad(options) {
    this.options = options || {};
    app.LM.loginAsync(false).finally(() => {
      if(this.data.isLogin != app.LM.isLogin){
        this.setData({
          isLogin: app.LM.isLogin 
        })
      }
    })
  },
  onReady() {
  },
  onShow() {
    getOrderGift.call(this);
  },
  onHide() {
  },
  receiveGift(){
    let giftActDetail = this.data.giftActDetail || {};
    wx.navigateTo({
      url: '/pages/micro_mall/order_gift/confirm_gift/confirm_gift?activityId=' + giftActDetail.activityId + '&exchangeId=' + giftActDetail.waitExchangeId + '&pId=' + giftActDetail.productId,
    })
  },
  getMyGift(){
    wx.navigateTo({
      url: '/pages/micro_mall/order_gift/my_gift/my_gift',
    })
  }
}))
function getOrderGift(){
  let options = this.options || {};
  if(!options.activityId) return;
  return app.UserApi.getOrderGiftActivityDetail({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      activityId: options.activityId
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    let data = e.data || {};
    if(e.code == 1){
      let orderCount = data.orderCount || 0;
      let rewardCondition = data.rewardCondition || 0;
      let hasFew = 0;
      if(orderCount < rewardCondition){
        hasFew = parseInt(rewardCondition - orderCount);
      } else{
        hasFew = 0;
      }
      this.setData({
        hasFew: hasFew,
        giftActDetail: data,
        giftData: {
          activityId: data.activityId,
          orderCount,
          rewardCondition,
          waitExchangeCount: data.waitExchangeCount
        }
      })
      return Promise.resolve(e);
    }else{
      app.SMH.showToast({
        title: data.msg,
      })
      return Promise.reject(e);
    }
  })
}