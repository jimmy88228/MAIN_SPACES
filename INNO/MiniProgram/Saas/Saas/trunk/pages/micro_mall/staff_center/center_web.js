// pages/micro_mall/staff_center/center_web.js
const app = getApp();
Page(app.BP({
  data: {
    webSrc:"",
  },
  onLoad: function (options) {
    let brand_info = this.data.brand_info;
    let webViewUrl = brand_info.webViewUrl || "";
    console.log(webViewUrl + "/mobile/v2/#/staffwap/kingStaff/index?token=" + app.LM.userToken + "&t102=" + new Date().getTime() + "&brand_code=" + app.Conf.BRAND_CODE);
    this.setData({
      webSrc: webViewUrl + "/mobile/v2/#/staffwap/kingStaff/index?token="+app.LM.userToken+"&t102="+new Date().getTime()+"&brand_code="+app.Conf.BRAND_CODE
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))