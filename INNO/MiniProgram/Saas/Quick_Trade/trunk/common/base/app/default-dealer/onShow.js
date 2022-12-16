import LCC from "../../../helper/lifecycle-controller/index"
import LM from "../../../manager/login-manager/index";
function theFrontPart(appOnShow, next) { // onShow的前半部分(全局)
  console.log("App.onShow");
  LM.loginAsync(false)
    .finally(() => {
      appOnShow && appOnShow.call(this);
      this.inLifeCycle = "afterOnShow";
      next();
    })
}

export default (appOptions) => {
  const {onShow: appOnShow} = appOptions;
  return function () { // 这个替换掉页面App里面的onShow方法
    LCC.add((next) => {
      this.inLifeCycle = "onShow";
      theFrontPart.call(this, appOnShow, next);
    })
  }
}