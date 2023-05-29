// components/login/login_by_phone.js
import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
import WxApi from "../../common/helper/wx-api-helper";
import MobileM from "../../common/helper/handle/mobileHandle.js"
const app = getApp();

Component(app.BTAB({
  behaviors: [WindowBehaviors],
  /**
   * 组件的属性列表
   */
  properties: {
    handleType:{
      type:String,
      value:""
    }
  },
  attached() {
  },
  detached() {

  },
  /**
   * 组件的初始数据
   */
  data: {
    canBindPhone: false,
    boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
  },
  ready(){},
  /**
   * 组件的方法列表
   */
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
      });
      console.log("载入触发 getWxSessionIdAsync");
      app.LM.getWxSessionIdAsync();
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
      });
      return 300;
    },
    checkLogin(params, needCheckBind, showMsgBool=true) {
      console.log('手机checkLogin',params, needCheckBind, showMsgBool)
      this.params = params || {};
      this.showMsgBool = showMsgBool||false;
      if (needCheckBind == "need"){
        MobileM.checkBindMobileResult().then(bindResult => {
          if (bindResult == 1) {
            console.log('无需授权手机',bindResult)
            this.triggerEvent("loginCallback", params);
          } else {
            console.log('弹出手机授权框',bindResult)
            beforeBindPhone.call(this);
          }
        }).catch(() => {
          app.SMH.showToast({
            "title": "接口异常"
          })
        })
      }else{
        console.log('弹出手机授权框')
        beforeBindPhone.call(this);
      }
    },
    getPhoneNumber(e) {
      console.log('getPhoneNumber',e)
      let detail = e.detail;
      if (detail.errMsg.indexOf("ok") == -1){return;}
      if (this.properties.handleType == "expose"){
        this.dismiss();
        this.triggerEvent("loginCallback", detail);
      }else{
        bindWxPhone.call(this, detail);
      }
      
    },
    changePhoneNumber(e){
      let detail = e.detail;
      if (detail.errMsg.indexOf("ok") == -1) { return; }
      if (this.properties.handleType == "expose") {
        this.dismiss();
        this.triggerEvent("loginCallback", detail);
      } else {
        changeWxPhone.call(this, detail);
      }
    }
  }
}))

function bindWxPhone(params) {
    return app.RegApi.bindWxPhone({
      data: {
        encryptedData: params.encryptedData,
        iv: params.iv,
        sessionId: app.LM.sessionId,
        userToken: app.LM.userToken,
        brandCode: app.Conf.BRAND_CODE
      },
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == 1 && e.data) {
        //绑定成功
        this.dismiss();
        let _timer1 = setTimeout(() =>{
          clearTimeout(_timer1);
          this.setData({
            canBindPhone: false,
          })
          this.showMsgBool && app.SMH.showToast({
            "title": "绑定成功"
          })
        }, 300);
        //
        let params = this.params || {};
        params.mobilePhone = e.data;
        //
        let user_info = app.StorageH.get("USER_INFOS") || {};
        user_info.mobilePhone = e.data;
        app.StorageH.set("USER_INFOS", user_info);
        //
        MobileM.mobileStorage(1,"set");
        return afterBindPhoneSuccess.call(this, params)
          .finally(() => Promise.resolve(e))
      } else {
        app.SMH.showToast({
          "title": e.msg||'操作失败，请重试'
        })
      }
      return Promise.reject(e);
    }).catch(res => {
    let _timer2 = setTimeout(function () {
      clearTimeout(_timer2);
      app.LM.createWxSessionId().then(() => {
        // app.SMH.showToast({
        //   title: "请重试"
        // });
      });
    }, 600);
  })
}
//
function changeWxPhone(params){
  return app.UserApi.changeWxPhone({
    data: {
      encryptedData: params.encryptedData,
      iv: params.iv,
      sessionId: app.LM.sessionId,
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
      if (e.code == 1 && e.data) {
        //绑定成功
        this.dismiss();
        setTimeout(() =>{
          this.setData({
            canBindPhone: false,
          })
          app.SMH.showToast({
            "title": "修改成功"
          })
        }, 300);
        //
        let params = this.params || {};
        params.mobilePhone = e.data;
        //
        let user_info = app.StorageH.get("USER_INFOS") || {};
        user_info.mobilePhone = e.data;
        app.StorageH.set("USER_INFOS", user_info);
        //
        MobileM.mobileStorage(1,"set");
        this.triggerEvent("loginCallback", params);
        return Promise.resolve(e);
      } else {
        app.SMH.showToast({
          "title": e.msg||'操作失败，请重试'
        })
      }
      return Promise.reject(e);
    }).catch(res => {
    setTimeout(function () {
      app.LM.createWxSessionId().then(() => {
        app.SMH.showToast({
          title: "会话已更新，请重试"
        });
      });
    }, 600);
  })
}
//
function beforeBindPhone(){
  this.show();
  this.setData({
    canBindPhone: true
  })
}

function afterBindPhoneSuccess(params){
  try {
    let pages = getCurrentPages(), curPage = pages[pages.length - 1];
    if (curPage.route === "pages/micro_mall/user_info/user_info"){ // 个人资料页的绑定手机/更换手机 这时不用跑"展示优惠券流程”
      this.triggerEvent("loginCallback", params);
      return Promise.resolve()
    }
    return checkDisplayReceivedCoupons.call(this, () => {this.triggerEvent("loginCallback", params)})
    .then(getCouponsPopShow => {
      if (!getCouponsPopShow) this.triggerEvent("loginCallback", params);
      return Promise.resolve()
    }).catch(err => {
      console.log("进行注册后展示优惠券流程报错", err);
      this.triggerEvent("loginCallback", params);
      return Promise.resolve()
    })
  } catch (err) {return Promise.resolve()}
}

// 注册成功后，检查"展示获得券"流程
function checkDisplayReceivedCoupons(cb = () => {}){
  return appletAuthRequired.call(this).then(clickType => {
    if (clickType == 1 || clickType == 5){ // 手机号注册完成后读取
      this.getCouponsPop = this.getCouponsPop || this.selectComponent("#getCouponsPop");
      return this.getCouponsPop.initData({typeName: "register", afterHideFn: cb})
    }
    return Promise.resolve(false);
  })
}

function appletAuthRequired(){
  return app.sysTemConfig("applet_auth_required").then(data=>{
    let value = parseFloat(data.Value);
    this.appletAuth = value;
    return Promise.resolve(value);
  })
}