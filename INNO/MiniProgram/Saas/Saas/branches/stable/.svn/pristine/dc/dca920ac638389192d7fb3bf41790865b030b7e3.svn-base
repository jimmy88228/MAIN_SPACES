import WindowBehaviors from "../../../../../../components/ui/cps/window/window-behaviors.js";
import Timer from "../../../../../../common/manager/timer-manager.js";
const app = getApp();
let expireTime = 60;
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    data: {
      boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
      sendSeconds: 0, // 倒计时
      captcha: "", // 验证码
    },
    deatched() {
      if (typeof this.valificateReject === "function") this.valificateReject("用户离开了页面")
    },
    ready() {
      this.valificated = false;
    },
    methods: {
      onAttached() {
        this.setData({
          captcha: "",
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        return 300;
      },
      valificate(needValicate = false) {
        needValicate && (this.valificated = false); 
        return new Promise((rs, rj) => {
          if (this.valificated) rs(); // 验证过了
          else {
            this.valificateResolve = rs; // 将resolve存起来
            this.valificateReject = rj; // 将reject存起来
            this.show(); // 展示弹窗
            if (!this.timerId) setCountDown.call(this);
            this.data.sendSeconds <= 0 && wx.nextTick(() => {this.sendMessage()}); // 如果倒计时结束了，帮用户点击发送验证码
          }
        })
      },
      sendMessage() {
        sendMessageRequest.call(this);
      },
      inputEvent(e){
        let detail = e.detail || {};
        let dataset = e.currentTarget.dataset || {};
        let key = dataset.key;
        let value = detail.value || "";
        if(key){
          this.setData({
            [key]: value
          })
        }
      },
      validate() {
        let validateError = "";
        let captcha = this.data.captcha || "";
        if (!captcha.trim()) validateError = "验证码不能为空"
        return validateError
      },
      confirm() {
        let validateError = this.validate();
        if (validateError) {
          app.SMH.showToast({title: validateError});
          return 
        }
        checkCaptchaRequest.call(this)
          .then((res) => {
            this.dismiss();
            console.log("this.valificateResolve")
            if (typeof this.valificateResolve === "function") {
              wx.nextTick(() => {
                this.valificateResolve();
                this.valificateResolve = null;
                this.valificateReject = null;
              })
            }
          })
      }
    }
  })
)

function setCountDown() {
  this.timerId = Timer.on(() => {
    if(this.data.sendSeconds>0){
      let sendSeconds = this.data.sendSeconds - 1;
      this.setData({
        sendSeconds
      })
    }else{
      clearCountDown.call(this);
    }
  })
}

function clearCountDown() {
  if (this.timerId) {
    Timer.off(this.timerId);
    this.timerId = undefined;
  }
}

function sendMessageRequest() {
  return app.UserApi.sendSmsForValetOrder({
    data: {
      "mobileNo": app.LM.userInfo.mobilePhone || "",
      "userToken": "",
      "staffUserToken": app.LM.userToken || "",
      "brandCode": app.Conf.BRAND_CODE,
      "type": 2, // 参数type：发送类型，0资产确认，1现金支付确认，2改价
    }, 
    other: {
      isShowLoad: true
    }
  })
    .then(res => {
      if (res.code == 1) {
        app.SMH.showToast({title: "验证码已发送"});
        expireTime = res.data || 60;
        this.setData({sendSeconds: expireTime})
        if (!this.timerId) setCountDown.call(this);
        return Promise.resolve()
      }
      return Promise.reject(res.msg || "验证码发送失败")
    })
    .catch(err => {
      console.log("sendMessageRequest error", err);
      app.SMH.showToast({title: err})
      
    })
}

function checkCaptchaRequest() {
  let captcha = this.data.captcha;
  return app.UserApi.checkValetOrderSms({
    data: {
      "mobileNo": app.LM.userInfo.mobilePhone || "",
      "userToken": "",
      "staffUserToken": app.LM.userToken || "",
      "brandCode": app.Conf.BRAND_CODE,
      "msgCode": captcha,
      "type": 2, // 发送类型，0资产确认，1现金支付确认，2改价; 这里只用到2
    },
    other: {
      isShowLoad: true
    }
  })
    .then(res => {
      if (res.code == 1) {
        this.valificated = true;
        return Promise.resolve()
      }
      return Promise.reject(res.msg || "验证失败")
    })
    .catch(err => {
      console.log("checkCaptchaRequest error", err, "captcha = ", captcha);
      app.SMH.showToast({title: err})
      return Promise.reject(err || "验证失败")
    })
}