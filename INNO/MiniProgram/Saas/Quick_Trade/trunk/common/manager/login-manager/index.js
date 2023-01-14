import WxApi from "../../utils/wxapi/index";
import {QT_RegApi, QT_UserApi, QT_DstbApi,DstbApi, QT_VsLogApi} from "../http-manager/index";
import {UserApi} from "../http-manager/index";
// import LgMg from "../log-manager/index";
import PH from "../../helper/params-handler/index"
import Conf from "../../../config/index";
// import SIH from "../../helper/system-info-helper/index"
import StorageH from "../../helper/storage-handler/index";
import SMH from "../../helper/show-message-helper/index";
import CDateH from "../../helper/cache-date-handler/index"
import StoreH from "../../helper/store-helper/index";
import EB from "../../support/event-bus/index";
const STORAGE_SESSION_ID_KEY = "SESSION_ID";
const STORAGE_USER_TOKEN_KEY = "USER_TOKEN";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const STORAGE_OPEN_ID_KEY = "O_ID";
const STORAGE_SHARE_CODE_KEY = "SHARE_CODE";
const STORAGE_USER_KEY = "USER_KEY";
const STAFF_INFO_KEY = "STAFF_INFO";
const STORE_STAFF_INFO_KEY = "STORE_STAFF_INFO";

//注册请求
function userRegister(showLoading, iData = {}) {
  iData = iData || {};
  console.log('进来 userRegister', iData)
  let storeInfo = StoreH.storeInfo || {};
  let storeId = storeInfo.storeId || 0;
  let staffId = storeInfo.staffId || 0;
  let userInfo = iData.userInfo || {};
  let url = this.isCanUrPf ? 'registerByUserProfile' : 'userRegister';
  let data = {
    // iv: iData && iData.iv || "",
    // encryptedData: iData && iData.encryptedData || "",
    profileIv: iData && iData.iv || "",
    profileEncryptData: iData && iData.encryptedData || "",
    sessionId: iData.sessionId || 0,
    shareCode: iData.shareCode || "",
    storeId,
    staffId,
  }
  if(this.isCanUrPf){
    data = {
      ...data,
      avatarUrl: userInfo.avatarUrl || "",
      nickName: userInfo.nickName || "",
      gender: userInfo.gender || 0,
    }
  }
  return QT_RegApi[url]({
    data,
    other: {
      isShowLoad: showLoading
    } 
  }).then(e => {
    if (e.code == "1") {
      this.registerCalledAndSuceess = 2;
      return e.data;
    }
    return Promise.reject(e);
  }).catch((error) => {
    SMH.showToast({
      title: error && error.errMsg || error.msg
    })
    return Promise.reject(error);
  })
}

//登录请求
function userLogin(sessionId, showLoading) {
  return WxApi.login().then(e => {
      return QT_RegApi.login({
        data: {
          sessionId
        },
        other: {
          isShowLoad: showLoading
        }
      })
    })
    .then(e => {
      if(e.code == 1){
        e.data = e.data || {};
        return e;
      }
      return Promise.reject(e)
    }).catch(error => {
      this.removeLoginData();
      return Promise.reject(error);
    }).finally(() => {
      this._isCheckLogin = true;
    });
}

//获取用户信息
function getUserExtraInfos(shareCode, isShowLoad = true) {
  if (!shareCode) return Promise.reject({});
  return QT_UserApi.getUserSimpleInfo({
    params: {
      shareCode:shareCode
    },
    other: {
      isShowLoad: isShowLoad
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      this.saveUserInfo(data);
      return e.data;
    }
    console.log(e)
    return Promise.reject(e.msg);
  }).catch(e => {
    return Promise.reject(e.msg);
  })
}

