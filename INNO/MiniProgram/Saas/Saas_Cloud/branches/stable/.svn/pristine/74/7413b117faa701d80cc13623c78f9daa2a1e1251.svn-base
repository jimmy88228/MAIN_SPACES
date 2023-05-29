import Conf from "../../../conf.js"
import StorageH from "./storageHandle";
class cacheDateManager {
  static getInstance() {
    if (!cacheDateManager.instance) {
      cacheDateManager.instance = new cacheDateManager();
    }
    return cacheDateManager.instance;
  }
  constructor() {
    this._cacheDate = StorageH.get("cacheDate") || {};
    this._result = {};
  }
  get cacheDate(){
    return this._cacheDate;
  }
  delCacheDate(key){
    if(key){
      let cacheDate = this.cacheDate;
      delete cacheDate[key];
      StorageH.set("cacheDate", cacheDate);
    }else{
      this._cacheDate = {};
      StorageH.remove("cacheDate");
    }
  }
  checkCatchData(key,time= 1){
    if (!key) return false;
    let cacheDate = this._cacheDate;
    let pervDate = cacheDate[key];
    let dataCacheTime = Conf.dataCacheTime || 1;
    if (pervDate){
      let nextDate = new Date();
      if ((nextDate.getTime() - pervDate) < (time * dataCacheTime * 60 * 1000)) {
        return false;
      }
    }
    return true;
  }
  setCatchDate(key,time = 1){
    if (!key) return Promise.reject();
    if (this.checkCatchData(key,time)){
      let cacheDate = this._cacheDate;
      let nextDate = new Date();
      cacheDate[key] = nextDate.getTime();
      StorageH.set("cacheDate", cacheDate);
      return Promise.resolve();
    }else{
      return Promise.reject(); 
    }
  }
  
  setCacheData(key,data){
    if(!key)return
    this._result = this._result || {};
    this._result[key] = data;
  }

  getResult(key = ''){
    if(!key){
      return this._result;
    }else{
      return this._result[key];
    }
  }

}

export default cacheDateManager.getInstance();