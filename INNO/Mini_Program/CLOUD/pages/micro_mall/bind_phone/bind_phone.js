var app = getApp();
Page(app.BP({
  data: {
    phone: '',
    phone: '',
    surplusTime: 0,
    vcode: '',
    getIdentifyOcdeText: '获取验证码',
    brand_info:{},
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
  
  onLoad: function (options) {
    this.setData({
      phone: options.mobile
    });
  },

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
  handleComplete(event) {
      // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      let reg = /^[0-9]*$/;
      var mobile = this.data.phone;
      var tip = "";
      if (!mobile) {
          tip = "请输入手机号";
      } else if (mobile.length != 11) {
          tip = "请输入正确的手机号";
      } else if (!reg.test(mobile)) {
          tip = "请输入正确的手机号";
      } else if (reg.test(mobile)) {
          if (this.data.vcode != "") {
              handleCompleteHandle.call(this, this.data.vcode).then(e => {
                  if (e.code == 0) {
                      let toToken = e.data;
                      wx.showModal({
                          title: '合并资产',
                          content: '是否合并资产',
                          success: function (res) {
                              if (res.confirm) {
                                  mergeAssets.call(this, toToken,mobile);
                              } else if (res.cancel) {
                                  wx.navigateBack();
                              }
                          }
                      })
                  } else {
                      app.SMH.showToast({
                          "title": "绑定成功"
                      })
                      goBackHandle.call(this,mobile);
                  }

              })
          } else {
              tip = "请输入验证码";
          }
      }
      if (tip) {
          app.SMH.showToast({
              title: tip,
          })
          return;
      }
  },

  bindKeyInput: function (e) {
    this.setData({
      [e.target.dataset.key]: e.detail.value
    })
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
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var mobile = this.data.phone;
    var tip = "";
    if (!mobile) {
      tip = "请输入手机号";
    } else if (mobile.length != 11) {
      tip = "请输入正确的手机号";
    } else if (!myreg.test(mobile)) {
      tip = "请输入正确的手机号";
    }
    if (tip) {
      app.SMH.showToast({
        title: tip,
      })
      return;
    }
    if (this.data.surplusTime > 0){
      return;
    }
    sendMsg.call(this, mobile);
    // wx.showLoading();
    // var reqData = {
    //   user_name: this.data.phone,
    //   send_surplus_time: app.StorageH.get('send_surplus_time') || 0,
    //   // optype: 5
    //   optype: this.data.phone ? 6 : 5
    // }
    
    // app.wxReq('', 'vcode_getVcode', reqData, (info) => {
    //   if(info.error != 0) {
    //     wx.showModal({
    //       title: '',
    //       content: info.message,
    //     })
    //     return;
    //   }

    //   this.countDown(info.send_surplus_time);
    //   app.StorageH.set('send_surplus_time', info.send_surplus_time)
    //   wx.hideLoading();
    // })
  }
}))

function handleCompleteHandle(vcode){
  let phone = this.data.phone;
  let reqUrl = phone ? 'changeMobile' : 'bindMobile';
  return app.UserApi[reqUrl]({
    data:{
      "mobilePhone": this.data.phone,
      "msgCode": this.data.vcode,
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if (e.code == 1 || e.code == 0){
      return Promise.resolve(e);
    } else {
        if (vcode != "") {
            app.SMH.showToast({
                title: e.msg,
            })
        }
    }
    return Promise.reject();
  })
}
//合并
function mergeAssets(toToken,mobile){
  return app.UserApi.sysTransferUserInfo({
    data:{
      "fromToken": app.LM.userToken,
      "toToken": toToken,
    },
    other:{
      isShowLoad: true
    }
  }).then( e=>{
    if(e.code == 1){
      app.SMH.showToast({
        "title": "合并成功"
      })
      //退出登录
      app.LM.logout();
      let _timer = setTimeout(function(){
        // wx.navigateBack();
        clearTimeout(_timer);
        goBackHandle.call(this, mobile);
      },500)
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
//获取验证码
function sendMsg(mobile) {
  if (!mobile) return;
  return app.UserApi.sendMsg({
    data: {
      "mobileNo": mobile,
      "opType": "5", // 1注册 , 2找回密码 3短信登录 4成为代理人 5 绑定手机 6 修改手机,
      "brandCode": app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      app.SMH.showToast({
        title: "发送成功"
      })
      let count = e.data;
      app.StorageH.set("send_surplus_time", {
        date: new Date(),
        time: count
      });
      this.countDown(count);
      return Promise.resolve(e);
    }
    app.SMH.showToast({
      title: e.msg
    })
    return Promise.reject();
  })
}

function goBackHandle(mobile){
  let pages = getCurrentPages();
  let nextIndex = pages.length > 1 ? pages.length - 2 : 0
  let nextPage = pages[nextIndex];
  nextPage.setData({
    mobile: mobile
  })
  wx.navigateBack()
}
