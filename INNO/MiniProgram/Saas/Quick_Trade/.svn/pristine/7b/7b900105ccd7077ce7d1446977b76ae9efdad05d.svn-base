import WxApi from "../../utils/wxapi/index.js";

class authorizeSet {
    static getInstance() {
        if (!authorizeSet.instance) {
            authorizeSet.instance = new authorizeSet();
        }
        return authorizeSet.instance;
    }
    constructor() {}
    checkAuthorize(scope, callBack, failback, failBackMod = false) {
        let h =  this._authorizeHold;
        console.log('进来checkAuthorize1',h)
        if (h) {
            return h;
        }
        console.log('进来checkAuthorize2')
        h = this._authorizeHold = this.checkAuthorizeHelp(scope, callBack, failback, failBackMod).then(res=>{
            console.log('checkAuthorizeHelp then',res);
            return res
        }).finally(()=>{
            delete this._authorizeHold;
        });
        return h;
    }

    modalCheckAuthorize(scope, modal, callBack, failback) {
        WxApi.showModal({
            title: modal.title || "前往设置",
            content: modal.content || "请前往手机设置页允许小程序授权",
            showCancel: modal.showCancel || true,
            cancelText: modal.cancelText || "取消",
            confirmText: modal.confirmText || "确定",
        }).then(e=>{
            if (e.confirm) {
                this.checkAuthorize(scope, callBack, failback)
            }
        })
    }

    checkAuthorizeHelp(scope, callBack, failback, failBackMod){
        let _this = this;
        return WxApi.getSetting().then(resGetSetting=>{
            let authSetting = resGetSetting.authSetting;
            if (authSetting[scope] == false) {
                return WxApi.openSetting().then(resOpenSetting=>{
                    let authSetting = resOpenSetting.authSetting;
                    console.log("checkAuthorize")
                    if (authSetting[scope]) {
                        typeof(callBack) == "function" && callBack(authSetting[scope]);
                    } else {
                          typeof (failback) == "function" && failback(authSetting[scope]);
                    }
                }).catch(e=>{
                    console.log("catch",e);
                    if (!failBackMod) {
                        typeof(failback) == "function" && failback(e);
                        return Promise.resolve(e);
                    } else {
                        return openSettingMod.call(this, scope, callBack, failback);
                    }
                })
            } else {
                return WxApi.authorize({
                    scope
                }).then(resAuthorize=>{
                    console.log('authorize',resAuthorize)
                    typeof(callBack) == "function" && callBack(authSetting[scope] || true);
                }).catch(e=>{
                    console.log("catch",e);
                    typeof(failback) == "function" && failback(e);
                    return Promise.resolve(e);
                })
            }
        })
    }
}

function openSettingMod(scope, callBack, failback) {
    let _this = this;
    return WxApi.showModal({
        title: "前往设置",
        content: "请前往手机设置页允许小程序授权",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
    }).then(e=>{
        if (e.confirm) {
            return WxApi.openSetting().then(res=>{
                let authSetting = res.authSetting;
                if (authSetting[scope]) {
                    typeof(callBack) == "function" && callBack(authSetting[scope]);
                } else {
                    typeof(failback) == "function" && failback(false);
                }
            }).catch(e=>{
                typeof(failback) == "function" && failback(false);
                return Promise.resolve(e);
            })
        } else {
            // 取消hold
            typeof(failback) == "function" && failback(false);
        }
    })
}

export default authorizeSet.getInstance();