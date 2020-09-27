// pages/micro_mall/shopping/shopping_cart.js
var app = getApp();
Page(app.BP({

    data: {},
    distance: 0,
    //
    edit_index: 0,
    onLoad() {
    },
    onShow: function() {
      if (this.onReadyBool){
        this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
        this.cartListModule.onShowFnc();
      } 
    },
    onReady() {
      this.onReadyBool =true;
      this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
      this.cartListModule.onShowFnc();
    },
    onHide: function() {
    },
    onReachBottom(e) {
      this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
      this.cartListModule.onReachBottom(); 
    },
}))