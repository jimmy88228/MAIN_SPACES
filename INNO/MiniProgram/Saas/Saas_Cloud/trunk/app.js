import "./common/support/init";
import Conf from "./conf";
import * as Api from "./common/manager/http-manager";
import SIH from "./common/helper/sys-infos-helper.js";
import LM from "./common/manager/login-manager";
import LgMg from "./common/manager/log-manager.js";
import FM from "./common/helper/form-id-manager.js";
import SMH from "./common/helper/show-msg-helper.js";
import BP from "./common/base/base-page.js";
import BTAB from "./common/base/base-tab.js";
import EB from "./common/support/tools/event-bus.js";
import pageJump from "./common/helper/page-jump";
import checkUpdate from "./common/helper/check-update-manager.js";
import SConf from "./common/helper/handle/getSystemConfig.js"
import md5 from './common/helper/utils/md5';
import getColor from "./common/helper/handle/colorHandle.js"
import PH from "./common/helper/handle/paramsHandle.js"
import AS from "./common/helper/authorize-set.js"
import RunApi from "./common/helper/apiPackage.js"
import TARH from "./common/helper/handle/tabbarHandle.js"
import NH from "./common/helper/handle/numHandle.js"
import LocationM from "./common/helper/location-manager.js"
import CardM from "./common/helper/handle/openCardHandle.js"
import SHP from "./common/helper/handle/scanHandleParams.js"
import WxGH from "./common/helper/handle/wxGroupHandle.js"
import { OpKind, ShareType,SceneType,videoAccountType} from "./common/manager/log-map.js";
import StorageH from "./common/helper/handle/storageHandle.js"
import strH from "./common/helper/handle/strHandle.js"
import StringUtl from "./common/support/utils/string-util.js";
import OriginApi from "./common/manager/original-api-manager";
import CDateH from "./common/helper/handle/cacheDateHandle.js"
import CacheH from "./common/helper/handle/cacheHandle.js"
import StoreH from "./common/helper/handle/storeHandle.js";
import {checkCommissionOpenConfig} from "./common/helper/commission-helper.js";
import retainSessionH from "./common/helper/handle/retainSessionHandle.js";
import WeReportHelper from "./common/helper/we-report-helper.js"
App({
  globalData: {
    isShowWelcome: false,
  },
  get md5() {
    return md5;
  },
  get Conf() {
    return Conf;
  },
  get LM() {
    return LM;
  },
  get AS(){
    return AS;
  },
  get RunApi(){
    return RunApi;
  },
  get PH(){
    return PH;
  },
  get SIH() {
    return SIH;
  },
  get SMH() {
    return SMH;
  },
  get BP() {
    return BP;
  },
  get BTAB() {
    return BTAB;
  },
  get EB() {
    return EB
  },
  get NH(){
    return NH;
  },
  get SHP(){
    return SHP
  },
  get OpKind(){
    return OpKind
  },
  get ShareType(){
    return ShareType
  },
  get strH(){
    return strH
  },
  get StringUtl(){
    return StringUtl
  },
  get LiveApi(){
    return Api.LiveApi;
  },
  get MainApi(){
    return Api.MainApi;
  },
  get UserApi(){
    return Api.UserApi;
  },
  get RegApi() {
    return Api.RegApi;
  },
  get GoodsApi() {
    return Api.GoodsApi;
  },
  get BuyApi() {
    return Api.BuyApi;
  },
  get BrandApi() {
    return Api.BrandApi;
  }, 
  get FromApi() {
    return Api.FromApi;
  },
  get PayApi() {
    return Api.PayApi;
  },
  get PointApi(){
    return Api.PointApi;
  },
  get PreSaleApi(){
    return Api.PreSaleApi;
  },
  get DstbApi(){
    return Api.DstbApi;
  },
  get DistrApi(){
    return Api.DistributionApi;
  },
  get CL_DistrApi(){
    return Api.CL_DistributionApi;
  },
  get CollageApi(){
    return Api.CollageApi;
  },
  get VsLogApi(){
    return Api.VsLogApi;
  },
  get SmktPayApi(){
    return Api.SmktPayApi;
  },
  get GrassApi(){
      return Api.GrassApi;
  },
  get PageApi(){
    return Api.PageApi;
  },
  get BargainApi() {
    return Api.BargainApi;
  },
  get MemberCardApi(){
    return Api.MemberCardApi;
  },
  get ActApi() {
    return Api.ActApi;
  },
  get LotteryApi(){
    return Api.LotteryApi;
  },
  get SecKillApi(){
    return Api.SecKillApi;
  },
  get BarCodeApi(){
    return Api.BarCodeApi;
  },
  get ElectricApi(){
    return Api.ElectricApi;
  },
  get UserDockApi(){
   return Api.UserApi;
  },
  get PdaApi(){
    return Api.PdaApi;
  },
  get NewPayApi(){
    return Api.NewPayApi;
  },
  //云店api
  get CL_GoodsApi() {
    return Api.CL_GoodsApi;
  },
  get CL_RegApi(){
    return Api.CL_RegApi;
  },
  get CL_BrandApi(){
    return Api.CL_BrandApi;
  },
  get CL_UserApi(){
    return Api.CL_UserApi;
  },
  get CL_BuyApi(){
    return Api.CL_BuyApi;
  },
  get CL_VsLogApi(){
    return Api.CL_VsLogApi;
  },
  get CL_ActApi(){
    return Api.CL_ActApi;
  },  
  get CL_SecKillApi(){
    return Api.CL_SecKillApi;
  },  
  get CL_BargainApi(){
    return Api.CL_BargainApi;
  },  
  get CL_PreSaleApi(){
    return Api.CL_PreSaleApi;
  }, 
  get CL_PointApi(){
    return Api.CL_PointApi;
  },  
  get CL_CollageApi(){
    return Api.CL_CollageApi;
  },  
  get CL_LotteryApi(){
    return Api.CL_LotteryApi;
  }, 
  get CL_StoreCommApi(){
    return Api.CL_StoreCommApi;
  },
  get CDateH(){
    return CDateH;
  },
  get CacheH(){
    return CacheH;
  },
  get TARH(){
    return TARH;
  },
  get LocationM(){
    return LocationM;
  },
  get CardM(){
    return CardM;
  },
  get LgMg(){
    return LgMg;
  },
  get StorageH(){
    return StorageH;
  },
  get OriginApi(){
    return OriginApi;
  },
  get StoreH(){
    return StoreH;
  },
  get WeReportHelper(){
    return WeReportHelper;
  },
  // get myPluginInterface(){
  //   return myPluginInterface
  // },
  getColor(...args) {
    return getColor(...args);
  },
  sysTemConfig(params){
    return SConf.getSysConfig(params)
  },
  pageJump(options) {
    return pageJump(options);
  },
  get version() {
    let reg = new RegExp(/(\d+).(\d+).(\d+)/);
    let ver = wx.getSystemInfoSync().SDKVersion;
    if (reg.test(ver)) {
      // 2.3.2以下为低版本
      if (RegExp.$1 < 2 || (RegExp.$1 == 2 && RegExp.$2 < 3) || (RegExp.$1 == 2 && RegExp.$2 <= 3 && RegExp.$3 < 2)) {
        return false;
      } else {
        return true;
      }
    }
  },
	onLaunch: function (options) {
    console.log("onLaunch",options); 
    console.log('systemInfo',this.SIH.systemInfo)
    if(!videoAccountType[options.scene]){
     //检测更新
      checkUpdate();
    }
    LgMg.getVersion();
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    LM.reSetSimpleInfo();
    LM.setStoreInfo();
    LM.checkStaffShare("sharing_identity");
		wx.setStorageSync('logs', logs);
    wx.removeStorageSync('CART_DEFAULT_SELECT');
	},
	onShow: function (ops) {
    console.log("页面 onShow app", ops);
    if(!retainSessionH.isCoverSession(ops, PH.paramsJson('options'))){
      return;
    }
    if(ops.query && !ops.query.scene){
      ops.query.store_code && (ops.query.storeCode = ops.query.store_code);
      StoreH.checkStoreUpdate(ops);
    }
    PH.saveParams({options:ops});
    if(this.isShow) return;
    appOnshow.call(this, ops);
    this.isShow = true;
    let _timer = setTimeout(()=>{
      this.isShow = false;
      clearTimeout(_timer);
    },1000);
	},
  onHide(){
    appOnhide.call(this);
  },
	// 检测是否是第一次打开小程序，在“发现”中删除小程序再重新进来也算第一次进来
	checkIsFirst: function () {
		if (!wx.getStorageSync('HAS_ENTRY')) {
			this.globalData.isFirst = true;
			wx.setStorageSync('HAS_ENTRY', 'true');
		} else {
			this.globalData.isFirst = false;
		}
	},
  //
  saveOptions(ops){
    console.log(ops,"app获取的参数")
    PH.initParam(ops)
  },
  showLog(data,tip=""){
    try{
      console.log(tip,JSON.parse(JSON.stringify(data)));
    }catch(e){}
  },
  getIconUrl(url,type='icon_url'){
    if(!type)return ""
    return (Conf[type] || "") + url;
  }
})

function appOnshow(ops){
  CardM.submitInfoCallback(ops);
  CDateH.delCacheDate();
  LgMg.initGlobalParams(ops);
  PH.initStatus();
  LgMg.setBaseChannel(ops);   
  WxGH.initStatus();
  LM.loginAsync(false).finally(() => {
    LgMg.setChannel(ops);
    if (!this.isCheckIfStaff) {
      setTimeout(() => {
        checkCommissionOpenConfig().finally(() => {
          LM.checkIfStaffDstbEvent();
          LM.checkIfStore();
        })
      }, 3000);
    }else{
      LM.checkIfStaffDstbEvent();
    }
    LM.isLogin && (this.isCheckIfStaff = true);
    FM.submit();
    let staffCode = ops.query.staffCode;
    if (staffCode) {
      LM.buildDstbRelation(staffCode);
    }
    this.saveOptions(ops);
  });
}

function appOnhide(){
  FM.submit();
  LgMg.clearGlobalParams();
  //清除强制登录配置
  PH.delParams(["needLogin", "page_id", "store_id", "staff_id", "fromUser", "staff_code", "goods_id","codeType"]);
  wx.removeStorageSync('tabKey');
}