// pages/component/micro-page/micro-mix/micro-page/micro-page.js
import mcBehavior from '../../help/mc-behavior.js'
const app = getApp();
const setTitle = {
  ["pages/micro_mall/index/index"]: true,
  ["pages/micro_mall/custom_page/custom_page"]: true,
  ["pages/micro_mall/guide_point/guide_point"]: true,
  ["pages/micro_mall/live_custom/live_custom"]: true,
}
Component(app.BTAB({ 
  behaviors: [mcBehavior],
  properties: {
    extraH:{
      type: Number,
      value:-1
    }, 
    assistBmH:{
      type: String,
      value: ""
    },
    customTab:{
      type: Boolean,
      value: false
    },
    isCustomNav:{
      type: Boolean,
      value: false
    },
    isHideShare:{
      type: Boolean,
      value: false  
    },
    isHideAssist:{
      type:Boolean,
      value:false
    }
  },
  data: {
    navList: [],
    tabCurr: 0,
    isTabPage: false,
    noScroll: false,
    cur_view:"",
    cardInfo:{},
    showNav:false,
    boxH:"",
    initNavH:'80rpx',
    screenWidth:app.SIH.screenWidth,
  },

  _options: {},
  attached() {
    this.cur_name = '';
    this.screenHeight = app.SIH.screenHeight || 0;
    checkSalesVolume.call(this);
    this.baseW = (app.SIH.screenWidth / 750);
  },
  ready(){  
    this.btnBackTop = this.btnBackTop || this.selectComponent("#btnBackTop");
  },
  methods: {
    onUnloadFn() {
      // this.cur_name && this[this.cur_name].unListen();
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
      this.checkLogin();
    },
    checkLogin(){
      if(this.data.isLogin)return
      return app.LM.loginAsync(false).then(res=>{
        this.setData({
          isLogin: !!res
        })
      })
    },
    changeSwiper(e) { //点击
      let dataset = e.currentTarget.dataset || {};
      let tabCurr = this.data.tabCurr;
      if (tabCurr == dataset.index) {
        return
      }
      let cur_view = 'tab' + dataset.index; 
      this.timer && clearTimeout(this.timer);
      let _timer = setTimeout(() => {
        this.setData({
          tabCurr: dataset.index,
          cur_view,
        })
        this.swiperChangeHandle();
        _timer && clearTimeout(_timer);
      }, 150)
    },
    swiperChangeHandle(e) { //控制swiper变化
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let current = this.data.tabCurr;
        let navList = this.data.navList || []; 
        let _options = {
          'page_id': navList[current].page_id
        };
        this.currentId = navList[current].page_id;
        this.cur_name = "custom" + this.currentId;
        this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
        this.setData({
          tabCurr: current
        })
        getItemData.call(this, _options);
        this.triggerEvent('getPageId', {page_id: this.currentId});
        this.timer && clearTimeout(this.timer);
      }, 200)
    },
    setPageScroll(noScroll) {
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
      this.setData({
        assistHoldStyle: "padding-bottom:200rpx"
      })
    },
    reachBottom(type) {  //需要父页面调用原生的 onReachBottom()
      // console.log('触底',type)
    },
    handle_scroll(top,type="") {  //需要父页面调用原生的 onPageScroll()
      if(type != "autoHide"){
        checkBackTop.call(this,top);
      }
      this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
      let _top = parseInt((top + (this.screenHeight||0)));
      this[this.cur_name].scroll(_top);
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
    setAdsPop(){
      if(!this.loadedAdsPop){
        this.loadedAdsPop = true;
      }else{
        this.setData({
          adsPop:this.adsPop || {}
        })
      }
    },
    setAutoShow(){
      this[this.cur_name] && this[this.cur_name].setAutoShow();
    }, 
  },
}))

