// pages/micro_mall/send_goods/send_goods_code.js
import LoginM from "../../../common/helper/handle/loginHandle.js" 
const app = getApp();
Page(app.BP({
    data: {
        isLogin: app.LM.isLogin,
        showCancel: false,
        registerExtra:{}
    },
    onLoad: function(options) {
        this.options = options;
        this.setData({
            showCancel: this.options.isNeedLogin == 1 ? true : false,
            registerExtra:JSON.parse(options.registerExtra||'{}')
        });
    },
    onShow: function() {
        let _timer = setTimeout(function() {
            clearTimeout(_timer);
            wx.setNavigationBarTitle({
                title: '登录',
            }, 500);
        });
        listen.call(this);
    },
    onHide(){
      unListen.call(this);
    },
    onUnload(){
      unListen.call(this);
    },
    clickAuthorizeUserInfo(e) {
        this.loginCallback();
    },
    //登录回调
    loginCallback() {
        //直接返回上一页
        let options = this.options;
        if (options.isNeedLogin) {
            wx.navigateBack();
        } else {
        let loginConf = LoginM.loginConf || {};
          if(options.prevRoute){
            let prevRoute = decodeURIComponent(options.prevRoute); 
            console.log('prevRoute',decodeURIComponent(options.prevRoute),options)
            wx.redirectTo({
                url: '/' + prevRoute,
                fail(){
                  wx.switchTab({
                    url: '/' + prevRoute
                  })
                }
            }); 
          }else if(loginConf.prevRoute){
            wx.redirectTo({
                url: '/' + loginConf.prevRoute,
                fail(){
                  wx.switchTab({
                    url: '/' + loginConf.prevRoute,
                  })
                }
            });
          }
          if (!loginConf.prevRoute&&!options.prevRoute) return;
          wx.redirectTo({
              url: '/' + options.prevRoute||loginConf.prevRoute,
              fail(){
                wx.switchTab({
                  url: '/' + options.prevRoute||loginConf.prevRoute,
                })
              }
          });
        }

    },
    cancelLogin() {
        let loginConf = LoginM.loginConf || {};
        loginConf.isHandleCancel = true;
        wx.navigateBack();
    }
}))
//
function listen() {
  if (app.LM.isLogin) {
    this.setData({
      isLogin: true
    });
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if (app.LM.isLogin) {
      this.setData({
        isLogin: true
      })
    }
  });
}
//
function unListen() {
  if (this.listenLoginStatuId) {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
}
