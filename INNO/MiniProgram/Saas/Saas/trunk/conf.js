import Utils from "./common/support/utils/utils";
import EXT from "./common/helper/handle/getBrandInfo.js";
import getSetConfig from "./config/getNeedConfig.js";
import { PayType } from "./common/manager/log-map";
/**
 * 
 * 该版本包含中转页跳转,第三方支付测试
 * 
 */
const microType = "pageTab" //microPage,pageTab //自定义页类型 //只有GOSO需要打microPage

const API_TYPE = "1";  //1:测试环境 ，2：正式环境 ，3： 雅鹿,百家好,新saas定制
const BRAND_CODE= "INNOVATION";
const ICONNAME= "INNO"; //可传空
const LiveType = ""; //channels:视频号版本 //只有新saas品牌需要打视频号版

let _config = getSetConfig({
  BRAND_CODE: BRAND_CODE, //"XLH"//TBH//JWTEST//ZZYXCODE//XXRMCODE//XIAICODE//ZZLD//JLY品牌名称
  iconFileName: ICONNAME, //JWTY//TBH//ZZ品牌icon文件夹//XA
  visitApiType:API_TYPE,
  barCodeApiType: API_TYPE,
  dev: API_TYPE == "1" ? true : false,
  debug:true,
  dataCacheTime:3,//页面缓存时间（分钟）
  OPEN_CARD_APPID: "wxeb490c6f9b154ef9",
  PAGE_SIZE: 20,
  VERSION:"1.0",
  STARTUP_PAGE: "pages/startup/startup_page",
  MEMBER_INDEX:"pages/micro_mall/user/user",
  PAYMETHOD:"", //TONGLIAN，空值为普通支付
  PLATFORM:{
    TYPE: "WXAPP", //WXAPP,QQ
    APITYPE: "QQ"
  },
  PAYTYPE: PayType,
  microType,
  LiveType
});
const config = EXT.tabbarHandle(Utils.merge(_config, EXT.BInfo));
console.log("CONFIG配置",config);//品牌配置信息，在app.json中ext配置
export default config;