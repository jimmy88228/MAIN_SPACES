var app = getApp();
Page(app.BP({
  data: {
    phone: '',
    surplusTime: 0,
    vcode: '',
    firstPw:'',
    secondPw:'',
    showFirstPw: false,
    showSecondPw: false,
    getIdentifyOcdeText: '获取验证码',
    brand_info:{},
    simpleInfo:{}
  },
  onShow(){
    let surplusTime = app.StorageH.get("send_surplus_time") || "";
    let surplusDate = new Date(surplusTime.date) || new Date();
    let time = surplusTime.time || 0;
    let secTime = parseInt((new Date().getTime() - surplusDate.getTime()) / 1000);
    if (secTime < time){
      let count = time - secTime;
      this.countDown(count);
    }else{
      app.StorageH.remove("send_surplus_time");
    }
    getUserSimpleInfo.call(this);
  },
  onHide(){
    let surplusTime = this.data.surplusTime || 0;
    if (surplusTime > 0){
      app.StorageH.set("send_surplus_time", {
        date: new Date(),
        time: surplusTime
      });
    }
  },
  
  onLoad: function (options) {},

  onUnload() {
    let surplusTime = this.data.surplusTime || 0;
    if (surplusTime > 0) {
      app.StorageH.set("send_surplus_time", {
        date: new Date(),
        time: surplusTime
      });
    }
  },
  onReady: function () {},
  handleComplete(e) {
      // let myreg = /[a-zA-Z]+(?=\d+)|\d+(?=[a-zA-Z]+)/g;//必须数字密码组合
      // let myreg = /[0-9a-z]/i;//单纯数字，密码
      let myreg = /^[0-9]*$/;
      let phone = this.data.phone;
      let vcode = this.data.vcode;
      let firstPw = this.data.firstPw + "";
      let secondPw = this.data.secondPw + "";
      let tip = "";
      if (!phone) return;
      if (!vcode){
        tip = "验证码为空";
      } else if (firstPw.length < 6 || firstPw.length > 12){
        tip = "新密码长度必须为6-12位";
      } else if (!myreg.test(firstPw)){
        tip = "新密码必须是纯数字组合";
      } else if (firstPw != secondPw) {
        tip = "确认密码输入不正确";
      }
      if (tip){
        app.SMH.showToast({
          title: tip,
        })
        return;
      }
      handleCompleteHandle.call(this);
  },
  //
  bindKeyInput: function (e) {
    this.setData({
      [e.target.dataset.key]: e.detail.value
    })
  },
  //
  pwEyeTouchS(e){
    showPw.call(this, e, true);
  },
  pwEyeTouchE(e) {
    showPw.call(this, e);
  },
  countDown(time) {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setData({
        surplusTime: time,
        getIdentifyOcdeText: '再次发送(' + (time) + 's)'
      });
      time = time - 1;
      if (time < 0) {
        this.setData({
          getIdentifyOcdeText: '再次发送'
        });
        clearInterval(this.timer);
      }
    }, 1000);
  },
  getIdentifyCode: function(e) {
    let mobile = this.data.phone;
    if (this.data.surplusTime > 0 || !mobile){
      return;
    }
    sendMsg.call(this, mobile);
  }
}))
function showPw(e,show){
  let dataset = e.currentTarget.dataset;
  let key = dataset.key || "";
  if (key) {
    this.setData({
      [key]: show || false
    })
  }
}
function handleCompleteHandle(){
  return app.UserApi.changeModifyPwd({
    data:{
      "mobilePhone": this.data.phone,
      "msgCode": this.data.vcode,
      "newPwd":this.data.secondPw,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    let msg = "";
    if(e.code == "1"){
      msg = "修改成功";
      let _timer = setTimeout(function(){
        clearTimeout(_timer);
        wx.navigateBack();
      },500);
    }else{
      msg = e.msg;
    }
    app.SMH.showToast({
      title: msg,
    })
  })
}
//获取验证码
function sendMsg(mobile) {
  if (!mobile) return;
  return app.UserApi.sendMsg({
    data: {
      "mobileNo": mobile,
      "opType": "2", // 1注册 , 2找回密码 3短信登录 4成为代理人 5 绑定手机 6 修改手机,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      app.SMH.showToast({
        title: e.message || "发送成功"
      })
      let count = e.data;
      app.StorageH.set("send_surplus_time", {
        date: new Date(),
        time: count
      });
      this.countDown(count);
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
function getUserSimpleInfo(){
  return app.UserApi.getUserSimpleInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code === "1") {
      let data = e.data;
      this.setData({
        simpleInfo:data,
        phone:data.mobilePhone
      })
      return e.data;
    }
    return Promise.reject(e.msg);
  })
}
