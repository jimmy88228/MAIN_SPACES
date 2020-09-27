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
    let time = parseInt(t) || 60;//默认一天,t 单位分钟
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + (time * 60);
      let setValue = {
        DEADTIME: timestamp,
        value: v
      }
      wx.setStorageSync(k, setValue);
  }
  get(k, def) {
    let getValue = wx.getStorageSync(k) || {};
    if (parseInt(getValue.DEADTIME) < (Date.parse(new Date()) / 1000) || !getValue.DEADTIME){
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
