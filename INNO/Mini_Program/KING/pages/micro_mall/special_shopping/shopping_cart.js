// pages/micro_mall/shopping/shopping_cart.js
var app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {},
  distance: 0,
  //
  edit_index: 0,
  onLoad() {
  },
  onShow: function () {
    this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
    this.cartListModule.onShowFnc(); 
  },
  onReady() {
  },
  onHide: function () {
  }
}))