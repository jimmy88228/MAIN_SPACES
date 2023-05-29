import LCC from "../../../helper/lifecycle-controller/index"
function theFrontPart(appQuery, appOnLaunch, next) { // onLaunch的前半部分(全局)
  console.log("App.onLaunch", appQuery);
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