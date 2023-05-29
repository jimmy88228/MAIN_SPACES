import WxGH from "../../../../common/helper/handle/wxGroupHandle.js"
import PH from "../../../../common/helper/handle/paramsHandle.js"
const app = getApp();
Page(app.BP({
  data: {
    isNoGroup:true
  },
  onLoad: function (options) {
    initUrl.call(this);
  },
  onReady: function () {

  },
  onShow: function () {
  },
  onHide: function () {

  },
  onShareAppMessage: function (options) {}
}))
function initUrl(){
  let that = this;
  let conf = app.Conf || {};
  let userInfo = app.StorageH.get("SIMPLE_USER_INFO") || {};
  let uId = userInfo.uId || 0
  let enter_op = wx.getEnterOptionsSync();
  console.log("enter_op", enter_op)
  console.log("shareTicket", enter_op.shareTicket == "<Undefined>")
  console.log("scene", enter_op.scene)
  if (enter_op.shareTicket && enter_op.shareTicket != "<Undefined>" && enter_op.scene == "1044"){
    if (WxGH.isGetGroupId) {
      let url = `${conf.webViewUrl}/mobile/h5_collect.php?user_id=${uId}&brand_id=${conf.brand_id}&group_id=${WxGH.groupId}`
      console.log("收集页面路径同步", url)
      that.setData({
        url: url,
        isNoGroup: true,
        groupId: WxGH.groupId
      })
    } else {
      this.groupMsgChange = app.EB.listen("GroupMsgChange", () => {
        let url = `${conf.webViewUrl}/mobile/h5_collect.php?user_id=${uId}&brand_id=${conf.brand_id}&group_id=${WxGH.groupId}`
        console.log("收集页面路径", url)
        that.setData({
          url: url,
          isNoGroup: true,
          groupId: WxGH.groupId
        })
      });
    }
  }else{
    let url = `${conf.webViewUrl}/mobile/h5_collect.php?group_id=${WxGH.groupId || 0}`
    that.setData({
      url: url
    })
    // this.setData({
    //   isNoGroup: false
    // })
  }
  // console.log("isNoGroup", this.data.isNoGroup);
  
  
}