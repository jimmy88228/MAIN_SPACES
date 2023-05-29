// components/pop/adsPop.js
import WxApi from "../../common/helper/wx-api-helper";
import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    confirmUseBtns: { // 确认按钮是登录按钮<btns>组件
      type: Boolean,
      value: false
    },
    confirmIsGetInfoBtn: { // 确定按钮是带获取信息<button>组件
      type: Boolean,
      value: false
    }
  },
  data: {
    agreeData: {}
  },
  ready(){
    if (wx.getUserProfile) {
      this.setData({
        isCanUrPf: true
      })
    }
  },
  pageLifetimes: {
    show() {
      if (this.temporaryLeave){
        this.show();
        this.temporaryLeave = false
      }
    },
    hide() {

    }
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: `opacity:1;transform: translate(-50%,  ${this.hideTabBar(true)? '50rpx' : '50rpx'});transition: all 300ms ease-in-out;`
      });
    },
    onDetached() {
      this.hideTabBar(false);
      this.setData({
        boxStyle: "opacity:0;transform: translate(-50%, 100%);transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    initData(data = {}){
      return loadData.call(this, data)
    },
    handleUserConfirm(e) {
      if (typeof this._confirm === "function" && this._confirm(e)) {
        this.hideFn(true);
        this._confirm = null;
      }
    },
    handleUserDeny() {
      if (typeof this._cancel === "function" && this._cancel()) {
        this.hideFn();
        this._cancel = null;
      }
    },
    hideFn(confirm = false){
      this.dismiss();
      typeof this._afterDismiss === "function" && wx.nextTick(() => {
        this._afterDismiss({confirm});
        this._afterDismiss = null;
      });
    },
    goJump(e){
      const {url} = e.currentTarget.dataset;
      WxApi.navigateTo({url})
        .then(() => {
          this.temporaryLeave = true;
          this.dismiss()
        })
    },
    _noFn() {},
  }
}))

function loadData({type, autoShow = true, confirm, cancel, afterDismiss}){
  try {
    return checkUserAgreement.call(this, type)
    .then(() => getUserAgreement(type))
    .then(data => {
      typeof confirm === "function" && (this._confirm = confirm);
      typeof cancel === "function" && (this._cancel = cancel);
      typeof afterDismiss === "function" && (this._afterDismiss = afterDismiss);
      return new Promise(resolve => {
        this.setData({agreeData: data});
        if (autoShow) {
          this.show()
          return resolve(true)
        } else return resolve(false)
      })
    })
    .catch(err => {
      console.log("没有拉起会员协议弹窗: ", err)
      return Promise.resolve(false)
    })
  } catch (error) {
    console.log("会员协议弹窗报错", error);
    return Promise.resolve(false)
  }
}

function getUserAgreement(type) {
  return app.UserApi.getUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: type, // USER:会员，RETURN:退换货
    }, other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1 && res.data && res.data.article_title && res.data.article_content) { // 这里谨慎点
      return Promise.resolve(res.data || {})
    }
    return Promise.reject(res)
  })
}

function checkUserAgreement(type) {
  console.log(type)
  if (type != "USER" && type != "RETURN") return Promise.resolve()
  return app.UserApi.checkIsUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: type // USER:会员，RETURN:退换货
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1 && res.data) {
      console.log("开启了会员注册协议", res)
      return Promise.resolve(res.data);
    }
    return Promise.reject("获取协议配置res: ", res)
  }).catch(err => {
    console.log("获取协议配置err:", err);
    return Promise.reject(err)
  })
}