import LCC from "../../../helper/lifecycle-controller/index"
import LM from "../../../manager/login-manager/index";
import WxApi from "../../../utils/wxapi/index";
import storeH from "../../../helper/store-helper/index"
function theFrontPart(appOnShow, appQuery, next) { // onShow的前半部分(全局)
  console.log("App.onShow", appQuery);
  WxApi.showLoading();
  LM.loginAsync(false)
  .finally(() => LM.checkIfStaff(false))
  .finally(() => LM.checkIfStore(false))
  .finally(() => storeH.changeVisitStore(appQuery.query||{}))
  .finally(() => storeH.getVisitStore(false, appQuery.query || {}))
  .finally(() => {
    appOnShow && appOnShow.call(this);
    this.inLifeCycle = "afterOnShow";
    WxApi.hideLoading();
    next();
  })
}

export default (appOptions) => {
  const {onShow: appOnShow} = appOptions;
  return function (appQuery) { // 这个替换掉页面App里面的onShow方法
    LCC.add((next) => {
      this.inLifeCycle = "onShow";
      theFrontPart.call(this, appOnShow, appQuery, next);
    })
  }
}