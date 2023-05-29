// pages/component/login/login_by_phone.js
import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
// import WxApi from "../../../support/tools/wx-api-promise";
import MobileM from "../../common/helper/handle/mobileHandle.js"
import RCH from "../pop/getCouponsPop/registerRelated";
const app = getApp();

Component(app.BTAB({
  behaviors: [WindowBehaviors],
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
  ready(){
    // app.LM.getWxSessionIdAsync();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
      });
      app.LM.getWxSessionIdAsync();
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
      });
      return 300;
    },
    checkLogin(params, needCheckBind, showMsgBool=true) {
      // if (needCheckBind == "need") {
      //   return app.sysTemConfig("constraint_mobile").then(data => {
      //     if (data.Value == 1) {
      //       return checkIsBindMobile.call(this).then(isBindMobile => {
      //         if (isBindMobile == 0) {
      //           this.show();
      //           this.setData({
      //             canBindPhone: true
      //           })
      //         } else { //已经绑定手机
      //           console.log("已经绑定手机")
      //           this.triggerEvent("loginCallback", params);
      //         }
      //       })
      //     } else { //不用绑定手机
      //       console.log("不用绑定手机")
      //       this.triggerEvent("loginCallback", params);
      //     }
      //   })
      // } else if (needCheckBind == "noNeed") {
      //   this.show();
      //   this.setData({
      //     canBindPhone: true
      //   })
      //   app.LM.getWxSessionIdAsync();
      // } else { //不用绑定手机
      //   console.log("完全不用绑定手机")
      //   this.triggerEvent("loginCallback", params);
      // }
      // extraData && (this.extraData = extraData);
      this.params = params || {};
      this.showMsgBool = showMsgBool||false;
      if (needCheckBind == "need"){
        MobileM.checkBindMobileResult().then(bindResult => {
          if (bindResult == 1) {
            this.triggerEvent("loginCallback", params);
          } else {
            beforeBindPhone.call(this);
          }
        }).catch(() => {
          app.SMH.showToast({
            "title": "接口异常"
          })
        })
      }else{
        beforeBindPhone.call(this);
      }
    },
    getPhoneNumber(e) {
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
    return app.CL_RegApi.bindWxPhone({
      data: {
        encryptedData: params.encryptedData,
        iv: params.iv,
        sessionId: app.LM.sessionId,
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
        MobileM.recordBindPhoneInThisCircle();
        this.triggerEvent("loginCallback", params);
        return Promise.resolve(e)
        // return afterBindPhoneSuccess.call(this, params)
        //   .then(couponPopShow => {
        //     !couponPopShow && this.triggerEvent("loginCallback", params);
        //     return Promise.resolve(e)
        //   })
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
  return app.CL_RegApi.changeWxPhone({
    data: {
      encryptedData: params.encryptedData,
      iv: params.iv,
      sessionId: app.LM.sessionId,
      // brandCode: app.Conf.BRAND_CODE,
      // userToken: app.LM.userKey
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

// function afterBindPhoneSuccess(params = {}){
//   let pages = getCurrentPages(), curPage = pages[pages.length - 1];
//   if (curPage.route === "pages/micro_mall/user_info/user_info"){
//     return Promise.resolve(false)
//   }
//   return RCH.checkDisplayCoupons(this, {
//     ...params,
//     afterHideFn: () => {this.triggerEvent("loginCallback", params)}
//   })
// }