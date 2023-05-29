import LCC from "../../../helper/lifecycle-controller/index"

function theFrontPart() { // created的前半部分(全局)

}

export default (componentOptions) => {
  const {lifetimes} = componentOptions;
  return function () { // 这个替换掉页面lifetimes里面created方法
    LCC.add(next => {
      this.inLifeCycle = "created"; // 标记
      theFrontPart.call(this);
      lifetimes && lifetimes.created && lifetimes.created.call(this);
      this.inLifeCycle = "afterCreated"; // 标记
      next(); // 跟Promise.resolve类似
    })
  }
}