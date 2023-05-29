import Conf from "../../../conf.js";
import StorageH from "./storageHandle";
import {
  UserApi
} from "../../manager/http-manager.js";
const AGREET_CONF = "AGREET_CONF";
const limitPath = [
  "pages/micro_mall/agreet_page/agreet",
  "pages/micro_mall/articles/agreet/agreet"
]
class AgreetManager {
  static getInstance() {
    if (!AgreetManager.instance) {
      AgreetManager.instance = new AgreetManager();
    }
    return AgreetManager.instance;
  }
  constructor() {
    
  }
  checkUserAgreetment(page){
    return checkUserAgreement.call(this).catch(()=>{
      console.log("需要跳转协议");
      page = page || getCurrentPages().splice(-1)[0];
      if(limitPath.indexOf(page.route) == -1){
        wx.navigateTo({
          url: '/' + limitPath[0],
        })
      }
      return Promise.reject();
    })
  }
}
//检测协议
function checkUserAgreement() {
  // rs: 不用跳转协议回调， rj: 需跳转协议
  return new Promise((rs, rj)=>{
    let agreetConf = StorageH.get(AGREET_CONF);
    if(agreetConf){
      if(agreetConf.isHandleCheck || !agreetConf.needAgreet){
        return rs();
      } else {
        return rj();
      }
    }
    return checkUserAgreementReq.call(this).then(val=>{
      return val ? rj() : rs();
    })
  })
}
//
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
      let agreetConf = StorageH.get(AGREET_CONF) || {};
      agreetConf.needAgreet = res.data;
      StorageH.set(AGREET_CONF, agreetConf);
      return Promise.resolve(res.data);
    }
    return Promise.reject()
  })
}

export default AgreetManager.getInstance();