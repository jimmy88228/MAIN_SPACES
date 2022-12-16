import { Apis } from "../http/http.api.install.js";
import { Http } from "../http/http.interceptor.js";
import StorageH from "../helper/storage-handler";
import LM from "./login-manager";
const STORAGE_IDENTITY_KEY = "IDENTITY_INFO";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const STORAGE_BSN_USER_INFOS_KEY = "BSN_USER_INFOS";
const STORAGE_CHOOSE_USER_KEY = "CHOOSE_USER";
//IdentityManager记录用户身份 (用户信息、分销信息、店员信息 和 对应信息的检测方法）
class IdentityManager {
    static getInstance() {
        if (!IdentityManager.instance) {
            IdentityManager.instance = new IdentityManager();
        }
        return IdentityManager.instance;
    }
    constructor() {
        Func._initStorage.call(this);
    }
    get userInfo() {
        return this._authUserInfo || StorageH.get(STORAGE_USER_INFOS_KEY) || {};
    }
    get authUserInfo() {
        return this._authUserInfo || StorageH.get(STORAGE_USER_INFOS_KEY) || {};
    }
    getAuthUserInfo() {
        if (!LM.userToken) return Promise.reject();
        if (this._authUserHold) return this._authUserHold;
        this._authUserHold = Func._getAuthUserInfo.call(this).then((data) => {
            this.saveIdentityInfo({ authUserInfo: data });
            return data;
        }).finally(() => {
            setTimeout(() => { this._authUserHold = null; }, 300);
        })
        return this._authUserHold;
    }
    
    // 为了解决user页面在获取用户信息的时候登录失效导致的Hold一直处于padding状态，新增加一个获取用户信息ByLogin接口
    getAuthUserInfoByLogin() {
        if (!LM.userToken) return Promise.reject();
        if (this._authUserHoldByLogin) return this._authUserHoldByLogin;
        this._authUserHoldByLogin = Func._getAuthUserInfo.call(this,'login').then((data) => {
            this.saveIdentityInfo({ authUserInfo: data });
            return data;
        }).finally(() => {
            setTimeout(() => { this._authUserHoldByLogin = null; }, 300);
        })
        return this._authUserHoldByLogin;
    }
    //保存全部的身份信息
    saveIdentityInfo(data) {
        if (!data) return
        this._identityInfo = {
            ...this._identityInfo,
            ...data
        }
        this.saveUserInfo(data.authUserInfo);
        StorageH.set(STORAGE_IDENTITY_KEY, this._identityInfo);
    }
    //保存用户信息
    saveUserInfo(authUserInfo) {
        if (authUserInfo) {
            this._authUserInfo = authUserInfo || {};
            StorageH.set(STORAGE_USER_INFOS_KEY, this._authUserInfo);
        }
    }
}

//私有方法
const Func = {
    _initStorage() {
        this._identityInfo = StorageH.get(STORAGE_IDENTITY_KEY) || {};
        this._authUserInfo = StorageH.get(STORAGE_USER_INFOS_KEY) || {};
    },
    // 授权用户信息
    _getAuthUserInfo(type) {
        return Http(Apis.getUserInfo, {}).then(res => {
            if (res.code == "1") {
                let data = res.data || {};
                data.userType = data.consultantOrCommonUser||"";
                return data;
            }
            return Promise.reject(res);
        }).catch((e) => {
            return Promise.reject(e);
        })
    },
}
export default IdentityManager.getInstance();