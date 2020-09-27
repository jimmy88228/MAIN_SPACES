import Utils from "../support/utils/utils";
import LM from "../helper/manager/login-manager"
import StorageH from "../helper/handle/storageHandle";
export default {
    get cookieId() {
        this._cookieId = LM.openId || StorageH.get("O_ID");
        if (this._cookieId) {
            if(typeof(this._cookieId) != "string"){
              this._cookieId = Utils.uuid16ByTime(32);
            }
            StorageH.set("COOKIE_ID", this._cookieId);
            return this._cookieId;
        }
        this._cookieId = Utils.uuid16ByTime(32);
        StorageH.set("COOKIE_ID", this._cookieId);
        return this._cookieId;
    },
    get systemInfo() {
        if (!this.systemInfoArr) {
            this.systemInfoArr = wx.getSystemInfoSync();
        }
        return this.systemInfoArr;
    },
    get os() {
        return this.systemInfo.system;
    },
    get osType() {
        this.systemInfo.system.split(" ");
        return systemInfoArr[0];
    },
    get osVersion() {
        this.systemInfo.system.split(" ");
        return systemInfoArr.length > 1 ? systemInfoArr[1] : "";
    },
    get model() {
        return this.systemInfo.model;
    },
    get sdkVersion() {
        return this.systemInfo.SDKVersion;
    },
    get appVersion() {
        return this.systemInfo.version;
    },
    get pixelRatio() {
        return this.systemInfo.pixelRatio;
    },
    get isIphoneX() {
      let isIphoneX;
      if (this.model.search("iPhone X") != -1 || this.model.search("iPhone 11") != -1) {
        isIphoneX = true
      } else {
        isIphoneX = false
      }
      return isIphoneX
        // return this.model.search("iPhone X") != -1 ? true : false;
    },
    get screenWidth() {
        return this.systemInfo.screenWidth;
    },
    get screenHeight() {
      return this.systemInfo.screenHeight;
    },
    get windowWidth() {
        return this.systemInfo.windowWidth;
    },
    get windowHeight() {
      return this.systemInfo.windowHeight;
    },
    get isIos(){
      return this.model.search("iPhone") != -1 ? true : false;
    },
    compareVersion(v1, v2) {
        v2 || (v2 = this.sdkVersion);
        return Utils.compareVersion(v1, v2);
    },
    get getMenuObject(){
      let menuObject = wx.getMenuButtonBoundingClientRect();  
      return menuObject || {}
    },
    getConvert(value,targetType){
      targetType = targetType.toLocaleUpperCase();
      let windowWidth = this.windowWidth;
      if(targetType == "PX"){
        return ( value * windowWidth ) / 750
      }else if(targetType == "RPX"){
        return ( value * 750 ) / windowWidth
      }
    }
}