//创建session
function createSession(showLoading, code) {
  return QT_RegApi.createSession({
    data: {
      // brandCode: Conf.BRAND_CODE,
      code: code
    },
    other: {
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
  console.log('进来 checkSession')
  return WxApi.checkSession().then(() => {
    console.log("检测 checkWXSession");
    return QT_RegApi.checkSession({
      params: {
        // brandCode: Conf.BRAND_CODE,
        sessionId: sessionId
      },
      other: {
        isShowLoad: showLoading
      }
    }).then(e => {
      if (e.code == 1 && e.data == 1) {
        return Promise.resolve(e);
      }
      return Promise.reject(e);
    });
  }).catch(error => {
    SMH.showToast({
      title: error.errMsg || error.msg
    })
    return Promise.reject();
  });
}
//
function getUserInfos(withCredentials = false, noAuthHandlerF) {
  return WxApi.getSetting()
    .then(e => {
      if (e.authSetting["scope.userInfo"]) {
        return e
      }
      return Promise.reject(e);
    })
    .then(() => {
      return WxApi.getUserInfo({
          withCredentials: withCredentials,
          lang: 'zh_CN'
        })
        .then(e => {
          if (e.userInfo) {
            return e;
          } else {
            return Promise.reject(e);
          }
        })
    }).catch(e => {
      console.log('catch', e)
      return noAuthHandlerF ? noAuthHandlerF() : Promise.reject(e);
    })
}

function getUserProfile(desc = "", noAuthHandlerF) {
  if (this.isCanUrPf) {
    return WxApi.getUserProfile({
      desc: desc || "获取头像、性别、昵称等信息",
      lang: 'zh_CN'
    }).catch(e => {
      console.log('进来 getUserProfile catch', e)
      let msg = e.errMsg || e.msg || "";
      if(msg.indexOf('fail auth deny') == -1){
        SMH.showToast({
          title: msg
        })
      }
      return noAuthHandlerF ? noAuthHandlerF() : Promise.resolve();
    }).then(e => {
      if (e && e.userInfo) {
        return e;
      } else {
        return Promise.reject();
      }
    })
  } else {
    return getUserInfos.call(this, true, noAuthHandlerF)
  }
}

function checkIfStaffDstb(){ 
  return DstbApi.checkIfStaffDstb({
    params: {
      userToken: this.userKey,
      brandCode: Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      this.setStaffInfo(data);
      return data
    }
    return Promise.reject({});
  })
}

function getStoreStaffInfo(){ 
  return UserApi.getStoreStaffInfo({
    params: {
      userToken: this.userKey,
      brandCode: Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      this.setStoreInfo(data); 
      return data
    }
    return Promise.reject({});
  })
} 


class LoginManager {
  static getInstance() {
    if (!LoginManager.instance) {
      LoginManager.instance = new LoginManager();
    }
    return LoginManager.instance;
  }
  constructor() {
    let sId = StorageH.get(STORAGE_SESSION_ID_KEY) || "";
    if (sId) {
      this._sessionId = sId;
    }
    let us = StorageH.get(STORAGE_USER_TOKEN_KEY) || "";
    if (us) {
      this._userToken = us;
    }
    let ui = StorageH.get(STORAGE_USER_INFOS_KEY) || {};
    if (ui) {
      this._userInfos = ui;
    }
    let opI = StorageH.get(STORAGE_OPEN_ID_KEY) || "";
    if (opI) {
      this._openId = opI;
    }
    let sCode = StorageH.get(STORAGE_SHARE_CODE_KEY) || "";
    if (sCode) {
      this._shareCode = sCode;
    }
    let stf = StorageH.get(STAFF_INFO_KEY) || "";
    if (stf) {
      this._staffInfo = stf;
    }
    let sstf = StorageH.get(STORE_STAFF_INFO_KEY) || "";
    if (sstf) {
      this._storeInfo = sstf;
    }
    this._isCheckLogin = false;
    this.isCanUrPf = !!wx.getUserProfile; 
    this.registerCalledAndSuceess = 0; // 在这次生命周期中，是否已进行过注册流程并成功
  }
  //创建sessionId
  createWxSessionId(showLoading) {
    return WxApi.login()
      .then(e => {
        this.removeSessionId();
        return createSession.call(this, showLoading, e.code);
      }).then(sessionId => {
        console.log('createSession then',sessionId)
        this.saveSessionId(sessionId);
        return sessionId;
      }).catch(error => {
        console.log("createSession", error);
        SMH.showToast({
          title: error.errMsg || error.msg || "授权失败，请重试"
        })
        return Promise.reject();
      });
  }
  //检测sessionId
  getWxSessionIdAsync(showLoading, isReject = false) {
    console.log('进来 getWxSessionIdAsync',this.sessionId)
    return this.sessionId ? checkSession.call(this, showLoading, this.sessionId).then(e => {
      return this.sessionId;
    }).catch(() => {
      console.log('sessionKey过期');
      this.removeSessionId();
      if (isReject) {
        this.createWxSessionId(showLoading).then(() => {
          SMH.showToast({
            title: "状态已过期，请重新授权",
            duration: 3000,
          })
        });
        return Promise.reject();
      } else {
        return this.createWxSessionId(showLoading);
      }
    }) : this.createWxSessionId(showLoading);
  }
  checkSession(){
    if (this._csh) {
      return this._csh;
    }
    this._csh = this.getWxSessionIdAsync().finally(()=>{
      setTimeout(() => {
        this._csh && delete this._csh;
      }, 500)
    });
    return this._csh
  }
  //同步登录
  loginAsync(showLoading) {
    // return Promise.resolve({})
    if (this.isLogin) {
      return Promise.resolve(this.userToken)
    }
    if (this._loginAsyncHold) {
      return this._loginAsyncHold;
    }
    this._loginAsyncHold = this.getWxSessionIdAsync(showLoading).then(sessionId => {
      return userLogin.call(this, sessionId, showLoading).then(e => {
        let data = e.data || {};
        this.saveLoginData({
          ...data,
          register: false
        });
        if (!data.userKey) return Promise.reject("loginAsync->data.userKey不存在");
        return getUserExtraInfos.call(this, data.shareCode);
      }).finally(() => {
        
        //500毫秒后释放；
        setTimeout(() => {
          this._loginAsyncHold && delete this._loginAsyncHold;
        }, 500)
      })
    })
    return this._loginAsyncHold;
  }
  // 注册
  registerAsync(showLoading) {
    console.log('进来 isCanUrPf', this.isCanUrPf)
    return this.isLogin ? Promise.resolve(this.userToken) : getUserProfile.call(this).then(e => {
        return e;
      })
      .then(e => {
        console.log('进来 getUserProfile', e);
        return this.getWxSessionIdAsync(false, this.isCanUrPf).then(sessionId => {
          return {
            ...e,
            sessionId: sessionId
          }
        })
      }) 
      .then(e => {
        let shareCode = PH.paramsJson("fromUser") || "";
        console.log(shareCode, "注册前fromUser数据")
        let codeType = PH.paramsJson("codeType") || "";
        if (shareCode && codeType != "myStoreCode") { //不是扫店员二维码
          return {
            ...e,
            shareCode
          } 
        } else {
          return e;
        }
      })
      .then(e => {
        return userRegister.call(this, showLoading, e)
      })
      .then(userData => {
        return getUserExtraInfos.call(this, userData.shareCode).then(userInfo => {
          this.saveLoginData({
            ...userData,
            userInfo: userInfo,
            register: true
          });
          console.log('EB CALL LOGIN_EB')
          EB.call('LOGIN_EB');
          return userData.userKey;
        })
      });
  }
  getUserSimpleInfo(shareCode) {
    return getUserExtraInfos.call(this, shareCode)
  }
  getUserTokenAsync(showLoading, noAuthHandlerF) {
    return this.userToken ?
      Promise.resolve({
        userToken: this.userToken,
        cache: true
      }) :
      this.registerAsync(showLoading).then(userToken => {
        return {
          userToken: userToken,
          cache: false
        };
      });
  } 

  reSetSimpleInfo() {
    if (!this.userKey) return Promise.reject();
    return QT_UserApi.getUserSimpleInfo({
      params: {
        shareCode:this.shareCode
      },
      other: {
        isShowLoad: false
      }
    }).then(res => {
      console.log('getUserSimpleInfo',res)
      if (res.code == "1") {
        let data = res.data || {};
        this.saveUserInfo(data);
      }
      return res;
    })
  }

  checkIfStaff(checkCache = true) {
    console.log('检测分销',this.staffInfo);
    if (!this.userToken) {
      return Promise.resolve({});
    }
    if (checkCache) {
      let staffInfo = this.staffInfo || {};
      if (staffInfo.isStaffDstbData) {
        return Promise.resolve(staffInfo);
      }
    }
    let h = this._csfh;
    if (h) {
      return h
    };
    this._csfh = h = CDateH.setCatchDate("checkStaff", 2).then(() => {
      console.log('setCatchDate then')
      return checkIfStaffDstb.call(this);
    }).catch(() => {
      console.log('setCatchDate catch')
      return Promise.resolve(this.staffInfo||{});
    }).finally(() => {
      this._csfh && delete this._csfh;
    })
    return h;
  }
  
  checkIfStore(checkCache = true) {
    console.log('检测店员',this.storeInfo);
    if (!this.userToken) {
      return Promise.resolve({});
    }
    if (checkCache) {
      let storeInfo = this.storeInfo || {};
      if (storeInfo.staff_code) {
        return Promise.resolve(storeInfo);
      }
    }
    let h = this._csth;
    if (h) {
      return h
    };
    this._csth = h = CDateH.setCatchDate("checkStore", 2).then(() => {
      console.log('setCatchDate2 then')
      return getStoreStaffInfo.call(this);
    }).catch(() => {
      console.log('setCatchDate2 catch')
      return Promise.resolve(this.storeInfo||{});
    }).finally(() => {
      this._csth && delete this._csth;
    })
    return h;
  }
  
  setStaffInfo(staffInfo = {}) {
    staffInfo && (staffInfo.private_code = (staffInfo && staffInfo.staffCode) ? staffInfo.staffCode : '');
    if (staffInfo && staffInfo.staffCode && /^\d{11}$/.test(staffInfo.staffCode)) {
      staffInfo.private_code = staffInfo.staffCode.slice(0, 3) + "****" + staffInfo.staffCode.slice(staffInfo.staffCode.length - 4);
    }
    this._staffInfo = staffInfo;
    StorageH.set(STAFF_INFO_KEY, staffInfo);
  }
  
  setStoreInfo(storeInfo) {
    this._storeInfo = storeInfo||{};
    StorageH.set(STORE_STAFF_INFO_KEY, storeInfo);
  }

  // 保存数据
  saveSessionId(sessionId) {
    if (this._sessionId == sessionId) return;
    this._sessionId = sessionId || "";
    StorageH.set(STORAGE_SESSION_ID_KEY, this._sessionId);
  }
  saveOpenId(openId) {
    if (this._openId == openId) return;
    this._openId = openId || "";
    StorageH.set(STORAGE_OPEN_ID_KEY, this._openId);
  }
  saveShareCode(shareCode) {
    if (this._shareCode == shareCode) return;
    this._shareCode = shareCode || "";
    StorageH.set(STORAGE_SHARE_CODE_KEY, this._shareCode);
  }
  saveUserToken(userToken) {
    this._userToken = userToken || "";
    StorageH.set(STORAGE_USER_TOKEN_KEY, this._userToken);
  } 
  saveUserKey(userKey) {
    if (this._userKey == userKey) return;
    this._userKey = userKey || "";
    StorageH.set(STORAGE_USER_KEY, this._userKey);
  }
  saveUserInfo(userInfos) {
    if (!userInfos) return;
    this._userInfos = userInfos || {};
    StorageH.set(STORAGE_USER_INFOS_KEY, this._userInfos);
  }
  saveLoginData(data) {
    if (data.cookieId) {
      this.saveOpenId(data.cookieId);
    }
    if (data.sessionId) {
      this.saveSessionId(data.sessionId);
    }
    if (data.userToken) {
      this.saveUserToken(data.userToken);
    }
    if (data.userKey) {
      this.saveUserKey(data.userKey);
    }
    if (data.shareCode) {
      this.saveShareCode(data.shareCode);
    }
    if (data.userInfo) {
      this.saveUserInfo(data.userInfo);
    }
  } 
  logout() { //注销 openId / cookieId、token、userInfo
    this.removeLoginData();
    this.removeSessionId();
  }
  pastLogout() { //注销 openId / cookieId、token、userInfo
    this.pastRemoveLoginData();
  }
  removeSessionId() {
    if (!this._sessionId) return;
    StorageH.remove(STORAGE_SESSION_ID_KEY);
    delete this._sessionId;
  }
  removeLoginData() {
    StorageH.remove(STORAGE_OPEN_ID_KEY);
    StorageH.remove(STORAGE_USER_TOKEN_KEY);
    StorageH.remove(STORAGE_USER_INFOS_KEY);
    StorageH.remove(STORAGE_SHARE_CODE_KEY);
    StorageH.remove(STORAGE_USER_KEY);
    delete this._openId;
    delete this._userToken;
    delete this._userInfos;
    delete this._shareCode;
    delete this._userKey;
    delete this._loginAsyncHold;
  }
  pastRemoveLoginData() {
    StorageH.remove(STORAGE_USER_TOKEN_KEY);
    StorageH.remove(STORAGE_USER_INFOS_KEY);
    StorageH.remove(STORAGE_SHARE_CODE_KEY);
    delete this._userToken;
    delete this._userInfos;
    delete this._shareCode;
    delete this._loginAsyncHold;
  }

  //get数据
  get isLogin() {
    return !!this.userToken && !!this.userKey && !!this.openId;
  }
  get isCheckLogin() {
    return this._isCheckLogin || false;
  }
  get userInfo() {
    return this._userInfos || {};
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
  get openId() {
    return this._openId || ""; //获取到接口返回的openId，实际是cookieId
  }
  get userCode() {
    return this._userInfos.userCode || ""
  }
  get shareCode() {
    return this._shareCode || ""
  }
  get storeInfo() {
    return this._storeInfo || "";
  }
  get staffInfo() {
    return this._staffInfo || "";
  }
  get userInfos() {
    return this._userInfos;
  }
}
export default LoginManager.getInstance(); 