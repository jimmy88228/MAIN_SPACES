
import UniApi from "../support/tools/uni-api-promise.js";
import Conf from "../../config/config.js";
import SMH from "../helper/show-msg-handler.js";
import StorageH from "../helper/storage-handler.js";
import ProviderH from "../helper/provider-handler.js";
import { Apis } from "../http/http.api.install.js";
import { Http } from "../http/http.interceptor.js";
// import { NotNeedLoginPage } from "./log-map.js";
import IM from "./identity-manager.js";
import Tools from "../support/utils.js"

const STORAGE_SESSION_ID_KEY = "SESSION_ID";
const STORAGE_USER_TOKEN_KEY = "USER_TOKEN";
const PRIVATE_INFO_KEY = "PRIVATE_INFO";
const STORAGE_RECORD_ID_KEY = "RECORD_ID";
const STORAGE_OPEN_ID_KEY = "OPEN_ID";

class LoginManager {
  static getInstance() {
    if (!LoginManager.instance) {
      LoginManager.instance = new LoginManager();
    }
    return LoginManager.instance;
  }
  constructor() {
    this._isCanUrPf = !!uni.getUserProfile;
    Func._initStorage.call(this);
  }
	
  //GET数据
  get isLogin() {
    return !!this.userToken;
  }
  get userToken() {
    return this._userToken || "";
  }
  get sessionId() {
    return this._sessionId || "";
  }
  get recordId() {
    return this._recordId || "";
  }
	get openId() {
    return this._openId || "";
  }
	
	

