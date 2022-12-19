var app = getApp();
Page(app.BP({
    data: {

    },
    onLoad(options) {
        this.options = options;
    },
    onShow(){
      this.loadData()
    },
    onReady() {
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
            bg_color: bg_color
        })
    },
    loadData(){
      getBuyBonusOrderPayDetail.call(this)
    },
    copy(){
      wx.setClipboardData({
        data: this.data.order_info.orderSn || this.data.order_info.order_sn || ""
      })
    },
}))

function getBuyBonusOrderPayDetail(){
  return app.ActApi.getBuyBonusOrderPayDetail({
    params: {
      orderId: this.options.order_id || 0,
      brandCode: app.Conf.BRAND_CODE,
    },
    other:{isShowLoad:true}
  }).then(res => {
    if (res.code == 1){
      const data = res.data || {};
      data.bonusNameListArr = data.bonusNameList && data.bonusNameList.split(",") || []
      this.setData({order_info: data || {}})
      return Promise.resolve(data)
    }
    return Promise.reject(res)
  })
}