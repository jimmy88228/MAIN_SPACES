import LocationM from "../../helper/manager/location-manager.js";
const renewLocLabel = 'scope.userLocation';

class authorizeSet {
    static getInstance() {
        if (!authorizeSet.instance) {
            authorizeSet.instance = new authorizeSet();
        }
        return authorizeSet.instance;
    }
    constructor() {}
    checkAuthorize(scope, callBack, failback, failBackMod = false) {
        let _this = this;
        wx.getSetting({
            success: res => {
                let authSetting = res.authSetting;
                if (authSetting[scope] == false) {
                    wx.openSetting({
                        success: s => {
                            let authSetting = s.authSetting;
                            if (authSetting[scope]) {
                                checkRenewAction.call(_this,scope,true);
                                typeof(callBack) == "function" && callBack(authSetting[scope]);
                            } else {
                                  checkRenewAction.call(_this,scope,false);
                                  typeof (failback) == "function" && failback(authSetting[scope]);
                            }
                        },
                        fail: error => {
                            console.log("自动弹窗提示");
                            if (!failBackMod) {
                                checkRenewAction.call(_this, scope, false);
                                typeof(failback) == "function" && failback(error);
                            } else {
                                openSettingMod.call(this, scope, callBack, failback);
                            }
                        }
                    })
                } else {
                    wx.authorize({
                        scope: scope,
                        success: s => {
                            checkRenewAction.call(_this, scope, true);
                            typeof(callBack) == "function" && callBack(authSetting[scope] || true);
                        },
                        fail: error => {
                            console.log(error, "error");
                            checkRenewAction.call(_this, scope, false);
                            typeof(failback) == "function" && failback(error);
                        }
                    })
                }
            }
        })
    }

    modalCheckAuthorize(scope, modal, callBack, failback) {
        wx.showModal({
            title: modal.title || "前往设置",
            content: modal.content || "请前往手机设置页允许小程序授权",
            showCancel: modal.showCancel || true,
            cancelText: modal.cancelText || "取消",
            confirmText: modal.confirmText || "确定",
            success: e => {
                if (e.confirm) {
                    this.checkAuthorize(scope, callBack, failback)
                }
            }
        })
    }
}

function openSettingMod(scope, callBack, failback) {
    let _this = this;
    wx.showModal({
        title: "前往设置",
        content: "请前往手机设置页允许小程序授权",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
        success: e => {
            if (e.confirm) {
                wx.openSetting({
                    success: s => {
                        let authSetting = s.authSetting;
                        if (authSetting[scope]) {
                            checkRenewAction.call(_this, scope, true);
                            typeof(callBack) == "function" && callBack(authSetting[scope]);
                        } else {
                            checkRenewAction.call(_this, scope, false);
                            typeof(failback) == "function" && failback(false);
                        }
                    },
                    fail: f => {
                        checkRenewAction.call(_this, scope, false);
                        typeof(failback) == "function" && failback(false);
                    }
                })
            } else {
                checkRenewAction.call(_this, scope, false);
                typeof(failback) == "function" && failback(false);
            }
        }
    })
}

function checkRenewAction(type,action = false){
    if (type == renewLocLabel){
        LocationM.setStatusObj(2, action)
    } 
}

export default authorizeSet.getInstance();