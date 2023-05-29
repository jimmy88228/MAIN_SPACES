// components/custom/pageTab/pageTab.js
import PH from "../../../common/helper/handle/paramsHandle.js";
import WxApi from "../../../common/helper/wx-api-helper.js";
import {LogMap} from '../../../common/manager/log-map'
const app = getApp();
const Tab_H = 74;
const SearchTop = 90;
const setTitle = {
  ["pages/micro_mall/index/index"]: true,
  ["pages/micro_mall/custom_page/custom_page"]: true,
  ["pages/micro_mall/guide_point/guide_point"]: true,
  ["pages/micro_mall/live_custom/live_custom"]: true,
}
Component(app.BTAB({
  properties: {
    actData: {
      type: Object,
      value: {}
    },
    type:{
      type: String,
      value: 'page'
    },
    customTab:{
      type: Boolean,
      value: false
    }, 
    setShare:{
      type: Boolean,
      value: true
    }, 
    autoShow:{
      type: Boolean,
      value: false  
    },
    top:{
      type: Number,
      value: 0,
      observer(n){
        this.setData({
          stickyTop: n||0
        })
      }
    },
    isHideShare:{
      type: Boolean,
      value: false  
    },
    isHideGoTop:{
      type: Boolean,
      value: false  
    },
    isHidePageHome:{
      type: Boolean,
      value: false
    },
    hideContact:{
      type: Boolean,
      value: false
    },
    isHideCouponAssist:{
      type: Boolean,
      value: false
    },
    isHideCouponAssistPop: {
      type: Boolean,
      value: false
    },
    isHideAdsPop:{
      type: Boolean,
      value: false  
    },
    isHideAllBtn:{
      type: Boolean,
      value: false,
      observer:function(n){
        n && this.setData({
          hideContact:true,
          isHideShare:true,
          isHideGoTop:true,
          isHideCouponAssist:true,
          isHideAdsPop:true
        })
      }
    }
  },
  data: {
    navList: [],
    swiperCurr: 0,
    tabCurr: 0,
    isTabPage: false,
    noScroll: false,
    sysConf: {},
    cur_view:"",
    cardInfo:{},
    navImg: {}
  },
  observers:{
    tabCurr(nV, oV){ 
      let index = nV || 0;
      let navImg = this.data.navImg;
      console.log("233", nV,"----", navImg,navImg[index]);
      if(navImg[index] && navImg[index].scale == 1){
        console.log("i 进来", index)
        for(let i in navImg){
          console.log("i", i, "-------", index == i)
          if(i == index){
            navImg[i].scale = 1.5;
          } else {
            navImg[i].scale = 1;
          }
        }
        // console.log("233", nV,"----", JSON.parse(JSON.stringify(navImg)));
        this.setData({
          navImg: navImg
        })
      }
    }
  },
  _options: {},
  attached() {
    this.current_customName = '';
    this.signStatus = true;
    app.sysTemConfig().then(sysConf => {
      this.setData({
        sysConf: sysConf
      })
    })
    checkSalesVolume.call(this);
    this.baseW = (app.SIH.screenWidth / 750);
    this.windowHeight = parseInt(app.SIH.windowHeight) - (this.baseW * SearchTop) - (this.baseW * Tab_H);
    this.btnBackTop = this.btnBackTop || this.selectComponent("#btnBackTop")
  }, 
  methods: {
    onUnloadFn() {
      this.current_customName && this[this.current_customName].unListen();
    },
    getPageData(options) {
      this.options = JSON.parse(JSON.stringify(options));
      this._options = JSON.parse(JSON.stringify(options));
      if (this._options.scene) {
        analysisParams.call(this);
      } else {
        console.log("不是扫码进入的");
        getCustomTabRequest.call(this, this._options);
      }
      //页面按钮配置
      // if(options.moduleConf){
      //   // moduleConf.hideContact  隐藏客服
      //   // this.setData({
      //   //   moduleConf: options.moduleConf
      //   // })
      // }
      //
      if(this.data.isLogin)return
      return app.LM.loginAsync(false).then(res=>{
        this.setData({
          isLogin: !!app.LM.isLogin
        })
      })
    },
    loadImage(e){
      console.log("导航图", e);
      let dataset = e.currentTarget.dataset || {}
      let detail = e.detail || {};
      let navIndex = dataset.navIndex;
      if(dataset.type == "nav"){
        let key = `navImg.${navIndex}`;
        this.setData({
          [key]: {
            w: detail.width,
            h: detail.height,
            scale : navIndex == this.data.tabCurr ? 1.5 : 1 
            // scale : navIndex == 0 ? 1.5 : 1 
          }
        })
        console.log("navImg数据", this.data.navImg);
      }
    },
    changeSwiper(e) { //点击
      let dataset = e.currentTarget.dataset || {};
      let tabCurr = this.data.tabCurr;
      if (tabCurr == dataset.index) {
        return
      }
      let cur_view = 'tab' + dataset.index;
      this.clicked = true;
      this.timer && clearTimeout(this.timer);
      let _timer = setTimeout(() => {
        this.setData({
          // swiperCurr: dataset.index,
          tabCurr: dataset.index,
          cur_view,
        })
        this.swiperChangeHandle();
        _timer && clearTimeout(_timer);
      }, 150)
    }, 
    swiperChangeHandle(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let current = this.data.tabCurr;
        let navList = this.data.navList || []; 
        let _options = {
          'page_id': navList[current].pageId
        };
        this.currentId = navList[current].pageId;
        this.current_customName = "custom" + this.currentId;
        this[this.current_customName] = this[this.current_customName] || this.selectComponent("#" + this.current_customName);
        // console.log('当前组件', this[this.current_customName])
        getItemData.call(this, _options, true);
        this.setData({
          tabCurr: current
        })
        this.triggerEvent('getPageId', {page_id: this.currentId});
        this.timer && clearTimeout(this.timer);
      }, 200)
    },
    videoPlay(e) {
      let video_url = e.detail.video_url || "";
      this.triggerEvent('videoPlayPage', {
        video_url: video_url
      });
    },
    shareSaving(e) { //custom_module 数据请求完的回调
      let detail = e.detail||{};
      console.log('shareSaving',detail.data)
      if(!this.properties.isHideShare){
        shareMsgSaving.call(this, detail.data||{});
      }
    },
    handleReflash(e) {
      this.reflashId = e.detail || 0;
    },
    onUnloadFn() {
      this.current_customName && this[this.current_customName].unListen();
    },
    setPageScroll(noScroll) { //到底
      this.setData({
        noScroll: noScroll ? true : false
      })
    },
    getTabData() {
      return {
        page_id: this.currentId,
        customTabInfo:this.data.customTabInfo
      }
    },
    setTabStyle() {
      this.setData({
        assistHoldStyle: "padding-bottom:200rpx"
      })
    },
    changeNode(e) {
      let moduleId = e.currentTarget.dataset && e.currentTarget.dataset.moduleId || 0;
      // console.log('点击标签', moduleId);
      this[this.current_customName] = this[this.current_customName] || this.selectComponent("#" + this.current_customName);
      this[this.current_customName].gotoView(moduleId);
    },
    reachBottom(type) {  //需要父页面调用原生的 onReachBottom()
      if (!(this._options && this._options.page_id)) return;
      this.current_customName = this.data.isTabPage ? "custom" + this.currentId : 'custom';
      this[this.current_customName] = this[this.current_customName] || this.selectComponent("#" + this.current_customName);
      this[this.current_customName].reachBottom(type);
    },
    handle_scroll(top,type="") {  //需要父页面调用原生的 onPageScroll()
      if(type != "autoHide" && !this.data.isHideGoTop){
        checkBackTop.call(this,top);
      }
      this.current_customName && this[this.current_customName].checkTop(top || 0, this.data.nodeShow);  
    }, 
    getActivityId(){
      this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
      let activityId = this.couponAssist && this.couponAssist.getActivityId();
      return activityId || 0;
    },
    backTopTap(){
      wx.pageScrollTo({
        scrollTop:0,
        duration:500,
      })
    },
    _noFn() { },
    setAdsPop(){
      console.log('ads--ready',this.loadedAdsPop,this.adsPop);
      this.setData({
        adsPop: this.adsPop || {}
      })
    },
    setAutoShow(){
      this[this.current_customName].setAutoShow();
    }
  },

  pageLifetimes: {
    show() {
      this.pageHome = this.pageHome || this.selectComponent("#pageHome")
      this.pageHome && !this.properties.isHidePageHome && this.pageHome.initPageHome();
    },
    hide() {
      console.log('hidehide pageTab')
      if (this.sceneParamsChangeId) {
        app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
      }
    }
  },
  
  
}))