  //异步登录
  loginAsync(showLoading, isPrueCheck = true) {
    console.log("进入_checkLogin")
    if (this.isLogin && isPrueCheck) return Promise.resolve(this.userToken)
    // #ifdef H5
    return Promise.reject();
    // #endif
		if(this._loginHold && isPrueCheck) return this._loginHold;
    this._loginHold = this.getWxSessionIdAsync().then((sessionId)=>{
			return Func._Login.call(this,showLoading, sessionId).then((data)=>{
				let token = data.authUserToken || "";
				let oldToken = this._userToken;
				this.savePrivateInfo(data);
				if(token && token != oldToken){
					IM.getAuthUserInfoByLogin();// 直接获取授权人信息；
				}
				return token ? Promise.resolve(token) : Promise.reject();
			})
		}).finally(() => {
				setTimeout(()=>{this._loginHold = null}, 350)
				// this._loginHold = null
    })
    return this._loginHold;
  }
	// 获取默认关联用户登录
  loginBsnAsync(showLoading, isCheck){ // isCheck 只是检测，不存信息
		if(!this.userToken) return Promise.reject();
    if(this.recordId) return Promise.resolve(this.recordId);
		if(this._loginBsnHold) return this._loginBsnHold;
    this._loginBsnHold = Func._LoginBsn.call(this,showLoading).then((res)=>{
      if(!isCheck){
        this.savePrivateInfo({recordId:res.data||''});
      }
      // 直接获取关联人信息
			IM.getUserInfoByToken();
    }).finally(() => {
			setTimeout(()=>{this._loginBsnHold = null}, 500)
		})
    return this._loginBsnHold;
  }
	//检测授权用户注册
	getTokenRegisterAsync(showLoading, cache = true) {
	  if(this.isLogin && cache){
	    return Promise.resolve({userToken:this.userToken,cache: true})
	  }
		return this.getWxSessionIdAsync().then((sessionId)=>{
			return this.registerAsync(showLoading, sessionId).then(userToken => {
			  return {userToken, cache: false};
			});
		})
	}
  //异步授权用户注册
  registerAsync(showLoading, sessionId) {
		if(this._regHold) return this._regHold;
    this._regHold = Func._registerAsync.call(this,showLoading, sessionId).finally(()=>{
				setTimeout(()=>{this._regHold = null}, 500)
      })
    return this._regHold; 
  }
	// 获取关联用户
  registerBsnAsync(showLoading, id){
		if(this._regBHold) return this._regBHold;
    this._regBHold = Func._registerBsnAsync.call(this, showLoading, id).then((res)=>{
      this.savePrivateInfo({recordId:res.data||''});
      // 直接获取关联人信息
			IM.getUserInfoByToken();
    }).finally(()=>{
				setTimeout(()=>{this._regBHold = null}, 500)
    })
    return this._regBHold; 
  }
  //跟更用户头像
  updateUserProfile(showLoading){
    if(this._profileHold) return this._profileHold;
    this._profileHold = this.getWxSessionIdAsync().then((sessionId)=>{
			return Func._getUserProfile(showLoading).then((e)=> {
			  let { encryptedData, iv } =  e;
        return updateUserProfileReq.call(this, showLoading, {
          encryptedData,
          iv,
          sessionId
        });
			});
		}).finally(()=>{
      setTimeout(()=>{this._profileHold = null}, 500)
    })
    return this._profileHold;
  }
  //检测sessionId过期
  getWxSessionIdAsync(showLoading) {
		return this.sessionId ? Promise.resolve(this.sessionId) : this.createWxSessionId(showLoading);
  }
  //创建sessionId
  createWxSessionId(showLoading) {
		if(this._cwxsHold) return this._cwxsHold;
    this._cwxsHold = Func._createWxSession.call(this,showLoading).finally(()=>{
        setTimeout(()=>{this._cwxsHold = null}, 500)
    })
    return this._cwxsHold;
  }
	// 刷新sessionId
	refreshSessionId(){
		this.removeSessionId();
		return this.createWxSessionId(showLoading).then((sessionId)=>{
			SMH.showToast({
				title: "sessionId已刷新"
			})
			return sessionId;
		})
	}
  //保存sessionId
  saveSessionId(sessionId) {
    if(sessionId){
      this._sessionId = sessionId;
      StorageH.set(STORAGE_SESSION_ID_KEY, this._sessionId);
    }
  }
  //保存userToken
  saveUserToken(userToken) {
    if(userToken){
      this._userToken = userToken || "";
      StorageH.set(STORAGE_USER_TOKEN_KEY, this._userToken);
    }
  }
  //保存recordId
  saveRecordId(recordId) {
    if(recordId){
      this._recordId = recordId || "";
      StorageH.set(STORAGE_RECORD_ID_KEY, this._recordId);
    }
  }
  //保存openId
saveOpenId(openId) {
  if(openId){
    this._openId = openId || "";
    StorageH.set(STORAGE_OPEN_ID_KEY, this._openId);
  }
}
  //保存数据
  savePrivateInfo(data) {
    if(!data)return
    this._privateInfo = {
      ...this._privateInfo,
      ...data
    }
    if (data.sessionId) {
      this.saveSessionId(data.sessionId);
    }
    if (data.authUserToken) {
      this.saveUserToken(data.authUserToken);
    }
    if (data.recordId) {
      this.saveRecordId(data.recordId);
    } 
    if (data.openId) {
      this.saveOpenId(data.openId);
    } 
    StorageH.set(PRIVATE_INFO_KEY,this._privateInfo);
  } 
  //注销信息
  logout(type='userToken') {
    if(type == 'all' || type == 'userToken'){
      this.removeSessionId();
    }
    this.removeLoginData(type);
    return this;
  }
  //移除sessionId
  removeSessionId() {
    if (!this._sessionId) return;
    StorageH.remove(STORAGE_SESSION_ID_KEY);
    delete this._sessionId;
  }
  //移除登录信息
  removeLoginData(type='userToken') {
    if(type == 'all' || type == 'userToken'){
      delete this._userToken;
      StorageH.remove(STORAGE_USER_TOKEN_KEY);
    }
    if(type == 'all' || type == 'recordId'){
      delete this._recordId;
      StorageH.remove(STORAGE_RECORD_ID_KEY);
    }
  }
}





