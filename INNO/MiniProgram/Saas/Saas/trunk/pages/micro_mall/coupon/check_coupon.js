// pages/micro_mall/coupon/check_coupon.js
var app=getApp();
Page({
  data: {
    brand_info: {}
  },
  onReady: function () {},
  checkCoupon:function(){
    wx.redirectTo({
      url:'my_coupon'
    })
  }
})