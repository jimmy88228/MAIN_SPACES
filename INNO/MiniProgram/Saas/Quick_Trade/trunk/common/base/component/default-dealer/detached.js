import SC from "../../../helper/state-controller/index";
import LCC from "../../../helper/lifecycle-controller/index"
function theFrontPart() { // attached的前半部分(全局)
  
}

export default (componentOptions) => {
  const {lifetimes} = componentOptions;
  return function () { // 这个替换掉mehods里面lifetimes.detached方法
    LCC.add(next => {
      this.inLifeCycle = "detached"; // 标记
      theFrontPart.call(this);
      lifetimes && lifetimes.detached && lifetimes.detached.call(this);
      this.inLifeCycle = "afterDetached"; // 标记
      SC.checkAndRemoveSub(this);
      next(); // 跟Promise.resolve类似
    })
  }
}