//获取页面tab数据
function getCustomTabRequest(ops = {}) {
  if (ops.pageType == "getParentPage"){
    this.currentId = 0;
    this.current_customName = 'custom';
    this[this.current_customName] = this[this.current_customName] || this.selectComponent("#" + this.current_customName);
    getItemData.call(this, this._options, false);
    return
  }
  let apiPack = {
    api:"GoodsApi",
    url:"getCustomPagesList",
  }
  let params = {
    brandCode: app.Conf.BRAND_CODE,
    userToken: app.LM.userToken
  };
  if (ops.pageType == "staffGuide"){
    params.param = 0,
    params.pageType = 4
  }else if (ops.pageType == "cart"){
    params.param = 0,
    params.pageType = 5
  }else if(ops.pageType == "liveCustom"){
    params.param = "直播",
    params.pageType = 2  //根据名称搜索
  }else if(ops.pageType == 'exchangeExplain') {
    params.param = 0,
    params.pageType = 6
  } else if (ops.page_id) {
    params.param = ops.page_id,
    params.pageType = 1
  } else {
    params.param = 0,
    params.pageType = 0
  }
  return app[apiPack.api][apiPack.url]({
    params: params,
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      let that = this;
      if (!data){
        if(ops.pageType == 'autoHide'){
          this.setData({
            hidePage:true
          })
        }
        noDataSet.call(this,this._options);
        return Promise.reject();
      };
      if(ops.pageType == 'autoHide' && data.is_enable == 0){
        this.setData({
          hidePage:true
        })
      }
      setTitleHandle.call(this, data.page_name);
      let navList = data.navList || [];
      let isTabPage = false,
        page_id = 0;
      this.isHomePage = data.is_index && LogMap[this.currentPage.route] == "INDEX" ? true : false;
      if (navList.length == 0) { //不是tab页面
        page_id = data.page_id
        isTabPage = false;
      } else if (this.reflashId) {
        page_id = this.reflashId;
        isTabPage = true;
      } else {
        let cur = 0;
        if(ops.navIndex && !this.currentId){
          cur = ops.navIndex - 1; 
          cur = navList[cur] && navList[cur].pageId && cur || 0;
          this.setData({
            tabCurr: cur,
            cur_view: "tab" + cur,
          })
        }
        if(!this.checkOverSize){ //文字导航栏的样式适应
          this.checkOverSize = true;
          for(let i = 0,len=navList.length;i<len;i++){
            navList[i].navName && navList[i].navName.length>6 && (this.setData({overSizeBool:true}))
          }
        }
        page_id = navList[cur].pageId;
        isTabPage = true;
      }
      this.adsPop = {
        isIndex:LogMap[this.currentPage.route] == "INDEX" ? 1 : 0,
        page_id: data.page_id //page_id
      }
      this.currentId = page_id;
      initAds.call(this,data||{});
      this.setAdsPop();
      this.setData({
        imgUrl: data.imgUrl,
        navList: navList,
        isTabPage: isTabPage,
        isHomePage: this.isHomePage, 
        customTabInfo:data
      })
      this._options.page_id = page_id;
      wx.nextTick(()=>{
        that.current_customName = isTabPage ? "custom" + that.currentId : 'custom';
        that[that.current_customName] = that[that.current_customName] || that.selectComponent("#" + that.current_customName);
        // console.log('当前组件', that.current_customName, that[that.current_customName])
      })
      getItemData.call(this, this._options, isTabPage);
      this.triggerEvent('getPageId', { page_id: this.currentId });
      // this.shareSaving(data);
      return Promise.resolve(e);
    }
    //页面数据不存在
    noDataSet.call(this,this._options);
    return Promise.reject(e);
  })
  .catch(err => {
    console.log("获取自定义页信息失败", err);
    checkIfNeedBackHome();
    return Promise.reject(err)
  })
}
function noDataSet(ops = {}){
  this.custom = this.custom || this.selectComponent("#custom");
  ops.NoSet = true;
  this.custom.getCustomData(ops, this.isHomePage, null, 0);
}
//扫码进入
function analysisParams() {
  let paramsJson = app.PH.paramsJson();
  app.SHP.getParams(["page_id", "staff_code", "staffCode"]).then((params) => {
    let ops = {
      ...this._options,
      ...params
    }
    this._options = JSON.parse(JSON.stringify(ops))
    getCustomTabRequest.call(this, ops);
  })
}

