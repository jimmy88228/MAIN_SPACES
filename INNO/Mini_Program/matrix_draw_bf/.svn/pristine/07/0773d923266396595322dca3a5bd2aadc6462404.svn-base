import Conf from '../../conf';
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
      let time = (parseInt(t) || 1)*60*60 ;// time=t个小时
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + (time * 24); // 默认一天
      let setValue = {
        DEADTIME: timestamp,
        version:Conf.LOGIN_VERSION || "",
        data: v
      }
      wx.setStorageSync(k, setValue);
  }
  get(k, def) {
    let getValue = wx.getStorageSync(k) || {};
    if (parseInt(getValue.DEADTIME) < (Date.parse(new Date()) / 1000) || !getValue.DEADTIME || getValue.version != Conf.LOGIN_VERSION){
      console.log('get 缓存过期 或 version不对应',k,getValue,getValue.version != Conf.LOGIN_VERSION,getValue.version,Conf.LOGIN_VERSION)
      if (def) {
        return def; 
      }else {
        return "";
      }
    }
    let data = getValue.data || def;
    console.log('get缓存', data)
    return data
  }
  hasKey(k){
    let getValue = wx.getStorageSync(k) || {};
    return !!getValue.DEADTIME
  }
  remove(k) {
    wx.removeStorageSync(k);
  }
  clear() {
    wx.clearStorageSync();
  }
}

export default StorageManager.getInstance();
