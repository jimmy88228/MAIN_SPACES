const app = getApp();
Page(app.BP({
  onLoad: function (options) {
    this.options = options;
  },
  onShow: function () {
    if(this.onShowed){
      this.order_info && this.order_info._onShow();
    }
  },
  onReady() {
    this.onShowed=true;
    this.order_info = this.order_info || this.selectComponent('#order_info');
    if(this.order_info){
      this.order_info._onLoad(this.options);
      this.order_info._onShow();
      this.order_info._onReady(); 
    }
  },
  onHide: function () {
    this.order_info && this.order_info._onHide();
  },
  onUnload: function () {
    this.order_info && this.order_info._onUnload();
  },
  onPullDownRefresh() {
    this.order_info && this.order_info._onPullDownRefresh();
  },
}))
