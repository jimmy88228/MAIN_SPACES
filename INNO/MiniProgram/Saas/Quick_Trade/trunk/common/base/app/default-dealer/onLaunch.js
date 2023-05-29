import LCC from "../../../helper/lifecycle-controller/index"
import CDH from "../../../../common/helper/cache-date-handler/index"
function theFrontPart(appQuery, appOnLaunch, next) { // onLaunch的前半部分(全局)
  console.log("App.onLaunch", appQuery);
  CDH.delCacheDate('checkStore');
  CDH.delCacheDate('checkStaff');
  appOnLaunch && appOnLaunch.call(this);
  this.inLifeCycle = "AfterOnLaunch";
  next();
}

export default (appOptions) => {
  const {onLaunch: appOnLaunch} = appOptions;
  return function (appQuery) { // 这个替换掉页面App里面的onLaunch方法
      LCC.add(next => {
        this.inLifeCycle = "onLaunch";
        theFrontPart.call(this, appQuery, appOnLaunch, next);
      })
  }
}