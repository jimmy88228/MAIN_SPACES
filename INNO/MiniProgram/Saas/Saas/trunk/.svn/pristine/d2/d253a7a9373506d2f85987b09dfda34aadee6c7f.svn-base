import EB from "../support/tools/event-bus";

import WxApi from "../helper/wx-api-helper";
import CDateH from "../helper/handle/cacheDateHandle.js";
import { RegApi, UserApi, DstbApi, VsLogApi,BrandApi } from "./http-manager";
import LgMg from "./log-manager";
import PH from "../helper/handle/paramsHandle"
import Conf from "../../conf";
import SMH from "../helper/show-msg-helper.js";
import SIH from "../helper/sys-infos-helper.js"
import StorageH from "../helper/handle/storageHandle";

const STORAGE_SESSION_ID_KEY = "SESSION_ID";
const STORAGE_USER_TOKEN_KEY = "USER_TOKEN";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const STORAGE_OPEN_ID_KEY = "O_ID";

//注册请求
function userRegister(showLoading, iData={},registerExtra={}) {
  iData = iData||{};
  let channel = LgMg.channel || {};
  let paramsJson = PH.paramsJson() || {};
  let storeId = paramsJson.store_id || 0;
  if (paramsJson.staff_id && paramsJson.store_id){
    storeId = 0;
  }
  let userInfo = iData.userInfo || {};
  // let url = this.isCanUrPf ? 'registerByUserProfile' : 'userRegister';
  let url = this.isCanUrPf ? 'registerByUserProfile1' : 'userRegister';
  return RegApi[url]({
    data: {
      iv: iData && iData.iv||"",
      encryptedData: iData && iData.encryptedData||"",
      avatarUrl: userInfo.avatarUrl||"",
      nickName: userInfo.nickName||"",
      sessionId: iData.sessionId || 0,
      userCode: iData.userCode || "",
      comeFrom: channel.channel || "WXAPP",
      storeId: storeId,
      staffId: paramsJson.staff_id || 0,
      brandCode: Conf.BRAND_CODE,
      ...(registerExtra||{})
    },
    other: {
      isShowLoad: showLoading
    }

  }).then(e => {
    if (e.code == "1") {
      let userToken;
      if (typeof e.data === "object"){
        userToken = e.data.userToken
        e.data.isTotalNewUser && StorageH.set("isTotalNewUser", 2, 60 * 24);
      } else userToken = e.data
      updateClientSession.call(this, userToken);
      return userToken;
    }
    SMH.showToast({
      title: e.msg
    })
    //
    return Promise.reject(e);
  }).catch((error)=>{
    SMH.showToast({
      title: error.errMsg || error.msg
    })
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
      EB.call("simpleInfoChange", this);
      return e.data;
    }
    return Promise.resolve();
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
  console.log("进来 checkWXSession");
  return WxApi.checkSession().then(()=>{
    console.log('进来 checkSession')
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
  }).catch(error=>{
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
  .then(()=>{
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
  }).catch(e=>{
    return noAuthHandlerF ? noAuthHandlerF() : Promise.reject(e);
  })
}

function getUserProfile(desc="", noAuthHandlerF) {
  if(this.isCanUrPf){
    return WxApi.getUserProfile({
      desc: desc||"获取头像、性别、昵称等信息",
      lang: 'zh_CN'
    }).catch(e=>{
      let errMsg = e.errMsg || e.msg || "",
        scene = (PH.paramsJson('options') || {}).scene;
      // 从朋友圈进入的单页模式，如果授权失败，则更改提示文案
      if (scene == 1154 && errMsg.indexOf("no permission currently") != -1) errMsg = "请点击下方前往小程序体验更多功能"         
      SMH.showToast({
        title: errMsg
      })
      return noAuthHandlerF ? noAuthHandlerF() : Promise.resolve();
    }).then(e => {
      if (e && e.userInfo) {
        return e;
      } else {
        return Promise.reject();
      }
    })
  }else{
    return getUserInfos.call(this,true,noAuthHandlerF)
  }
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

function checkIfStaffDstb(){
  return DstbApi.checkIfStaffDstb({
    params: {
      userToken: this.userToken,
      brandCode: Conf.BRAND_CODE
    }, other: { isShowLoad: true }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data||{}; 
      this.setStaffInfo(data);
      setTimeout(function () {
        EB.call("staffInfoChange", this);
      }.bind(this), 150);
      return data;
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
    let ui = StorageH.get(STORAGE_USER_INFOS_KEY) || "";
    if(ui){
      this._userInfos = ui;
    }
    let opI = StorageH.get(STORAGE_OPEN_ID_KEY) || "";
    if(opI){
      this._openId = opI;
    }
    this.isCanUrPf = !!wx.getUserProfile;
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
          title: error.errMsg || error.msg || "授权失败，请重试"
        })
        return Promise.reject();
      });
  }
  //
  getWxSessionIdAsync(showLoading,isReject = false) {
    console.log('进来 getWxSessionIdAsync')
    return this.sessionId ? checkSession.call(this, showLoading, this.sessionId).then(e => {
      return this.sessionId;
    }).catch(() => {
      console.log('sessionKey过期');
      this.removeSessionId();
      if(isReject){
        this.createWxSessionId(showLoading).then(()=>{
          SMH.showToast({
            title: "状态已过期，请重新授权",
            duration:3000,
          })
        });
        return Promise.reject();
      }else{
        return this.createWxSessionId(showLoading);      
      }
    }) : this.createWxSessionId(showLoading);
  }
  //异步登录hold
  loginAsync(showLoading) {
    if(this.isLogin){
     this.checkIfStore()
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
      return Promise.resolve(data);
    }).then( res=>{
      let token = res.token;
      if(!token) return Promise.resolve(res);
      return getUserExtraInfos.call(this, token).then(userInfos=>{
        if (token && userInfos) {
          this.saveLoginData(token, userInfos);
          this.checkIfStore();
        }
        return token
      })
    })
    .finally(()=>{ 
      setTimeout(() => {
        this._loginAsyncHold && delete this._loginAsyncHold;
      }, 500) 
    })
    return this._loginAsyncHold;
  }
  registerAsync(showLoading, registerExtra) {
    console.log('进来 isCanUrPf',this.isCanUrPf)
    return this.isLogin ? Promise.resolve(this.userToken) :  getUserProfile.call(this).then(e => {
      return e;
    })
    .then(e=>{
      console.log('进来 getUserProfile',e);
      return this.getWxSessionIdAsync(false,this.isCanUrPf).then(sessionId=>{
        return {...e,sessionId:sessionId}
      })
    })
    // .then(e=>{
    //   return getUserInfos.call(this,true,noAuthHandlerF).then((uInfo)=>{
    //     return {uInfo, pInfo:e, sessionId:e.sessionId}
    //   })
    // })
    .then(e => {
      let fromUser = PH.paramsJson("fromUser") || "";
      console.log(fromUser,"注册前fromUser数据")
      let codeType = PH.paramsJson("codeType") || "";
      if (fromUser && codeType != "myStoreCode"){//不是扫店员二维码
        return getUserExtraInfos.call(this, fromUser).then( userInfo =>{
          let userCode = userInfo && userInfo.userCode || "";
          return { ...e, userCode}
        })
      }else{
        return e;
      }
    })
    .then(e=>{
      return userRegister.call(this, showLoading,e,registerExtra)
    })
    .then(userToken => {
      return getUserExtraInfos.call(this, userToken).then( userInfos =>{
        if (userToken && userInfos){
          this.saveLoginData(userToken, userInfos, true);
        }
        return userToken;
      })
    });
  }
  getUserSimpleInfo(userToken){
    return getUserExtraInfos.call(this, userToken)
  }
  getUserTokenAsync(showLoading,registerExtra) {
    console.log('registerExtra',registerExtra);
    return this.userToken
      ? Promise.resolve({ userToken: this.userToken, cache: true })
      : this.registerAsync(showLoading,registerExtra).then(userToken => {
        return { userToken: userToken, cache: false };
      });
  }
  get isLogin() {
    return !!this.userToken && !!this.userInfo.uId && !!this.openId;
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
  get isTotalNewUser() { // >=1 是新会员，==2 是新会员+一次弹出优惠券机会
    return StorageH.get("isTotalNewUser") || 0
  }
  setStaffInfo(staffInfo={}){
    staffInfo && (staffInfo.private_code = (staffInfo && staffInfo.staffCode) ? staffInfo.staffCode : '');
    if (staffInfo && staffInfo.staffCode && /^\d{11}$/.test(staffInfo.staffCode)){
      staffInfo.private_code = staffInfo.staffCode.slice(0, 3) + "****" + staffInfo.staffCode.slice(staffInfo.staffCode.length - 4);
    }
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
        break;
      case "set":
        this._needBindStaffInfo = staffInfo
        break;
      default:
        break;
    }
    return this._needBindStaffInfo;
  }
  handleBindFromStore(p_scene, handleType) {
    switch (handleType) {
      case "del":
        this._needBindFromStore = "";
        break;
      case "set":
        this._needBindFromStore = p_scene
        break;
      default:
        break;
    }
    return this._needBindFromStore;
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
  checkIfStaffDstbEvent(getStorage=true) {
    if(getStorage){ //优先读缓存
      //如果已经是分销员则直接返回数据,否则走下面接口逻辑
      let staffInfo = this.staffInfo || {};
      if(staffInfo.isStaffDstbData){
        return Promise.resolve(staffInfo);
      }
    }
    if (!this.userToken) { 
      return Promise.resolve({});
    }
    let h = this._csfh;
    if(h){
      return h
    };
    this._csfh = h = checkIfStaffDstb.call(this).finally(()=>{
      this._csfh && delete this._csfh;
    });
    return h

    // this._csfh = h = CDateH.setCatchDate("checkStaff", 2).then(()=>{
    // }).catch(()=>{
    //   console.log(this.staffInfo,"--catch");
    //   if (this.staffInfo){
    //     return Promise.resolve(this.staffInfo);
    //   }
    // }).finally(()=>{
    //   this._csfh && delete this._csfh;
    // })
    // return h;
  }
	//检测店员
  checkIfStore(reset=false){
    let storeInfo = this.storeInfo || ''; 
    console.log('检测店员:', storeInfo,this.storeChecked);
    if (!storeInfo || reset){
      if ((!storeInfo || reset) && !this.storeChecked){
        return checkIfStoreFn.call(this).then(res=>{
          if(res.code == 1){
            this.storeChecked = true;
          }
          this.setStoreInfo(res.data);
          return Promise.resolve(res.data);
        });
      }else{
        return Promise.resolve(this.storeInfo)
      }
    }
    return Promise.resolve(this.storeInfo || "");
  }
  checkLoginHandle(){
    EB.call("isCheckLoginHandle", this);
  }
  logout(type="login") {
    type == 'login' && this.removeLoginData();
    type == 'all' && logoutAll.call(this);
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
    if (this._needBindStaffInfo){ // 处理分销
      console.log("进入绑定分销")
      this.buildDstbRelation(this._needBindStaffInfo);
    }
    if (this._needBindFromStore) {
      let paramsJson = PH.paramsJson() || {};
      let options = paramsJson.options || {};
      PH.handleStoreStaffInfo(options.query || {})
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
  checkStaffShare(cfgTypes=[]){
    let interval = 0;
    let promiseArr = cfgTypes.map(
      cfgType => new Promise(rs => {
        console.log("interval", interval)
        setTimeout(() => {
          BrandApi.getWxappShareConfigEntity({
            params: {
              cfgType: cfgType,
              brandCode: Conf.BRAND_CODE,
            }, other: {
              isShowLoad: false
          }})
          .then(res => {rs(res)})
          .catch(err => {
            console.log(`获取分享配置: ${cfgTypes}失败, 原因: ${err}`)
            rs({})
          })
        }, interval += 500)
      })
    ) 
    return Promise.all(promiseArr).then(res => {
      let res0 = res[0] || {},
        res1 = res[1] || {},
        res2 = res[2] || {},
        res3 = res[3] || {};
      let obj = {
        identity: res0.data || {},
        share_staff_identity: res1.data || {},
        share_store_staff_identity: res2.data || {},
        share_transpay_title: res3.data || {},
      }
      StorageH.set("STAFF_SHARE_DATA", obj)
      return Promise.resolve(obj)
    }).catch(err => {
      console.log("获取分享配置报错:", err)
      return Promise.resolve({})
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
        // StorageH.set("SIMPLE_USER_INFO",data)
        this.saveUserInfo(data);
        EB.call('simpleInfoChange',this);
      }
    })
  }
}

function logoutAll(){
  this._sessionId = "";
  this._userToken = "";
  this._openId = "";
  this._isCheckLogin = "";
  this._userInfos = "";
  this._storeInfo = "";
  this._staffInfo = "";
  this.storeChecked = false;
  EB.call("LoginStateChange", this);
}

export default LoginManager.getInstance();
