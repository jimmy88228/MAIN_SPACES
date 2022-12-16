import LM from "../manager/login-manager.js";
import StoreH from "../helper/handle/storeHandle"; 
// import AgreetH from "../helper/handle/agreetHandle";
import Conf from "../../conf.js";
import PH from "../helper/handle/paramsHandle.js";
import SIH from "../helper/sys-infos-helper.js";
// import LoginM from "../helper/handle/loginHandle.js"
import SMH from "../helper/show-msg-helper.js";
import CheckVideo from "../helper/check-video-update.js";
import MyStr from "../support/utils/string-util.js";
import StartPageHandle from "../helper/handle/startPageHandle.js";
import StorageH from "../helper/handle/storageHandle.js"
import WelcomeH from "../helper/handle/welcomeHandle.js";
import retainSessionH from "../helper/handle/retainSessionHandle";
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
import { checkCommissionOpenConfigAsync } from "../helper/commission-helper";
import baseHelper from "./base-helper.js";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const BasePage = function (pageOptions){
  let po = pageOptions || {};
  let pageParams,baseData={pageShare:""};
  let pages,page;
  let bpo = {
    onLoad(...args) {
      try{
        console.log('BP onLoad', ...args,this.route);
        pages = getCurrentPages() || [];
        page = pages.pop() || {};
        let q = args && args.length > 0 && args[0] || {};
        pageParams = {...q};
        page && page.setData(getDefaultData());
        if(this._onLoaded)return;
        checkHasStoreId(this); //检测onload是否有有效storeId
        setShareMenu(po.onShareAppMessage);
        checkWxScene(q); //检测为微信场景值处理
        if(StartPageHandle.startPageJump(page, {...q,_lastRoute:this.route})){
          console.log('旧小程序码拦截onLoad'); 
          return
        }
        getPageState(this,"onLoad");
        checkOverFlow(); //检测页面累计 
        trimShareConf(this,po,page,baseData);  
      }catch(e){
        console.log('BP onLoad catch', ...args,this.route);
      }
      po.onLoad && po.onLoad.call(this, ...args);
    },
    onShow(...args) {
      try{
        console.log('BP onShow', ...args,this.route);
        getPageState(this,"onShow"); 
        if (pageParams.scene && !StartPageHandle.releasePage){
          console.log('拦截onShow',this.route)
          return;
        } 
        settarbar();
        checkVideoRoute();
        checkMenuUpdate(page);
        trimWelcomeH(this,page);
        if (!po.unAutoAddLog) {
          if (!LimitAddLog[this.route]) {
            this.addPageLog(null, this.route, pageParams, this._isBack);
          }
        } 
      }catch(e){
        console.log('BP onShow catch',e,...args,this.route);
      }
      po.onShow && po.onShow.call(this, ...args);
    },
    onHide() {
      try {
        getPageState(this, "onHide");
      } catch (e) {}
      po.onHide && po.onHide.call(this);
    },
    onUnload() {
      try {
        getPageState(this, "onUnload");
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
 
//请求分享配置  （新框架后台不支持，考虑摒弃）
function getWxappShareConfigEntity(cfgType = "user_center") {
  return CL_BrandApi.getWxappShareConfigEntity({
    params: {
      cfgType: cfgType,
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

// //协议登录
// function checkAgreetLogin(target,callback) {
//   AgreetH.checkUserAgreetment().then(()=>{ //协议检测
//     console.log("不用跳转协议");
//     LoginM.loginHandle(()=>{  //登录检测
//       console.log("登录回调");
//       typeof (callback) == "function" && callback.call(target);
//     });
//   })
// }

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
      checkUpdateFnc(tab);
      tab.setData({
        selected: TabKeys[page.route]
      });
      page.setData({
        customTab: true,
        customTabStyle:"customTab"
      });
    }
  }
}

function checkMenuUpdate(page){
  if (page.route && TabKeys[page.route] && typeof (page.getTabBar) == "function"){
    let tab = page.getTabBar();
    if (tab){
      tab.setTab(); //custom-tab-bar -> setTab
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

function checkVideoRoute(){
  let page = getCurrentPages().pop();
  if (CheckLastRoute[page.route])return
  CheckVideo.setLastRoute(page.route); 
}
function hidePage(_this,hide=false){
  console.log('_this',hide,_this,)
  if(_this){
      _this.setData({
        pageHidden: hide
      })
  }
}
 
function checkWxScene(q){
  //由于scene和二维码的参数有冲突，检测为微信场景值处理
  if (q.scene && MyStr.checkWxScene(q.scene)) {
    delete q.scene;
  }
}

function checkHasStoreId(_this){
  if(StoreH.storeId){ //检测onload时是否有soterId
    _this._onLoaded = true;
  }
}

function getDefaultData(){
  return {
    brand_info: Conf,
    main_bg_color:Conf.style.bg_color,
    main_font_color:Conf.style.font_color,
    defaultIcon:  Conf.default_icon_url,
    isIphoneX: SIH.isIphoneX,
    pageHidden: true,
    brand_info: Conf,
    brandStyle: Conf.style,
    customTabStyle:"",
    ipx_p_b_style:SIH.isIphoneX?"ipx_p_b":"",
    ipx_b_b_style:SIH.isIphoneX?"ipx_b_b":"",
  }
}

function trimShareConf(_this,po,page,baseData){
   //分享配置
   let cfgType = ShareConf[page.route] || "default";
   if (cfgType != "goods" && po.onShareAppMessage) {
     baseData.pageShare = cfgType;
     let reqType = cfgType == 'user_center' ? cfgType : "custom_page";
     getWxappShareConfigEntity.call(_this, reqType).then(config => {
       let allShareConfig = PH.paramsJson().shareConfig || {};
       allShareConfig[cfgType] = config;
       PH.saveParams({
         "shareConfig": allShareConfig
       });
     });
   }  
}

function getPageState(_this,process) {
  switch (process) {
    case "onShow":
      if (_this.pageState == "onLoad" || !_this.pageState) {
        _this.pageState = process
      } else if (_this.pageState == "onHide") {
        _this.pageState = "onBack"
      }
      break;
    case "onLoad":
    case "onReady":
    case "onHide":
    case "onUnload":
      _this.pageState = process;
      break;
  }
}


function trimWelcomeH(_this,page){
  //欢迎页
  WelcomeH.checkWelcomeConf(page).then((isActive) => {
    if (isActive) {
      settarbar(true);
      hidePage(page, true)
      typeof (_this.checkWelComeCallback) == "function" && _this.checkWelComeCallback();
      WelcomeH.activeCallback(function () {
        // checkAgreetLogin.call(_this, _this);
        // checkAgreetLogin.call(_this, _this ,()=>{StoreH.callListen()});
        settarbar(false);
        hidePage(page, false);
      })
    } else {
      hidePage(page, false)
      settarbar(false);
      // checkAgreetLogin.call(_this, _this);
      // checkAgreetLogin.call(_this, _this ,()=>{StoreH.callListen()});
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
      baseHelper.addActionLog("PAGE_SHARE", "", param);
    }
    //路径拼装
    if (_shareData.path) {
      _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `shareType=${_shareData.shareType}`;
    } else {
      _shareData.path = this.route + `?shareType=${_shareData.shareType}`;
    }
    //分享 fromUser
    console.log('分享shareCode',LM.shareCode)
    if (LM.isLogin && LM.shareCode) {
      if (_shareData.path) {
        _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `fromUser=${LM.shareCode}`;
      } else {
        _shareData.path = this.route + `?fromUser=${LM.shareCode}`;
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
    if (checkCommissionOpenConfigAsync() === "staff" && (staffInfo.private_code || staffInfo.staffCode)) { // 分销员
      let code = staffInfo.private_code || staffInfo.staffCode;
      let STAFF_SHARE_DATA = StorageH.get('STAFF_SHARE_DATA') || {};
      if (STAFF_SHARE_DATA.cfg_pic == "none") {
        code = "";
      } else if (STAFF_SHARE_DATA.cfg_pic == "name") { // && LogMap[this.route] != 'SECKILL_ACT_PAGE'
        let USER_INFOS = StorageH.get(STORAGE_USER_INFOS_KEY) || {};
        code = USER_INFOS.realName || staffInfo.staffCode;
        console.log("USER_INFOS", USER_INFOS);
      }
      console.log("STAFF_SHARE_DATA", STAFF_SHARE_DATA);
      _shareData.title = _shareData.title ? code ? code + '-' + _shareData.title : _shareData.title : code;
    }
    if (LM.storeInfo && LM.storeInfo.staff_code) { // 带上staff_code是店员code
      if (_shareData.path) {
        _shareData.path += (_shareData.path.indexOf("?") >= 0 ? "&" : "?") + `storeStaffCode=${LM.storeInfo.staff_code}`;
      } else {
        _shareData.path = this.route + `?storeStaffCode=${LM.storeInfo.staff_code}`;
      }
    }
    if(StoreH.storeInfo && StoreH.storeInfo.storeCode){
      _shareData.path = splicePath.call(this,_shareData.path,`storeCode=${StoreH.storeInfo.storeCode}`);
    }
    shareData = _shareData;
    console.log("onShareAppMessage", shareData);
    // 保存短暂切换后台数据
    retainSessionH.saveRetainSession({
      shortPath: this.route,
      shortHome: true
    })
    return shareData;
  };
  bpo.onShareTimeline = function(...args){
    let data = typeof(this.onShareAppMessage) == "function" && this.onShareAppMessage(...args);
    let path = data.path;
    data.query = path.substr(parseInt(path.indexOf("?")) + 1);
    // 保存短暂切换后台数据
    retainSessionH.saveRetainSession({
      shortPath: this.route,
      shortHome: true
    })
    console.log('onShareTimeline',data)
    return data;
  }
}

function setShareMenu(bool = false) {
  bool && wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

function splicePath(path,params){
  if (path) {
    path += (path.indexOf("?") >= 0 ? "&" : "?") + `${params}`;
  } else {
    path = this.route + `?${params}`;
  }
  return path
}