import LM from "../manager/login-manager.js";
import LocationM from "../helper/location-manager.js";
import AppUtil from "../helper/app-utils.js";
import Conf from "../../conf.js";
import PH from "../helper/handle/paramsHandle.js";
import SIH from "../helper/sys-infos-helper.js";
import CDateH from "../helper/handle/cacheDateHandle.js"
import LoginM from "../helper/handle/loginHandle.js"
import SMH from "../helper/show-msg-helper.js";
import CheckVideo from "../helper/check-video-update.js";
import MyStr from "../support/utils/string-util.js";
import StartPageHandle from "../helper/handle/startPageHandle.js";
import StorageH from "../helper/handle/storageHandle.js"
import WelcomeH from "../helper/handle/welcomeHandle.js";
import {
  ShareConf,
  TabKeys,
  LimitAddLog,
  ShareType,
  CheckLastRoute
} from "../manager/log-map.js";
import {
  BrandApi,
  UserApi
} from "../manager/http-manager.js"
import baseHelper from "./base-helper.js";

const BasePage = function (pageOptions) {
  let po = pageOptions || {};
  let pageParams,baseData={pageShare:""};
  let pages,page;
  let bpo = {
    onLoad(...args) {
      try {
        console.log('BP onLoad', ...args);
        pages = getCurrentPages() || [];
        page = pages.pop() || {};
        let q = args && args.length > 0 && args[0] || {};
        pageParams = {...q};
        page && page.setData(getDefaultData());
        setShareMenu(po.onShareAppMessage);
        checkWxScene(q);
        getPageState.call(this,"onLoad");
        checkOverFlow.call(this,pages);
        trimShareConf.call(this,po,page,baseData);
      } catch (e) {}
      po.onLoad && po.onLoad.call(this, ...args);
    },
    onShow(...args) {
      try {
        console.log('BP onShow', ...args, pageParams);
        getPageState.call(this, "onShow");
        if (pageParams.scene && !StartPageHandle.releasePage)return; //旧小程序码拦截跳转
        settarbar.call(this);
        checkRoute.call(this);
        checkMenuUpdate.call(this,page);
        trimWelcomeH.call(this,page);
        if (!po.unAutoAddLog) {
          if (LimitAddLog[this.route] == "isHome" || LimitAddLog[this.route] == "limitAll") {
            return;
          }
          this.addVisitLog(null, this.route, pageParams);
          if (LimitAddLog[this.route]) {
            return;
          }
          this.addPageLog(null, this.route, pageParams, this._isBack);
        }
      } catch (e) {}
      po.onShow && po.onShow.call(this, ...args);
    },
    onHide() {
      try {
        getPageState.call(this, "onHide");
      } catch (e) {}
      po.onHide && po.onHide.call(this);
    },
    onUnload() {
      try {
        getPageState.call(this, "onUnload");
      } catch (e) {}
      po.onUnload && po.onUnload.call(this);
    }
  };
  if (po.onShareAppMessage) {
    setShare.call(this,po,bpo,baseData);
  }
  return {
    ...baseHelper,
    ...po,
    ...bpo,
  }
}
export default BasePage;

