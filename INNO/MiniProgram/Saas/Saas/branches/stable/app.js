import "./common/init";
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
import md5 from './common/support/utils/md5';
import getColor from "./common/helper/handle/colorHandle.js"
import PH from "./common/helper/handle/paramsHandle.js"
import AS from "./common/helper/authorize-set.js"
import RunApi from "./common/helper/apiPackage.js"
import TARH from "./common/helper/handle/tabbarHandle.js"
import CDateH from "./common/helper/handle/cacheDateHandle.js"
import NH from "./common/helper/handle/numHandle.js"
import LocationM from "./common/helper/location-manager.js"
import CardM from "./common/helper/handle/openCardHandle.js"
import CacheH from "./common/helper/handle/cacheHandle.js"
import SHP from "./common/helper/handle/scanHandleParams.js"
import WxGH from "./common/helper/handle/wxGroupHandle.js"
import {OpKind, ShareType} from "./common/manager/log-map.js";
import StorageH from "./common/helper/handle/storageHandle.js"
import strH from "./common/helper/handle/strHandle.js"
import StringUtl from "./common/support/utils/string-util.js";
import OriginalApi from "./common/manager/original-api-manager";
import {videoAccountType} from "./common/manager/log-map.js";
import retainSessionH from "./common/helper/handle/retainSessionHandle.js";
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
  get TARH() {
    return TARH;
  },
  get CDateH(){
    return CDateH;
  },
  get CacheH(){
    return CacheH;
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
  get OriginalApi(){
    return OriginalApi;
  },
  getColor(...args) {
    return getColor(...args);
  },
  sysTemConfig(params){
    return SConf.getSysConfig(params)
  },
  getOnceSysConfig(params){
    return SConf.getOnceSysConfig(params)
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
    appOnLaunch.call(this,options);
	},
	onShow: function (ops) {
    console.log("App onShow", ops);
    if(!retainSessionH.isCoverSession(ops, PH.paramsJson('options'))){
      return;
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
  saveOptions(ops){
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

function appOnLaunch(options){
  if(!videoAccountType[options.scene]){ //视频号scene检测
    checkUpdate(); //检测线上新版本
  } 
  LgMg.getVersion();
  var logs = wx.getStorageSync('logs') || []//调用API从本地缓存中获取数据
  logs.unshift(Date.now());
  LM.reSetSimpleInfo();
  LM.checkStaffShare(["sharing_identity", "share_distribution", "share_staff",'share_transpay_title']); // 分享配置-分享身份设置
  wx.setStorageSync('logs', logs);
  wx.removeStorageSync('CART_DEFAULT_SELECT'); 
  StorageH.remove("select_store");// 清除已选择的自提店铺
  LM.setStoreInfo();
  LM.setStaffInfo({}); 
}

function appOnshow(ops){
  CardM.submitInfoCallback(ops);
  CDateH.delCacheDate();
  LgMg.initGlobalParams(ops);
  PH.initStatus();
  LgMg.setBaseChannel(ops);  
  WxGH.initStatus();
  LM.loginAsync(false).finally(() => {
    LgMg.setChannel(ops);
    !this.isCheckIfStaff && LM.checkIfStaffDstbEvent();
    LM.isLogin && (this.isCheckIfStaff = true);
    let staffCode = ops.query.staffCode;
    if (staffCode) {
      LM.buildDstbRelation(staffCode);
    }
    this.saveOptions(ops);
    // FM.submit();
    // SRHandle.setContext();
  });
 }

function appOnhide(){
  // FM.submit();
  LgMg.clearGlobalParams();
  //清除强制登录配置
  PH.delParams(["needLogin", "page_id", "store_id", "staff_id", "fromUser", "staff_code", "goods_id","codeType"]); 
  wx.removeStorageSync('tabKey');
}
