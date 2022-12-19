// import LocationM from "./location-manager.js";
import UniApi from "../support/tools/uni-api-promise.js"
import SMH from "./show-msg-handler.js"
// import WxApi from "./wx-api-helper"
// const renewLocLabel = 'scope.userLocation';

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
        if (h) {
            return h;
        }
        h = this._authorizeHold = this.checkAuthorizeHelp(scope, callBack, failback, failBackMod).then(res=>{
            console.log('checkAuthorizeHelp then',res);
            return res
        }).finally(()=>{
            delete this._authorizeHold;
        });
        return h;
    }

    modalCheckAuthorize(scope, modal, callBack, failback) {
        UniApi.showModal({
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
        return UniApi.getSetting().then(resGetSetting=>{
            let authSetting = resGetSetting.authSetting;
            if (authSetting[scope] == false) {
                return UniApi.openSetting().then(resOpenSetting=>{
                    let authSetting = resOpenSetting.authSetting;
                    if (authSetting[scope]) {
                        checkRenewAction.call(_this,scope,true);
                        typeof(callBack) == "function" && callBack(authSetting[scope]);
                    } else {
                          checkRenewAction.call(_this,scope,false);
                          typeof (failback) == "function" && failback(authSetting[scope]);
                    }
                }).catch(e=>{
                    console.log("catch",e);
										if(e.errMsg){
											SMH.showToast({
												title: e.errMsg
											})
										}
                    if (!failBackMod) {
                        checkRenewAction.call(_this, scope, false);
                        typeof(failback) == "function" && failback(e);
                        return Promise.resolve(e);
                    } else {
                        return openSettingMod.call(this, scope, callBack, failback);
                    }
                })
            } else {
                return UniApi.authorize({
                    scope
                }).then(resAuthorize=>{
                    console.log('authorize',resAuthorize)
                    checkRenewAction.call(_this, scope, true);
                    typeof(callBack) == "function" && callBack(authSetting[scope] || true);
                }).catch(e=>{
                    console.log("catch",e);
                    checkRenewAction.call(_this, scope, false);
                    typeof(failback) == "function" && failback(e);
                    return Promise.resolve(e);
                })
            }
        })
    }
}

function openSettingMod(scope, callBack, failback) {
    let _this = this;
    return UniApi.showModal({
        title: "前往设置",
        content: "请前往手机设置页允许小程序授权",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
    }).then(e=>{
        if (e.confirm) {
            return UniApi.openSetting().then(res=>{
                let authSetting = res.authSetting;
                if (authSetting[scope]) {
                    checkRenewAction.call(_this, scope, true);
                    typeof(callBack) == "function" && callBack(authSetting[scope]);
                } else {
                    checkRenewAction.call(_this, scope, false);
                    typeof(failback) == "function" && failback(false);
                }
            }).catch(e=>{
                checkRenewAction.call(_this, scope, false);
                typeof(failback) == "function" && failback(false);
                return Promise.resolve(e);
            })
        } else {
            // 取消hold
            checkRenewAction.call(_this, scope, false);
            typeof(failback) == "function" && failback(false);
        }
    })
}

function checkRenewAction(type,action = false){
    // if (type == renewLocLabel){
    //     LocationM.setStatusObj(2, action)
    // } 
}

export default authorizeSet.getInstance();