import SIH from "./sys-infos-helper";

export default {
    /*loading 框 */
    showLoading(obj, delay = 700) {
        this._recoverHideLoadingDelayer();
        this._setLoadingObj(obj);
        if (this.isLoadingShowed) {
            //已经显示时，直接更新显示内容
            this._recoverShowLoadingDelayer();
            this._showLoading();
        } else {
            //未显示时，重新计算延时
            this._createShowLoadingDelayer(delay);
        }
    },
    hideLoading() {
        this._createHideLoadingDelayer();
    },
    _createShowLoadingDelayer(delay) {
        delay || (delay = 0);
        var target = this.targetShowLoadingTime || 0;
        var newtarget = new Date().getTime() + delay;
        if (newtarget < target || !this.hasShowLoadingDelayer) {
            this.targetShowLoadingTime = newtarget;
            if (this.hasShowLoadingDelayer) {
                recoverDelayer(this.showLoadingDelayerId);
            }
            this.hasShowLoadingDelayer = true;
            this.showLoadingDelayerId = createDelayer(delay, () => {
                this.hasShowLoadingDelayer = false;
                delete this.showLoadingDelayerId;
                if (!this.isLoadingShowed) {
                    this._showLoading();
                }
            });
        }
    },
    _recoverShowLoadingDelayer() {
        if (this.hasShowLoadingDelayer) {
            this.hasShowLoadingDelayer = false;
            recoverDelayer(this.showLoadingDelayerId);
            delete this.showLoadingDelayerId;
        }
    },
    _createHideLoadingDelayer() {
        if (this.hasHideLoadingDelayer) {
            recoverDelayer(this.hideLoadingDelayerId);
        }
        this.hasHideLoadingDelayer = true;
        this.hideLoadingDelayerId = createDelayer(300, () => {
            this.hasHideLoadingDelayer = false;
            delete this.hideLoadingDelayerId;
            this._recoverShowLoadingDelayer();
            this._hideLoading();
        });
    },
    _recoverHideLoadingDelayer() {
        if (this.hasHideLoadingDelayer) {
            this.hasHideLoadingDelayer = false;
            recoverDelayer(this.hideLoadingDelayerId);
            delete this.hideLoadingDelayerId;
        }
    },
    _showLoading() {
        let obj = this.obj;
        this.isLoadingShowed = true;
        this.rightShowLoadingTime = new Date().getTime();
        wx.showLoading({
            title: "加载中...", ...obj || {}
        });
    },
    _hideLoading() {
        if (this.isLoadingShowed) {
            this.isLoadingShowed = false;
            wx.hideLoading();
        }
    },
    _setLoadingObj(obj) {
        this.obj = obj;
    },
    /*土司 */
    showToast(obj) {
        if (!obj) return;

        if (!obj.image && !obj.icon) {
            obj.icon = "none";
        }
        if (!obj.image && obj.icon === "none" && !this.isCanUseNoneIcon) {
            obj.image = "/static/images/common/err-tip-icon.png";
        }
        obj.duration || (obj.duration = 2000);
        let tobj = obj.title;
        if (tobj && !isString(tobj)) {
            if (tobj instanceof Error) {
                obj.title = tobj.toString();
            } else {
                obj.title = tobj.msg || tobj.title;
            }
        }
        if (!obj.title) return;

        this._recoverShowLoadingDelayer();
        this._recoverHideLoadingDelayer();
        this._hideLoading();
        wx.showToast(obj);
    },
    hideToast() {
        wx.hideToast();
    },
    getMsg(rs) {
        if (!rs) return;
        if (!rs.api) return;

        msg && Smm.showToast({
            title: msg
        })
    },
    get isCanUseNoneIcon() {
        if (typeof this.cuSOIN === "undefined") {
            this.cuSOIN = SIH.compareVersion("1.9.0") >= 0;
        }
        return this.cuSOIN;
    }
};
function createDelayer(delay, action) {
    return setTimeout(() => {
        action();
    }, delay);
}
function recoverDelayer(delayerId) {
    delayerId && clearTimeout(delayerId);
}
function isString(str) {
    return (typeof str == 'string');
} 