import Wxp from "../support/tools/wx-api-promise";
import Conf from "../../conf";
import { LoginApi } from "./http-manager";

const VERSION = Conf.LOGIN_VERSION || "";
const STORAGE_USERTOKEN_KEY = "USER_TOKEN";
const STORAGE_USERID_KEY = "USER_ID";

function saveData(key, data) {
    wx.setStorage({
        key, data: {
            version: VERSION,
            data: data
        }
    });
}

function readData(key) {
    let storage = wx.getStorageSync(key);
    if (storage && storage.version === VERSION) {
        return storage.data;
    }
}

function removeData(key) {
    wx.removeStorageSync(key);
}

class LoginManager {
    constructor() {
        Func.readAllData.call(this);
    }
    get sessionKey() {
        return this._sessionKey || null;
    }

    get isLogin() {
        return !!this._userToken;
    }

    get token() {
        return (this.isLogin && this._userToken) || null;
    }

    get userId() {
        return (this.isLogin && this._userId) || 0;
    }

    //注册
    register(params) {
        return Func.wxRegister.call(this, params)
            .then(data => (this._loginErr && (delete this._loginErr), data));
    }

    //登录
    login() {
        if (this.isLogin) {
            return Promise.resolve(this._userToken);
        } else if (this._loginErr) {
            return Promise.reject(this._loginErr);
        }
        return this.relogin();
    }

    //重新登录
    relogin() {
        let h = this._rlh;
        if (h) return h;

        this._rlh = h = Func.wxLogin.call(this)
            .then(data => (this._loginErr && (delete this._loginErr), data))
            .catch(res => (res && res.code == -1 && (this._loginErr = res), Promise.reject(res)))
            .finally(() => this._rlh && delete this._rlh);

        return h;
    }
    reCreateWxSession() {
        let h = this._rcwsh;
        if (h) return h;

        Func.removeSessionKey.call(this);
        this._rcwsh = h = Func.createWxSession.call(this)
            .finally(() => this._rcwsh && delete this._rcwsh);

        return h;
    }
    getWxSession() {
        let h = this._gwsh;
        if (h) return h;

        this._gwsh = h = Func.getWxSession.call(this)
            .finally(() => this._gwsh && delete this._gwsh);

        return h;
    }
    logout() {
        Func.removeUserToken.call(this);
        Func.removeUserId.call(this);
    }
}

//私有函数
const Func = {
    //创建微信登录凭证
    createWxSession() {
        return Wxp.login()
            .then(wxLoginData => createSessionKey(Conf.BRAND_CODE, wxLoginData.code))
            .then(sessionKey => (Func.svaeSessionKey.call(this, sessionKey), sessionKey));
    },
    //获取微信登录凭证
    getWxSession() {
        let sessionKey = this._sessionKey;
        return new Promise((rs, rj) => sessionKey ? rs(sessionKey) : rj())//sessionKey是否存在
            .then(sessionKey => {
                //sessionKey存在，验证sessionKey是否有效
                return Wxp.checkSession()
                    .then(() => ({ sessionKey, isNew: false }));
            })
            .catch(() => {
                //sessionKey不存在 或 已失效需要重新生成
                Func.removeSessionKey.call(this);
                return Func.createWxSession.call(this)
                    .then(sessionKey => ({ sessionKey, isNew: true }));
            });
    },
    //使用微信登录凭证登录
    wxLogin() {
        return Func.getWxSession
            .call(this) //获取微信登录凭证
            .then(({ sessionKey }) => login(Conf.BRAND_CODE, sessionKey))
            .then(data => (Func.svaeLoginData.call(this, data), this._userToken));
    },
    //使用微信登录凭证注册
    wxRegister(params) {
        return Func.getWxSession
            .call(this) //获取微信登录凭证
            .then(({ sessionKey, isNew }) => {
                if (!isNew && params)
                    return { sessionKey, params };

                //重新获取微信授权信息
                return Wxp.getUserInfo({ withCredentials: true, lang: "zh_CN" })
                    .then(params => ({ sessionKey, params }));

            }).then(({ sessionKey, params }) => {
                let { encryptedData, iv } = params;
                return register(Conf.BRAND_CODE, sessionKey, encryptedData, iv)
                    .then(data => (Func.svaeLoginData.call(this, data), this._userToken));
            });
    },
    readAllData() {
        let userToken = readData(STORAGE_USERTOKEN_KEY);
        userToken && (this._userToken = userToken);

        let userId = readData(STORAGE_USERID_KEY);
        userId && (this._userId = userId);
    },
    svaeSessionKey(sessionKey) {
        sessionKey && (this._sessionKey = sessionKey);
    },
    svaeLoginData(data) {
        if (!data) return;
        let { userToken, userId } = data;
        userToken && (this._userToken = userToken, saveData(STORAGE_USERTOKEN_KEY, userToken));
        userId && (this._userId = userId, saveData(STORAGE_USERID_KEY, userId));
    },
    removeSessionKey() {
        delete this._sessionKey;
    },
    removeUserToken() {
        delete this._userToken;
        removeData(STORAGE_USERTOKEN_KEY);
    },
    removeUserId() {
        delete this._userId;
        removeData(STORAGE_USERID_KEY);
    }
};


function createSessionKey(brandCode, code) {
    return LoginApi.createSessionKey({
        data: {
            brandCode: brandCode,
            code: code
        },
        extraData: { noReSessionKey: true }
    }).netData();
}
function login(brandCode, sessionKey) {
    return LoginApi.login({
        data: {
            brandCode: brandCode,
            sessionKey: sessionKey
        },
        extraData: { noReLogin: true }
    }).netData();
}
function register(brandCode, sessionKey, encryptedData, iv) {
    return LoginApi.register({
        data: {
            brandCode: brandCode,
            sessionKey: sessionKey,
            encryptedData: encryptedData,
            iv: iv
        }
    }).netData();
}

const instance = new LoginManager();

export default instance;
