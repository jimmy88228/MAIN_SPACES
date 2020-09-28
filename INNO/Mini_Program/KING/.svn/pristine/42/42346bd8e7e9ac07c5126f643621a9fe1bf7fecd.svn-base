import Promise from "../../libs/promise/promise";
import EB from "../../support/tools/event-bus";

import WxApi from "../wx-api-helper";
import CDateH from "../handle/cacheDateHandle.js";
import { RegApi, UserApi, DstbApi, VsLogApi,BrandApi } from "./http-manager";
import LgMg from "./log-manager";
import PH from "../handle/paramsHandle"
import Conf from "../../conf";
import SMH from "../show-msg-helper.js";
import SIH from "../../helper/sys-infos-helper.js"
import StorageH from "../../helper/handle/storageHandle";

const STORAGE_SESSION_ID_KEY = "SESSION_ID";
const STORAGE_USER_TOKEN_KEY = "USER_TOKEN";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const STORAGE_OPEN_ID_KEY = "O_ID";
//注册请求
function userRegister(showLoading, sessionId, encryptedData, iv, userCode) {
  let channel = LgMg.channel || {};
  let paramsJson = PH.paramsJson() || {};
  let storeId = paramsJson.store_id || 0;
  if (paramsJson.staff_id && paramsJson.store_id){
    storeId = 0;
  }
  return RegApi.userRegister({
    data: {
      brandCode: Conf.BRAND_CODE,
      sessionId: sessionId,
      encryptedData: encryptedData, 
      iv: iv,
      // channelType: channel.channelType || "",
      comeFrom: channel.channel || "WXAPP",
      userCode: userCode || "",
      storeId: storeId,
      staffId: paramsJson.staff_id || 0
      // clientSessionId: channel.clientSessionId || ""
    },
    other: {
      isShowLoad: showLoading
    }

  }).then(e => {
    if (e.code == "1") {
      updateClientSession.call(this, e.data);
      return e.data;
    }
    SMH.showToast({
      title: e.msg
    })
    //
    return Promise.reject(e.msg);
  })
}

//登录请求
function userLogin(showLoading) {
  return WxApi.login().then(e => {
    return RegApi.userLogin({
      data: {
        brandCode: Conf.BRAND_CODE,
        code: e.code,
      },
      other: {
        isShowLoad: showLoading
      }
    })
  })
    .then(e => {
      e.data = e.data || {};
      return e;
      // if (e.code == "1") {
      //   return e.data;
      // }else{
      //   return Promise.reject(e.msg);
      // }
    }).catch(error => {
      this.removeLoginData();
      return Promise.reject(error);
    }).finally(()=>{
      this._isCheckLogin = true;
    });
}

//获取用户信息
function getUserExtraInfos(token, isShowLoad = true) {
  if (!token) return Promise.reject({});
  return UserApi.getUserSimpleInfo({
    params: {
      userToken: token,
      brandCode: Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: isShowLoad
    }
  }).then(e => {
    if (e.code == "1") {
      let data  = e.data||{};
      StorageH.set("SIMPLE_USER_INFO",data)
      return e.data;
    }
    return Promise.reject(e.msg);
  })
}

