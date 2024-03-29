  // pages/coupon/coupon_give.js
var app=getApp();
Page(app.BP({

  data: {
    brand_info: {},
    shareCoupon: "",
      isShow: true
  },
  onLoad: function (options) {
      let storeBonus = this.data.brand_info.icon_url + "micro_mall/coupon/storeBonus.jpg";
      let onlineBonus = this.data.brand_info.icon_url + "micro_mall/coupon/onlineBonus.jpg";
      this.setData({
          storeBonus,
          onlineBonus
      })
    this.getSendBonus();
  },
    showPanel() {
        this.setData({
            isShow: false
        });
    },
  onReady: function () {},

  onPullDownRefresh: function () {
  
  },
    onHide() {
        this.setData({
            isShow: true
        })
    },
  onShareAppMessage: function (res) {
      var that = this;
      var brand_info = this.data.brand_info;
      var shareCoupon = this.data.shareCoupon;
      var bonus_id = shareCoupon.bonus_id;
      if (res.from === 'button') {
      }
      return {
        title: '赠送你优惠券',
        path: '/pages/micro_mall/coupon/get_coupon?bonus_id=' + bonus_id + '&userToken=' + app.LM.userKey,
        imageUrl: shareCoupon.share_image ? shareCoupon.share_image : brand_info.icon_url +'micro_mall/coupon/share_coupon_bg.jpg',
        success: function (res) {
          BeginSharingCoupon.call(that, bonus_id);
        },
        fail: function (res) {
        }
      }
  },
  /**
   * 获取赠送优惠券信息
  */
  getSendBonus:function(){
    var send_bonus = app.StorageH.get('send_bonus') || {};
    this.setData({
      shareCoupon: send_bonus
    })
  }
}))
function BeginSharingCoupon(bonusId){
  if (!bonusId) return;
  return app.UserApi.BeginSharingCoupon({
    data:{
      "bonusId": bonusId,
      "userToken": app.LM.userKey,
      "brandCode": app.Conf.BRAND_CODE
    },other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == "1"){
      let _timer = setTimeout(function () {
        clearTimeout(_timer);
        wx.navigateBack();
      },500);
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}