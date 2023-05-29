import Utils from "./common/support/utils/utils";
import EXT from "./common/helper/handle/getBrandInfo.js";
import getSetConfig from "./config/getNeedConfig.js";
import { PayType } from "./common/manager/log-map";
/**
 * 
 * 该版本包含中转页跳转,第三方支付测试
 * 
*/
const API_TYPE = "2";  //1:测试环境 ，2：正式环境 ，3： 雅鹿,百家好,新saas定制
const BRANDCODE= "GOSO"; 
const ICONNAME= "GOSO"; 

let _config = getSetConfig({
  brandCode: BRANDCODE,//INNOVATION//XLH//TBH//JWTEST//ZZYXCODE//XXRMCODE//XIAICODE//ZZLD//JLY品牌名称
  iconFileName: ICONNAME, //INNO//JWTY//TBH//ZZ品牌icon文件夹//XA
  visitApiType:API_TYPE,
  barCodeApiType: API_TYPE,
  dev: API_TYPE == "1" ? true : false,
  debug:true,
  NEWREG:true,
  dataCacheTime:3,//页面缓存时间（分钟）
  OPEN_CARD_APPID: "wxeb490c6f9b154ef9",
  PAGE_SIZE: 20,
  VERSION:"1.0",
  STARTUP_PAGE: "pages/startup/startup_page",
  MEMBER_INDEX:"pages/micro_mall/user/user",
  PAYMETHOD:"TONGLIAN",//TONGLIAN ，空值为普通支付
  PLATFORM:{
    TYPE: "CLOUD_SHOP", //WXAPP,QQ,CLOUD_SHOP
    APITYPE: "QQ"
  },
  PAYTYPE: PayType,
  ext_params: {
    qq_map_api_key: "IQABZ-UE2C2-F7OU6-CGV3S-D74G6-ERFMR" // 腾讯位置信息服务key
  },
  sevenFishConf:{
    APP_KEY:"e1bb172cdb3cad526c657df12526a225", //5c193d9a50d2c6bb6497773ea81b2359 //e1bb172cdb3cad526c657df12526a225
    APP_ID:"zRK0QRkFZgq", //3f0eoV7OHWR //zRK0QRkFZgq
  } 
});
// const config = EXT.tabbarHandle(Utils.merge(_config));
const config = EXT.tabbarHandle(Utils.merge(_config, EXT.BInfo));
console.log('ext.binfo', EXT.BInfo, '_config', _config);
console.log('configconfig',config);//品牌配置信息，在app.json中ext配置
export default config;