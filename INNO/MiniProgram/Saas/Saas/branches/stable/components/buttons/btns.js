// components/buttons/btns.js
import MobileM from "../../common/helper/handle/mobileHandle.js"
import WxApi from "../../common/helper/wx-api-helper.js";
import appUtils from '../../common/support/utils/utils';
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
    tapInterval: { // 点击限流间隔时间
      type: Number,
      value: 2000
    },
    showMsgBool:{
      type:Boolean,
      value: true
    },
    ignoreAgreement:{
      type:Boolean,
      value: false
    },
    positionType:{
      type:String,
      value:"relative"
    },
    registerExtra:{
      type:Object,
      value:{}
    }
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
    checkPopComponentsRef.call(this);
  },
  data: {
    needBindPhone:false,
  },
  canClick:true,
  isBindPhone:false,
  isPerfected:false,
  methods: {
    handleUserInfo(e, intervalControl = true){
      let tapInterval = this.properties.tapInterval;
      let mainFn = ()=>{
        // if(!canClickEvent.call(this)){ return };
        saveClickObj.call(this);
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
                this.clickHandle(res && res.userInfo);
              })
              break;
            default:
              if (this.data.isLogin) {//已经登录
                this.needCheck = true;
                beforeAppletAuthRequired.call(this).then(value => {
                    this.curStatus = 'normal';
                    clickHandleEventFnc.call(this, value, true);
                })
              } else {//注册流程
                this.needCheck = true;
                console.log('注册流程');
                // let callBackData = { 
                //   ...this.data.customData,
                //   isLogin: true,
                //   curStatus:"register"||""
                // }
                // console.log("callBackData", callBackData);
                // this.triggerEvent("clickcallback", callBackData,{
                //   bubbles:true,
                //   composed:true,
                //   capturePhase:true,
                // });
                // return Promise.reject('reject') 
                checkIfNeedConfirmAgreement.call(this)
                  .then(agreementPopShow => agreementPopShow ? Promise.reject("已调起会员协议弹窗，跳出") : Promise.resolve())
                  .then(checkIsLogin.bind(this))
                  .then(beforeAppletAuthRequired.bind(this))
                  .then(value => checkDisplayReceivedCoupons.call(this, value))
                  .then(value => {clickHandleEventFnc.call(this, value, true);})
              }
          }
        }
      }
      if (intervalControl) return appUtils.throttle(mainFn, tapInterval || 2000)()
      else return mainFn()
    },
    //绑定手机
    bindPhone(bindResult,data){
      console.log("进入检测手机",bindResult,this.curStatus,this.appletAuth)
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
        } else if((this.appletAuth == 1 || this.appletAuth == 5) && this.curStatus == "register") {
          wx.hideLoading()
          app.SMH.hideToast();
          this.getCouponsPop = this.getCouponsPop || this.selectComponent("#getCouponsPop");
          this.getCouponsPop.initData({typeName: "register", afterHideFn: () => {clickHandleEventFnc.call(this,this.appletAuth)}})
            .then(getCouponsPopShow => getCouponsPopShow ? Promise.reject("展示优惠券弹窗打开，跳出") : Promise.resolve())
            .finally(() => {this.curStatus = "normal"})
        } else {
          this.clickHandle(data||{});
        }
      }
    },
    //绑定手机回调
    bindPhoneCallback(){
      console.log("绑定手机回调");
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
      console.log('按钮点击回调')
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
      console.log("最终登录回调，执行点击事件");
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
        isLogin: app.LM.isLogin,
        curStatus:this.curStatus||""
      }
      console.log("callBackData", callBackData);
      this.triggerEvent("clickcallback", callBackData,{
        bubbles:true,
        composed:true,
        capturePhase:true,
      });
    }
  }
}))
function checkPopComponentsRef(){ // 检查当前页面是否存在outSideComponent组件, 如果有，则弹窗组件默认用放在outSideComponent组件的弹窗组件
  let pages = getCurrentPages(), curPage = pages[pages.length - 1];
  let outsideContainer = curPage.selectComponent("#outsideContainer");
  if (outsideContainer){
    this.agreementPop = outsideContainer.getCompnent && outsideContainer.getCompnent("agreementPop");
    this.getCouponsPop = outsideContainer.getCompnent && outsideContainer.getCompnent("getCouponsPop");
  }
}

