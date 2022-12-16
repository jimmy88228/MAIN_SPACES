import StorageH from "@/common/helper/storage-handler.js";
import stringUtil from '@/common/support/utils/string-util.js'

const APP_CODE_KEY = "APP_CODE";
// 区别于config 的动态品牌信息
class brandManager {
  static getInstance() {
    if (!brandManager.instance) {
      brandManager.instance = new brandManager();
    }
    return brandManager.instance;
  }
  constructor() {
    this._appCode = StorageH.get(APP_CODE_KEY) || "";
  }
  get appCode(){
    return this._appCode || ""
  }
  _setAppCodeUrl(url){
    // #ifdef H5
    let pageParams = stringUtil.getAppUrlParams(); 
    if(pageParams.appCode){
      this.setData({appCode: pageParams.appCode}) // 决定请求头appCode参数
    }
    if(url.indexOf('appCode') === -1 && pageParams.appCode){
      if(url.indexOf('?') === -1){
        url+=`?appCode=${pageParams.appCode}`
      }else{
        url+=`&appCode=${pageParams.appCode}`
      }
    }
    return url
    // #endif

    // #ifdef MP
    return url
    // #endif
  }
  setData(data = {}){
    if(data.appCode){
      this._appCode = data.appCode;
      StorageH.set(APP_CODE_KEY, data.appCode);
    }
  }
  removeData(removeKey){
    if(removeKey instanceof Array || !removeKey){
      if((removeKey && removeKey.indexOf('appCode') != -1) || !removeKey){
        delete this._appCode;
        StorageH.set(APP_CODE_KEY, null);
      }
    }
  }
}
export default brandManager.getInstance();