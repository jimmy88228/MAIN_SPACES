import SC from "../../../helper/state-controller/index";
import LCC from "../../../helper/lifecycle-controller/index"
function theFrontPart() { // show的前半部分(全局)
  
}

export default (componentOptions) => {
  const {pageLifetimes} = componentOptions;
  return function () { // 这个替换掉页面mehods里面pageLifetimes.hide方法
    LCC.add(next => {
      this.inLifeCycle = "pageHide"; // 标记
      theFrontPart.call(this);
      pageLifetimes && pageLifetimes.hide && pageLifetimes.hide.call(this);
      this.inLifeCycle = "afterPageHide"; // 标记
      SC.checkAndRemoveSub(this);
      next(); // 跟Promise.resolve类似
    })
  }
}