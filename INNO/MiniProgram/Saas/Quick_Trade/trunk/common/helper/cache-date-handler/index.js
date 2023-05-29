import Conf from "../../../config/index"
import StorageH from "../storage-handler/index";
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
  checkCatchData(key,times= 1){
    if (!key) return false;
    let cacheDate = this._cacheDate;
    let pervDate = cacheDate[key];
    let dataCacheTime = Conf.dataCacheTime || 1;
    if (pervDate){
      let nextDate = new Date();
      // console.log('check缓存',key,(nextDate.getTime() - pervDate),(times * dataCacheTime * 60 * 1000))
      if ((nextDate.getTime() - pervDate) < (times * dataCacheTime * 60 * 1000)) {
        console.log('缓存时间内',key,'剩余'+(((times * dataCacheTime * 60 * 1000)-(nextDate.getTime() - pervDate))/(60*1000)).toFixed(1)+"分钟");
        return false; //缓存时间内
      }else{
        console.log('缓存已结束',key)
        return true
      }
    }
    console.log('无缓存',key);
    return true; //无缓存/缓存结束
  }
  setCatchDate(key,times = 1){
    if (!key) return Promise.reject();
    if (this.checkCatchData(key,times)){ //无缓存/缓存结束
      let cacheDate = this._cacheDate;
      let nextDate = new Date();
      cacheDate[key] = nextDate.getTime();
      StorageH.set("cacheDate", cacheDate);
      return Promise.resolve();
    }else{ //缓存时间内
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