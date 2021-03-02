var app = getApp();
Page(app.BP({
  data: {
    act_data:"",
  },
  options:{},
  onLoad: function (options) {
    this.options = options;
  },
  onReady: function () {
  },
  onShow: function () {
    this.loadPageInitData(this.options);
    this.pageHome = this.pageHome || this.selectComponent("#pageHome")
    this.pageHome.initPageHome();
  },
  onUnload(){
    this.pageTab && this.pageTab.onUnloadFn();
  },
  onShareAppMessage(){
    let tabData = this.pageTab && this.pageTab.getTabData();
    this.options.page_id = this.options.page_id || tabData.page_id || 0;
    let activityId = this.pageTab && this.pageTab.getActivityId() || 0;
    let path = "/pages/micro_mall/custom_page/custom_page?page_id=" + this.options.page_id;
    path = activityId ? path + '&activityId=' + activityId : path;
    return {
      title: this.shareConf.cfg_title,
      path: path
    }
  },
  onUnload(){
    this.pageTab && this.pageTab.onUnloadFn();
  },
  pageShareSaving(data) {
    this.shareConf = data.detail || {};
  },
  /**
   * 读取数据
  */
  loadPageInitData: function (options) {
    var that = this;
    var page_id = options.page_id ? options.page_id : 0;
    var page_key = options.page_key ? options.page_key : "";
    var isStaff = options.isStaff ? options.isStaff: false;
    var phone = options.phone ? options.phone : '';
    var reqData = {
      page_id: page_id,
      page_key: page_key,
      isStaff: isStaff,
      phone:phone 
    }
    this.setData({
      act_data: reqData
    })
    //页面显示时，更新组件数据
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab.getPageData(options);
  },
  initDataCallBack(e){
    let detail = e.detail || {};
    this.setData({
      pageName: detail.pageName || ""
    })
  },
  /**
   * 初始化视频
  */
  videoPlay: function (e) {
    var video_url = e.detail.video_url;
    this.setData({
      video_url: video_url
    });
    this.videoContext.requestFullScreen();
  },
  // videoFull: function (e) {
  //   var fullScreen = e.detail.fullScreen;
  //   if (fullScreen) {
  //     this.videoContext.play();
  //   } else {
  //     this.videoContext.pause();
  //   }
  // },

  onPageScroll(e) {
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab.handle_scroll(e && e.scrollTop);
  }
  
  // onReachBottom(e) {
  //   console.log('触底');
  //   this.pageTab = this.pageTab || this.selectComponent("#pageTab");
  //   this.pageTab.reachBottom();
  // },
}))