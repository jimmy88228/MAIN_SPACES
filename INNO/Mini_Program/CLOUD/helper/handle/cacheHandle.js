import Conf from "../../conf.js"
import StorageH from "../../helper/handle/storageHandle";
class cacheManager {
  static getInstance() {
    if (!cacheManager.instance) {
      cacheManager.instance = new cacheManager();
    }
    return cacheManager.instance;
  }
  constructor() {
    
  }
  getCache(key){
    let version = Conf.VERSION;
    let data = StorageH.get(key) || {};
    if (data[version]){
      return data[version]
    }else{
      return null;
    }
  }
  setCache(key, data){
    let version = Conf.VERSION;
    StorageH.set(key, {
      [version]: data
    })
  }
}

export default cacheManager.getInstance();