import SConf from "./getSystemConfig.js";
import LM from "../../manager/login-manager.js";
import MobileM from "./mobileHandle.js";
import Conf from "../../../conf.js";
import StorageH from "./storageHandle";
import {
  UserApi
} from "../../manager/http-manager.js"
import {
  PageLogin
} from "../../manager/log-map.js"
class LoginManager {
  static getInstance() {
    if (!LoginManager.instance) {
      LoginManager.instance = new LoginManager();
    }
    return LoginManager.instance;
  }
  constructor() {
    this._JumpRoute = "pages/micro_mall/send_goods/login_page";
    this._loginConf = {};
  }
  get loginConf(){
    return this._loginConf;
  }
  setLoginConf(obj){
    if(obj){
      this._loginConf = obj
    }
  }
  checkAppletForceAuth(){
    return SConf.getSysConfig("applet_force_auth").then(data=>{
      return Promise.resolve(data);
    })
  }
  checkAppletAuthRequired(){
    return SConf.getSysConfig("applet_auth_required").then(data=>{
      return Promise.resolve(data)
    })
  }
  checkRegisterAllConf(){
    if (this._loginConf.isLoadedConf){
      return Promise.resolve(this._loginConf);
    }
    return this.checkAppletForceAuth().then(res1 =>{
      let data = {};
      data.needLogin = res1.Value || 0;
      return this.checkAppletAuthRequired().then(res2=>{
        data.loginType = res2.Value || 0;
        return Promise.resolve(data);
      })
    })
  }
  //登录处理
  loginHandle(callback){
    this.loginCallback = callback;
    let page = getCurrentPages().pop();
    let pageRoute = page.route;
    //特定页面处理 
    if (PageLogin[pageRoute] == "noNeed" || PageLogin[pageRoute] == "isLogin"){
      this.handleLoginCallback(PageLogin[pageRoute]);
      return;
    }
    if (LM.isLogin){//登录状态，且已经绑定手机，完善资料,不读登录配置
      let userInfo = LM.userInfo || {};
      if (!(userInfo.mobilePhone && (userInfo.profile_modify == 1 || userInfo.isPerfected == 1))){
        this.checkRegisterAllConfEvent(pageRoute);
      }else{
        this.handleLoginCallback();
      }
      return;
    }else{
      this.checkRegisterAllConfEvent(pageRoute);
    }   
  }
  checkRegisterAllConfEvent(pageRoute){
    this.checkRegisterAllConf().then(res => {
      //首次加载，缓存配置
      if (!res.isLoadedConf) {
        this._loginConf = {
          prevRoute: pageRoute,
          isLoadedConf: true,
          ...res,
        }
        this._JumpRoute = '/' + this._JumpRoute + "?isNeedLogin=" + res.needLogin;
      }
      //特定页面处理
      if (PageLogin[pageRoute] == "need") {
        this.loginStateHandle(2, res.loginType);
        return;
      }
      //
      if (res.needLogin == 0) {
        this.handleLoginCallback();
        return;
      } else if (res.needLogin == 1) {
        if (!this._loginConf.isHandleCancel) {
          this.loginStateHandle(res.needLogin, res.loginType);
        } else {
          this.handleLoginCallback();
          return;
        }
      } else if (res.needLogin == 2) {
        this.loginStateHandle(res.needLogin, res.loginType);
      }
    })
  }
  //检测登录
  loginStateHandle(needLogin,loginType){
    LM.loginAsync(false).then(()=>{
      if (LM.isLogin){
        this.loginTypeHandle(needLogin, loginType);
        return;
      }else{
        let page = getCurrentPages().pop();
        let pageRoute = page.route;
        //特定页面处理 
        if (PageLogin[pageRoute] == "noNeed" || PageLogin[pageRoute] == "isLogin") {
          this.handleLoginCallback(PageLogin[pageRoute]);
          return;
        };
        wx.navigateTo({
          url: this._JumpRoute,
        })
        // if (!LM.isLogin){//没有登录直接跳转
        //   wx.navigateTo({
        //     url: this._JumpRoute,
        //   })
        // }else{
        //   this.loginTypeHandle(needLogin, loginType);
        // }
      }
    })
    //
    // if (LM.isLogin){
    //   this.loginTypeHandle(needLogin, loginType);
    //   return;
    // }
    // //
    // if(LM.isCheckLogin){
    //   let that = this;
    //   setTimeout(()=>{
    //     if(!LM.isLogin){
    //       wx.navigateTo({
    //         url: that._JumpRoute,
    //       })
    //     }else{
    //       that.loginTypeHandle(needLogin, loginType);
    //     }
    //   },200);
    //   return;
    // }
    // //
    // // console.log("监听登录")
    // this.listenLoginStatuId = EB.listen("LoginStateChange", () => {
    //   let page = getCurrentPages().pop();
    //   let pageRoute = page.route;
    //   //特定页面处理 
    //   if (PageLogin[pageRoute] == "noNeed" || PageLogin[pageRoute] == "isLogin") {
    //     this.handleLoginCallback(PageLogin[pageRoute]);
    //     return;
    //   };
    //   if (!LM.isLogin){//没有登录直接跳转
    //     wx.navigateTo({
    //       url: this._JumpRoute,
    //     })
    //   }else{
    //     this.loginTypeHandle(needLogin, loginType);
    //   }
    // })
  }
  //登录类型
  loginTypeHandle(needLogin,loginType){
    let that = this;
    loginType = loginType + "";
    switch (loginType){
      case"0":
        //注册只需授权
        that.handleLoginCallback();
        break;
      case "1":
        //注册时授权并且绑定手机
        MobileM.getBindMobile().then(isBind => {
          if (!isBind) {
            wx.navigateTo({
              url: that._JumpRoute,
            })
          }else{
            that.handleLoginCallback();
          }
        })
        break;
      case "2":
        that.handleLoginCallback();
        //注册时只需授权
        break;
      case "3":
        //注册时授权并且完善资料
        this.checkIsPerfected().then(isPerfected=>{
          if (!isPerfected){
            wx.navigateTo({
              url: that._JumpRoute,
            })
          }else{
            that.handleLoginCallback();
          }
        })
        break;
      case "4":
        //注册时只需授权
        that.handleLoginCallback();
        break;
      case "5":
        //注册时授权并且绑定手机
        MobileM.getBindMobile().then(isBind => {
          if (!isBind) {
            wx.navigateTo({
              url: that._JumpRoute,
            })
          }else{
            that.handleLoginCallback();
          }
        })
        break;
    }
  }
  //检测完善资料
  checkIsPerfected(){
    let user_info = StorageH.get("USER_INFOS") || {};
    if (user_info.isPerfected) {
      return Promise.resolve(user_info.isPerfected);
    }
    return UserApi.checkUserIsCompleteInfo({
      params: {
        brandCode: Conf.BRAND_CODE,
        userToken: LM.userToken
      }
    }).then(res => {
      if (res.code == 1) {
        console.log(res);
        user_info.isPerfected = res.data == 1 ? true : false;
        StorageH.set("USER_INFOS", user_info);
      }
      return Promise.resolve(user_info.isPerfected || false);
    })
  }
  //处理回调
  handleLoginCallback(pageType){
    typeof (this.loginCallback) == "function" && this.loginCallback(pageType);
  }
}

export default LoginManager.getInstance();