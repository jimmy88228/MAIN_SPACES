const app = getApp(); 
Page(app.BP({
  data: {
    // 签到记录
    setRecord: [],
    sign_succ: false,
    htmlVal: '',
    _showAnim_op: '',
    pointVal:0,
    prize:[{},{},{},{}],
    calendar:{},
    outsideComponents: { // 该页面的最外层容器的组件对象-解决层级问题用
      agreementPop: {confirmIsGetInfoBtn: true},
      getCouponsPop: {},
      contactStaffGuide: {}
    },
  },
  onLoad() {
  },
  onReady() {
    this.pageHome = this.pageHome || this.selectComponent("#pageHome");
    this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
    this.pageHome && this.pageHome.initPageHome();
    this.loading = false;
    app.LM.loginAsync(true).finally(()=>{
      this.checkLoginChange();
      this.setAdsPop(); 
      this.signMod = this.selectComponent('#signMod');
      this.signMod.onLoadFnc();
      this.signMod.onShowFnc();
    })
  }, 
  customPageId(e){
    let detail = e.detail||{};
    let page_id = detail.page_id||0;
    if(page_id){
      this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
      this.pageTab && this.pageTab.getPageData({
        page_id,
        loadDataType: "bottom"
      });
    }else{
      this.setData({
        hideCustom: true
      })
    }
  },
  onPageScroll(e){
      this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
      this.pageTab && this.pageTab.handle_scroll(e&&e.scrollTop);
  },
  onReachBottom() {
    this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
    this.pageTab.reachBottom();
  }, 
  setAdsPop(){
    this.setData({
      adsPop: {
        isIndex:3,
        page_id:0,
      }
    })
  },
  handle_rule(){
      this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
      this.pageTab && this.pageTab.setPageScroll(true);
  },
  cancel_rule(){
      this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
      this.pageTab && this.pageTab.setPageScroll(false);
  },
  onShareAppMessage(e){
    this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
    let tabData = this.pageTab && this.pageTab.getTabData() || {};
    tabData = tabData.customTabInfo||{};
    console.log('tabData',tabData)
    return {
      isCustom: !!tabData.wx_share_title || false,
      title:tabData.wx_share_title||"",
      imageUrl:tabData.wx_share_image||""
    }
  },
})) 