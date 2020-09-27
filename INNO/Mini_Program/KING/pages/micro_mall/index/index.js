//index.js
import LocationM from "../../../helper/manager/location-manager.js";
const PAGE_TYPE = "CUSTOM_INDEX";
var app = getApp();
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        hasJump: false, // 标识当前打开小程序是否是通过从别的小程序跳转过来的
        index_module_act: "",
        video_url: '',
        showHeader: true,
        showStoresA: false,
        navH: 64,
        pageHidden: true
    },
    videoContext: "",
    onLoad: function(options) {
        if (options.hasJump) {
            this.setData({
                hasJump: true
            });
        }
        this.options = options;
    },
    onReady: function() {
        this.initVideo();
        pagePopInit.call(this);
    },
    onShow: function() {
        //页面显示时，更新组件数据
        this.pageTab = this.pageTab || this.selectComponent("#pageTab");
        this.pageTab.getPageData(this.options);
        if (!this.checked){
          checkStoresForAFn.call(this);
        }
    },
    onHide() {
        unListen.call(this);
    },
    onUnload() {
        unListen.call(this);
        this.pageTab && this.pageTab.onUnloadFn();
    },
    onShareAppMessage: function(res) {
        let tabData = this.pageTab && this.pageTab.getTabData();
        let activityId = this.pageTab && this.pageTab.getActivityId();
        let path = "/pages/micro_mall/index/index?index_page_id="+ tabData.page_id || 0;
        path = activityId ? path + '&activityId='+ activityId : path;
        return {
            shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            title: this.shareConf && this.shareConf.cfg_title || "",
            path: path,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    initVideo() {
        this.videoContext = wx.createVideoContext('play_video');
    },
    videoPlayPage: function(e) {
      console.log('videoPlaypage',e)
        var video_url = e.detail.video_url;
        this.setData({
            video_url: video_url
        });
        this.videoContext.requestFullScreen();
    },
    videoFull: function(e) {
        var fullScreen = e.detail.fullScreen;
        if (fullScreen) {
            this.videoContext.play();
        } else {
            this.videoContext.pause();
        }
    },
    initDataCallBack(e) {
        let detail = e.detail || {};
        console.log("initDataCallBack",detail)
        this.setData({
            pageName: detail.pageName || ""
        })
    },
    pageShareSaving(data){
      this.shareConf = data.detail || {};
    },
    getStoreMsg(){ 
      this.checked = true;
    },
    onPageScroll(e){
      this.pageTab = this.pageTab || this.selectComponent("#pageTab");
      this.pageTab.handle_scroll(e&&e.scrollTop);
    },
	  getPageId(e){
          console.log("getPageId",e);
    //   let detail = e.detail || {};
    //   let page_id = detail.page_id;
    },
    checkAgreetLoginCallback(){
        this.welcome = this.welcome || this.selectComponent("#welcome");
        this.welcome.loadConf();
    },
    getNavH(data){
        let detail = data.detail || {};
        this.setData({
            navH: parseFloat(detail.navH),
            statusH: parseFloat(detail.statusH)
        })
    }
}))

function checkStoresForAFn() {
    let that = this;
    that.storeA = that.storeA || that.selectComponent('#stores_a_id') || {};
    that.storesForAId = app.EB.listen('storesForA', (res) => {
        console.log('千店一面回调', res);
        if (res && res.storesForAOpen == 1) {
            let data = res && res.data || {};
            that.setData({
                showStoresA: true,
                showHeader: false,
            });
            if(!wx.nextTick) return;
            wx.nextTick(() => {
                that.storeA.onShowFn(data);
            });
        } else {
            // console.log('千面未开启或用户未注册');
            this.indexHeader = this.indexHeader || this.selectComponent('#indexHeader');
            this.indexHeader.init();
            this.checked = true;
            that.setData({
                showHeader: true,
                showStoresA: false,
            })
        }
    });
} 

function unListen(){
    app.EB.unListen('storesForA', this.storesForAId);
}

function pagePopInit(){
    this.pagePop = this.pagePop || this.selectComponent('#pagePop') || {};
    this.pagePop.onReadyFnc && this.pagePop.onReadyFnc();
    
    this.pageTab = this.pageTab || this.selectComponent("#pageTab") || {};
    this.pageTab.setAdsPop && this.pageTab.setAdsPop();
}