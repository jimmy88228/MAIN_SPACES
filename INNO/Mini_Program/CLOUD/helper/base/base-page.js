import LgMg from "../manager/log-manager.js";
import FM from "../manager/form-id-manager";
import LM from "../manager/login-manager.js";
import AppUtil from "../app-utils.js";
import Conf from "../../conf.js";
import PH from "../handle/paramsHandle.js";
import SIH from "../sys-infos-helper.js";
import LoginM from "../handle/loginHandle.js"
import SMH from "../../helper/show-msg-helper.js";
import CheckVideo from "../../helper/manager/check-video-update.js";
import MyStr from "../../support/utils/string-util.js";
import StartPageHandle from "../handle/startPageHandle.js";
import StorageH from "../../helper/handle/storageHandle.js"
import WelcomeH from "../../helper/handle/welcomeHandle.js";
import AgreetH from "../../helper/handle/agreetHandle";
import StoreH from "../../helper/handle/storeHandle";
import {
  ShareConf,
  TabKeys,
  LimitAddLog,
  ShareType,
  CheckLastRoute
} from "../manager/log-map.js";
import {
  CL_BrandApi
} from "../manager/http-manager.js"
export default function(pageOptions) {
  if (pageOptions) {
    let bpData = {};
    let pageParams;
    let userShareConfig = "";
    //
    let rOnLoad = pageOptions.onLoad;
    let rOnShareAppMessage = pageOptions.onShareAppMessage;
    pageOptions.onLoad = function(...args) {
      if(this._onLoaded)return
      if(StoreH.storeId){ //检测onload时是否有soterId
        this._onLoaded = true;
      }
      //统一赋值
      checkOverFlow();
      this.setData({
        brand_info: Conf,
        main_bg_color:Conf.style.bg_color,
        main_font_color:Conf.style.font_color,
        defaultIcon:  Conf.default_icon_url,
        isIphoneX: SIH.isIphoneX,
        pageHidden: true
      })
      let q = args && args.length > 0 && args[0];
      //由于scene和二维码的参数有冲突，检测为微信场景值处理
      if (q.scene && MyStr.checkWxScene(q.scene)) {
        delete q.scene;
      }
      // 扫码进入: 过渡页、店铺进入的屏蔽
      // if (StartPageHandle.startPageJump(this, q) || StoreH.isHoldPage(this)) {
      if (StartPageHandle.startPageJump(this, q)) {
        return;
      }
      //分享配置
      let cfgType = ShareConf[this.route] || "default";
      if (cfgType != "goods" && typeof(this.onShareAppMessage) != 'undefined') {
        userShareConfig = cfgType;
        let reqType = cfgType == 'user_center' ? cfgType : "custom_page";
        getWxappShareConfigEntity.call(this, reqType).then(config => {
          let allShareConfig = PH.paramsJson().shareConfig || {};
          allShareConfig[cfgType] = config;
          PH.saveParams({
            "shareConfig": allShareConfig
          });
          return Promise.resolve(config);
        });
      }
      console.log('BP页面onLoad',...args);
      rOnLoad && rOnLoad.call(this, ...args);
      if (q && q instanceof Object) {
        pageParams = {
          ...q
        };
      }
    };
    let rOnShow = pageOptions.onShow;
    pageOptions.onShow = function(...args) {
      let options = PH.paramsJson("options") || {};
      console.log('中转页检测',StartPageHandle.releasePage?"ok,":"return,",this.route,options.query);
      if (options.query && options.query.scene && !StartPageHandle.releasePage) return;
      let that = this;
      settarbar.call(this);
      checkMenuUpdate.call(this);
      checkRoute.call(this);
      //onShow屏蔽检测
      if(!StoreH.isHoldPage(this)){
        console.log('BP页面onShow',...args);
        rOnShow && rOnShow.call(this, ...args);
      }
      //欢迎页检测
      WelcomeH.checkWelcomeConf(this).then((isActive)=>{
        if(isActive){
          settarbar.call(this,true);
          hidePage.call(this,true)
          typeof(that.checkAgreetLoginCallback) == "function" && that.checkAgreetLoginCallback();
          WelcomeH.activeCallback(function(){
            settarbar.call(this, false);
            hidePage.call(that, false);
            checkAgreetLogin.call(that, that) //协议 登录 检测
          })
        }else{
          settarbar.call(this, false);
          hidePage.call(that, false);
          checkAgreetLogin.call(that, that,function(){})  //协议 登录 检测
        }
      })
      //
      if (!bpData.unAutoAddLog) {
        if (LimitAddLog[this.route] == "isHome" || LimitAddLog[this.route] == "limitAll"){
          return;
        }
        this.addVisitLog(null, this.route, pageParams);
        if (LimitAddLog[this.route]) {
          return;
        }
        this.addPageLog(null, this.route, pageParams, this._isBack);
      }
      if(rOnShareAppMessage){
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        })
      }
    };
    let rOnHide = pageOptions.onHide;
    pageOptions.onHide = function(){
      rOnHide && rOnHide.call(this);
    }
    if (rOnShareAppMessage) {
      //卡片分享
      let shareData = ""
      pageOptions.onShareAppMessage = function(...args) {
        //必须function
        shareData = rOnShareAppMessage.call(this, ...args);
        let _shareData = {
          ...shareData || {}
        };
        //分享类型
        if (_shareData.shareType){
          _shareData.shareType = ShareType[_shareData.shareType] || _shareData.shareType;
        }else{
          _shareData.shareType = ShareType["NORMAL"];
        }
        //普通分享actionLog
        if(!_shareData.addActionName){
          let param = MyStr.getUrlParam(_shareData.path);
          this.addActionLog("PAGE_SHARE","",param);
        }
        //路径拼装
        if (_shareData.path) {
          _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `shareType=${_shareData.shareType}`;
        } else {
          _shareData.path = this.route + `?shareType=${_shareData.shareType}`;
        }
        //分享 登录信息
        console.log('分享shareCode',LM.shareCode)
        if (LM.isLogin && LM.shareCode) {
          if (_shareData.path) {
            _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `fromUser=${LM.shareCode}`;
          } else {
            _shareData.path = this.route + `?fromUser=${LM.shareCode}`;
          }
        }
        //读取配置(shareData.isCustom ==== 页面如果需要自定义则不读配置)
        if (userShareConfig && !_shareData.isCustom) {
          let allShareConfig = PH.paramsJson().shareConfig || {};
          let shareConfig = allShareConfig[userShareConfig] || {};
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
        //分享staffCode
        if(staffInfo.staffCode){
          if (_shareData.path) {
            _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `staffCode=${staffInfo.staffCode}`;
          } else {
            _shareData.path = this.route + `?staffCode=${staffInfo.staffCode}`;
          }
        }
        //分享店铺code
        let storeInfo = StoreH.storeInfo || {};
        if(storeInfo.storeCode){
          if (_shareData.path) {
            _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `storeCode=${storeInfo.storeCode}`;
          } else {
            _shareData.path = this.route + `?staffCode=${staffInfo.staffCode}`;
          }
        }
        //分享分销员code
        if (staffInfo.private_code || staffInfo.staffCode) {
          let code = staffInfo.private_code || staffInfo.staffCode;
          let STAFF_SHARE_DATA = StorageH.get('STAFF_SHARE_DATA')||{};
          if(STAFF_SHARE_DATA.cfg_pic=="none"){
            code = "";
          }else if(STAFF_SHARE_DATA.cfg_pic=="name"){
            let USER_INFOS = StorageH.get('SIMPLE_USER_INFO')||{};
            code = USER_INFOS.realName || staffInfo.staffCode;
          }
          _shareData.title = _shareData.title ? code ? code + '-' + _shareData.title : _shareData.title : code;
        }
        shareData = _shareData;
        AppUtil.log("------share data-----", shareData);
        return shareData;
      };
      //朋友圈,读卡片分享配置
      pageOptions.onShareTimeline = function(...args){
        let data = typeof(this.onShareAppMessage) == "function" && this.onShareAppMessage(...args);
        let path = data.path;
        data.query = path.substr(parseInt(path.indexOf("?")) + 1);
        return data;
      }
    }
    pageOptions.setBpData = function(obj) {
      if (!obj) {
        return;
      }
      bpData = {
        ...bpData,
        ...obj
      };
    };
    pageOptions.addVisitLog = function(name, path, options) {
      // if(this.lockPage) return;
      // LgMg.addVisitLog(name, path, options);
    };
    pageOptions.addPageLog = function (name, path, options, _isBack){
      this._isBack = true;
      LgMg.addPageLog(name, path, options, _isBack);
    };
    pageOptions.addActionLog = function(name, position, options) {
      LgMg.addActionLog(name, position, options);
    };
    pageOptions.formAction = function(e) {
      let formId = e && e.detail && e.detail.formId;
      FM.push(formId, false);
    };
    pageOptions.jumpAction = function(e) {
      let dataset = e.currentTarget.dataset || {}
      let url = dataset.url;
      if (!url) return;
      wx.navigateTo({
        url: url,
        fail(){
          wx.switchTab({
            url: url,
          })
        }
      })
    };
    pageOptions.nextTickTask = function () {
      return new Promise(rs => {
          wx.nextTick(rs);
      });
    };
    pageOptions.MyViewTask = function (id, name, key) {
        this._myview || (this._myview = {});
        let vs = this._myview;
        if (vs[name]) return Promise.resolve(vs[name]);
        if (key) this.setData({ [key]: true });
        return this.nextTickTask().then(() => {
            vs[name] = this.selectComponent(id);
            return vs[name];
        });
    };
    pageOptions.noAction = function() {};
    pageOptions.redirectAction = function(e) {
      let url = e.currentTarget.dataset.url;
      wx.redirectTo({
        url: url
      });
    };
    pageOptions.showPage = function(){
      setTimeout(()=>{
        hidePage.call(this,false)
      })
    }
    pageOptions._noFn = function(){}
    pageOptions._checkUserLogin = function(){
      return LM.loginAsync().finally(()=>{
          this._setUserLogin();
          return Promise.resolve(LM.isLogin);
      })
    }
    pageOptions._setUserLogin = function(callback){
      if(this.data.isLogin != LM.isLogin){
        this.setData({
            isLogin: LM.isLogin
        })
      }
      typeof(callback) == "function" && callback(LM.isLogin)
    }
    pageOptions._getQuery = function(id,type,fnc){
      return new Promise((rs,rj)=>{
        setTimeout(() => { 
          let query = this.createSelectorQuery();
          let idSel = id || '#main';
          if(type == 'all'){
            query.selectAll(idSel).boundingClientRect()
          }else{
            query.select(idSel).boundingClientRect();
          }
          query.selectViewport().scrollOffset().exec(
            res=>{
              fnc && typeof(fnc) == 'function' && fnc();
              rs(res || {})
            }
          )
        }, 300);
      })
    }
  }
  return pageOptions;
}
//请求分享配置  （新框架后台不支持，考虑摒弃）
function getWxappShareConfigEntity(cfgType = "user_center") {
  return CL_BrandApi.getWxappShareConfigEntity({
    params: {
      cfgType: cfgType,
    },
    extraData: {
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
function checkAgreetLogin(target,callback) {
  AgreetH.checkUserAgreetment().then(()=>{ //协议检测
    console.log("不用跳转协议");
    LoginM.loginHandle(()=>{  //登录检测
      typeof (callback) == "function" && callback.call(target);
      console.log("不用跳转协议 + 登录回调");
      StoreH.callListen();
    });
  })
  // let page = getCurrentPages().pop();
  // let pageRoute = page.route;
  // let reqConf = StorageH.get("REQCONF") || {};
  // reqConf.agreetConf = reqConf.agreetConf || {};
  // let locationCallBack = function (pageType) {
  //   if (pageType != "isLogin"){
  //     LocationM.checkLoctionFn();
  //   }
  //   typeof (callback) == "function" && callback.call(target);
  // }
  // if (reqConf.agreetConf.isHandleCheck && reqConf.agreetConf.needAgreet) { //已经勾选
  //   LoginM.loginHandle(locationCallBack);
  //   return;
  // }
  // let jumpRoute = "pages/micro_mall/agreet_page/agreet";
  // if (pageRoute == jumpRoute || pageRoute == "pages/micro_mall/articles/agreet/agreet"){
  //   typeof (callback) == "function" && callback.call(target);
  //   return;
  // }
  // checkUserAgreement.call(this).then(needArgeet => {
  //   if (needArgeet == 1 && reqConf.agreetConf.isHandleCheck != 1) { //需要勾选协议
  //     let page = getCurrentPages().pop();
  //     let pageRoute = page.route;
  //     let needLogin = PH.paramsJson("needLogin") || {};
  //     needLogin.prevRoute = pageRoute;
  //     PH.saveParams({
  //       needLogin: needLogin
  //     });
  //     wx.navigateTo({
  //       url: '/' + jumpRoute,
  //     })
  //   } else {
  //     LoginM.loginHandle(locationCallBack);
  //   }
  // }).catch(() => {
  //   LoginM.loginHandle(locationCallBack);
  // })
}

function settarbar(isHideTab){
  let page = getCurrentPages().pop() || {};
  if (page.route && TabKeys[page.route] && typeof (page.getTabBar) == "function"){
    let tab = page.getTabBar();
    if (tab){
      if(typeof(isHideTab) == "boolean" && tab.data.isHideTab != isHideTab){
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

function checkMenuUpdate(){
  if (this.route && TabKeys[this.route] && typeof (this.getTabBar) == "function"){
    let tab = this.getTabBar();
    if (tab){
      tab.setTab();
    }
  }
}

function checkOverFlow(){
  let pages = getCurrentPages() || [];
  if (pages && pages.length >= 10) {
    setTimeout(() => {
      SMH.showToast({
        title: "页面累积过多，请多次返回上级页面",
        duration: 4000
      })
    }, 1000)
  }
}

function checkUpdateFnc(tab){
  if (!CheckVideo.checked) {
    CheckVideo.checkUpdate(tab).then(res => {
      tab.setData({
        showUpdateType: "videoShopping",
        showUpdate:true
      });
    }) 
  } else if (CheckVideo.checked && CheckVideo.exsist){
    let showUpdate = CheckVideo.showUpdate == 1? true:false;
    if (showUpdate != tab.data.showUpdate){
      tab.setData({
        showUpdate,
        showUpdateType: "videoShopping",
      });
    }
  }
}

function checkRoute(obj={}){
  let page = getCurrentPages().pop();
  if (CheckLastRoute[page.route])return
  CheckVideo.setLastRoute(page.route); 
}
function hidePage(hide){
  if(this){
      this.setData({
        pageHidden: hide
      })
  }
}