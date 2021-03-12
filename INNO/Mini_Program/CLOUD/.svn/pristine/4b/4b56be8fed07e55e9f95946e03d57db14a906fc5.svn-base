var app=getApp();
Page({
  data: {
    brand_info: {},
    codeUrl:"",
  },
  onLoad: function (options) {
    this.getCodeInfo();
  },
  onReady: function () {},
  getCodeInfo:function(){
    var that = this;
    app.wxReq("","ucenter_getShareQrcode","",function(info){
      if(info.error != 0 ){
        wx.showToast({
          title: info.msg,
          image: '/images/micro_mall/cn/err_tip_icon.png'
        })
        return;
      }
      that.setData({
        codeUrl: info.qrcode_url
      })
    });
  }
  
})