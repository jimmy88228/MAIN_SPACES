// pages/store_pay/pay_center/pay_center.js
import {
  barcode,
} from "../../../common/utils/codeCanvas/index.js" 
const app=getApp();
Page(app.BP({
  data: {
    isLogin: app.LM.isLogin,
    brand_info: {},
    userCode: "",
    userData: {},
    record:0,
    hideCustom:false,
    outsideComponents: { // 该页面的最外层容器的组件对象-解决层级问题用
      agreementPop: {confirmIsGetInfoBtn: true},
      getCouponsPop: {},
      contactStaffGuide: {}
    },
  },
  onLoad: function (options) { 
    this.payCode = this.payCode  ||  this.selectComponent('#pay_code_id');
    this.payCode.onLoadFn();
  },
  onReady: function () {
       getUserInfoEvent.call(this);
       initCustomPageModule.call(this);
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
  onScrollViewScroll(e) {
    customPageBindScroll.call(this, e);
  },
  onScrollViewReachBottom() {
    customPageBindReachBottom.call(this);
  },
  onShareAppMessage() {
    customPageOnShareAppMessage.call(this);
  },
  hideCustomF() {
    this.setData({hideCustom: true})
  }
}))
//获取用户信息
function getUserInfoEvent() {
  return app.UserApi.getUserInfoWap({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
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
          getUserInfoEvent.call(this)
            .then(() => {
              let userData = this.data.userData || {};
              setUserCode.call(this, 0, userData)
            })
     }
     this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
          this.setData({
               isLogin: app.LM.isLogin
          });
          getUserInfoEvent.call(this)
            .then(() => {
              let userData = this.data.userData || {};
              setUserCode.call(this, 0, userData)
            })
     });
}

function unListen() {
     app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}

function getCustomPageCom() {
  return this.pageTab = this.pageTab || this.selectComponent(`#mcPage`);
}

function customPageBindScroll(e) {
  // console.log("customPageScroll", e)
  getCustomPageCom.call(this) && getCustomPageCom.call(this).handle_scroll(e&&e.detail&&e.detail.scrollTop)
}

function customPageBindReachBottom() {
  getCustomPageCom.call(this) && getCustomPageCom.call(this).reachBottom();
}

function customPageOnShareAppMessage() {
  let tabData = getCustomPageCom.call(this) && getCustomPageCom.call(this).getTabData() || {};
  tabData = tabData.customTabInfo||{};
  console.log('tabData',tabData)
  return {
    isCustom: !!tabData.wx_share_title || false,
    title:tabData.wx_share_title||"",
    // imageUrl:tabData.wx_share_image||""
  }
}

function initCustomPageModule() {
  return app.sysTemConfig("cfg_cloud_page")
    .then(e => {
        let cfg_cloud_page = e && e.Value || "0";
        if (cfg_cloud_page != "0") {
          this.setData({customPageId: cfg_cloud_page});
          return Promise.resolve(cfg_cloud_page)
        }
        return Promise.reject(e)
    })
    .then(customPageId => {
      let pageTab = getCustomPageCom.call(this);
      let page_id = customPageId;
      pageTab && this.pageTab.getPageData({
        page_id,
        loadDataType: "bottom"
      })
    })
    .catch(err => {
      console.log(err)
      this.hideCustomF()
    })
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

function setUserCode(type, userData = {}){
  console.log("setUserCode", userData)
  let code = type == "1" ? userData.MobileNo : type == "2" ? userData.realUserName : userData.CardNo;
  code = code || "";
  barcode('userCode', code, 650, 110, getCodeUrl.call(this,'userCode'));
  this.setData({
    barCardCode: code
  })
}

function getCodeUrl(name=''){
  if (!name)return
  let that  = this;
  wx.createSelectorQuery().in(this).select().node(function (res) {
      setTimeout(()=>{
        wx.canvasToTempFilePath({
          canvasId: `${name}`,
          success(res) {
            that.setData({
              [`${name}`]: res.tempFilePath
            })
          },
          fail(err){
            console.log("fail", err)
            if(that.limitUrlTime > 0){
              getCodeUrl.call(that, name);
              that.limitUrlTime = that.limitUrlTime - 1;
            }
          },
          complete(res){
            console.log("canvasToTempFilePath res", res);
          }
        })
      }, 300);
  }).exec()
}