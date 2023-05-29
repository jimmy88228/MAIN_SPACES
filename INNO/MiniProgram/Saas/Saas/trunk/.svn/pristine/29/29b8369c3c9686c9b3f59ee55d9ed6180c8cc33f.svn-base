// pages/micro_mall/shopping/shopping_cart.js
var app = getApp();
Page(app.BP({
    data: {
      isEdit: false,
    },
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
    onPageScroll(e){
      this.cartListModule = this.cartListModule || this.selectComponent("#cartListModule");
      this.cartListModule && this.cartListModule.onPageScroll && this.cartListModule.onPageScroll(e);
    },
    onReachBottom(){
        this.cartListModule = this.cartListModule || this.selectComponent("#cartListModule");
        this.cartListModule && this.cartListModule.onReachBottom();
    },
}))