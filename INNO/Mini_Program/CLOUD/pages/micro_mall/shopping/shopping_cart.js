// pages/micro_mall/shopping/shopping_cart.js
var app = getApp();
Page(app.BP({
    data: {
      isEdit: false,
    },
    onLoad() {
      console.log('页面onLoad')
    },
    onShow: function() {
      this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
      this.cartListModule.onShowFnc();
      if (this.onReadyBool){
      } 
    },
    onReady() {
      // this.onReadyBool =true;
      // this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
      // this.cartListModule.onShowFnc();
    },
    onHide: function() {
    },
    onReachBottom(e) {
      return
      this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
      this.cartListModule.onReachBottom(); 
    }
}))