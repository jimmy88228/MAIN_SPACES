// pages/micro_mall/QRcode/my_code.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand_info: {},
    codeUrl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCodeInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.getBrandInfo(this);
  },
  /**
   * 二维码信息
  */
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