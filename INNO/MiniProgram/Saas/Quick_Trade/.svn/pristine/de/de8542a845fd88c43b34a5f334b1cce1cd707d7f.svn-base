import LCC from "../../../helper/lifecycle-controller/index"
import { getCurrentPageInstance, getPageQuery } from "./helper";

function theFrontPart() { // onShow的前半部分(全局)
  // console.log("page.onShow");
  // const pageQuery = getPageQuery(this);
}

export default (pageOptions) => {
  const {onShow: pageOnShow} = pageOptions;
  return function () { // 这个替换掉页面Page里面的onShow方法
    LCC.add(next => {
      this.inLifeCycle = "onShow"; // 标记
      theFrontPart.call(this);
      pageOnShow && pageOnShow.call(this);
      this.inLifeCycle = "afterOnShow"; // 标记
      next(); // 跟Promise.resolve类似
    })
  }
}