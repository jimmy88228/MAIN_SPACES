import { setPageQueryOnComponent, setDefaultData } from "./helper";
import LCC from "../../../helper/lifecycle-controller/index"

function theFrontPart() { // ready的前半部分(全局)
  setPageQueryOnComponent(this); // 给组件设置pageQuery
  setDefaultData(this); // 给组件设置全局data
}

export default (componentOptions) => {
  const {ready: componentReady} = componentOptions;
  return function () { // 这个替换掉页面Component里面的ready方法
    LCC.add(next => {
      this.inLifeCycle = "ready"; // 标记
      theFrontPart.call(this);
      componentReady && componentReady.call(this);
      this.inLifeCycle = "afterReady"; // 标记
      next(); // 跟Promise.resolve类似
    })
  }
}