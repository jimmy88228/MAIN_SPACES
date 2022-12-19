import SC from "../../../helper/state-controller/index";
import LCC from "../../../helper/lifecycle-controller/index"
import { getPageQuery } from "./helper";

function theFrontPart() { // onShow的前半部分(全局)
  console.log("page.onUnload");
  const pageQuery = getPageQuery(this);
}

export default (pageOptions) => {
  const {onUnload: pageOnUnload} = pageOptions;
  return function () { // 这个替换掉页面Page里面的onShow方法
    LCC.add(next => {
      this.inLifeCycle = "onUnload"; // 标记
      theFrontPart.call(this);
      pageOnUnload && pageOnUnload.call(this);
      this.inLifeCycle = "afterOnUnload"; // 标记
      SC.checkAndRemoveSub(this);
      next(); // 跟Promise.resolve类似
    })
  }
}