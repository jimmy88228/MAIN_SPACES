import Conf from "./conf";
import * as Api from "./helper/manager/http-manager";
import SIH from "./helper/sys-infos-helper.js";
import LM from "./helper/manager/login-manager";
import LgMg from "./helper/manager/log-manager.js";
import FM from "./helper/manager/form-id-manager.js";
import SMH from "./helper/show-msg-helper.js";
import BP from "./helper/base/base-page.js";
import BTAB from "./helper/base/base-tab.js";
import EB from "./support/tools/event-bus.js";
import pageJump from "./helper/page-jump";
import checkUpdate from "./helper/manager/check-update-manager.js";
import SConf from "./helper/handle/getSystemConfig.js"
import BI from "./helper/handle/getBrandInfo.js"
import md5 from './utils/md5';
import getColor from "./helper/handle/colorHandle.js"
import PH from "./helper/handle/paramsHandle.js"
import AS from "./helper/manager/authorize-set.js"
import RunApi from "./helper/manager/apiPackage.js"
import TARH from "./helper/handle/tabbarHandle.js"
import CDateH from "./helper/handle/cacheDateHandle.js"
import NH from "./helper/handle/numHandle.js"
import LocationM from "./helper/manager/location-manager.js"
import CardM from "./helper/handle/openCardHandle.js"
import CacheH from "./helper/handle/cacheHandle.js"
import SHP from "./helper/handle/scanHandleParams.js"
import WxGH from "./helper/handle/wxGroupHandle.js"
import { OpKind, ShareType} from "./helper/manager/log-map.js";
import StorageH from "./helper/handle/storageHandle.js"
import strH from "./helper/handle/strHandle.js"
import StringUtl from "./support/utils/string-util.js";
import './support/polyfill/polyfill-promise'
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
  get TestApi(){
   return Api.TestApi;
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
  // get UserDockApi(){
  //   return Api.UserDockApi;
  // },
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
  getColor(...args) {
    return getColor(...args);
  },
  sysTemConfig(params){
    return SConf.getSysConfig(params)
  },
  getBrandInfo(){},
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
    //检测更新
    checkUpdate();
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    LM.getUserSimpleInfo();
    LM.checkStaffShare("sharing_identity");
		wx.setStorageSync('logs', logs);
    wx.removeStorageSync('CART_DEFAULT_SELECT');
    LM.setStoreInfo();
	},
	onShow: function (ops) {
    console.log("页面 onshow apJs", ops);
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
  }
})
//
function appOnshow(ops){
  CardM.submitInfoCallback(ops);
  CDateH.delCacheDate();
  LgMg.initGlobalParams(ops);
  PH.initStatus();
  LM.loginAsync(false).then(res=>{
    console.log('进来 loginAsync 结果',res)
  }).catch(e=>{
    console.log('进来 loginAsync 结果 catch',e)
  }).finally(() => {
    LgMg.setChannel(ops);
    LM.checkIfStaffDstbEvent();
    FM.submit();
    let staffCode = ops.query.staffCode;
    if (staffCode) {
      LM.buildDstbRelation(staffCode);
    }
    this.saveOptions(ops);
    // SRHandle.setContext();
  });
  WxGH.initStatus();
  this.getBrandInfo();
}
//
function appOnhide(){
  FM.submit();
  LgMg.clearGlobalParams();
  //清除强制登录配置
  PH.delParams(["needLogin", "page_id", "store_id", "staff_id", "fromUser", "staff_code", "goods_id","codeType"]);
  //注销用户分销身份
  LM.setStaffInfo({});
  wx.removeStorageSync('tabKey');
}