function clickHandleEventFnc(clickType, needCheck = false){
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
  } else if (this.data.btnType == "bindPhone" && (this.realAppletAuth == 0 || this.realAppletAuth == 2 || this.realAppletAuth == 4)) { // 抽奖活动中的按钮特殊处理
    this.getCouponsPop = this.getCouponsPop || this.selectComponent("#getCouponsPop");
    return this.getCouponsPop.initData({
      typeName: "register", 
      afterHideFn: () => {
        return getBindMobile.call(this, needCheck).then(isBind=>{
          this.bindPhone(isBind);
        })
      }
    })
      .then(popShow => {
        if (!popShow){
          getBindMobile.call(this, needCheck).then(isBind=>{
            this.bindPhone(isBind);
          })
        }
      })
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
function saveClickObj(){
  app.globalData.btns = this;
  app.globalData.thisBtns = this;
}
// function canClickEvent(){
//   if (this.canClick || this != app.globalData.thisBtns){
//     this.canClick = false;
//     app.globalData.btns = this;
//     app.globalData.thisBtns = this;
//     clearTimeout(timer);
//     let timer = setTimeout(() => {
//       this.canClick = true;
//       clearTimeout(timer);
//     }, parseInt(this.properties.limitTime));
//     return true;
//   }else{
//     app.SMH.showToast({
//       title: "点击频繁，请稍微等一下"
//     });
//     return false;
//   }
// }
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

// 检查是否要走"同意会员协议"流程
function checkIfNeedConfirmAgreement(){ // 返回Promise 带true说明会拉起"会员协议"弹窗, 带false或reject则不会拉起
  try {
    console.log("按钮点击 检查是否要走 会员协议流程");
    if (this.ignoreAgreement || this.properties.ignoreAgreement){ // 不需要走会员协议流程
      this.ignoreAgreement = false;
      return Promise.resolve(false);
    }
    else if(app.LM.isLogin && app.LM.userToken){
      console.log("用户已登录，不走会员协议流程", app.LM.isLogin, app.LM.userToken)
      return Promise.resolve(false)
    }
    this.agreementPop = this.agreementPop || this.selectComponent("#agreementPop");
    return this.agreementPop.initData({type: "USER", confirm: (e) => {
      this.ignoreAgreement = true
      this.handleUserInfo(e, 0);
      return true // 是告诉组件，点击确认后要关闭哦
    }, cancel: () => true})
  } catch (error) {
    console.log("检查会员协议流程报错: ", error);
    return Promise.resolve(false)
  }
}

//检测登录
function checkIsLogin() {
  console.log('进来 按钮点击 开始getUserTokenAsync'); 
  if(this.checkLogining) return Promise.reject();
   this.checkLogining = true;
  if(!app.LM.isLogin){
    this.curStatus = 'register';
  }
  return app.LM.getUserTokenAsync(true,this.properties.registerExtra||{}).then(data => {
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
    return appletAuthRequired.call(this)
      .then(value => {
        this.realAppletAuth = value;
        this.appletAuth = 1;
      })
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

// 注册成功后，检查"展示获得券"流程
function checkDisplayReceivedCoupons(clickType){
  if (clickType == 0 || clickType == 2 || clickType == 4){ // 授权后读取
    this.getCouponsPop = this.getCouponsPop || this.selectComponent("#getCouponsPop");
    return this.getCouponsPop.initData({typeName: "register", afterHideFn: () => {clickHandleEventFnc.call(this,clickType)}})
      .then(getCouponsPopShow => getCouponsPopShow ? Promise.reject("展示优惠券弹窗打开，跳出") : Promise.resolve(clickType))
  }
  return Promise.resolve(clickType);
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