function getPageState(process) {
  switch (process) {
    case "onShow":
      if (this.pageState == "onLoad" || !this.pageState) {
        this.pageState = process
      } else if (this.pageState == "onHide") {
        this.pageState = "onBack"
      }
      break;
    case "onLoad":
    case "onReady":
    case "onHide":
    case "onUnload":
      this.pageState = process;
      break;
  }
}
//请求分享配置
function getWxappShareConfigEntity(cfgType = "user_center") {
  return BrandApi.getWxappShareConfigEntity({
    params: {
      cfgType: cfgType,
      brandCode: Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(e => {
    if (e.code == "1") {
      return Promise.resolve(e.data);
    } else {
      return Promise.reject(e);
    }
  })
}
//协议登录
function checkAgreetLogin(target, callback) {
  let page = getCurrentPages().pop();
  let pageRoute = page.route;
  let reqConf = StorageH.get("REQCONF") || {};
  reqConf.agreetConf = reqConf.agreetConf || {};
  let locationCallBack = function (pageType) {
    if (pageType != "isLogin") {
      LocationM.checkLoctionFn();
    }
    typeof (callback) == "function" && callback.call(target);
  }
  if (reqConf.agreetConf.isHandleCheck && reqConf.agreetConf.needAgreet) { //已经勾选
    LoginM.loginHandle(locationCallBack);
    return;
  }
  let jumpRoute = "pages/micro_mall/agreet_page/agreet";
  if (pageRoute == jumpRoute || pageRoute == "pages/micro_mall/articles/agreet/agreet") {
    typeof (callback) == "function" && callback.call(target);
    return;
  }
  checkUserAgreement.call(this).then(needArgeet => {
    if (needArgeet == 1 && reqConf.agreetConf.isHandleCheck != 1) { //需要勾选协议
      let page = getCurrentPages().pop();
      let pageRoute = page.route;
      let needLogin = PH.paramsJson("needLogin") || {};
      needLogin.prevRoute = pageRoute;
      PH.saveParams({
        needLogin: needLogin
      });
      wx.navigateTo({
        url: '/' + jumpRoute,
      })
    } else {
      LoginM.loginHandle(locationCallBack);
    }
  }).catch(() => {
    LoginM.loginHandle(locationCallBack);
  })
}
//检测协议
function checkUserAgreement() {
  return CDateH.setCatchDate("needAgreet", 3).then(() => {
    return checkUserAgreementReq.call(this);
  }).catch(() => {
    let reqConf = StorageH.get("REQCONF") || {};
    reqConf.agreetConf = reqConf.agreetConf || {}
    return Promise.resolve(reqConf.agreetConf.needAgreet);
  })
}

function checkUserAgreementReq() {
  return UserApi.checkIsUserAgreement({
    params: {
      brandCode: Conf.BRAND_CODE,
      agreementType: "USER" // USER:会员，RETURN:退换货
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      let reqConf = StorageH.get("REQCONF") || {};
      reqConf.agreetConf = reqConf.agreetConf || {}
      reqConf.agreetConf.needAgreet = res.data;
      StorageH.set("REQCONF", reqConf);
      return Promise.resolve(res.data);
    }
    return Promise.reject()
  })
}

function settarbar(isHideTab) {
  let page = getCurrentPages().pop() || {};
  if (page.route && TabKeys[page.route] && typeof (page.getTabBar) == "function") {
    let tab = page.getTabBar();
    if (tab) {
      if (typeof (isHideTab) == "boolean" && tab.data.isHideTab != isHideTab) {
        tab.setData({
          isHideTab: isHideTab
        });
        return;
      }
      checkUpdateFnc.call(this, tab);
      tab.setData({
        selected: TabKeys[page.route]
      });
      page.setData({
        customTab: true
      });
    }
  }
}

function checkUpdateFnc(tab) {
  if (!CheckVideo.checked) {
    CheckVideo.checkUpdate(tab).then(res => {
      tab.setData({
        showUpdateType: "videoShopping",
        showUpdate: true
      });
    })
  } else if (CheckVideo.checked && CheckVideo.exsist) {
    let showUpdate = CheckVideo.showUpdate == 1 ? true : false;
    if (showUpdate != tab.data.showUpdate) {
      tab.setData({
        showUpdate,
        showUpdateType: "videoShopping",
      });
    }
  }
}

function checkMenuUpdate(page) {
  if (page.route && TabKeys[page.route] && typeof (page.getTabBar) == "function") {
    let tab = page.getTabBar();
    if (tab) {
      tab.setTab();
    }
  }
}

function checkOverFlow(pages = []) {
  if (pages && pages.length >= 10) {
    setTimeout(() => {
      SMH.showToast({
        title: "页面累积过多，请操作返回释放页面",
        duration: 4000
      })
    }, 1000)
  }
}

function checkRoute(obj = {}) {
  let page = getCurrentPages().pop();
  if (CheckLastRoute[page.route]) return
  CheckVideo.setLastRoute(page.route);
}

function hidePage(thisPage, hide) {
  if (thisPage) {
    thisPage.setData({
      pageHidden: hide
    })
  }
}

function setShareMenu(bool = false) {
  if (bool) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
}

function checkWxScene(q){
  //由于scene和二维码的参数有冲突，检测为微信场景值处理
  if (q.scene && MyStr.checkWxScene(q.scene)) {
    delete q.scene;
  }
}
function getDefaultData(){
  return {
    brand_info: Conf,
    brandStyle: Conf.style,
    isIphoneX: SIH.isIphoneX,
    pageHidden: true
  }
}
function trimShareConf(po,page,baseData){
  //分享配置
  let cfgType = ShareConf[page.route] || "default";
  if (cfgType != "goods" && po.onShareAppMessage) {
    baseData.pageShare = cfgType;
    let reqType = cfgType == 'user_center' ? cfgType : "custom_page";
    getWxappShareConfigEntity.call(this, reqType).then(config => {
      let allShareConfig = PH.paramsJson().shareConfig || {};
      allShareConfig[cfgType] = config;
      PH.saveParams({
        "shareConfig": allShareConfig
      });
    });
  }  
}

function trimWelcomeH(page){
  //欢迎页
  WelcomeH.checkWelcomeConf(page).then((isActive) => {
    if (isActive) {
      settarbar.call(this, true);
      hidePage(page, true)
      typeof (this.checkAgreetLoginCallback) == "function" && this.checkAgreetLoginCallback();
      WelcomeH.activeCallback(function () {
        checkAgreetLogin.call(this, this)
        settarbar.call(this, false);
        hidePage(page, false);
      })
    } else {
      hidePage(page, false)
      settarbar.call(this, false);
      checkAgreetLogin.call(this, this, function () {})
    }
  })
}
function setShare(po,bpo,baseData){
  bpo.onShareAppMessage = function (...args) {
    //必须function
    let shareData = po.onShareAppMessage.call(this, ...args);
    let _shareData = {
      ...shareData || {}
    };
    //分享类型
    if (_shareData.shareType) {
      _shareData.shareType = ShareType[_shareData.shareType] || _shareData.shareType;
    } else {
      _shareData.shareType = ShareType["NORMAL"];
    }
    //普通分享actionLog
    if (!_shareData.addActionName) {
      let param = MyStr.getUrlParam(_shareData.path);
      this.addActionLog("PAGE_SHARE", "", param);
    }
    //路径拼装
    if (_shareData.path) {
      _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `shareType=${_shareData.shareType}`;
    } else {
      _shareData.path = this.route + `?shareType=${_shareData.shareType}`;
    }
    //登录
    if (LM.isLogin) {
      if (_shareData.path) {
        _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `fromUser=${LM.userToken}`;
      } else {
        _shareData.path = this.route + `?fromUser=${LM.userToken}`;
      }
    }
    //读取配置(shareData.isCustom ==== 页面如果需要自定义则不读配置) 
    if (baseData.pageShare && !_shareData.isCustom) {
      let allShareConfig = PH.paramsJson().shareConfig || {};
      let shareConfig = allShareConfig[baseData.pageShare] || {};
      if (shareConfig.cfg_title && !_shareData.title) {
        _shareData.title = shareConfig.cfg_title;
      }
      if (shareConfig.cfg_pic && !_shareData.imageUrl) {
        _shareData.imageUrl = shareConfig.cfg_pic;
      }
    }
    _shareData.title = _shareData.title || "";
    //title, path带上代码
    let staffInfo = LM.staffInfo;
    if (staffInfo.staffCode) {
      if (_shareData.path) {
        _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `staffCode=${staffInfo.staffCode}`;
      } else {
        _shareData.path = this.route + `?staffCode=${staffInfo.staffCode}`;
      }
    }
    if (staffInfo.private_code || staffInfo.staffCode) {
      let code = staffInfo.private_code || staffInfo.staffCode;
      let STAFF_SHARE_DATA = StorageH.get('STAFF_SHARE_DATA') || {};
      if (STAFF_SHARE_DATA.cfg_pic == "none") {
        code = "";
      } else if (STAFF_SHARE_DATA.cfg_pic == "name") {
        let USER_INFOS = StorageH.get('SIMPLE_USER_INFO') || {};
        code = USER_INFOS.realName || staffInfo.staffCode;
        console.log("USER_INFOS", USER_INFOS);
      }
      console.log("STAFF_SHARE_DATA", STAFF_SHARE_DATA);
      _shareData.title = _shareData.title ? code ? code + '-' + _shareData.title : _shareData.title : code;
    }
    shareData = _shareData;
    AppUtil.log("------share data-----", shareData);
    return shareData;
  };
}