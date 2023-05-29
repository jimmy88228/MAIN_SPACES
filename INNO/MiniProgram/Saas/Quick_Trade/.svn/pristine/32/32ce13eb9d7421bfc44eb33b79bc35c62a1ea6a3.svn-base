import {data} from "../default-options/index";
import {tabKeys} from "../../../../config/tabBar";
export const getCurrentPageInstance = () => {
  let pages = getCurrentPages() || [],
    curPage = pages[pages.length - 1] || {};
  return curPage
}
export const setPageQuery = (pageInstance, pageQuery) => { // 给页面实例加上options属性
  pageInstance && (pageInstance.pageQuery = pageQuery);
  return pageQuery
}
export const getPageQuery = pageInstance => {
  return pageInstance && pageInstance.pageQuery || {}
}
export const setDefaultData = pageInstance => {
  pageInstance && typeof pageInstance.setData === "function" && pageInstance.setData(data)
  return data
}
export const setTabBar = pageInstance => {
  let route = pageInstance.route || getCurrentPageInstance().route || "";
  if (route && typeof pageInstance.getTabBar == "function") {
    let tabBarInstance = pageInstance.getTabBar();
    if (tabBarInstance) {
      let tabBarName = tabKeys[route];
      tabBarInstance.selectTabBarByName(tabBarName);
    }
  }
}