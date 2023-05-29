import WxApi from "../../utils/wxapi/index";
export default {
  onLoad(){
    WxApi.showModal({
      title: "温馨提示",
      content: "页面不见了",
      showCancel: false,
      confirmText: "回到首页",
      complete() {
        WxApi.reLaunch({
          url: "/pages/main/index/index.js"
        })
      }
    })
  }
}