//获取页面数据
function getItemData(_options, isTabPage) {
  let page_id = _options.page_id;

  let lockTime = false;
  if (isTabPage) {
    //锁缓存
    if (this.isHomePage) {
      this.loadTabData = this.loadTabData || {};
      let label = "$#" + page_id + "$#";
      if (!this.loadTabData[label]) {
        lockTime = false;
        this.loadTabData[label] = this.loadTabData[label] || true;
        app.CDateH.setCatchDate('index');
      } else {
        if (app.CDateH.checkCatchData("index")) {
          this.loadTabData = {};
          this.loadTabData[label] = true;
          lockTime = false;
        }
        lockTime = true
      }
    } else {
      //不是主页
      lockTime = false;
    }
    let customName = "custom" + page_id;
    this.current_customName = customName;
    this[customName] = this[customName] || this.selectComponent("#" + customName);
    if (this.oldPageId && this.oldPageId != page_id) {
      let oldName = "custom" + this.oldPageId;
      this[oldName] && typeof(this[oldName].unListen) == "function" && this[oldName].unListen();
    }
    this.oldPageId = page_id;
    this[customName].getCustomData(_options, this.isHomePage, lockTime, this.baseW * Tab_H)
  } else {
    lockTime = true;
    this.custom = this.custom || this.selectComponent("#custom");
    this.custom.getCustomData(_options, this.isHomePage, lockTime, 0);
    this.current_customName = "custom";
  }
  //
  this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
  this.couponAssist && this.couponAssist.getData(this.currentId);

  //
  
}

