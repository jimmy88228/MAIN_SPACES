import Wxp from "../support/tools/wx-api-promise";
import Conf from "../../conf";
import { RegApi } from "./http-manager";
import StorH from "../helper/storageHandle";
import SMH from '../../common/helper/show-msg-helper'
// const VERSION = Conf.LOGIN_VERSION || "";
const STORAGE_USERTOKEN_KEY = "USER_TOKEN";
const STORAGE_USERID_KEY = "USER_ID";


const STORAGE_SESSION_ID_KEY = "SESSION_ID";
const STORAGE_USER_TOKEN_KEY = "USER_TOKEN";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const STORAGE_OPEN_ID_KEY = "O_ID";
const STORAGE_USER_KEY = "USER_KEY";
const STORAGE_SHARE_CODE_KEY = "SHARE_CODE";
function saveData(key, data) {
    // wx.setStorage({
    //     key, data: {
    //         version: VERSION,
    //         data: data
    //     }
    // });
    StorH.set(key,data);   
}

function readData(key) {
    // let storage = wx.getStorageSync(key);
    // if (storage && storage.version === VERSION) {
    //     return storage.data;
    // }
    return StorH.get(key);
}

function removeData(key) {
    // wx.removeStorageSync(key);
    StorH.remove(key);   
}

class LoginManager {
    constructor() {
        Func.readAllData.call(this);
    }
    // get sessionKey() {
    //     return this._sessionKey || "";
    // }

    // get isLogin() {
    //     return !!this._userToken;
    // }

    // get token() {
    //     return (this.isLogin && this._userToken) || "";
    // }

    // get userId() {
    //     return (this.isLogin && this._userId) || 0;
    // }

    // //注册
    // register(params) {
    //     return Func.wxRegister.call(this, params)
    //         .then(data => (this._loginErr && (delete this._loginErr), data));
    // }

    // //登录
    // login() {
    //     if (this.isLogin) {
    //         return Promise.resolve(this._userToken);
    //     } else if (this._loginErr) {
    //         return Promise.reject(this._loginErr);
    //     }
    //     return this.relogin();
    // }

    // //重新登录
    // relogin() {
    //     let h = this._rlh;
    //     if (h) return h;

    //     this._rlh = h = Func.wxLogin.call(this)
    //         .then(data => (this._loginErr && (delete this._loginErr), data))
    //         .catch(res => (res && res.code == -1 && (this._loginErr = res), Promise.reject(res)))
    //         .finally(() => this._rlh && delete this._rlh);

    //     return h;
    // }
    // reCreateWxSession() {
    //     let h = this._rcwsh;
    //     if (h) return h;

    //     Func.removeSessionKey.call(this);
    //     this._rcwsh = h = Func.createWxSession.call(this)
    //         .finally(() => this._rcwsh && delete this._rcwsh);

    //     return h;
    // }
    // getWxSession() {
    //     let h = this._gwsh;
    //     if (h) return h;

    //     this._gwsh = h = Func.getWxSession.call(this)
    //         .finally(() => this._gwsh && delete this._gwsh);

