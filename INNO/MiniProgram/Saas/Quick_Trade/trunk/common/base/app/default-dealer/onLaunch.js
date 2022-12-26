import {handleAppQuery} from "./helper";
import LCC from "../../../helper/lifecycle-controller/index"
import storeH from "../../../helper/store-helper/index"
import LM from "../../../manager/login-manager/index"
import WxApi from "../../../utils/wxapi/index";
function theFrontPart(appQuery, appOnLaunch, next) { // onLaunch的前半部分(全局)
  console.log("App.onLaunch", appQuery);
  WxApi.showLoading();
  handleAppQuery(appQuery);
  LM.loginAsync()
    .finally(() => LM.checkIfStaff(false))
    .finally(() => LM.checkIfStore(false))
    .finally(() => storeH.changeVisitStore(appQuery.query||{}))
    .finally(() => storeH.getVisitStore(false, appQuery.query || {}))
    .finally(() => {
      appOnLaunch && appOnLaunch.call(this, appQuery);
      WxApi.hideLoading();
      next();
    })
}

export default (appOptions) => {
  const {onLaunch: appOnLaunch} = appOptions;
  return function (appQuery) { // 这个替换掉页面App里面的onLaunch方法
      LCC.add(next => {
        this.inLifeCycle = "onLaunch";
        theFrontPart.call(this, appQuery, appOnLaunch, next);
        this.inLifeCycle = "AfterOnLaunch";
      })
  }
}