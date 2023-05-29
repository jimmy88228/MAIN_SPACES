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
    },  
    onPageScroll(e){
      this.cartListModule = this.cartListModule || this.selectComponent('#cartListModule');
      this.cartListModule.handle_scroll(e&&e.scrollTop);
    },
    onReachBottom(e) { 
    }
}))