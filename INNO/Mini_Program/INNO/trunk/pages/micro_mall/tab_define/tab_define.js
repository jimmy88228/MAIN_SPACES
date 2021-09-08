// pages/micro_mall/tab_define/tab_define.js
var app = getApp();
Page(app.BP({ 
  data: {

  }, 
  onLoad: function (options) {

  }, 
  onReady: function () {
    this.onReadyed = true;
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab.getPageData({pageType:"getParentPage"}); 
  }, 
  onShow: function () {
    // if(this.onReadyed){
    //   this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    //   this.pageTab.getPageData({pageType:"getParentPage"}); 
    // }
  },
  onReachBottom(){
    this.pageTab.reachBottom();
  },
  onPageScroll(e){
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab.handle_scroll(e&&e.scrollTop);
  },
  pageShareSaving(data){
    this.shareConf = data.detail || {};
  },
  onShareAppMessage: function () {
    return {
      title:this.shareConf && this.shareConf.cfg_title || "",
      shareType: app.ShareType.NORMAL, 
    }
  }
}))