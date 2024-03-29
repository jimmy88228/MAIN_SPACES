// pages/store_pay/pay_result/pay_success.js
import WxApi from '../../../common/helper/wx-api-helper.js'
var app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    pay_info: {},
    page_loaded: false
  },
  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.options = options;
    getPayInfo.call(this).then(res=>{ 
      if (this.data.pay_info.payment_mode == 3 || this.data.pay_info.payment_mode == 4){
        return
      }
      // if (this.data.pay_info.payment_status == 0){
      //   pay.call(this);
      // }
    });
  },
  onShow: function() {
    let brand_info = this.data.brand_info || {};
    let bg_color = app.getColor(brand_info.style.bg_color, 28, 31, 30, 1);
    this.setData({
      bg_color: bg_color
    })
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  /**
   * 
   */
  getIndexPage: function() {
    if (this.data.pay_info.payment_status == 1) {
      wx.redirectTo({
        url: "/pages/store_pay/store_pay_history/history_info?payment_id=" + this.options.payment_id
      })
    }else{
      wx.navigateBack({
        delta:1
      })
    }
  }
}))

function getPayInfo() {
  let payment_id = this.options.payment_id;
  return app.SmktPayApi.getReqPayInfoEntity({
    params: {
      paymentId: payment_id,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") { 
      let pay_info = e.data;
      pay_info.all_amount = (parseFloat(pay_info.order_amount || 0) + parseFloat(pay_info.discount_amount || 0)).toFixed(2);
      pay_info.you_pay_amount = (pay_info.payment_mode == 3 || pay_info.payment_mode == 4) ? pay_info.pending_amount : pay_info.all_amount;
      pay_info.prepaidcard_attach_value = parseFloat(pay_info.prepaidcard_attach_value);
      pay_info.prepaidcard_value = parseFloat(pay_info.prepaidcard_value);
      pay_info.prepaidcard_discount_str = pay_info.prepaidcard_value + pay_info.prepaidcard_attach_value;
      this.setData({
        pay_info: pay_info,
        page_loaded: true
      })
      return Promise.resolve();
    }
    return Promise.reject();
  })
}
 