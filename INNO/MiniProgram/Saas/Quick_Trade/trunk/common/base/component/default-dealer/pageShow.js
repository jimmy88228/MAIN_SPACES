import LCC from "../../../helper/lifecycle-controller/index"
function theFrontPart() { // show的前半部分(全局)
  
}

export default (componentOptions) => {
  const {pageLifetimes} = componentOptions;
  return function () { // 这个替换掉页面mehods里面pageLifetimes.show方法
    LCC.add(next => {
      this.inLifeCycle = "pageShow"; // 标记
      theFrontPart.call(this);
      pageLifetimes && pageLifetimes.show && pageLifetimes.show.call(this);
      this.inLifeCycle = "afterPageShow"; // 标记
      next(); // 跟Promise.resolve类似
    })
  }
}