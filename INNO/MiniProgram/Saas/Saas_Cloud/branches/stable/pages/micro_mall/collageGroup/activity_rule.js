// pages/micro_mall/collageGroup/activity_rule.js
var WxParse = require("../../../components/thirdParty/wxParse/wxParse.js");
var app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    act_rule:{}
  },
  activity_id:0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       this.activity_id = options.activity_id;
       getCollageGroupActivityDetail.call(this);
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
  // onShareAppMessage: function () {
  
  // },
  
}))
function getCollageGroupActivityDetail(){
     
     return app.CL_CollageApi.getCollageGroupActivityDetail({
          params: {
               activityId: this.activity_id,
          },
          other: {
               isShowLoad: true
          }
     }).then(e => {
          if (e.code == "1") {
              const data = e.data || {};
               var activity_remark = e.data.activity_remark;
            //    WxParse.wxParse('activity_rule', 'html', activity_remark, this, 5);
            this.setData({
                activity_remark: activity_remark
            })
              
          }
          return Promise.reject(e);
     })
}