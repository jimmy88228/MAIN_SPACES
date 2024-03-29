import CDateH from "../../../common/helper/handle/cacheDateHandle.js"
import ShakingHelp from "../../../common/helper/shakingHelp.js"
import FISH from "../../../common/helper/seven-fish-helper"
const PAGE_TYPE = "CUSTOM_INDEX";
var app = getApp();
const SerH = 90;
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        hasJump: false, // 标识当前打开小程序是否是通过从别的小程序跳转过来的
        index_module_act: "",
        video_url: '',
        showHeader: false,
        showStoresA: true,
        navH: app.SIH.navPlace,
        pageHidden: true,
        // extraH: -1
        extraH:parseFloat(app.SIH.navPlace + app.StringUtl.transPx(SerH)) || 0
    },
    videoContext: "",
    initTimes:0,
    onLoad: function(options) {
        if (options.hasJump) {  
            this.setData({
                hasJump: true
            });
        }
        this.options = options;
    },
    init(){
        // this.setData({
        //     extraH:parseFloat(app.SIH.navPlace + app.StringUtl.transPx(SerH)) || 0
        // }) 
        setTimeout(() => {
            const query = wx.createSelectorQuery();
            let that = this; 
            query.select('#box').boundingClientRect(function (res) {
                that.setData({
                    extraH: parseInt(res && res.height) || 0
                })
            }).exec() 
        }, 3500);
    },
    onReady: function() {
        this.onReadyed = true;
        this.init();
        this.firstSnowId = setTimeout(()=>{
            this.firstSnow = true;
            this.shakeStart(true);
        },1000)
        this.initVideo();
        pagePopInit.call(this); 
    },
    onShow: function() {
        this.onShowing = true;
        if(this.onReadyed){
            this.shakeStart(!this.firstSnow);
        }
        if(this.initTimes<2){  //至少清空两次缓存
            this.initTimes += 1;
            CDateH.delCacheDate("index");
        }
        //页面显示时，更新组件数据
        this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        this.mcPage.getPageData(this.options);
        this.storeA = this.storeA || this.selectComponent('#stores_a_id') || {};
        this.storeA.onShowFn();
        // if (!this.checked){
        //   checkStoresForAFn.call(this);
        // }
    },
    onHide() {
        this.onShowing = false;
        unListen.call(this);
        this.shakeEnd();
    },
    onUnload() {
        unListen.call(this);
        this.mcPage && this.mcPage.onUnloadFn();
    },
    onShareAppMessage: function(res) {
        let tabData = this.mcPage && this.mcPage.getTabData();
        let activityId = this.mcPage && this.mcPage.getActivityId();
        let path = "/pages/micro_mall/index/index?index_page_id="+ tabData.page_id || 0;
        path = activityId ? path + '&activityId='+ activityId : path;
        return {
            shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            title: this.shareConf && this.shareConf.cfg_title || "",
            path: path
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
    onReachBottom(){
        this.mcPage.reachBottom('callEvent');
    },
    onPageScroll(e){
      this.mcPage = this.mcPage || this.selectComponent("#mcPage");
      this.mcPage.handle_scroll(e&&e.scrollTop);
    },
    getPageId(e){
        console.log("getPageId",e);
    },
    checkWelComeCallback(){
        this.welcome = this.welcome || this.selectComponent("#welcome");
        this.welcome.loadConf();
    },
    shakeEnd(){
        if(app.Conf.BRAND_CODE == 'GOSO' && false){
            return ShakingHelp.end();
        }
    },
    shakeStart(first) {
        if(app.Conf.BRAND_CODE == 'GOSO' && false){
            console.log('开始监听');
            ShakingHelp.start(first).then(res=>{
                this.shakeEnd();
                this.animStatus(true);
            })
        }
    },
    animStatus(bool){
        this.snow = this.snow||this.selectComponent('#snow');
        if(bool){
            this.snow.start();
        }
    },
    snowStatus(e){
        // console.log('飘雪callback')
        if(!this.onShowing)return
        let type = e.detail||'';
        if(type == 'end'){
            this.shakeStart();
        }
    }
}))

// function checkStoresForAFn() {
//     let that = this;
//     that.storeA = that.storeA || that.selectComponent('#stores_a_id') || {};
//     that.storesForAId = app.EB.listen('storesForA', (res) => {
//         console.log('千店一面回调', res);
//         if (res && res.storesForAOpen == 1) {
//             let data = res && res.data || {};
//             that.setData({
//                 showStoresA: true,
//                 showHeader: false,
//             });
//             if(!wx.nextTick) return;
//             wx.nextTick(() => {
//                 that.storeA.onShowFn(data);
//             });
//         } else {
//             // console.log('千面未开启或用户未注册');
//             this.indexHeader = this.indexHeader || this.selectComponent('#indexHeader');
//             this.indexHeader.init();
//             this.checked = true;
//             that.setData({
//                 showHeader: true,
//                 showStoresA: false,
//             })
//         }
//         wx.nextTick(()=>{
//             setTimeout(()=>{
//                 this.init();
//             },1000)
//         })
//     });
// } 

function unListen(){
    clearTimeout(this.firstSnowId);
    // app.EB.unListen('storesForA', this.storesForAId);
}

function pagePopInit(){
    this.pagePop = this.pagePop || this.selectComponent('#pagePop') || {};
    this.pagePop.onReadyFnc && this.pagePop.onReadyFnc();
    
    // this.mcPage = this.mcPage || this.selectComponent("#mcPage") || {};
    // this.mcPage.setAdsPop && this.mcPage.setAdsPop();
}