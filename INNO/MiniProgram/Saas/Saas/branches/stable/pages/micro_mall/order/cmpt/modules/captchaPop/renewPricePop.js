import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors.js";
import Timer from "../../../../../common/manager/timer-manager.js";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {

    },
    data: {
      boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
      sendSeconds: 0, // 倒计时
      captcha: "", // 验证码
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        return 300;
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
      sendMsg() {
        setCountDown.call(this);
        requestSendMessage.call(this);
      },
      activate() {

      },
      confirm() {
        let captcha = this.data.captcha;
        return validateCaptcha(captcha)
          .then(() => {
            
          })
          .catch(err => {
            console.log("")
          })
      },
    }
  })
)

function setCountDown() {
  Timer.on(() => {
    if(this.data.sendSeconds>0){
      sendSeconds = this.data.sendSeconds - 1;
      this.setData({
        sendSeconds
      })
      console.log(sendSeconds)
    }else{
      Timer.offAll();
    }
  })
}

function requestSendMessage() {
  return Promise.resolve({
    code: 1
  })
}