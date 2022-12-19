import {handleAppQuery} from "./helper";
import LCC from "../../../helper/lifecycle-controller/index"
function theFrontPart(appQuery) { // onLaunch的前半部分(全局)
  console.log("App.onLaunch");
  handleAppQuery(appQuery);
}

export default (appOptions) => {
  const {onLaunch: appOnLaunch} = appOptions;
  return function (appQuery) { // 这个替换掉页面App里面的onLaunch方法
      LCC.add(next => {
        this.inLifeCycle = "onLaunch";
        theFrontPart.call(this, appQuery);
        appOnLaunch && appOnLaunch.call(this, appQuery);
        this.inLifeCycle = "AfterOnLaunch";
        next(); // 跟Promise.resolve类似
      })
  }
}