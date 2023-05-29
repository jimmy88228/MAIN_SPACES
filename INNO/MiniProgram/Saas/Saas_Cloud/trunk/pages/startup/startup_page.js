import MyStr from "../../common/support/utils/string-util.js"
import StartPageHandle from "../../common/helper/handle/startPageHandle.js"
const app = getApp();
Page(app.BP({
  data: { 
  },
  onLoad: function (options) { 
    this.options = options || {}; 
    console.log('进入中转页',options)
    if (options.scene) {
      pageParamsHandle.call(this);
    }else{
      this.getStore(this.options);
    }
  },
  onReady: function () {
    this.onshowed = true;
  },
  onShow: function () {
    if (this.options.scene && this.onshowed) {
        pageParamsHandle.call(this);
    }
    // else{
    //   this.getStore(this.options);
    // }
  }, 
  getStore(options){
    let _lastRoute = options._lastRoute
    options._lastRoute && delete options._lastRoute;
    let pageParams = createPageParams(options);
    let path = "/" + _lastRoute + "?" + pageParams;
    return app.StoreH.getStoreAsync().finally(()=>{
      StartPageHandle.setReleasePage(true);
      if(app.StoreH.needSelectJump){
        console.log('已经跳转changeStore页面 中转页return');
        app.StoreH.setNeedSelectJump(false);
        return
      }
      console.log('中转页跳目标页',path,_lastRoute)
      _lastRoute && wx.redirectTo({
        url: path,
        fail:(e)=>{
          console.log("中转页跳转目标页失败，原因:", e, path);
          setTimeout(()=>{
            wx.reLaunch({
              url: path,
            })
          },500)
        }
      })
    }) 
  }
}))

function pageParamsHandle() {
  return app.SHP.getParams(["options"]).then((params) => {
    let getParams = params && params.options || false;
    return app.StoreH.getStoreAsync(getParams).finally(()=>{
      console.log('中转页解码scene',params)
      let data = params.options || {};
      let query = data.query || {};
      this.options = {
        ...this.options,
        ...query
      }
      onShowEvent.call(this);
    })
  })
}
function onShowEvent() {
  let options = this.options;
  let that = this;
  StartPageHandle.setReleasePage(true);
  if (options.p_path && options.p_path != app.Conf.STARTUP_PAGE) {
    let pageParams = createPageParams(options);
    let path = "/" + options.p_path + "?" + pageParams;
    if (!checkIsCurrentPage.call(this)) {console.log('页面page return');return};
    if(app.StoreH.needSelectJump){
      console.log('已经跳转changeStore页面 中转页return');
      app.StoreH.setNeedSelectJump(false);
      return
    }
    console.log('中转页跳目标页',path)
    wx.redirectTo({
      url: path,
      fail: function () {
        if (!checkIsCurrentPage.call(that)) {return}
        setTimeout(()=>{ //需要加延迟,不然会出现页面时序错乱（无法解决的bug）
          wx.reLaunch({
            url: path,
          })
        },500)
      }
    })
  }
}
function createPageParams(params) {
  let pageParams = JSON.parse(JSON.stringify(params));
  //剔除页面不需参数
  delete pageParams.scene;
  delete pageParams.p_path;
  delete pageParams.path;
  delete pageParams.opKind;
  delete pageParams.shareType;
  let paramsStr = MyStr.getPageParamsStr(pageParams);
  console.log('剔除页面不需参数',paramsStr)
  return paramsStr;
}
function checkIsCurrentPage() {
  let lastPages = getCurrentPages().pop();
  let thisPages = this;
  console.log('页面checkIsCurrent',thisPages.route == lastPages.route,thisPages.route, ',' ,lastPages.route);
  if (thisPages.route != lastPages.route) {
    return false
  } else {
    return true;
  }
}