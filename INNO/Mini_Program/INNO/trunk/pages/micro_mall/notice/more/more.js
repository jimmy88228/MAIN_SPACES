// pages/component/custom/module_branches/notice/more/more.js
const app = getApp();
  
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let noticeText = app.StorageH.get('NOTICE');
    this.setData({
      noticeText
    })
  }, 
  onReady: function () {

  }, 
  onShow: function () {

  }, 
  onHide: function () {

  }, 
  onUnload: function () {
    app.StorageH.remove('NOTICE')
  },
}))