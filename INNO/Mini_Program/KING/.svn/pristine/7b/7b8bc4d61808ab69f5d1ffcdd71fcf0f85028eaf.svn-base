// pages/store_pay/pay_center/pay_center.js
const app=getApp();
Page(app.BP({
  data: {
    isLogin: app.LM.isLogin,
    brand_info: {},
    userData: {},
    record:0,
  },
  onLoad: function (options) { 
    this.payCode = this.payCode  ||  this.selectComponent('#pay_code_id');
    this.payCode.onLoadFn();
  },
  onReady: function () {
       getUserInfoEvent.call(this);
  },
  onShow: function () {
       listen.call(this);
       getRecord.call(this);
  },
  onHide:function(){
    unListen.call(this);
  },
  onUnload:function(){
    unListen.call(this);
    this.payCode.onUnloadFn();
  },

  // 用户信息授权回调
  getUserInfo: function(e) {
      authorizeUserInfo.call(this).then(e => {
          this.loginPage = this.loginPage || this.selectComponent("#loginPage");
          this.loginPage.checkLogin({}, "need");
      }) 
  }, 
  onShareAppMessage: function () {

  },
}))
//获取用户信息
function getUserInfoEvent() {
  return app.UserApi.getUserInfoWap({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let userPoint = data.Points;
      this.setData({
        userData: data,
        userPoint: userPoint,
      });
      return Promise.resolve(data.IsBindMobile);
    }
    return Promise.reject();
  })
}
function authorizeUserInfo() {
     return app.LM.getUserTokenAsync(true);
}
function listen() {
     console.log(11111);
     if (app.LM.isLogin) {
          this.setData({
               isLogin: app.LM.isLogin
          });
          getUserInfoEvent.call(this);
     }
     this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
          this.setData({
               isLogin: app.LM.isLogin
          });
          getUserInfoEvent.call(this);
     });
}

function unListen() {
     app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}
 
function getRecord(){ 
  let params = {};
  app.RunApi.go('SmktPayApi','get_offlineOrderCount',params).then(res=>{
    console.log('getRecord?',res);
    if(res.code=='1'){
      this.setData({
        record:res.data || 0
      })
    }
  }) 
}
