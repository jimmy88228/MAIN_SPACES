var app = getApp();
Page(app.BP({
  data: {
    act_data:"",
  },
  options:{},
  onLoad: function (options) {
  //   if(!options.pageType){
  //     options.pageType = "liveCustom";
  //   }
  //  this.options = options;
  },
  onReady: function () {
  },
  onShow: function () {
    wx.redirectTo({
      url:'/pages/micro_mall/live/live_square_new/live_square_new'
    })
  //  this.loadPageInitData(this.options);
  //  this.pageHome = this.pageHome || this.selectComponent("#pageHome")
  //  this.pageHome.initPageHome();
  },
  onUnload(){
    // this.pageTab && this.pageTab.onUnloadFn();
  },
  onShareAppMessage(){
    // let activityId = this.pageTab && this.pageTab.getActivityId() || 0;
    // let path = "/pages/micro_mall/live_custom/live_custom?page_type=liveCustom"
    // path = activityId ? path + '&activityId=' + activityId : path;
    // return {
    //   isCustom: (this.shareConf.cfg_title && this.shareConf.cfg_pic) ? true : false, //是否自定义
    //   title: this.shareConf.cfg_title,
    //   imageUrl: this.shareConf.cfg_pic,
    //   path: path
    // }
  },
  onUnload(){
    // this.pageTab && this.pageTab.onUnloadFn();
  },
  pageShareSaving(data) {
    // this.shareConf = data.detail || {};
  },
  /**
   * 读取数据
  */
  loadPageInitData: function (options) {
    // var page_key = options.page_key ? options.page_key : "";
    // var isStaff = options.isStaff ? options.isStaff: false;
    // var phone = options.phone ? options.phone : '';
    // var reqData = {
    //   page_key: page_key,
    //   isStaff: isStaff,
    //   phone:phone 
    // }
    // this.setData({
    //   act_data: reqData
    // })
    // //页面显示时，更新组件数据
    // this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    // this.pageTab.getPageData(options);
  },
  initDataCallBack(e){
    // let detail = e.detail || {};
    // this.setData({
    //   pageName: detail.pageName || ""
    // })
  },

  onPageScroll(e) {
    // this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    // this.pageTab.handle_scroll(e && e.scrollTop);
  }
}))