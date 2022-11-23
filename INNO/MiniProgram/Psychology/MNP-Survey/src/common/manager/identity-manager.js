import {
    Apis
} from "../http/http.api.install.js";
import {
    Http
} from "../http/http.interceptor.js";
import StorageH from "../helper/storage-handler";
import LM from "./login-manager";
const STORAGE_IDENTITY_KEY = "IDENTITY_INFO";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const STORAGE_BSN_USER_INFOS_KEY = "BSN_USER_INFOS";
const STORAGE_TCR_USER_INFOS_KEY = "TCR_USER_INFOS";
const STORAGE_CHOOSE_USER_KEY = "CHOOSE_USER";
const STORAGE_TEACHER_INFOS_KEY = "TEACHER_INFOS";
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
    get authUserInfo() {
        return this._authUserInfo || StorageH.get(STORAGE_USER_INFOS_KEY);
    }
    get bsnUserInfo() {
        return this._bsnUserInfo || StorageH.get(STORAGE_BSN_USER_INFOS_KEY);
    }
    get tcrUserInfo() {
        return this._tcrUserInfo || StorageH.get(STORAGE_TCR_USER_INFOS_KEY);
    }

    checkBindTeacher() {
        return this.getTeacherUserInfo().then(res => {
            LM.savePrivateInfo({
                recordId: res.recordId
            });
            return this.getUserInfoByToken().then(() => {
                return res
            }).catch(err => {
                return Promise.reject()
            })
        }).catch(err => {
            return Promise.reject()
        })
    }

    getAuthUserInfo() {
        if (!LM.userToken) return Promise.reject();
        if (this._authUserHold) return this._authUserHold;
        this._authUserHold = Func._getAuthUserInfo.call(this).then((data) => {
            this.saveIdentityInfo({
                authUserInfo: data
            });
            return data;
        }).finally(() => {
            setTimeout(() => {
                this._authUserHold = null;
            }, 300);
        })
        return this._authUserHold;
    }
    // 为了解决user页面在获取用户信息的时候登录失效导致的Hold一直处于padding状态，新增加一个获取用户信息ByLogin接口
    getAuthUserInfoByLogin() {
        if (!LM.userToken) return Promise.reject();
        if (this._authUserHoldByLogin) return this._authUserHoldByLogin;
        this._authUserHoldByLogin = Func._getAuthUserInfo.call(this).then((data) => {
            this.saveIdentityInfo({
                authUserInfo: data
            });
            return data;
        }).finally(() => {
            setTimeout(() => {
                this._authUserHoldByLogin = null;
            }, 300);
        })
        return this._authUserHoldByLogin;
    }
    getTeacherUserInfo() {
        if (!LM.userToken) return Promise.reject();
        if (this._teacherUserHold) return this._teacherUserHold;
        this._teacherUserHold = Func._getTeacherUserInfo.call(this).then((data) => {
            if (data.recordId != 0) {
                this.saveIdentityInfo({
                    tcrUserInfo: data
                });
                return data;
            } else {
                return Promise.reject(data)
            }

        }).finally(() => {
            setTimeout(() => {
                this._teacherUserHold = null;
            }, 300);
        })
        return this._teacherUserHold;
    }
    getUserInfoByToken(isRead) {
        if (!LM.recordId) return Promise.reject();
        if (this._tokenUserHold) return this._tokenUserHold;
        if (isRead && this._bsnUserInfo.schoolId) {
            return Promise.resolve(this._bsnUserInfo);
        }
        this._tokenUserHold = Func._getUserInfoByToken.call(this).then((data) => {
            this.saveIdentityInfo({
                bsnUserInfo: data
            });
            console.log(data, "getUserInfoByToken")
            return data;
        }).finally(() => {
            setTimeout(() => {
                this._tokenUserHold = null;
            }, 300);
        })
        return this._tokenUserHold;
    }
    //保存全部的身份信息
    saveIdentityInfo(data) {
        if (!data) return
        this._identityInfo = {
            ...this._identityInfo,
            ...data
        }
        this.saveUserInfo(data.authUserInfo);
        this.saveBsnUserInfo(data.bsnUserInfo);
        this.saveTcrUserInfo(data.tcrUserInfo);
        StorageH.set(STORAGE_IDENTITY_KEY, this._identityInfo);
    }
    //保存用户信息
    saveUserInfo(authUserInfo) {
        if (authUserInfo) {
            this._authUserInfo = authUserInfo || {};
            StorageH.set(STORAGE_USER_INFOS_KEY, this._authUserInfo);
        }
    }
    //保存业务TOKEN用户信息
    saveBsnUserInfo(bsnUserInfo) {
        if (bsnUserInfo) {
            this._bsnUserInfo = bsnUserInfo || {};
            StorageH.set(STORAGE_BSN_USER_INFOS_KEY, this._bsnUserInfo);
        }
    }
    //保存业务TOKEN用户信息(老师)
    saveTcrUserInfo(tcrUserInfo) {
        if (tcrUserInfo) {
            this._tcrUserInfo = tcrUserInfo || {};
            StorageH.set(STORAGE_TCR_USER_INFOS_KEY, this._tcrUserInfo);
        }
    }
    removeUserInfo(type) {
        if (type == 'all' || type == 'tcrUserInfos') {
            delete this._tcrUserInfo;
            StorageH.remove(STORAGE_BSN_USER_INFOS_KEY);
        }
        if (type == 'all' || type == 'bsnUserInfo') {
            delete this._bsnUserInfo;
            StorageH.remove(STORAGE_TCR_USER_INFOS_KEY)
        }
    }
    initUserInfo() {
        this._isInit = 1
    }
}

//私有方法
const Func = {
    _initStorage() {
        this._identityInfo = StorageH.get(STORAGE_IDENTITY_KEY) || {};
        this._authUserInfo = StorageH.get(STORAGE_USER_INFOS_KEY) || {};
        this._bsnUserInfo = StorageH.get(STORAGE_BSN_USER_INFOS_KEY) || {};
        this._tcrUserInfo = StorageH.get(STORAGE_TCR_USER_INFOS_KEY) || {};
        this._isInit = 1;
    },
    // 授权用户信息
    _getAuthUserInfo() {
        return Http(Apis.getAuthUserInfo, {}).then(res => {
            if (res.code == "1") {
                let data = res.data || {};
                return data;
            }
            return Promise.resolve(res);
        }).catch((e) => {
            return Promise.reject(e);
        })
    },
    // 授权用户信息(老师)
    _getTeacherUserInfo() {
        return Http(Apis.checkBindTeacher, {}).then(res => {
            if (res.code == "1") {
                let data = res.data || {};
                return data;
            }
            return Promise.resolve(res);
        }).catch((e) => {
            return Promise.reject(e);
        })
    },
    // 业务用户信息
    _getUserInfoByToken() {
        console.log(this._isInit, "this._isInit")
        return Http(Apis.getUserInfoByToken, {
            header: {
                isInit: this._isInit
            }
        }).then(res => {
            if (res.code == "1") {
                if (this._isInit) this._isInit = 0
                let data = res.data || {};
                return data;
            }
            return Promise.resolve(res);
        }).catch((e) => {
            return Promise.reject(e);
        })
    },
    _checkBindTeacher() {
        return Http(Apis.checkBindTeacher, {}).then(res => {
            if (res.code == "1") {
                let data = res.data || {};
                console.log('datadata2', data)
                return data;
            }
            return Promise.resolve(res);
        }).catch((e) => {
            return Promise.reject(e);
        })
    },
}
export default IdentityManager.getInstance();