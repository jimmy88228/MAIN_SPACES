const CheckIsTimeoutKey = "CheckIsTimeout"
class StorageManager {
  static getInstance() {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }
  constructor() {
    
  }
  set(k, v, t) {
    let time = parseFloat(t) || 60 * 2; //单位:分钟 //默认120分钟
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + (time * 60);
      let setValue = {
        DEADTIME: timestamp,
        value: v
      }
      uni.setStorageSync(k, setValue);
  }
  get(k,def,check=true) {
    let getValue = uni.getStorageSync(k);
		if(!getValue){ // 未初始化
			return null;
		}
    if (check && (parseFloat(getValue.DEADTIME) < (Date.parse(new Date()) / 1000)) || !getValue.DEADTIME){
      this.remove(k);
      if (def) { 
        return def; 
      }else {
        return "";
      }
    }
    let value = getValue.value;
    return value || def
  }
  hasKey(k){
    let getValue = uni.getStorageSync(k) || {};
    return !!getValue.DEADTIME
  }
  remove(k) {
    uni.removeStorageSync(k);
  }
  clear() {
    uni.clearStorageSync();
  }
  checkIsTimeout({key,type="get",value,t=0}){ //t 时间(单位分钟
    let storage = this.get(CheckIsTimeoutKey,{},false); //CheckIsTimeout缓存
    storage[key] || (storage[key] = {})
    let item = storage[key];
    if(type == 'get'){
      if(item.DEADTIME){
        let DEADTIME = item.DEADTIME;
        // console.log('DEADTIME',DEADTIME,new Date().getTime(),DEADTIME - new Date().getTime())
        if(DEADTIME > (new Date().getTime())){
          return false //缓存时间未过期
        }
      }
      return true //缓存时间过期
    }else if(type == 'set'){
      item.DEADTIME = (new Date().getTime()) + t * 60 * 1000; //单位分钟(60 * 1000)
      item.value = value;
      this.set(CheckIsTimeoutKey,storage)
    }
  }
}

export default StorageManager.getInstance();
