import {data} from "../default-options/index";
export const getCurrentPageInstance = () => {
  let pages = getCurrentPages() || [],
    curPage = pages[pages.length - 1] || {};
  return curPage
}
export const setPageQueryOnComponent = componentInstance => {
  const curPage = getCurrentPageInstance();
  const pageQuery = curPage.pageQuery || {};
  componentInstance.pageQuery = pageQuery;
  return pageQuery
}
export const setDefaultData = componentInstance => {
  componentInstance && typeof componentInstance.setData === "function" && componentInstance.setData(data);
  return data
}