    //     return h;
    // }
    // logout() {
    //     Func.removeUserToken.call(this);
    //     Func.removeUserId.call(this);
    // }  
    login(){
        return this.loginAsync();
    }
    //云店登录  
    //登录
    loginAsync(showLoading) {
        console.log('进来 loginAsync',this.isLogin,this.userToken)
        if(this.isLogin){
            return Promise.resolve(this.userToken)
        }
        if(this._loginAsyncHold){
            return this._loginAsyncHold;
        }
        this._loginAsyncHold = this.getWxSessionIdAsync(showLoading).then(sessionId=>{
            return userLogin.call(this,sessionId,showLoading).then(e=>{
                let data = e.data || {};
                this.saveLoginData({ ...data, register: false });
                if(!data.userKey) return Promise.reject();
                return getUserExtraInfos.call(this, data.userKey);
            }).finally(()=>{
                //500毫秒后释放；
                setTimeout(()=>{
                this._loginAsyncHold && delete this._loginAsyncHold;
                },500)
            })
        }) 
        return this._loginAsyncHold;
    }
    //注册
    registerAsync(showLoading, noAuthHandlerF) {
        console.log('进来 registerAsync',this.isLogin,this.userToken)
        return this.isLogin ? Promise.resolve(this.userToken) : this.getWxSessionIdAsync(showLoading)
        .then(sessionId => {
            return getUserInfos.call(this, true, noAuthHandlerF).then(e => {
                return { ...e, sessionId: sessionId };
            });
        }).then(e => {
            return e;
            // let fromUser = PH.paramsJson("fromUser") || "";
            // console.log(fromUser,"注册前fromUser数据")
            // let codeType = PH.paramsJson("codeType") || "";
            // if (fromUser && codeType != "myStoreCode"){//不是扫店员二维码
            //     return { ...e, fromUser}
            // }else{
            //     return e;
            // }
        }).then( e=>{
            return userRegister.call(this, showLoading, e.sessionId, e.encryptedData, e.iv, e.fromUser)
        }).then(userData => {
            return getUserExtraInfos.call(this, userData.userKey).then( userInfo =>{
                this.saveLoginData({
                    ...userData,
                    userInfo: userInfo,
                    register: true
                })
                return userData.userKey;
            })
        });
    }
    //创建sessionId
    createWxSessionId(showLoading) {
        console.log('进来 createWxSessionId',)
        return Wxp.login().then(e => {
            this.removeSessionId();
            return createSession.call(this, showLoading, e.code);
        }).then(sessionId => {
            this.saveSessionId(sessionId);
            return sessionId;
        }).catch(error=>{
            console.log(error)
            SMH.showToast({
            title:"授权失败，请重试"
            })
            return Promise.reject();
        });
    }
    //读取sessionId
    getWxSessionIdAsync(showLoading) {
        console.log('进来 读取sessionId',this.sessionId)
        return this.sessionId ? checkSession.call(this, showLoading, this.sessionId).then(e => {
        return this.sessionId;
        }).catch(() => {
        this.removeSessionId();
        return this.createWxSessionId(showLoading);
        }) : this.createWxSessionId(showLoading);
    }
    //读取token
    getUserTokenAsync(showLoading, noAuthHandlerF) {
        console.log('进来 getUserTokenAsync',this.userToken)
        return this.userToken
        ? Promise.resolve({ userToken: this.userToken, cache: true })
        : this.registerAsync(showLoading, noAuthHandlerF).then(userToken => {
            return { userToken: userToken, cache: false };
        });
    } 
    //读取个人信息
    getUserSimpleInfo(userToken){
        console.log('进来 getUserSimpleInfo',userToken)
        return getUserExtraInfos.call(this, userToken);
    }

    get isLogin() {
        return !!this._userToken;
        // return !!this._userToken && !!(this._userInfos && this._userInfos.uId) && !!this._openId;
    }
    get isCheckLogin(){
        return this._isCheckLogin || false;
    }
    get userInfo(){
        return this._userInfos;
    }
    get userToken() {
        return this._userToken || "";
    }
    get userKey() {
        return this._userKey || "";
    }
    get sessionId() {
        return this._sessionId || "";
    }
    get openId(){
        return this._openId || "";//获取到接口返回的openId，实际是cookieId
    }
    get userCode(){
        return this._userInfos.userCode || ""
    }
    get shareCode(){
        return this._shareCode || ""
    }
    get storeInfo(){
        return this._storeInfo ||"";
    }
    get staffInfo(){
        return this._staffInfo || "";
    } 
    
