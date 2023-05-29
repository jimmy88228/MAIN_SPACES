class StorageHandler {
  static getInstance() {
    if (!StorageHandler.instance) {
      StorageHandler.instance = new StorageHandler()
    }
    return StorageHandler.instance
  }

  constructor() {

  }
  set(k, v, t) {
    let time = parseInt(t) || 60; //单位:分钟 //默认60分钟
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + (time * 60);
    let setValue = {
      deadtime: timestamp,
      value: v
    }
    wx.setStorageSync(k, setValue);
  }
  get(k) {
    let getValue = wx.getStorageSync(k) || "";
    if ((parseInt(getValue.deadtime) < (Date.parse(new Date()) / 1000)) || !getValue.deadtime) return ""
    let value = getValue.value;
    return value || ""
  }
  hasKey(k) {
    let getValue = wx.getStorageSync(k) || {};
    return !!getValue.deadtime
  }
  remove(k) {
    wx.removeStorageSync(k);
  }
  clear() {
    wx.clearStorageSync();
  }
}

export default StorageHandler.getInstance();