//创建session
function createSession(showLoading, code) {
  return RegApi.createSession({
    data: {
      brandCode: Conf.BRAND_CODE,
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
  return WxApi.checkSession().then(()=>{
    return RegApi.checkSession({
      params: {
        brandCode: Conf.BRAND_CODE,
        sessionId: sessionId
      },
      other: {
        isShowLoad: showLoading
      }
    }).then(e => {
      if (e.code == "1") {
        return Promise.resolve(e);
      }
      return Promise.reject(e);
    });
  }).catch( ()=>{
    return Promise.reject();
  });
}
//
function getUserInfos(withCredentials = false, noAuthHandlerF) {
  return WxApi.getSetting()
    .then(e => {
      if (e.authSetting["scope.userInfo"]) {
        return WxApi.getUserInfo({
          withCredentials: withCredentials,
          lang: 'zh_CN'
        });
      }
      return noAuthHandlerF ? noAuthHandlerF() : Promise.reject("授权失效");
    })
    .then(e => {
      if (e.userInfo) {
        return e;
      } else {
        return Promise.reject("授权失败");
      }
    });
}
 

function checkIfStoreFn() {
  return UserApi.getStoreStaffInfo({
    params: {
      userToken: this.userToken,
      brandCode: Conf.BRAND_CODE,
    }, other: {
      isShowLoad: true
    }
  })
} 

function updateClientSession(token) {
  return VsLogApi.postUpdateClientSession({
    data: {
      clientSessionId: LgMg.channel && LgMg.channel.clientSessionId || '',
      userToken: token || "",
      cookieId: SIH.cookieId || "",
      brandCode: Conf.BRAND_CODE || ""
    }
  });
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
    let ui = StorageH.get(STORAGE_USER_INFOS_KEY) || "";
    if(ui){
      this._userInfos = ui;
    }
    let opI = StorageH.get(STORAGE_OPEN_ID_KEY) || "";
    if(opI){
      this._openId = opI;
    }
    this._isCheckLogin = false;
  }
  //
  createWxSessionId(showLoading) {
    return WxApi.login()
      .then(e => {
        this.removeSessionId();
        return createSession.call(this, showLoading, e.code);
      }).then(sessionId => {
        this.saveSessionId(sessionId);
        return sessionId;
      }).catch(error=>{
        console.log("createSession",error);
        SMH.showToast({
          title:"授权失败，请重试"
        })
        return Promise.reject();
      });
  }
  //
  getWxSessionIdAsync(showLoading) {
    return this.sessionId ? checkSession.call(this, showLoading, this.sessionId).then(e => {
      return this.sessionId;
    }).catch(() => {
      this.removeSessionId();
      return this.createWxSessionId(showLoading);
    }) : this.createWxSessionId(showLoading);
  }
  //同步登录
  loginAsync(showLoading) {
    if(this.isLogin){
     return Promise.resolve(this.userToken)
    }
    if(this._loginAsyncHold){
      return this._loginAsyncHold;
    }
    this._loginAsyncHold = userLogin.call(this, showLoading).then(e=>{
      let data = e.data || {};
      if (data.sessionId) {
        this.saveSessionId(data.sessionId);
      }
      if (data.openId) {
        this.saveOpenId(data.openId);
      }
      this.checkLoginHandle();
      // if (e.code == 1){
      //   return data;
      // }
      return Promise.resolve(data);
    }).then( res=>{
      let token = res.token;
      if(!token) return Promise.resolve();
      return getUserExtraInfos.call(this, token).then( userInfos=>{
        if (token && userInfos) {
          this.saveLoginData(token, userInfos);
        }
      })
    })
    .finally(()=>{
      this._loginAsyncHold && delete this._loginAsyncHold;
    })
    return this._loginAsyncHold;
  }
  registerAsync(showLoading, noAuthHandlerF) {
    return this.isLogin ? Promise.resolve(this.userToken) : this.getWxSessionIdAsync(showLoading)
      .then(sessionId => {
        return getUserInfos.call(this, true, noAuthHandlerF).then(e => {
          return { ...e, sessionId: sessionId };
        });
      })
      .then(e => {
        let fromUser = PH.paramsJson("fromUser") || "";
        console.log(fromUser,"注册前fromUser数据")
        let codeType = PH.paramsJson("codeType") || "";
        if (fromUser && codeType != "myStoreCode"){//不是扫店员二维码
          return getUserExtraInfos.call(this, fromUser).then( userInfo =>{
            let userCode = userInfo.userCode;
            return { ...e, userCode}
          })
        }else{
          return e;
        }
      }).then( e=>{
        console.log(e,"注册时拿到的userCode数据")
        return userRegister.call(this, showLoading, e.sessionId, e.encryptedData, e.iv, e.userCode)
      }).then(userToken => {
        return getUserExtraInfos.call(this, userToken).then( userInfos =>{
          if (userToken && userInfos){
            this.saveLoginData(userToken, userInfos, true);
            return userToken;
          }
        })
        // this.saveLoginData(userToken, {});
        // return userToken;
      });
  }
  getUserSimpleInfo(userToken){
    return getUserExtraInfos.call(this, userToken);
  }
  getUserTokenAsync(showLoading, noAuthHandlerF) {
    return this.userToken
      ? Promise.resolve({ userToken: this.userToken, cache: true })
      : this.registerAsync(showLoading, noAuthHandlerF).then(userToken => {
        return { userToken: userToken, cache: false };
      });
  }
  get isLogin() {
    return !!this._userToken && !!this._userInfos.uId && !!this._openId;
    // return !!this._userToken && !!this._userInfos.uId;
  }
  get isCheckLogin(){
    return this._isCheckLogin || false;
  }
  get userInfo(){
    return this._userInfos || {};
  }
  get userToken() {
    return this._userToken || "";
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
  get storeInfo(){
    return this._storeInfo ||"";
  }
  get staffInfo(){
    return this._staffInfo || "";
  }
  get userInfos(){
    return this._userInfos;
  }
  setStaffInfo(staffInfo){
    this._staffInfo = staffInfo;
    if (staffInfo.staffCode){
      StorageH.set("STAFFINFO", staffInfo)
    }else{
      StorageH.remove("STAFFINFO")
    }
  }
  setStoreInfo(storeInfo){
    this._storeInfo = storeInfo;
    if (storeInfo){
      StorageH.set("STOREINFO", storeInfo)
    }else{
      this._storeInfo = "";
      StorageH.remove("STOREINFO")
    }
  }
  handleBindStaffInfo(staffInfo, handleType){
    switch (handleType){
      case "del":
        this._needBindStaffInfo = "";
        return "";
        break;
      case "set":
        this._needBindStaffInfo = staffInfo
        break;
      default:;
    }
    return this._needBindStaffInfo;
  }
  //绑定分销关系
  buildDstbRelation(staffCode){
    if (!staffCode) return;
    if (!this.userToken) {
      this.handleBindStaffInfo(staffCode, "set");
      return
    };
    return DstbApi.buildDstbRelation({
      data: {
        userToken: this.userToken,
        staffCode: staffCode,
        brandCode: Conf.BRAND_CODE
      },
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == "1") {
        if(e.data == 1){
          //
          this.handleBindStaffInfo("", "del");
        }
        return Promise.resolve(e);
      }
      
    })
  }
  //检测分销
  checkIfStaffDstbEvent() {
    let staffInfo = this.staffInfo || {};
    // if (staffInfo.isStaffDstbData) {
    //   return Promise.resolve(staffInfo);
    // }
    if (!this.userToken) {
      return Promise.resolve({});
    }
    return CDateH.setCatchDate("checkStaff", 2).then(()=>{
      return DstbApi.checkIfStaffDstb({
        params: {
          userToken: this.userToken,
          brandCode: Conf.BRAND_CODE
        }, other: { isShowLoad: true }
      }).then(e => {
        if (e.code == "1") {
          let data = e.data;
          data.private_code = (data && data.staffCode) ? data.staffCode : '';
          if (data && data.staffCode && /^\d{11}$/.test(data.staffCode)){
            data.private_code = data.staffCode.slice(0, 3) + "****" + data.staffCode.slice(data.staffCode.length - 4);
          }
          this.setStaffInfo(data);
          setTimeout(function () {
            EB.call("staffInfoChange", this);
          }.bind(this), 150);
          return Promise.resolve(data);
        }
        return Promise.reject({});
      })
    }).catch(()=>{
      console.log(this.staffInfo,"--catch");
      if (this.staffInfo){
        // setTimeout(function () {
        //   EB.call("staffInfoChange", this);
        // }.bind(this), 150);
        return Promise.resolve(this.staffInfo);
      }
    })
  }
	//检测店员
  checkIfStore(reset=false){
    let storeInfo = this.storeInfo || ''; 
    console.log('检测店员:', storeInfo);
    if (!storeInfo || reset){
      if ((!storeInfo || reset) && !this.storeChecked){
        return checkIfStoreFn.call(this).then(res=>{
          this.storeChecked = true;
          this.setStoreInfo(res.data);
          return Promise.resolve(res.data);
        });
      }else{
        return Promise.resolve(this.storeInfo)
      }
    }
  }
  checkLoginHandle(){
    EB.call("isCheckLoginHandle", this);
  }
  logout() {
    this.removeLoginData();
  }
  saveSessionId(sessionId) {
    this._sessionId = sessionId;
    StorageH.set(STORAGE_SESSION_ID_KEY, this._sessionId);
  }
  saveOpenId(openId){
    this._openId = openId;
    StorageH.set(STORAGE_OPEN_ID_KEY, this._openId);
  }
  saveLoginData(userToken, userInfos, register = false) {
    this._userToken = userToken || "";
    StorageH.set(STORAGE_USER_TOKEN_KEY, this._userToken);
    this.saveUserInfo(userInfos)
    EB.call("LoginStateChange", register);
    //处理分销
    if (this._needBindStaffInfo){
      console.log("进入绑定分销")
      this.buildDstbRelation(this._needBindStaffInfo);
    }
  }
  saveUserInfo(userInfos){
    if (!userInfos) return;
    this._userInfos = userInfos || {};
    StorageH.set(STORAGE_USER_INFOS_KEY, this._userInfos);
  }
  removeSessionId() {
    if (!this._sessionId) return;
    StorageH.remove(STORAGE_SESSION_ID_KEY);
    delete this._sessionId;
  }
  removeLoginData() {
    if (!this._openId) return;
    StorageH.remove(STORAGE_OPEN_ID_KEY);
    delete this._openId;
    if (!this._userToken) return;
    StorageH.remove(STORAGE_USER_TOKEN_KEY);
    StorageH.remove(STORAGE_USER_INFOS_KEY);
    delete this._userToken;
    delete this._userInfos;
    EB.call("LoginStateChange", this);
  }
  checkStaffShare(cfgType=""){
    return BrandApi.getWxappShareConfigEntity({
      params: {
        cfgType: cfgType,
        brandCode: Conf.BRAND_CODE,
      }, other: {
        isShowLoad: false
      },
    }).catch(()=>{
      return Promise.resolve({});
    }).then(res=>{
      if(res.code=="1"){
        let data  = res.data||{};
        StorageH.set("STAFF_SHARE_DATA",data)
      }
    })
  }
  reSetSimpleInfo(){
    if(!this.userToken)return Promise.reject();
    return UserApi.getUserSimpleInfo({
      params: {
        brandCode: Conf.BRAND_CODE,
        userToken: this.userToken||""
      },other: {
        isShowLoad: false
      }
    }).catch(()=>{
      return Promise.resolve({});
    }).then(res=>{
      if(res.code=="1"){
        let data  = res.data||{};
        StorageH.set("SIMPLE_USER_INFO",data)
      }
    })
  }
}
 

export default LoginManager.getInstance();
