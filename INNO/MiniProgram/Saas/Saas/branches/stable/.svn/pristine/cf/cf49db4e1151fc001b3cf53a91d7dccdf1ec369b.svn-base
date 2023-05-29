// pages/store_pay/pay_center/pay_center.js
import {
  barcode,
} from "../../../common/utils/codeCanvas/index.js"
const app = getApp();
Page(app.BP({
  data: {
    isLogin: app.LM.isLogin,
    brand_info: {},
    userCode: "",
    userData: {},
    record: 0,
    hideCustom: false,
    outsideComponents: { // 该页面的最外层容器的组件对象-解决层级问题用
      agreementPop: {
        confirmIsGetInfoBtn: true
      },
      getCouponsPop: {},
      contactStaffGuide: {}
    },
  },  
  onShow: function () {
    console.log('智慧支付 onShow')
    this._checkUserLogin().then(()=>{
      if(app.LM.isLogin){
        initPayCode.call(this); 
        getRecord.call(this);
        getUserInfoWap.call(this);
      } 
    })
  }, 
  onReady: function () {
    this._checkUserLogin().then(()=>{ 
      if(app.LM.isLogin){
        getUserSimpleInfo.call(this);
      }
      agreementShow.call(this);
    })
    initCustomPageModule.call(this);
  },
  onHide(){
    this.payCode && this.payCode.onHideFn();
  },
  onUnload: function () {
    this.payCode && this.payCode.onUnloadFn();
  },  

  // 用户信息授权回调
  loginCallBack: function (e) {
    console.log('智慧支付 用户信息授权回调',app.LM.isLogin,e)
    return this._checkUserLogin().then(() => {
      if (app.LM.isLogin) {
        initPayCode.call(this);
        getRecord.call(this);
        getUserSimpleInfo.call(this);
        getUserInfoWap.call(this);
      }
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
    this.setData({
      hideCustom: true
    })
  }
}))
//获取用户信息
function getUserInfoWap() {
  if(!app.LM.isLogin)return Promise.reject();
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
      let userData = e.data || {};
      this.setData({
        userData,
      }); 
      return e;
    }
    return Promise.reject();
  })
} 


//获取用户信息
function getUserSimpleInfo() {
  if(!app.LM.isLogin)return Promise.reject();
  return app.UserApi.getUserSimpleInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      setUserCode.call(this, e.data || {})
      return e;
    }
    return Promise.reject();
  })
} 


function getCustomPageCom() {
  return this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
}

function customPageBindScroll(e) {
  // console.log("customPageScroll", e)
  getCustomPageCom.call(this) && getCustomPageCom.call(this).handle_scroll(e && e.detail && e.detail.scrollTop)
}

function customPageBindReachBottom() {
  getCustomPageCom.call(this) && getCustomPageCom.call(this).reachBottom();
}

function customPageOnShareAppMessage() {
  let tabData = getCustomPageCom.call(this) && getCustomPageCom.call(this).getTabData() || {};
  tabData = tabData.customTabInfo || {};
  console.log('tabData', tabData)
  return {
    isCustom: !!tabData.wx_share_title || false,
    title: tabData.wx_share_title || "",
    imageUrl: tabData.wx_share_image || ""
  }
}

function initCustomPageModule() {
  return app.sysTemConfig("cfg_moto_page")
    .then(e => {
      let cfg_moto_page = e && e.Value || "0";
      if (cfg_moto_page != "0") {
        this.setData({
          customPageId: cfg_moto_page
        });
        return Promise.resolve(cfg_moto_page)
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

function getRecord() {
  if(!app.LM.isLogin)return Promise.reject();
  let params = {};
  return app.RunApi.go('SmktPayApi', 'get_offlineOrderCount', params).then(res => {
    if (res.code == '1') {
      this.setData({
        record: res.data || 0
      })
    }
  })
}

function setUserCode( userData = {}) {
  let code = userData.cardNum||""; 
  code && barcode('userCode', code, 650, 110, getCodeUrl.call(this, 'userCode'));
  code && this.setData({
    barCardCode: code
  })
}

function getCodeUrl(name = '') {
  if (!name) return
  let that = this;
  wx.createSelectorQuery().select().node().exec(() => {
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: `${name}`,
        success(res) {
          that.setData({
            [`${name}`]: res.tempFilePath
          })
        },
        fail() {
          if (that.limitUrlTime > 0) {
            getCodeUrl.call(that, name);
            that.limitUrlTime = that.limitUrlTime - 1;
          }
        },
        complete(res) {
          console.log("canvasToTempFilePath res", res);
        }
      })
    }, 300);
  })
}

function agreementShow() {
  if (!app.LM.isLogin) { 
    this.btns = this.selectComponent("#btns");
    this.btns.handleUserInfo({});
  } 
}
function initPayCode(){
  console.log('进来 initPayCode')
  this.payCode = this.payCode  ||  this.selectComponent('#pay_code_id');
  this.payCode && this.payCode.onShowFn();
}