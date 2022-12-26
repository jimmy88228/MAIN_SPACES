
import Timer from "../../../../../../common/manager/timer-manager/index";
const App = getApp();
Component(
  App.BC({
    properties: {

    },
    smsTime: 0,
    data: {
      boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
      phoneSms:'',
      sendSeconds:0,
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
        saveTimeEvent.call(this, false);
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        setDownTime.call(this, false);
        saveTimeEvent.call(this,true);
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
      initSms(valetInfo, nextSendSeconds, type=0){
        this.valetInfo = valetInfo || {};
        this.type = type||0;
        let sendSeconds = this.data.sendSeconds || nextSendSeconds;
        if (this.data.sendSeconds != sendSeconds){
          this.setData({
            sendSeconds: nextSendSeconds || 0
          })
        }
        setDownTime.call(this,true);
        this.show();
      },
      sendSMSClick(){
        sendSMS.call(this);
      },
      checkOrderSms() {
        checkOrderSms.call(this);
      },
    }
  })
)
function sendSMS() {
  let valetInfo = this.valetInfo || {};
  console.log("valetInfo", valetInfo)
  if (!valetInfo.mobilePhone || !valetInfo.userToken) return;
  let data = {
    "mobileNo": valetInfo.mobilePhone,
    "staffUserToken": App.LM.userKey,
    brandCode: App.Conf.BRAND_CODE,
    userToken: valetInfo.userToken || "",
    "type":this.type||0
  }
  if(this.type == 1){
    let user_info = app.StorageH.get("USER_INFOS") || {};
    data.mobileNo = user_info.mobilePhone || valetInfo.mobilePhone || 0;  
  }
  return App.UserApi.sendSmsForValetOrder({
    data, 
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      this.setData({
        sendSeconds: res.data || 0
      })
      App.SMH.showToast({
        title: "发送成功"
      })
      if(res.data > 0){
        setDownTime.call(this,true);
      }
    }
  })
}
function checkOrderSms() {
  let valetInfo = this.valetInfo || {};
  let staffUserToken = App.LM.userKey || "";
  let phoneSms = this.data.phoneSms;
  if (!valetInfo.mobilePhone || !valetInfo.userToken || !staffUserToken) return;
  if (!phoneSms){
    App.SMH.showToast({
      title: "请输入验证码"
    })
    return;
  }
  let params = {
    "mobileNo": valetInfo.mobilePhone,
    "userToken": valetInfo.userToken,
    "staffUserToken": staffUserToken,
    "brandCode": App.Conf.BRAND_CODE,
    "msgCode": phoneSms,
    "type":this.type||0
  }; 
  if(this.type == 1){
    let user_info = app.StorageH.get("USER_INFOS") || {};
    params.mobileNo = user_info.mobilePhone || valetInfo.mobilePhone || 0;  
  }
  // return App.UserApi.checkValetOrderSms({
  //   data: {
  //     "mobileNo": valetInfo.mobilePhone,
  //     "staffUserToken": staffUserToken,
  //     "msgCode": phoneSms,
  //     brandCode: App.Conf.BRAND_CODE,
  //     userToken: App.LM.userKey
  //   }, other: {
  //     isShowLoad: true
  //   }
  // })
  return App.UserApi.checkValetOrderSms({
    data: params, 
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      //成功后初始化数据
      this.setData({
        sendSeconds: 0
      })
      this.saveTime = {};
      this.dismiss();
      setTimeout(()=>{
        App.SMH.showToast({
          title: "授权成功"
        })
      },500)
      this.triggerEvent("checkValetOrder", {
        isCheck: true,
        type:this.type||0
      },{
        bubbles:true,
        composed:true
      });
    }else{
      App.SMH.showToast({
        title: res.msg
      })
    }
  })
}
function setDownTime(isAction){
  let sendSeconds = this.data.sendSeconds;
  if (sendSeconds == 0 && Timer.isRunning){
    Timer.offAll();
    return;
  }
  if (isAction){
    if (!Timer.isRunning && sendSeconds > 0) {
      let that = this;
      Timer.on(function(){
        if(that.data.sendSeconds>0){
        sendSeconds = that.data.sendSeconds - 1;
        that.setData({
          sendSeconds
        })
        }else{
          Timer.offAll();
        }
      })
    }
  }else{
    Timer.offAll();
  }
}
function saveTimeEvent(isSave){
  let sendSeconds = this.data.sendSeconds || 0;
  if (isSave){
    if (sendSeconds) {
     this.saveTime = {
        dateTime: new Date().getTime(),
        time: sendSeconds
      }
    }
  }else{
    let saveTime = this.saveTime || {};
    let dateTime = saveTime.dateTime || new Date().getTime();
    let nowTime = new Date().getTime();
    let time = saveTime.time || 0;
    let secTime = parseInt((nowTime - dateTime) / 1000);
    if (secTime < time) {
      let count = time - secTime || 0;
      this.setData({
        sendSeconds: count
      })
      setDownTime.call(this,true);
    } else {
      this.saveTime = {};
    }
  }
}