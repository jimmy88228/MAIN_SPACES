// pages/micro_mall/shopping/shopping_cart.js
var app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
  },
  distance: 0,
  onLoad() {
  },
  onShow: function () {
    this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
    this.cartListModule.onShowFnc(); 
  },
  onReady() {
  },
  onHide: function () {
  }, 
  onPageScroll(e){
    this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
    this.cartListModule.handle_scroll(e&&e.scrollTop);
  },
}))