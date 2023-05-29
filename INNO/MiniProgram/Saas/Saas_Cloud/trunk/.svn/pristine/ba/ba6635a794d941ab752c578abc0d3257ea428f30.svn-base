// pages/micro_mall/paypal/paypal.js
const app = getApp();
Page(app.BP({
  data: {
  }, 
  onLoad: function (options) {
    this.setData({
      isLogin: app.LM.isLogin
    })
    getUserInfoEvent.call(this);
  },
  onShow(){
    listen.call(this);
  }, 
  onUnload(){
  },
  onHide(){
  },
  onReady: function () {
    this.qy_code = this.selectComponent('#qy_code');
    this.bar_code = this.selectComponent('#bar_code');
    getPayCode.call(this).then(res=>{
      init.call(this,res.data);
    });
  }, 
  refreshCode(e){
    if (this.isLoading)return;
    throttling.call(this);
    refreshPayCode.call(this).then(res=>{
      this.setData({
        qr_pay_code: res.data || ''
      })
      this.qy_code = this.qy_code || this.selectComponent('#qy_code');
      this.bar_code = this.bar_code || this.selectComponent('#bar_code');
      this.qy_code.drawCode(res.data || '');
      this.bar_code.drawCode(res.data || ''); 
    }); 
  },
  jump(e){
    let dataset = e.currentTarget.dataset || {};
    let url = dataset.url || '';
    wx.navigateTo({
      url: url,
    })
  },
}))

function getPayCode(){
  return app.RunApi.go('UserApi','getPayCode',{}).then(res=>{
    console.log('getPayCode',res);
    if(res && res.code=='1'){
      return res
    }
    return Promise.reject(res);
  }).catch(e=>{
    app.SMH.showToast({
      title: e && e.msg || '请求支付码出错'
    })
    return Promise.reject();
  })
}

function refreshPayCode(){
  return app.RunApi.go('UserApi','refreshPayCode',{}).then(res=>{
    console.log('refreshPayCode',res);
    if(res && res.code=='1'){
      return res
    }
    return Promise.reject(res);
  }).catch(e=>{
    app.SMH.showToast({
      title:e && e.msg || '刷新支付码出错'
    })
    return Promise.reject();
  })
}

function init(data=''){
  this.setData({
    qr_pay_code:data ||''
  })
  this.qy_code =  this.qy_code || this.selectComponent('#qy_code');
  this.bar_code = this.bar_code || this.selectComponent('#bar_code');
  this.qy_code.drawCode(data);
  this.bar_code.drawCode(data);
}

function throttling(){
  this.isLoading = true;
  let _timer = setTimeout(()=>{
    this.isLoading = false; 
    clearTimeout(_timer);
  },500)
}


function listen() { 
  this._checkUserLogin().finally(()=>{
    if(app.LM.isLogin){
      getUserInfoEvent.call(this);
    }
  })
}


//获取用户信息
function getUserInfoEvent() {
  return app.UserApi.getUserInfoWap({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let userPoint = data.Points;
      this.setData({
        userData: data,
        userPoint: userPoint,
      });
      return Promise.resolve(data.IsBindMobile);
    }
    return Promise.reject();
  })
}