import LCC from "../../../helper/lifecycle-controller/index"

function theFrontPart() { // onShow的前半部分(全局)
  // console.log("page.onReady");
}

export default (pageOptions) => {
  const {onReady: pageOnReady} = pageOptions;
  return function () { // 这个替换掉页面Page里面的onShow方法
    LCC.add(next => {
      this.inLifeCycle = "onReady"; // 标记
      theFrontPart.call(this);
      pageOnReady && pageOnReady.call(this);
      this.inLifeCycle = "afterOnReady"; // 标记
      next(); // 跟Promise.resolve类似
    })
  }
}