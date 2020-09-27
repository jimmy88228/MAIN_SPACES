import LM from "./login-manager.js";
import StorageH from "../handle/storageHandle";
let cookieId;
let sysType;
let isIphoneX;

class SysInfosManager {
    static getInstance() {
        SysInfosManager.instance = SysInfosManager.instance ? SysInfosManager.instance : new SysInfosManager();
        return SysInfosManager.instance;
    }

    get cookieId() {
        // if (!cookieId) {
        cookieId = StorageH.get("O_ID") || LM.openId;
        if (!cookieId) {
            cookieId = new Date().getTime();
            StorageH.set("COOKIE_ID", cookieId);
        }
        // }
        return cookieId;
    }

    get sysType() {
        if (!sysType) {
            let systemInfoArr = wx.getSystemInfoSync().system.split(" ");
            sysType = systemInfoArr[0].toUpperCase();
        }

        return sysType;
    }

    get isIphoneX() {
        if (typeof isIphoneX == "undefined") {
          if (wx.getSystemInfoSync().model.search("iPhone X") != -1 || wx.getSystemInfoSync().model.search("iPhone 11") != -1){
            isIphoneX = true
          }else{
            isIphoneX = false 
          }
        }
        return isIphoneX;
    }
    compareVersion(v1, v2) {
        v2 = v2 || wx.getSystemInfoSync().SDKVersion;
        v1 = v1.split(".");
        v2 = v2.split(".");
        var len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
            v1.push("0");
        }
        while (v2.length < len) {
            v2.push("0");
        }

        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);

            if (num1 > num2) {
                return -1;
            } else if (num1 < num2) {
                return 1;
            }
        }

        return 0;
    }
}

export default SysInfosManager.getInstance();