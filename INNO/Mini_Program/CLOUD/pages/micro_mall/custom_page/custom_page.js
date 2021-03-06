var app = getApp();
const PAGE_TYPE = "CUSTOM_PAGE";
const PAGE_TYPE_INVITE = "STAFF_INVITE";
const SerH = 90;
Page(app.BP({
  data: {
    brand_info: app.globalData.brand_info,
    act_data:"",
    navH: app.SIH.navPlace,
    pageHidden: true,
    extraH:-1,
    showHeader: false,
    showStoresA: true,
  },
  options:{},
  onLoad: function (options) {
    this.options = options;
  },
  onReady: function () {
    this.init();
    this.initVideo();
  },
  onShow: function () {
    this.loadPageInitData(this.options);
    this.pageHome = this.pageHome || this.selectComponent("#pageHome")
    this.pageHome.initPageHome();
  },
  init(){
    this.setData({
        extraH:parseFloat(app.SIH.navPlace + app.StringUtl.transPx(SerH)) || 0
    })
  },
  onUnload(){
    this.mcPage && this.mcPage.onUnloadFn();
  },
  onShareAppMessage(){
    let tabData = this.mcPage && this.mcPage.getTabData();
    this.options.page_id = this.options.page_id || tabData.page_id || 0;
    let activityId = this.mcPage && this.mcPage.getActivityId() || 0;
    let path = "/pages/micro_mall/custom_page/custom_page?page_id=" + this.options.page_id;
    path = activityId ? path + '&activityId=' + activityId : path;
    return {
      shareType: app.ShareType[this.cur_type ? this.cur_type : PAGE_TYPE] || app.ShareType.NORMAL,
      title: this.shareConf && this.shareConf.cfg_title||"",
      path: path
    }
  },
  onUnload(){
    this.mcPage && this.mcPage.onUnloadFn();
  },
  pageShareSaving(data) {
    this.shareConf = data.detail || {};
  },
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
    this.mcPage = this.mcPage || this.selectComponent("#mcPage");
    this.mcPage.getPageData(options);
    this.storeA = this.storeA || this.selectComponent('#stores_a_id') || {};
    this.storeA.onShowFn();
  },
  initDataCallBack(e){
    let detail = e.detail || {};
    this.setData({
      pageName: detail.pageName || ""
    })
  },
  initVideo() {
    this.videoContext = wx.createVideoContext('play_video');
  },
  videoPlay: function (e) {
    var video_url = e.detail.video_url;
    this.setData({
      video_url: video_url
    });
    this.videoContext.requestFullScreen();
  },
  videoFull: function (e) {
    var fullScreen = e.detail.fullScreen;
    if (fullScreen) {
      this.videoContext.play();
    } else {
      this.videoContext.pause();
    }
  }, 
  onReachBottom(){
    this.mcPage.reachBottom('callEvent');
  },
  onPageScroll(e) {
    this.mcPage = this.mcPage || this.selectComponent("#mcPage");
    this.mcPage.handle_scroll(e && e.scrollTop);
  },
  onTap(e){
    let detail = e.detail || {};
    let type = detail.type || "";
    if (type == PAGE_TYPE_INVITE){
      this.cur_type = PAGE_TYPE_INVITE;
    }
  },
  checkAgreetLoginCallback(){
      this.welcome = this.welcome || this.selectComponent("#welcome");
      this.welcome.loadConf();
  },
  getNavH(data){
      let detail = data.detail || {};
      this.setData({
          navH: parseFloat(detail.navH)
      })
  }
}))