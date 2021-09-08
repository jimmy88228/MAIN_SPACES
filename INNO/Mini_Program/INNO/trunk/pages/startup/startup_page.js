import MyStr from "../../common/support/utils/string-util.js"
import StartPageHandle from "../../common/helper/handle/startPageHandle.js"
const app = getApp();
Page(app.BP({
  data: {

  },
  onLoad: function (options) {
    this.options = options || {}; 
    if (options.scene) {
      pageParamsHandle.call(this);
    }
  },
  onReady: function () {
    this.onshowed = true;
  },
  onShow: function () {
    if (this.options.scene && this.onshowed) {
        pageParamsHandle.call(this);
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  }
}))

function pageParamsHandle() {
  app.SHP.getParams(["options"]).then((params) => {
    let data = params.options || {};
    let query = data.query || {};
    this.options = {
      ...this.options,
      ...query
    }
    onShowEvent.call(this);
  })
}
function onShowEvent() {
  let options = this.options;
  let that = this;
  StartPageHandle.setReleasePage(true);
  if (options.p_path && options.p_path != app.Conf.STARTUP_PAGE) {
    let pageParams = createPageParams(options);
    let path = "/" + options.p_path + "?" + pageParams;
    console.log('页面 目标跳转',path);
    if (!checkIsCurrentPage.call(this)) {console.log('页面page return');return};
    console.log('接口开始跳转',path)
    wx.redirectTo({
      url: path,
      success:function(){
        console.log('页面 跳转成功');
      },
      fail: function () {
        if (!checkIsCurrentPage.call(that)) {return}
        console.log('页面 跳转成功');
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