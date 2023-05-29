import {
  UserApi,
} from "../../manager/http-manager.js"
import Conf from "../../../conf.js"
import SConf from "./getSystemConfig.js"
import LM from "../../manager/login-manager.js"
import SMH from "../show-msg-helper.js"
import CacheD from "./cacheDateHandle.js"
import StorageH from "./storageHandle"
class mobileManager {
  static getInstance() {
    if (!mobileManager.instance) {
      mobileManager.instance = new mobileManager();
    }
    return mobileManager.instance;
  }
  constructor() {
    
  }
  //强制绑手机配置，绑定手机结果
  checkBindMobileResult() {
    return checkConstraintMobile.call(this).then(confNeed => {
      if (confNeed.Value == 1) {
        return checkIsBindMobile.call(this).then(isBindMobile => {
          return Promise.resolve(isBindMobile);
        })
      } else {
        return Promise.resolve(1);
      }
    })
  }
  //强制绑定手机配置接口
  getConstraintMobile(){
    return checkConstraintMobile.call(this);
  }
  //是否绑定手机
  getBindMobile(){
    return checkIsBindMobile.call(this);
  }
  //
  mobileStorage(value,type){
    if (type == "set"){
      StorageH.set("isBindMobile", value);
    } else if (type == "get"){
      StorageH.get("isBindMobile") || 0;
    }else{
      StorageH.remove("isBindMobile");
    }
  }
}
function checkIsBindMobile(){
  return CacheD.setCatchDate("bindMobile",3).then(()=>{
    return checkIsBindMobileReq.call(this);
  }).catch(res=>{
    if (res && res.code != "1"){
      return Promise.reject(res);
    }else{
      let isBindMobile = StorageH.get("isBindMobile") || 0;
      return Promise.resolve(isBindMobile);
    }
  })
}
//是否绑定手机
function checkIsBindMobileReq() {
  if (this.keepCheckBindMobil || !LM.isLogin) { return Promise.resolve(0); }
  this.keepCheckBindMobil = true;
  return UserApi.checkUserBindPhone({
    params: {
      brandCode: Conf.BRAND_CODE,
      userToken: LM.userToken
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      this.mobileStorage(data,"set");
      return Promise.resolve(data);
    }
    // SMH.showToast({
    //   title:e.msg
    // })
    console.log("checkIsBindMobileReq 错误")
    return Promise.reject(e);
  }).finally(()=>{
    this.keepCheckBindMobil = false;
  })
}
//绑定手机配置
function checkConstraintMobile() {
  if (this.keepConstraintMobile) { return Promise.resolve(0)}
  this.keepConstraintMobile = true;
  return SConf.getSysConfig("constraint_mobile").then(data=>{
    return Promise.resolve(data);
  }).finally(()=>{
    this.keepConstraintMobile = false
  })
}
export default mobileManager.getInstance();