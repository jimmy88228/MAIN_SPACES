import WxApi from "../../../common/utils/wxapi/index";
const App = getApp();
Page(App.BP({
  data: {
    addressInfo: {},
    goodsList: [],
    menuInfo: {},
    orderInfo: {},
    storeInfo: {},
    valetInfo: {},
  },
  onLoad(query) {
    this.pageQuery = query;
  },
  onShow() {
    loadOrderInfo.call(this)
  },
  handleGoodsSnCopyTap() {
    WxApi.setClipboardData({data: this.data.orderInfo.orderSn})
  }
}))

function loadOrderInfo() {
  return getOrderInfo.call(this)
    .then(data => {
      let {
        addressInfo,
        goodsList,
        menuInfo,
        orderInfo,
        storeInfo,
        valetInfo
      } = data;
      this.setData({
        addressInfo,
        goodsList,
        menuInfo,
        orderInfo,
        storeInfo,
        valetInfo
      })
    })
}

function getOrderInfo() {
  let orderId = this.pageQuery.order_id || 0;
  if (!orderId) {
    App.SMH.showToast({
      title: "订单Id不存在"
    });
    return;
  }
  this.showLoading();
  return App.Http.QT_BuyApi.getOrderDetail({
      params: {
        orderId
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res.msg || "获取订单详情失败")
    })
    .catch(err => {
      console.log("getOrderInfo err", err);
      App.SMH.showToast({
        title: err
      });
      return Promise.reject(err)
    })
    .finally(() => {
      this.hideLoading();
    })
}