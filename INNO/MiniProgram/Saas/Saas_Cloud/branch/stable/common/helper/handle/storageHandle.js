class StorageManager{
  static getInstance() {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }
  constructor() {
    
  }
  set(k, v, t) {
    let time = parseInt(t) || 60; //单位:分钟 //默认60分钟
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

  // extends
  setByNextCalendarDay(k, v, dayCount = 1){ // set方法(下N个自然日过期)
    const resultStamp = new Date(new Date(new Date().toLocaleDateString()).getTime()+((24*60*60*1000) * dayCount)).getTime();
    let setValue = {
      DEADTIME: resultStamp / 1000, // 这里单位是秒
      value: v
    }
    wx.setStorageSync(k, setValue);
  }
}



export default StorageManager.getInstance();
