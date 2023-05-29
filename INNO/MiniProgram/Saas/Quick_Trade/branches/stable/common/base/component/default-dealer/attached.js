import LCC from "../../../helper/lifecycle-controller/index"

function theFrontPart() { // attached的前半部分(全局)
  
}

export default (componentOptions) => {
  const {lifetimes} = componentOptions;
  return function () { // 这个替换掉mehods里面lifetimess.attached方法
    LCC.add(next => {
      this.inLifeCycle = "attached"; // 标记
      theFrontPart.call(this);
      lifetimes && lifetimes.attached && lifetimes.attached.call(this);
      this.inLifeCycle = "afterAttached"; // 标记
      next(); // 跟Promise.resolve类似
    })
  }
}