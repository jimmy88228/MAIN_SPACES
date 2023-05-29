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
     
    microType:app.Conf.microType || "pageTab",
    extraH:parseFloat(app.SIH.navPlace + app.StringUtl.transPx(SerH) - 1) || 0,
    hideIndexHeader: false
  },
  options:{},
  onLoad: function (options) {
    this.options = options;
  },
  onReady: function () {
  },
  onShow: function () {
    this.loadPageInitData(this.options);
  },
  onUnload(){
    this.pageTab && this.pageTab.onUnloadFn();
  },
  onShareAppMessage(){
    let tabData = this.pageTab && this.pageTab.getTabData();
    this.options.page_id = this.options.page_id || tabData.page_id || 0;
    
    let activityId = this.pageTab && this.pageTab.getActivityId && this.pageTab.getActivityId() || 0;
    let path = "/pages/micro_mall/custom_page/custom_page?page_id=" + this.options.page_id;
    path = activityId ? path + '&activityId=' + activityId : path;
    path = this.options.hideBackNav ? path + '&hideBackNav=' + this.options.hideBackNav : path;
    path = this.options.hideIndexHeader ? path + '&hideIndexHeader=' + this.options.hideIndexHeader : path;
    return {
      shareType: app.ShareType[this.cur_type ? this.cur_type : PAGE_TYPE] || app.ShareType.NORMAL,
      title: this.shareConf && this.shareConf.cfg_title||"",
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
    var hideIndexHeader = options.hideIndexHeader ? options.hideIndexHeader: false; // 隐藏头部
    var hideBackNav = options.hideBackNav ? options.hideBackNav : false; // 隐藏返回按钮，navigationBar背景为透明

    var reqData = {
      page_id: page_id,
      page_key: page_key,
      isStaff: isStaff,
      phone: phone
    }
    this.setData({
      act_data: reqData,
      hideIndexHeader: hideIndexHeader,
      hideBackNav: hideBackNav
    })
    //页面显示时，更新组件数据
    this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
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
  onReachBottom(){
    this.pageTab.reachBottom();
  },
  onPageScroll(e) {
    this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
    this.pageTab.handle_scroll(e && e.scrollTop);
  },
  onTap(e){
    let detail = e.detail || {};
    let type = detail.type || "";
    if (type == PAGE_TYPE_INVITE){
      this.cur_type = PAGE_TYPE_INVITE;
    }
  },
  checkWelComeCallback(){
      this.welcome = this.welcome || this.selectComponent("#welcome");
      this.welcome.loadConf();
  },
  // getNavH(data){
  //     let detail = data.detail || {};
  //     this.setData({
  //         navH: parseFloat(detail.navH)
  //     })
  // }, 
  refreshExtraH(e){
    let detail = e.detail||0;
    // let navPlace = this.data.hideBackNav ? 0 : app.SIH.navPlace;
    let navPlace = app.SIH.navPlace;
    let extraH = parseFloat(detail + navPlace);
    this.setData({
        extraH: extraH ? extraH - 1 : 0
    })
  }
}))