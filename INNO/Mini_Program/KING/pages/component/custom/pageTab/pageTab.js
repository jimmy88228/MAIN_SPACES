// pages/component/custom/pageTab/pageTab.js
import PH from "../../../../helper/handle/paramsHandle.js";
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
    hideContact:{
      type: Boolean,
      value: false
    },
    setShare:{
      type: Boolean,
      value: true
    },
    isHideShare:{
      type: Boolean,
      value: false  
    },
    top:{
      type: Number,
      value: 0,
      observer(n){
        let searchH = 90;
        let toprpx = parseFloat(app.SIH.getConvert(n,"RPX"));
        this.setData({
          stickyTop: (searchH + toprpx)
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
    cardInfo:{}
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
      this.thisPage = getCurrentPages().pop();
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
      if (app.LM.isLogin) {
        this.setData({
          isLogin: true
        })
        return;
      }
      this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
        this.setData({
          isLogin: app.LM.isLogin
        })
      });
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
    handle_loaded(e){
      // if(!this.clicked)return
      // this.clicked = true;
      // wx.pageScrollTo({
      //   duration: 300,
      //   selector:"#pageTab >>> #stickyBox",
      // })
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
    shareSaving(data) { //custom_module 数据请求完的回调
      let dataValue = data.detail.data || {};
      if(!this.properties.isHideShare){
        shareMsgSaving.call(this, dataValue);
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
        page_id: this.currentId
      }
    },
    setTabStyle() {
      // console.log("setTabStyle", "setTabStyle")
      this.setData({
        assistHoldStyle: "padding-bottom:200rpx"
      })
    },
    nodeInfo(e = {}) {
      if (e.detail && e.detail.moduleId) {
        let _id = e.detail.moduleId;
        throttlingFn.call(this, ()=>{
          // console.log('当前标签', _id);
          this.setData({
            currentNode: _id,
            toView: 'node_' + _id
          });
        }, _id)   
      }
    }, 
    changeNode(e) {
      let moduleId = e.currentTarget.dataset && e.currentTarget.dataset.moduleId || 0;
      // console.log('点击标签', moduleId);
      this[this.current_customName] = this[this.current_customName] || this.selectComponent("#" + this.current_customName);
      this[this.current_customName].gotoView(moduleId);
    },
    reachBottom(e) {  //需要父页面调用原生的 onReachBottom()
      if (!(this._options && this._options.page_id)) return;
      this.current_customName = this.data.isTabPage ? "custom" + this.currentId : 'custom';
      this[this.current_customName] = this[this.current_customName] || this.selectComponent("#" + this.current_customName);
      this[this.current_customName].loadData();
    },
    handle_scroll(top,type="") {  //需要父页面调用原生的 onPageScroll()
      if(type != "lottery"){
        checkBackTop.call(this,top);
      }
      this[this.current_customName].checkTop(top || 0, this.data.nodeShow);  
    }, 
    getActivityId(){
      this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
      let activityId = this.couponAssist.getActivityId();
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
      if(!this.loadedAdsPop){
        this.loadedAdsPop = true;
      }else{
        this.setData({
          adsPop:this.adsPop || {}
        })
      }
    }
  },

  pageLifetimes: {
    hide() {
      if (this.listenLoginStatuId) {
        app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
      }
      if (this.sceneParamsChangeId) {
        app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
      }
    }
  },
  
  
}))

//获取页面tab数据
function getCustomTabRequest(ops = {}) {
  let params = {
    brandCode: app.Conf.BRAND_CODE,
    userToken: app.LM.userToken
  };
  if (ops.pageType == "staffGuide"){
    params.param = 0,
    params.pageType = 4
  } else if (ops.pageType == "cart"){
    params.param = 0,
    params.pageType = 5
  }else if(ops.pageType == "liveCustom"){
    params.param = "直播",
    params.pageType = 2  //根据名称搜索
  }else if (ops.page_id) {
    params.param = ops.page_id,
    params.pageType = 1
  } else {
    params.param = 0,
    params.pageType = 0
  }
  return app.GoodsApi.getCustomPagesList({
    params: params,
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      let that = this;
      if (!data){
        if(ops.pageType == 'lottery'){
          this.setData({
            hidePage:true
          })
        }
        noDataSet.call(this,this._options);
        return;
      };
      if(ops.pageType == 'lottery' && data.is_enable == 0){
        this.setData({
          hidePage:true
        })
      }
      let navList = data.navList || [];
      let isTabPage = false,
        page_id = 0;
      this.isHomePage = data.is_index && this.thisPage.route == "pages/micro_mall/index/index" ? true : false;
      if (navList.length == 0) { //不是tab页面
        page_id = data.page_id
        isTabPage = false;
      } else if (this.reflashId) {
        page_id = this.reflashId;
        isTabPage = true;
      } else {
        page_id = navList[0].pageId;
        isTabPage = true;
      }
      this.adsPop = {
        is_home:this.isHomePage,
        page_id:page_id
      }
      this.currentId = page_id;
      setTitleHandle.call(this, data.page_name)
      initAds.call(this,data||{});
      if(!this.loadedAdsPop){
        this.loadedAdsPop = true;  
      }else{
        this.setData({
          adsPop:this.adsPop || {}
        })
      }
      this.setData({
        navList: navList,
        isTabPage: isTabPage,
        isHomePage: this.isHomePage, 
      })
      this._options.page_id = page_id;
      wx.nextTick(()=>{
        that.current_customName = isTabPage ? "custom" + that.currentId : 'custom';
        that[that.current_customName] = that[that.current_customName] || that.selectComponent("#" + that.current_customName);
        // console.log('当前组件', that.current_customName, that[that.current_customName])
      })
      getItemData.call(this, this._options, isTabPage);
      this.triggerEvent('getPageId', { page_id: this.currentId });
      return Promise.resolve(e);
    }
    //页面数据不存在
    noDataSet.call(this,this._options);
    return Promise.reject(e);
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
  this.couponAssist.getData(this.currentId);

  //
  
}

function setTitleHandle(pageTitle) {
  const pages = getCurrentPages();
  const currentPage = pages.pop() || {};
  if (setTitle[currentPage.route] && pageTitle) {
    //不适合自定义导航
    // wx.setNavigationBarTitle({
    //   title: pageTitle
    // })
    currentPage.setData({
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
    url_value: this.wxPosterImage || '',
    page_id_value: this.currentId || 0
  })
  this.triggerEvent('pageShareSaving', shareConf);
  this.button_share = this.button_share || this.selectComponent('#button_share');
  let timer = setTimeout(() => {
    this.button_share.onShowFn(); //onshow请求
    timer && clearTimeout(timer);
  }, 100)
}


// function throttlingFn() {
//   this.isLoading = true;
//   this.throttlingId = setTimeout(() => {
//     clearTimeout(this.throttlingId);
//     this.isLoading = false;
//   }, 10)
// }

// function setSignStatus(bool=false){  //bool: true为显示签到   false为隐藏签到
//   this.signStatus = bool;
//   this.triggerEvent('signStatusEvent', bool);
// }

function lockFnc(time = 500){
  this.locking = true;
  this._tiemr = setTimeout(()=>{
    this.locking = false;
  },time)
}

function throttlingFn(fn,params){
  clearTimeout(this.throttlingId);
  this.throttlingId = setTimeout(()=>{
    clearTimeout(this.throttlingId);
    fn && typeof (fn) == 'function' && fn(...params); 
  },150); 
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