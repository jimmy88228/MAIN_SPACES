import utils from "../../../../common/utils/normal/index";
const App = getApp();
Component(App.BC({
  properties: {
    customData:{//自定义属性
      type:Object,
      value:{},
    },
    tapInterval: { // 点击限流间隔时间
      type: Number,
      value: 0
    },
    disabled: { // 是否不可用
      type: Boolean,
      value: false
    }
  },
  data: {
    
  },
  ready() {
    if (wx.getUserProfile) this.setData({isCanUrPf: true});
  },
  methods: {
    handleTap(e, ) {
      let tapInterval = this.properties.tapInterval;
      if (tapInterval) {
        this.throttleFunction = this.throttleFunction || utils.throttle_2((event) => {
          this.handleUserInfo(event)
        }, tapInterval);
        this.throttleFunction(e);
      } else {
        this.handleUserInfo(e);
      }
    },
    handleUserInfo(e) {
      this.triggerEvent("clickFront");
      let detail = e.detail || {};
      if (detail.errMsg && detail.errMsg.indexOf("fail auth deny") != -1) {
        return;
      }
      if (App.LM.isLogin === 1) { //已经登录
        this.clickHandle()
      } else { //注册流程
        checkIsLogin.call(this)
          .then(() => this.clickHandle())
      }
    },
    //按钮点击回调
    clickHandle(data = {}) {
      //初始化页面登录状态
      let page = getCurrentPages().slice(-1)[0];
      let isLogin = App.LM.isLogin;
      if(page.data.isLogin != isLogin) page.setData({isLogin});
      let callBackData = {
        ...data,
        ...this.properties.customData,
        isLogin,
      }
      console.log("登录回调，执行点击事件", callBackData);
      this.triggerEvent("clickcallback", callBackData);
    },
    blankF() {}
  }
}))

function checkIsLogin() {
  console.log('进来 按钮点击 开始getUserTokenAsync'); 
  if(this.checkLogining) return Promise.reject();
  this.checkLogining = true;
  return App.LM.getUserTokenAsync(true).then(data => {
    // cache
    if (data.userToken) return Promise.resolve(data);
    return Promise.reject();
  }).finally(()=>{
    this.checkLogining = false;
  })
}