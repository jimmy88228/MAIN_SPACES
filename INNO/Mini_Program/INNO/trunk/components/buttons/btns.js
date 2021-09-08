// pages/component/buttons/btns.js
import MobileM from "../../common/helper/handle/mobileHandle.js"
import WxApi from "../../common/helper/wx-api-helper.js";
const app = getApp();
Component(app.BTAB({
  options:{
    multipleSlots:true, 
    styleIsolation: "isolated"
  },
  properties: {
    isLogin:{
      type:Boolean,
      value:false,
    },
    showLoad: {
      type: Boolean,
      value: false
    },
    customData:{//自定义属性
      type:Object,
      value:{},
    },
    btnType:{//按钮类型
      type:String,
      value:""//buy => "购买","立即购买","下单"; point => "积分商城"; prepaid => "储值卡"; bindPhone ;justLogin 只授权登录
    },
    disabled:{//失效按钮
      type:Boolean,
      value:false
    },
    hideDisStyle:{
      type:Boolean,
      value:false
    },
    isNormal:{//普通按钮
      type:Boolean,
      value:false
    },
    canCancelLogin:{//可取消登录
      type: Boolean,
      value:false
    },
    loginType:{//登录类型 // REFRESH 刷新头像
      type:String,
      value:"LOGIN"
    },
    limitTime:{
      type:String,
      value: "1200"
    },
    showMsgBool:{
      type:Boolean,
      value: true
    }
    // needBindPhone: { //是否绑定手机(默认强制绑定手机/根据后台配置/根据单个活动配置)
    //     type: Boolean,
    //     value: true
    // }
  },
  //app.globalData.btns: 记录点击到完成回调中的btns实例，完成后会销毁
  //app.globalData.thisBtns: 记录当前点击的按钮实例，不会销毁
  pageLifetimes:{
    show() {
      if (this.appletAuth > 2 && this.data.isLogin && app.globalData.btns == this){
        userInfoJump.call(this,"load",true)
      }
    },
  },
  ready(){
    if (wx.getUserProfile) {
      this.setData({
        isCanUrPf: true
      })
    }
    if (this.properties.loginType == "REFRESH") {
      app.LM.getWxSessionIdAsync();
    }
  },
  data: {
    needBindPhone:false,
  },
  canClick:true,
  isBindPhone:false,
  isPerfected:false,
  methods: {
    handleUserInfo(e){
      console.log("按钮触发授权");
      if(!canClickEvent.call(this)){ return };
      this.triggerEvent("clickFront");
      //普通按钮
      if (this.data.isNormal){
        this.clickHandle();
      }else{
        let detail = e.detail || {};
        if (detail.errMsg && detail.errMsg.indexOf("fail auth deny") != -1) {
          return;
        }
        switch (this.data.loginType){
          case "REFRESH":
            refreshInfo.call(this, detail).then(res=>{
              console.log('refreshInfo',res)
              this.clickHandle(res && res.userInfo);
            })
            // .catch(res=>{
            //   if (res.code == "10000" || res.code == "-1"){
            //     app.LM.createWxSessionId().then(() => {
            //       this.clickHandle({});
            //     });
            //   }
            // })
            break;
          default:
            console.log("登录状态：", this.data.isLogin);
            if (this.data.isLogin) {//已经登录
              this.needCheck = true;
              beforeAppletAuthRequired.call(this).then(value => {
                  clickHandleEvent.call(this, value, true);
              })
            } else {//注册流程
              this.needCheck = true;
              checkIsLogin.call(this).then((data) => {
                beforeAppletAuthRequired.call(this).then(value => {
                  clickHandleEvent.call(this, value, true);
                })
              })
            }
        }
      }
    },
    //绑定手机
    bindPhone(bindResult,data){
      console.log("进入检测手机")
      // if (bindResult < 0) {
      //   //不需要绑定手机的
      //   this.clickHandle();
      // } else 
      if (bindResult != 1){
        //强制绑定手机
      let timer = setTimeout(() => {
          this.loginPage = this.loginPage || this.selectComponent("#loginPage");
          // this.loginPage.dismiss();
          this.loginPage.checkLogin({},"noNeed",this.data.showMsgBool);
          clearTimeout(timer);
        },300)
      } else{//已经绑过手机
        if (this.appletAuth == 5 && this.data.btnType == "buy") {
          userInfoJump.call(this, "click", this.needCheck);
        } else {
          this.clickHandle(data||{});
        }
      }
    },
    //绑定手机回调
    bindPhoneCallback(){
      console.log("授权完回调");
      //授权完，关闭
      if (this.data.needBindPhone) {
        wx.nextTick(() => {
          this.setData({
            needBindPhone: false
          })
        })
      }
      //
      if (this.appletAuth == 5 && this.data.btnType == "buy"){
        userInfoJump.call(this, "click", this.needCheck);
      }else{
        this.clickHandle({bindPhoneSucceed:true});
      }
    },
    //按钮点击回调
    clickHandle(data){
      if (this.data.btnType === "bindPhone" && (this.appletAuth != 1 || this.appletAuth != 5) && !this.isBindPhone){
        getBindMobile.call(this, true).then(isBind =>{
          this.bindPhone(isBind,data);
        })
        return;
      }else{
        this.clickHandleEvent(data);
      }
    },
    clickHandleEvent(data){
      console.log("登录回调，执行点击事件");
      app.globalData.btns = null;
      //初始化页面登录状态
      let page = getCurrentPages().slice(-1)[0];
      if(page.data.isLogin != app.LM.isLogin){
        page.setData({
          isLogin: app.LM.isLogin
        })
      }
      let callBackData = {
        ...data,
        ...this.data.customData,
        isLogin: app.LM.isLogin
      }
      this.triggerEvent("clickcallback", callBackData);
    }
  }
}))
function clickHandleEvent(clickType, needCheck = false){
  //积分商城只走 -- 绑手机  或者  完善资料
  if(this.data.btnType == "point"){
    if (clickType < 3) {
      //注册时授权并且绑定手机
      getBindMobile.call(this, needCheck).then(isBind => {
        this.bindPhone(isBind);
      })
    } else {
      //注册时授权并且完善资料
      userInfoJump.call(this, "click", needCheck);
    }
    return;
  }

  clickType = clickType + "";
  switch (clickType){
    case "0":
      //注册是只需授权
      this.clickHandle();
      break;
    case "1":
      //注册时授权并且绑定手机
      getBindMobile.call(this, needCheck).then(isBind=>{
        this.bindPhone(isBind);
      })
      break;
    case "2":
      //注册时只需授权，加入购物车,立即购买需绑定手机
      if (this.data.btnType == "buy"){
        getBindMobile.call(this, needCheck).then(isBind => {
          this.bindPhone(isBind);
        })
      }else{
        this.clickHandle();
      }
      break;
    case "3":
      //注册时授权并且完善资料
      userInfoJump.call(this,"click", needCheck);
      break;
    case "4":
      //注册时只需授权，加入购物车,立即购买需完善资料
      if (this.data.btnType == "buy"){
        userInfoJump.call(this,"click", needCheck);
      }else{
        this.clickHandle();
      }
      break;
    case "5":
      //注册时授权并且绑定手机，加入购物车,立即购买需完善资料
      getBindMobile.call(this, needCheck).then(isBind => {
        this.bindPhone(isBind);
      })
      break;
    default:
      this.clickHandle();
  }
}

