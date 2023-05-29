Page({
  data: { 
  },
  onLoad: function (options) {
    this.act_bonus = this.act_bonus || this.selectComponent('#act_bonus');
    this.act_bonus.onLoadFnc('order', this.options.orderId || '');
  },
})