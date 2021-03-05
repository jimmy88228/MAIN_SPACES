import {
  CL_UserApi
} from "../manager/http-manager.js"
import StorageH from "../handle/storageHandle.js";
const STORE_KEY = "STORE_STORAGE";
class storeManager {
  static getInstance() {
    if (!storeManager.instance) {
      storeManager.instance = new storeManager();
    }
    return storeManager.instance;s
  }
  constructor() {
    let storeInfo = StorageH.get(STORE_KEY);
    if(storeInfo){
      this._storeInfo = storeInfo;
    }
  }
  getVisitStore(...arg){
    return getVisitStore.call(this, ...arg);
  }
  get storeInfo(){
    return this._storeInfo || {};
  }
  get storeId(){
    return (this._storeInfo && this._storeInfo.storeId) || 0
  }
}
export default storeManager.getInstance();
//
function getVisitStore(storeCode, isShowLoad){
  return CL_UserApi.getVisitStore({
    data: {
      storeCode: storeCode || ""
    },
    other: {
      isShowLoad: isShowLoad
    }
  }).then(e=>{
    if(e.code == 1){
      let data = e.data || {}
      this._storeInfo = data;
      StorageH.set(STORE_KEY, data);
      return Promise.resolve(data);
    }
    return Promise.reject();
  })
}