  /*保存数据*/
  saveSessionId(sessionId) {
    if(this._sessionId == sessionId) return;
    this._sessionId = sessionId || "";
    saveData(STORAGE_SESSION_ID_KEY, this._sessionId);
  }
  saveOpenId(openId){
    if(this._openId == openId) return;
    this._openId = openId || "";
    saveData(STORAGE_OPEN_ID_KEY, this._openId);
  }
  saveUserKey(userKey){
    if(this._userKey == userKey) return;
    this._userKey = userKey || "";
    saveData(STORAGE_USER_KEY, this._userKey);
  }
  saveShareCode(shareCode){
    if(this._shareCode == shareCode) return;
    this._shareCode = shareCode || "";
    saveData(STORAGE_SHARE_CODE_KEY, this._shareCode);
  }
  saveUserToken(userToken){
    this._userToken = userToken || "";
    saveData(STORAGE_USER_TOKEN_KEY, this._userToken);
  }
  saveUserInfo(userInfos){
    if (!userInfos) return;
    this._userInfos = userInfos || {};
    saveData(STORAGE_USER_INFOS_KEY, this._userInfos);
  }
  saveLoginData(data) {
    console.log('进来 saveLoginData',data)
    if(data.cookieId) {
      this.saveOpenId(data.cookieId);
    }
    if(data.sessionId){
      this.saveSessionId(data.sessionId);
    }
    if(data.userToken) {
      this.saveUserToken(data.userToken);
    }
    if(data.userKey) {
      this.saveUserKey(data.userKey);
    }
    if(data.shareCode) {
      this.saveShareCode(data.shareCode);
    }
    if(data.userInfo){
      this.saveUserInfo(data.userInfo);
    }
    //处理分销
    // if (this._needBindStaffInfo){
    //   this.buildDstbRelation(this._needBindStaffInfo);
    // }
  }
  logout() {//注销
    console.log('进来 logout',)
    this.removeLoginData();
    this.removeSessionId();
  }
  pastLogout() {//过期注销
    console.log('进来 pastLogout',)
    this.removeLoginData();
  } 
  removeLoginData() {
    console.log('进来 removeLoginData',)
    removeData(STORAGE_OPEN_ID_KEY);
    delete this._openId;
    removeData(STORAGE_USER_TOKEN_KEY);
    delete this._userToken;
    removeData(STORAGE_USER_INFOS_KEY);
    delete this._userInfos;
    removeData(STORAGE_USER_KEY);
    delete this._userKey;
    removeData(STORAGE_SHARE_CODE_KEY);
    delete this._shareCode;
    delete this._loginAsyncHold; 
  } 
  removeSessionId() {
    console.log('进来 removeSessionId',)
    if (!this._sessionId) return;
    removeData(STORAGE_SESSION_ID_KEY);
    delete this._sessionId;
  }
}

  //注册请求
  function userRegister(showLoading, sessionId, encryptedData, iv, shareCode) {
    console.log('进来 userRegister',...arguments)
    // let channel = LgMg.channel || {};
    let paramsJson = PH.paramsJson() || {};
    let storeId = paramsJson.store_id || 0;
    if (paramsJson.staff_id && paramsJson.store_id){
      storeId = 0;
    }
    return RegApi.userRegister({
      data: {
        sessionId: sessionId,
        encryptedData: encryptedData, 
        iv: iv,
        shareCode: shareCode || "",
        storeId: storeId,
        staffId: paramsJson.staff_id || 0
      },
      extraData: {
        isShowLoad: showLoading
      }
    }).then(e => {
      if (e.code == "1") {
        updateClientSession.call(this, e.data);
        return e.data;
      }
      SMH.showToast({ title: e.msg })
      return Promise.reject(e.msg);
    })
  }
  //登录请求
  function userLogin(id,showLoading) {
    console.log('进来 userLogin',id)
      return RegApi.userLogin({
        data: {
          sessionId: id || ""
        },
        extraData: {
          isShowLoad: showLoading
        }
      })
      .then(e => {
        e.data = e.data || {};
        return e;
      }).catch(error => {
        console.log('进来 Login catch',this.isLogin,error);
        this.removeLoginData();
        return Promise.reject(error);
      }).finally(()=>{
        this._isCheckLogin = true;
      });
  }
  
  //获取用户信息
  function getUserExtraInfos(userKey, isShowLoad = true) {
    console.log('进来 getUserExtraInfos',userKey)
    if (!userKey) return Promise.reject({});
    return UserApi.getUserSimpleInfo({
      params: {
        userToken: userKey,
        brandCode: Conf.BRAND_CODE,
      },
      extraData: {
        isShowLoad: isShowLoad
      }
    }).then(e => {
      if (e.code == "1") {
        let data  = e.data||{};
        this.saveUserInfo(data);
        return e.data;
      }
      return Promise.reject(e.msg);
    })
  }
  //创建session
  function createSession(showLoading, code) {
    console.log('进来 createSession',code)
    return RegApi.createSession({
      data: {
        // brandCode: Conf.BRAND_CODE,
        code: code
      },
      extraData: {
        isShowLoad: showLoading
      }
    }).then(e => {
      if (e.code == "1") {
        return e.data;
      }
      return Promise.reject(e.msg);
    });
  }
  //检查session
  function checkSession(showLoading, sessionId) {
    console.log('进来 checkSession',sessionId)
    return Wxp.checkSession().then(()=>{
      return RegApi.checkSession({
        params: {
          sessionId: sessionId
        },
        extraData: {
          isShowLoad: showLoading
        }
      }).then(e => {
        if (e.code == "1") {
          return Promise.resolve(e);
        }
        return Promise.reject(e);
      });
    }).catch(e=>{
      console.log('进来 checkSession catch',e)
      return Promise.reject();
    });
  }
  
  //获取微信授权用户基本信息
  function getUserInfos(withCredentials = false, noAuthHandlerF) {
    console.log('进来 getUserInfos',)
    return Wxp.getSetting()
      .then(e => {
        if (true || e.authSetting["scope.userInfo"]) { //待完善getUserProfile接口
            return Wxp.getUserInfo({
              withCredentials: withCredentials,
              lang: 'zh_CN'
            });
        }else{
            return noAuthHandlerF ? noAuthHandlerF() : Promise.reject("授权失效");
        }
      })
      .then(e => {
        if (e.userInfo) {
          return e;
        } else {
          return Promise.reject("授权失败");
        }
      });
  }

