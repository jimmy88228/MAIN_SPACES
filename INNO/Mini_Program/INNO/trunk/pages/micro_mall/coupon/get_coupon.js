// pages/micro_mall/coupon/get_coupon.js
const app =getApp();
Page(app.BP({
  data: {
    brand_info: app.globalData.brand_info,
    page_info:"",
    //
    isReceive:true,
    isReceiveState:"",
    receiveState:{
      s_switch:false,
      cont:""
    }
  },
  onLoad: function (options) {
    listen.call(this);
    this.options = options;
  },
  onShow(){
    getSharingCoupon.call(this,this.options);
    //首页
    this.pageHome = this.pageHome || this.selectComponent("#pageHome")
    this.pageHome.initPageHome();
  },
  onUnload(){
    unListen.call(this);
  },
  onShareAppMessage: function () {

  },
  getReceiveBonus(){
    app.LM.getUserTokenAsync(true).then( res=>{
      if (res.userToken){
        this.receiveBonus();
      }
    })
  },
  /**
   * 领取优惠券
  */
  receiveBonus:function(){
    let that = this;
    let page_info = this.data.page_info;
    let type_id = page_info.bonus.bonus_type_id;
    let options = this.options;
    return app.UserApi.receiveSharedCoupon({
      data:{
        "typeId": type_id,
        "shareBonusId": options.bonus_id,
        "fromUserToken": options.bonusUserToken,
        "userToken": app.LM.userToken,
        "brandCode": app.Conf.BRAND_CODE
      },other:{
        isShowLoad:true
      }
    }).then( e=>{
      if(e.code == "1"){
        if(e.data == 1){
          this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
          this.pageDialog.setTouchCancel(false);
          this.pageDialog.setCentent("领取成功");
          this.pageDialog.setSingleBtn({
            name: "确定",
            tap: function () {
              wx.redirectTo({
                url: '/pages/micro_mall/coupon/my_coupon',
              })
            }
          })
          this.pageDialog.show();
        }
        return Promise.resolve(e);
      }
      app.SMH.showToast({
        "title":e.msg || "领取失败"
      })
      return Promise.reject();
    })
    
  },
  /**
   * 关闭
  */
  closeState:function(){
    var receiveState = this.data.receiveState;
    receiveState.s_switch = false;
    this.setData({
      receiveState: receiveState
    })
  }
}))
//获取分享优惠券
function getSharingCoupon(options = {}){
  return app.UserApi.getSharingCoupon({
    data:{
      bonusId: options.bonus_id,
      fromUserToken: options.bonusUserToken,
      brandCode:app.Conf.BRAND_CODE,
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == "1" || e.code == "-1"){
      let data = e.data || {};
      let bonus = data.bonus || {};
      let bonus_info = data.bonus_info || {};
      let shareUserInfo = data.shareUserInfo || {};
      let title = data.title || "";
      let url = data.url || "";
      let isReceive = false;
      if ((bonus.give_type == "1" || bonus.give_type == "3") && (bonus.give_to_user_id == bonus.user_id)) {//领券失效
        isReceive = true;
      }
      if (bonus_info.bonus_type == 4 ){
        bonus_info.discountStr = app.NH.getDiscount(bonus_info.discount);       
      }
      let page_info = {
        bonus: bonus,
        bonus_info: bonus_info,
        shareUserInfo: shareUserInfo,
        title: title,
        url: url
      }
      this.setData({
        page_info: page_info,
        isReceive: isReceive,
        shareUserInfo: shareUserInfo,
        isReceiveState: e.msg || ""
      })
      return Promise.resolve(e)
    }
    return Promise.reject(e);
    
  })
}
//

function listen() {
  if (app.LM.isLogin) {
    this.setData({
      isLogin: app.LM.isLogin
    });
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
  });
}
function unListen() {
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}