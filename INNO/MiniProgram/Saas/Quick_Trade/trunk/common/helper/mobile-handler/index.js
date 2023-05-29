import {
  UserApi,
} from "../../manager/http-manager/index"
import Conf from "../../../config/index"
import LM from "../../manager/login-manager/index"
import CacheD from "../cache-date-handler/index"
import StorageH from "../storage-handler/index"
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
    return checkIsBindMobile.call(this).then(isBindMobile => {
      return Promise.resolve(isBindMobile);
    })
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
  return CacheD.setCatchDate("bindMobile",5).then(()=>{
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
    return Promise.reject(e);
  }).finally(()=>{
    this.keepCheckBindMobil = false;
  })
}
export default mobileManager.getInstance();