// pages/micro_mall/tab_define/tab_define.js
var app = getApp();
Page(app.BP({ 
  data: {

  }, 
  onLoad: function (options) {

  }, 
  onReady: function () {
    this.onReadyed = true;
    this.mcPage = this.mcPage || this.selectComponent("#mcPage");
    this.mcPage.getPageData({pageType:"getParentPage"}); 
  }, 
  onShow: function () {
    // if(this.onReadyed){
    //   this.mcPage = this.mcPage || this.selectComponent("#mcPage");
    //   this.mcPage.getPageData({pageType:"getParentPage"}); 
    // }
  },
  onReachBottom(){
    this.mcPage.reachBottom('callEvent');
  },
  onPageScroll(e){
    this.mcPage = this.mcPage || this.selectComponent("#mcPage");
    this.mcPage.handle_scroll(e&&e.scrollTop);
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