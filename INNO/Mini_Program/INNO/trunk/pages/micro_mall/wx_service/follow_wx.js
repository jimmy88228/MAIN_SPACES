// pages/micro_mall/wx_service/follow_wx.js
var app=getApp();
Page({

  data: {
    brand_info: app.globalData.brand_info,
    qrcode_url: '',
    page_bg:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      brand_info: app.globalData.brand_info,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.getBrandInfo(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var brand_info = this.data.brand_info;
    var qrcode_url = brand_info.qrcode_url;
    var is_wx_qrcode = 0;
    if (qrcode_url){
           is_wx_qrcode = 1;
    }
    var reqData = { 'is_wx_qrcode': is_wx_qrcode};
    wx.showLoading();
    app.wxReq('', 'brand_getWxQrcode', reqData, (info) => {
        wx.hideLoading();
        if (info.error != 0) {
              wx.showToast({
                      title: info.message,
                      image: '/images/micro_mall/cn/err_tip_icon.png'
              });
              return;
        }
        let brand_info = app.StorageH.get('brand_info') || {};
        if (info.data) {
              qrcode_url = info.data;
              brand_info.qrcode_url = qrcode_url;
        }
        app.StorageH.set('brand_info', brand_info);
        this.setData({
              brand_info: app.globalData.brand_info,
              qrcode_url: qrcode_url,
              page_bg: info.wx_qrcode_bg
        });
    })
  
  },

  /**
   * 保存图片
  */
  saveImageToPhotos:function(){
    //下载到本地，
    var qrcode_url = this.data.qrcode_url;
    
    wx.downloadFile({
      url: qrcode_url,
      success(down_res){
        var tempFilePath = down_res.tempFilePath;
        const that = this;
        //保存到本地相册
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            try {
              if (wx.getSystemInfoSync().system.split(' ')[0].toLocaleUpperCase() === 'IOS') {
                wx.showToast({
                  title: '图片保存成功',
                  icon:'success'
                });
              }
            } catch (e) {
            }
            
          },
          fail(res){
            wx.showToast({
              "title": '保存失败',
              image: '/images/micro_mall/cn/err_tip_icon.png'
            })
          }
        })
      }
    })
  }
})