//私有方法
const Func = {
  _initStorage(){
    let sId = StorageH.get(STORAGE_SESSION_ID_KEY) || "";
    let us = StorageH.get(STORAGE_USER_TOKEN_KEY) || "";
		let recordId = StorageH.get(STORAGE_RECORD_ID_KEY) || "";
    let opId = StorageH.get(STORAGE_OPEN_ID_KEY) || "";
    this._sessionId = sId;
    this._userToken = us;
		this._recordId = recordId;
    this._openId = opId;
  },
  _Login(showLoading, sessionId){ 
			return userLogin(showLoading, sessionId).then((res)=>{
				if(res.code){
					let data = res && res.data||{};
					return data
				} else {
					return Promise.reject();
				}
			})
  },
  _LoginBsn(showLoading){ // 默认业务token登录
    return registerBsn.call(this,showLoading, 0).then(res=>{
			return res;
		});
  },
  _registerAsync(showLoading, sessionId){ 
    return register.call(this,showLoading, sessionId);
  },
  _registerBsnAsync(showLoading,id){ // 切换业务token登录
    return registerBsn.call(this,showLoading,id).then(res=>{
			return res;
		});
  },
  _createWxSession(showLoading){
    return ProviderH.get("oauth").then((provider)=>{
      return Func.uniLogin(provider).then(e => {
        this.removeSessionId();
        return createSession.call(this,showLoading, e.code);
      }).then(res => {
        this.savePrivateInfo({sessionId:res.sessionId,openId:res.openId})
        return res.sessionId;
      }).catch(error => {
        console.log('error',error)
        SMH.showToast({
          title: error.errMsg || error.msg || "授权失败，请重试"
        })
        return Promise.reject();
      });
    }).catch(e=>{
      console.log('ProviderH',e)
    })
  },
  _getUserProfile(){
    return new Promise((rs, rj)=>{
      uni.getUserProfile({
        lang: "zh_CN",
        desc: "仅用户展示个人中心头像",
        success(e){
          rs(e)
        },
        fail(error){
          rj(error)
        }
      })
    })
    
  },
  uniLogin(provider){
    //#ifdef MP
    return UniApi.login({provider});
    //#endif

    //#ifdef H5
    return Promise.resolve();
    //#endif

  }
}



//授权token请求
function userLogin(showLoading, sessionId) {
	if(!sessionId) return Promise.reject();
	return Http(Apis.login,{
		customUrl:Apis.login.u + `?sessionId=${sessionId}`, //post请求带url传参
		other: {
			isShowLoad: showLoading,
			isHideMsg: true
		}
	}).catch(error => {
		this.logout();
		return Promise.reject(error);
	})
}

//用户注册
function register(showLoading, sessionId){
  return Http(Apis.register,{
    data:{
      sessionId: sessionId,
    },
    other:{
      isShowLoad: showLoading
    }
  }).then(res=>{
    if(res.code == 1){
       return res
    }
    return Promise.reject(res)
  }).catch(e=>{ 
    return Promise.reject(e);
  })
} 

//业务token请求
function registerBsn(showLoading,id){
  return Http(Apis.businessUserLogin,{
    customUrl:Apis.businessUserLogin.u + `?recordId=${id||0}`,
    other:{
      isShowLoad: showLoading,
			isHideMsg: true
    }
  }).then(res=>{
    if(res.code == 1 && res.data){
      return res
    }else{
      return Promise.reject(res);
    }
  })
} 

//创建session
function createSession(showLoading, code) {
  return Http(Apis.createSessionPlatformV2,{
    data: {
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

//授权用户头像信息等
function updateUserProfileReq(showLoading, data) {
	if(!data.encryptedData || !data.iv || !data.sessionId) return Promise.reject();
	return Http(Apis.updateUserProfile,{
		data: data,
		other: {
			isShowLoad: showLoading,
			isHideMsg: true
		}
	}).catch(error => {
		return Promise.reject(error);
	})
}

let LM = LoginManager.getInstance();
export default LM;


