import { setDefaultData, setPageQuery, setTabBar} from "./helper";
import LCC from "../../../helper/lifecycle-controller/index"

function theFrontPart(pageQuery) { // onLoad的前半部分(全局)
  console.log("page.onLoad");
  setDefaultData(this); // 给页面设置全局data
  setPageQuery(this, pageQuery); // 给页面实例加上一个pageQuery属性, 是在onLoad拿到的
}

export default (pageOptions) => {
  const {onLoad: pageOnLoad} = pageOptions;
  return function (pageQuery) { // 这个替换掉页面Page里面的onLoad方法
    LCC.add(next => {
      this.inLifeCycle = "onLoad"; // 标记
      theFrontPart.call(this, pageQuery);
      pageOnLoad && pageOnLoad.call(this, pageQuery);
      this.inLifeCycle = "afterOnLoad"; // 标记
      next(); // 跟Promise.resolve类似
    })
    setTabBar(this); // 给tabBar设置隐藏和选中
  }
}