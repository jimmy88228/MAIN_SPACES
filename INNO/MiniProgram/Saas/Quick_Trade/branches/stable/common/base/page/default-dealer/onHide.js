import SC from "../../../helper/state-controller/index";
import { getPageQuery } from "./helper";

function theFrontPart() { // onShow的前半部分(全局)
  // const pageQuery = getPageQuery(this);
}

import LCC from "../../../helper/lifecycle-controller/index"
export default (pageOptions) => {
  const {onHide: pageOnHide} = pageOptions;
  return function () { // 这个替换掉页面Page里面的onShow方法
      LCC.add(next => {
      this.inLifeCycle = "onHide"; // 标记
      theFrontPart.call(this);
      pageOnHide && pageOnHide.call(this);
      this.inLifeCycle = "afterOnHide"; // 标记
      SC.checkAndRemoveSub(this);
      next(); // 跟Promise.resolve类似
    })
  }
}