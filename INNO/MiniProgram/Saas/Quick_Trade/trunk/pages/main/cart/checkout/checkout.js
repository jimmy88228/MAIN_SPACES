import WxApi from "../../../../common/utils/wxapi/index";
const App = getApp();
Page(App.BP({
  handleTakeOrderBtnTap() {
    WxApi.navigateTo({url: "/pages/micro_mall/order/order_info"})
  }
}))