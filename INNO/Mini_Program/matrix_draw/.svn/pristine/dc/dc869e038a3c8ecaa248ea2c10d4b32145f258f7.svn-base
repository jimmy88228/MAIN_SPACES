// pages/matrix/draw_box/draw_orders/draw_coupons/detail/detail.js
const app = getApp();
Page.BasePage({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = app.StorageH.get('Cur_Coupon_Detail',info);
    this.setData({
      info,
      isAttached: true,
      showRefresh: true,
    }) 
  }, 
  onReady: function () {
    this.setData({ 
      showRefresh: false,
    }) 
  }, 
})