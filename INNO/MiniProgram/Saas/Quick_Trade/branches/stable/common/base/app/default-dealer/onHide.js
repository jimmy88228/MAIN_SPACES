import SC from "../../../helper/state-controller/index";
import LCC from "../../../helper/lifecycle-controller/index"

function theFrontPart() { // onShow的前半部分(全局)
  console.log("app.onHide");
}

export default (appOptions) => {
  const {onHide: appOnHide} = appOptions;
  return function () { // 这个替换掉页面App里面的onShow方法
    LCC.add(next => {
      this.inLifeCycle = "onHide";
      theFrontPart.call(this);
      appOnHide && appOnHide.call(this);
      this.inLifeCycle = "afterOnHide";
      SC.checkAndRemoveSub(this);
      next(); // 跟Promise.resolve类似
    })
  }
}