function canClickEvent(){
  if (this.canClick || this != app.globalData.thisBtns){
    this.canClick = false;
    app.globalData.btns = this;
    app.globalData.thisBtns = this;
    clearTimeout(timer);
    let timer = setTimeout(() => {
      this.canClick = true;
      clearTimeout(timer);
    }, parseInt(this.properties.limitTime));
    return true;
  }else{
    app.SMH.showToast({
      title: "点击频繁，请稍微等一下"
    });
    return false;
  }
}
//跳转完善资料
function userInfoJump(type, needCheck = false){
  if (!needCheck && type != "load"){//新注册用户，不用检测
    wx.navigateTo({
      url: '/pages/micro_mall/user_info/user_info?type=register',
    })
    return;
  }
  let user_info = app.StorageH.get("USER_INFOS")  || {};
  if (user_info.isPerfected) {
    console.log("回调")
    this.isPerfected = true;
    this.clickHandle();
  }else{
    app.UserApi.checkUserIsCompleteInfo({
      params:{
        brandCode: app.Conf.BRAND_CODE,
        userToken: app.LM.userToken
      }
    }).then(res=>{
      if(res.code == 1){
        user_info.isPerfected = res.data == 1 ? true : false;
        this.isPerfected = user_info.isPerfected;
        app.StorageH.set("USER_INFOS", user_info);
        if (user_info.isPerfected){
          this.clickHandle();
        }else{
          if (type != "load"){
            wx.navigateTo({
              url: '/pages/micro_mall/user_info/user_info?type=register',
            }) 
          }
        }
      }else{
        if (type != "load") {
          wx.navigateTo({
            url: '/pages/micro_mall/user_info/user_info?type=register',
          })
        }
      }
    })
  }
  
}
//检测登录
function checkIsLogin() {
  console.log('进来 按钮点击 开始getUserTokenAsync'); 
  if(this.checkLogining) return Promise.reject();
   this.checkLogining = true;
  return app.LM.getUserTokenAsync(true).then(data => {
    // cache
    if (data.userToken) {
      this.setData({
        isLogin: true
      })
      //注册写log
      if (data.cache == false){
        this.addActionLog("REGISTER", null, null);
      }
      return Promise.resolve(data);
    }
    return Promise.reject();
  }).finally(()=>{
    this.checkLogining = false;
  })
}
function beforeAppletAuthRequired(){
  let btnType = this.data.btnType||"";
  if (btnType === "prepaid" || btnType === 'bindPhone'){
    this.appletAuth = 1;
    return Promise.resolve(1);
  }else if(btnType === "justLogin"){
    this.appletAuth = 0;
    return Promise.resolve(0);
  }else{
    return appletAuthRequired.call(this);
  }
}
//
function appletAuthRequired(){
  return app.sysTemConfig("applet_auth_required").then(data=>{
    let value = parseFloat(data.Value);
    this.appletAuth = value;
    return Promise.resolve(value);
  })
}
//判断绑定手机
function getBindMobile(needCheckBind) {
  if (needCheckBind){
    return MobileM.getBindMobile().then(isBind => {//confNeed 1:强制绑定手机 0：否
      this.setData({
        needBindPhone: isBind ? false : true
      })
      this.isBindPhone = isBind ? true : false
      if (!isBind){
        this.loginPage = this.loginPage || this.selectComponent("#loginPage");
        this.loginPage.dismiss();
      }
      return Promise.resolve(isBind);
    })
  }else{
    this.setData({
      needBindPhone: true
    })
    this.loginPage = this.loginPage || this.selectComponent("#loginPage");
    this.loginPage.dismiss();
    return Promise.resolve(0);
    // 分为默认强制绑定手机和单个活动配置绑定手机
    // if (this.data.needBindPhone) {
    //     this.loginPage = this.loginPage || this.selectComponent("#loginPage");
    //     this.loginPage.dismiss();
    //     return Promise.resolve(0);
    // } else {
    //     return Promise.resolve(-1);
    // }
  }
}
function refreshInfo(reqData = {}){
  if(!app.LM.userToken) return Promise.reject();
  if(this.data.isCanUrPf){
    return WxApi.getUserProfile({
      desc: "获取头像、性别、昵称等信息",
      lang: 'zh_CN'
    }).then(e=>{
      return app.RegApi.updateUserPortrait({
        data:{
          encryptedData: e.encryptedData,
          iv: e.iv,
          avatarUrl: e.userInfo && e.userInfo.avatarUrl || "",
          nickName: e.userInfo && e.userInfo.nickName || "",
          sessionId: app.LM.sessionId,
          userToken: app.LM.userToken,
          brandCode: app.Conf.BRAND_CODE
        }
      }).then(res=>{
        if(res.code == 1){
          return Promise.resolve(e)
        }
        app.SMH.showToast({
          "title":"头像刷新失败"
        })
        return Promise.reject()
      })
    }).catch(e=>{
      console.log('catch',e)
      this.clickHandle();
      return Promise.reject();
    }) 
  }else{ //兼容
    return app.UserApi.updatePortraitPath({
      data:{
        encryptedData: reqData.encryptedData,
        iv: reqData.iv,
        sessionId: app.LM.sessionId,
        userToken: app.LM.userToken,
        brandCode: app.Conf.BRAND_CODE
      }
    }).then(res=>{
      if(res.code == 1){
        return Promise.resolve(reqData)
      }
      app.SMH.showToast({
        "title":"头像刷新失败"
      })
      return app.LM.createWxSessionId().then(() => {
          this.clickHandle({});
          return Promise.reject();
      });
    })
  }
}