function setTitleHandle(pageTitle) {
  this.currentPage = getCurrentPages().pop() || {};
  if (setTitle[this.currentPage.route] && pageTitle) {
    this.currentPage.setData({
      pageTitle: pageTitle
    })
    this.setData({
      "cardInfo.title": pageTitle
    })
  }
}


function shareMsgSaving(data) {
  let shareConf = {
    cfg_title: data.page_name
  };
  console.log('datadata',data)
  if (data.wx_share_title && data.wx_share_image) {
    shareConf = {
      cfg_title: data.wx_share_title,
      cfg_pic: data.wx_share_image,
      cfg_type: "custom_page"
    }
    let allShareConfig = PH.paramsJson().shareConfig || {};
    allShareConfig["custom_page"] = shareConf;
    console.log(shareConf)
    PH.saveParams({
      "shareConfig": allShareConfig
    });
  }
  this.wxPosterImage = data.wx_poster_image;
  this.setData({
    url_value: this.wxPosterImage || '', //海报背景
    page_id_value: this.currentId || 0   //当前微页面page_id
  })
  this.triggerEvent('pageShareSaving', shareConf);
  this.button_share = this.button_share || this.selectComponent('#button_share');
  let timer = setTimeout(() => {
    this.button_share && this.button_share.onShowFn(); //onshow请求
    timer && clearTimeout(timer);
  }, 100)
}

function checkBackTop(top=0){
  if (top >= this.windowHeight){
    if (!this.showBackTop){
      this.showBackTop = true;
      this.btnBackTop.setShow(true);
    }
  }else{
    if (this.showBackTop) {
      this.showBackTop = false;
      this.btnBackTop.setShow(false);
    }
  }
}

function initAds(data={}){
  if(!data.moduleList || data.moduleList.length<=0)return
  this.adsId = this.adsId || this.selectComponent('#adsId');
  this.adsId.getPageData({
    ImgDomain: data.imgUrl,
    ModuleList: data.moduleList || []
  });
  let minH = app.SIH.windowHeight - (SearchTop * this.baseW) - (Tab_H * this.baseW); 
  this.setData({
    hasAdsData:true,
    minH
  });

}

function checkSalesVolume(){
  return app.sysTemConfig("is_show_goods_sales_volume").then(data=>{
    this.setData({
      showSalesVolume: data.Value == 1 || false
    })
  })
}

function checkIfNeedBackHome(){
  let pages = getCurrentPages(), page = pages[pages.length - 1] || {};
  if (page.route != "pages/micro_mall/index/index" && page.options && page.options.fromModule === "COUPON"){ // 从优惠券列表页面跳转过来的，如果报错了，要帮用户跳转回首页
    let timer1 = setTimeout(() => {
      WxApi.switchTab({url: "/pages/micro_mall/index/index"})
        .then(() => {
          let timer2 = setTimeout(() => {app.SMH.showToast({title: "暂无跳转路径", duration: 3000}); clearTimeout(timer2)}, 500)
        });
      clearTimeout(timer1)
    }, 1000)
  }
}