//获取页面tab数据
function getCustomTabRequest(ops = {}) {
  if (ops.pageType == "getParentPage"){
    this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
    this.currentId = 0;
    getItemData.call(this, this._options);
    return
  }
  let apiPack = {
    api:"CL_GoodsApi",
    url:"getCustomPagesInfo",
  }
  let params = {};
  if (ops.pageType == "staffGuoncee"){
    params.param = 0,
    params.pageType = 4
  }
  else if (ops.pageType == "cart"){
    params.param = 0,
    params.pageType = 5
  }else if(ops.pageType == "liveCustom"){
    params.param = "直播",
    params.pageType = 2  //根据名称搜索
  }else if(ops.pageType == 'catelog'){//分类
    params.param = "catelog",
    params.pageType = 3  
  }else if (ops.page_id) {
    params.param = ops.page_id,
    params.pageType = 1
  } else {
    params.param = 0,
    params.pageType = 0
  }
  return app[apiPack.api][apiPack.url]({
    params: params,
  }).then(e => {
    if (e.code == 1) {
      let data = e.data || {}; 
      let navInfoBox = data.navInfo || {};
      let navInfo = navInfoBox.navInfo || {};
      let moduleList = navInfoBox.moduleList || [];
      let navList = navInfo.pageList || [];
      let _data = {
        backgroundColor:data.backgroundColor,
        backgroundImage:data.backgroundImage,
        backgroundPosition:data.backgroundPosition,
      }
      let isTabPage = false,page_id = 0,showNav = false,showType = "top";
      if (navList.length == 0) { //不是tab页面
        page_id = data.page_id || ops.page_id || 0;
        navList.push({
          is_enable: true,
          page_id,
        })
      } else {
        page_id = navList[0].page_id;
        showType = this.data.showType || navInfo.type||"top"
        isTabPage = true;
        showNav = true;
      }
      let compareId = data.page_id || ops.page_id || page_id;
      if(this.frameInited && this.initPageId && this.initPageId == compareId){
        console.log('getCustomPagesInfo 同一个page_id:',compareId,this.initPageId)
        return
      }else{
        console.log('getCustomPagesInfo 新page_id:',compareId,this.initPageId)
      }
      navList.forEach(item=>{
        item.pageModelList = [];
      })
      this.adsPop = {
        is_home:this.data.customTab,
        page_id:page_id
      }
      this.initPageId = data.page_id || ops.page_id || page_id; //赋值page_id
      this.currentId = page_id; //赋值page_id
      this.cur_name = "custom" + this.currentId;
      this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name); 
      setTitleHandle.call(this, data.page_name)
      this.setData({
        navList,
        _data,
        showType,
        showNav,
        moduleList,
        isTabPage: isTabPage,
        isHomePageConf: this.data.customTab, 
      })
      this._options.page_id = page_id;
      getItemData.call(this, this._options);
      this.triggerEvent('getPageId', { page_id: this.currentId });
      return Promise.resolve(e);
    }
    if(this.data.navList.length<=0){ //数据异常
      noDataSet.call(this,true);
    }
    return Promise.reject(e);
  })
}
function noDataSet(setBox=false){
  this.setData({
    hidePage:true
  })
}
//扫码进入
function analysisParams() {
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
function getItemData(_options) {
  loadFrame.call(this,this.currentId);
  this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
  this.couponAssist.getData(this.currentId);
}

function loadFrame(id) {
  this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
  let check = this[this.cur_name].reset(this.currentId);
  if (check) {
    let params = {
      pageId: id || 0,
    },apiPack = {
      api:"CL_GoodsApi",
      url:"getCustomPageDataScript",
      extra:{diy:true}
    },ops = this.options||{}; 
    if(ops.pageType == 'getParentPage'){
      params={ brandCode: app.Conf.BRAND_CODE };
      apiPack.url = "getParentPageDataScript";
    }
    return app.RunApi.go(apiPack.api, apiPack.url, params,apiPack.extra).then(res => {
      if (res.code == 1) {
        this.frameInited = true;
        (ops.pageType == 'getParentPage') && 
        this.setData({
          pageEnable: 1
        })
        let data = res.data || {};
        this.serverTime = data.server_time || '';
        let pageModelList = data.pageModelList || [];
        let navList = this.data.navList || [],cur = this.data.tabCurr;
        this.setData({
          // img_url: data.imgUrl || '',
          [`navList[${cur}]`]:{
            ...navList[cur],
            pageModelList
          }
        })
        shareMsgSaving.call(this,data)
        console.log('骨架',this.currentId,cur,this.data.navList)
      }
    }).catch(e=>{
      (ops.pageType == 'getParentPage') && 
      this.setData({
        pageEnable: 0
      })
    })
  }
} 

function setTitleHandle(pageTitle) {
  const currentPage = getCurrentPages().pop() || {};
  if (setTitle[currentPage.route] && pageTitle) {
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
    let allShareConfig = app.PH.paramsJson().shareConfig || {};
    allShareConfig["custom_page"] = shareConf;
    app.PH.saveParams({
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

function checkBackTop(top=0){ 
  this.btnBackTop = this.btnBackTop || this.selectComponent("#btnBackTop");
  if (top >= (this.screenHeight * 0.5)){
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

function checkSalesVolume(){
  return app.sysTemConfig("is_show_goods_sales_volume").then(data=>{
    this.setData({
      showSalesVolume: data.Value == 1 || false
    })
  })
}