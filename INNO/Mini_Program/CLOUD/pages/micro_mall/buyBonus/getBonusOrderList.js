// pages/micro_mall/buyBonus/getBonusOrderList.js
var app = getApp();
Page(app.BP({
  data: {
    order_list:[],
  },
  page: 0,
  load_more: false,
  onLoad: function (options) {
    this.getOrderData();
  },
  onReachBottom: function () {
    if (this.load_more) {
      this.getOrderData();
    } else {
      app.SMH.showToast({
        title:"已经到底啦！"
      })
    }
  },
  getOrderData(){
    let that = this;
    this.page = this.page + 1;
    let params = {
      pageIndex: this.page,
      pageSize: app.Conf.PAGE_SIZE
    }
    app.RunApi.go('ActApi','getBuyBonusOrderList',params).then(res=>{
      let data = res.data;
      if (data.length == 0) {
        this.load_more = false;
        if (this.page==1){
          this.setData({
            empty:true
          })
        }
        return
      }
      let order_list = that.data.order_list;
      order_list = order_list.concat(data);
      that.setData({
        order_list: order_list
      });
    }) 
  },
  jump(e){
    let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
    let orderId = dataset.orderId||'';
    if (!orderId)return;
    wx.navigateTo({
      url: '/pages/micro_mall/buyBonus/getBonusOrderDetail?orderId=' + orderId,
    })
  },
}))