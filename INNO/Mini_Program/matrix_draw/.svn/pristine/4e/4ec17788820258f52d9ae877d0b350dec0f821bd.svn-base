import Util from "../utils/util";
export default {
    get cookieId() {
        if (this._cookieId) return this._cookieId;
        this._cookieId = wx.getStorageSync("COOKIE_ID");
        if (this._cookieId) return this._cookieId;
        this._cookieId = Util.uuid16ByTime(32);
        wx.setStorage({ key: "COOKIE_ID", data: this._cookieId });
        return this._cookieId;
    },
    get systemInfo() {
        if (!this._systemInfo)
            this._systemInfo = wx.getSystemInfoSync();
        return this._systemInfo || {};
    },
    get os() {
        return this.systemInfo.system || "";
    },
    get osType() {
        let arr = this.os.split(" ");
        return arr[0];
    },
    get osVersion() {
        let arr = this.os.split(" ");
        return arr.length > 1 ? arr[1] : "";
    },
    get model() {
        return this.systemInfo.model;
    },
    get isIphoneX() {
        if (typeof this._isIphoneX == "undefined" && this.model)
            this._isIphoneX = this.model.toLowerCase().search("iphone x") >= 0 ? true : false;
        return !!this._isIphoneX;
    },
    get sdkVersion() {
        return this.systemInfo.SDKVersion || "";
    },
    get appVersion() {
        return this.systemInfo.version || "";
    },
    get screenWidth() {
        return this.systemInfo.screenWidth || 0;
    },
    get screenHeight() {
        return this.systemInfo.screenHeight || 0;
    },
    get pixelRatio() {
        return this.systemInfo.pixelRatio || 1;
    },
    get ratio() {
        return this.systemInfo.screenWidth / 750;
    },
    toPx(value) {
        value = parseFloat(value);
        if (isNaN(value)) return undefined;
        return value * this.ratio;
    },
    toRpx(value) {
        if (this.ratio <= 0) return 0;
        value = parseFloat(value);
        if (isNaN(value)) return undefined;
        return value / this.ratio;
    },
    get windowWidth() {
        return this.systemInfo.windowWidth || 0;
    },
    get windowHeight() {
        return this.systemInfo.windowHeight || 0;
    },
    get statusBarHeight() {
        return this.systemInfo.statusBarHeight || 0;
    },
    get menuRect() {
        if (!this._menuRect) {
            this._menuRect = wx.getMenuButtonBoundingClientRect();
        }
        return this._menuRect || {}
    },
    get titleBarHeight() {
        let statusBarHeight = this.statusBarHeight;
        let menuTop = (this.menuRect.top || 0) - statusBarHeight;
        let menuHeight = this.menuRect.height || 0;
        return menuHeight + menuTop * 2;
    },
    get navigationBarHeight() {
        let statusBarHeight = this.statusBarHeight;
        let menuTop = (this.menuRect.top || 0) - statusBarHeight;
        let menuHeight = this.menuRect.height || 0;
        return statusBarHeight + menuHeight + menuTop * 2;
    },
    compareVersion(v1, v2) {
        v2 = v2 || this.sdkVersion;
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