//私有函数
const Func = {
//     //创建微信登录凭证
//     createWxSession() {
//         return Wxp.login()
//             .then(wxLoginData => createSessionKey(Conf.BRAND_CODE, wxLoginData.code))
//             .then(sessionKey => (Func.svaeSessionKey.call(this, sessionKey), sessionKey));
//     },
//     //获取微信登录凭证
//     getWxSession() {
//         let sessionKey = this._sessionKey;
//         return new Promise((rs, rj) => sessionKey ? rs(sessionKey) : rj())//sessionKey是否存在
//             .then(sessionKey => {
//                 //sessionKey存在，验证sessionKey是否有效
//                 return Wxp.checkSession()
//                     .then(() => ({ sessionKey, isNew: false }));
//             })
//             .catch(() => {
//                 //sessionKey不存在 或 已失效需要重新生成
//                 Func.removeSessionKey.call(this);
//                 return Func.createWxSession.call(this)
//                     .then(sessionKey => ({ sessionKey, isNew: true }));
//             });
//     },
//     //使用微信登录凭证登录
//     wxLogin() {
//         return Func.getWxSession
//             .call(this) //获取微信登录凭证
//             .then(({ sessionKey }) => login(Conf.BRAND_CODE, sessionKey))
//             .then(data => (Func.svaeLoginData.call(this, data), this._userToken));
//     },
//     //使用微信登录凭证注册
//     wxRegister(params) {
//         return Func.getWxSession
//             .call(this) //获取微信登录凭证
//             .then(({ sessionKey, isNew }) => {
//                 if (!isNew && params)
//                     return { sessionKey, params };

//                 //重新获取微信授权信息
//                 return Wxp.getUserInfo({ withCredentials: true, lang: "zh_CN" })
//                     .then(params => ({ sessionKey, params }));

//             }).then(({ sessionKey, params }) => {
//                 let { encryptedData, iv } = params;
//                 return register(Conf.BRAND_CODE, sessionKey, encryptedData, iv)
//                     .then(data => (Func.svaeLoginData.call(this, data), this._userToken));
//             });
//     },
    
    readAllData() {
        // let userToken = readData(STORAGE_USERTOKEN_KEY);
        // userToken && (this._userToken = userToken);

        // let userId = readData(STORAGE_USERID_KEY);
        // userId && (this._userId = userId);
 
        let sId = readData(STORAGE_SESSION_ID_KEY) || "";
        if (sId) {
            this._sessionId = sId;
        }
        let us = readData(STORAGE_USER_TOKEN_KEY) || "";
        if (us) {
            this._userToken = us;
        }
        let ui = readData(STORAGE_USER_INFOS_KEY) || {};
        if(ui){
            this._userInfos = ui;
        }
        let opI = readData(STORAGE_OPEN_ID_KEY) || "";
        if(opI){
            this._openId = opI;
        }
        let uKey = readData(STORAGE_USER_KEY) || "";
        if(uKey){
            this._userKey = uKey;
        }
        let sCode = readData(STORAGE_SHARE_CODE_KEY) || "";
        if(sCode){
            this._shareCode = sCode;
        }
        this._isCheckLogin = false;
    },
//     svaeSessionKey(sessionKey) {
//         sessionKey && (this._sessionKey = sessionKey);
//     },
//     svaeLoginData(data) {
//         if (!data) return;
//         let { userToken, userId } = data;
//         userToken && (this._userToken = userToken, saveData(STORAGE_USERTOKEN_KEY, userToken));
//         userId && (this._userId = userId, saveData(STORAGE_USERID_KEY, userId));
//     },
//     removeSessionKey() {
//         delete this._sessionKey;
//     },
//     removeUserToken() {
//         delete this._userToken;
//         removeData(STORAGE_USERTOKEN_KEY);
//     },
//     removeUserId() {
//         delete this._userId;
//         removeData(STORAGE_USERID_KEY);
//     }
};

 
const instance = new LoginManager();

export default instance;
