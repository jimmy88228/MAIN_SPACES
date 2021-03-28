// pages/component/micro-page/micro-mix/micro-page/micro-page.js
import mcBehavior from '../../help/mc-behavior.js'
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
  behaviors: [mcBehavior],
  properties: {
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
    autoShow:{
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
    },
    extraH:{
      type: Number,
      value:-1,
      observer(n,o){
        this.setBoxH(n);
      }
    },
    isCustomNav:{
      type: Boolean,
      value: false
    }
  },
  data: {
    navList: [],
    pageModelList:[],
    swiperCurr: 0,
    tabCurr: 0,
    isTabPage: false,
    noScroll: false,
    sysConf: {},
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
    this.extraTop = 0;
    this.signStatus = true;
    app.sysTemConfig().then(sysConf => {
      this.setData({
        sysConf: sysConf
      })
    })
    checkSalesVolume.call(this);
    this.baseW = (app.SIH.screenWidth / 750);
    this.btnBackTop = this.btnBackTop || this.selectComponent("#btnBackTop");
  },
  ready(){ 
    setTimeout(()=>{
      let query = this.createSelectorQuery();
      let idSel = '#box'
      query.select(idSel).boundingClientRect().exec(
        res=>{
         console.log('resres',res);
         this.extraTop = res && res[0] && res[0].top || 0
        }
      )
    },500)
  },
  methods: {
    setBoxH(n){
      this.windowHeight = parseInt(app.SIH.windowHeight) - n;
      let bottomTabH = this.data.customTab?app.SIH.isIphoneX?app.StringUtl.transPx(158):app.StringUtl.transPx(90):0;
      let extraSumH = n + bottomTabH;
      this.setData({
        boxH:`calc(100vh - ${extraSumH}px)`,
        extraSumH: extraSumH
      })
      // console.log('extraSumH',this.data.extraSumH,n)
    },
    onUnloadFn() {
      this.cur_name && this[this.cur_name].unListen();
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
          'page_id': navList[current].page_id
        };
        this.currentId = navList[current].page_id;
        this.cur_name = "custom" + this.currentId;
        this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
        getItemData.call(this, _options, true);
        this.setData({
          tabCurr: current
        })
        this.triggerEvent('getPageId', {page_id: this.currentId});
        this.timer && clearTimeout(this.timer);
      }, 200)
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
      this.cur_name && this[this.cur_name].unListen();
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
      if (!(this._options && this._options.page_id)) return;
      this.cur_name = "custom" + this.currentId;
      this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
      if(type == 'callEvent'){
        this[this.cur_name].callEvent();
      }else{
        this[this.cur_name].loadData();
      }
    },
    handle_scroll(top,type="") {  //需要父页面调用原生的 onPageScroll()
      if(type != "autoHide"){
        checkBackTop.call(this,top);
      }
      // console.log((top + this.extraTop)||0);
      
      // this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
      // this[this.cur_name].checkTop(top || 0);
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

  pageLifetimes: {
  },
  
  
}))

//获取页面tab数据
function getCustomTabRequest(ops = {}) {
  if (ops.pageType == "getParentPage"){
    this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
    this.currentId = 0;
    getItemData.call(this, this._options, false);
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
      let check = !!e.data;
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
      this.isHomePage = false; // this.isHomePage = this.data.customTab ? true : false;
      if (navList.length == 0) { //不是tab页面
        page_id = data.page_id || ops.page_id || 0;
        navList.push({
          is_enable: true,
          page_id,
        })
      } else if (this.reflashId) {
        console.log('进来this.reflashId',this.reflashId,this);
        page_id = this.reflashId;
        isTabPage = true;
        showNav = true;
        showType = this.data.showType || navInfo.type||"top"
      } else {
        page_id = navList[0].page_id;
        showType = this.data.showType || navInfo.type||"top"
        isTabPage = true;
        showNav = true;
      }
      this.adsPop = {
        is_home:this.isHomePage,
        page_id:page_id
      }
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
        isHomePage: this.isHomePage, 
      })
      if(!checkIsEnable.call(this,data,check)){ //检测页面失效
        return
      };
      // Promise.nextTick().then(()=>{
      //   if(moduleList.length>0){ //nav顶部广告
      //     this.once = this.once || this.selectComponent('#once');
      //     this.once && this.once.getAutoData(moduleList);
      //   }
      // })
      this._options.page_id = page_id;
      getItemData.call(this, this._options, isTabPage);
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
  if(!setBox){
    this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
    this[this.cur_name] && this[this.cur_name].setEmpty();
  }else{
    this.setData({
      hidePage:true
    })
  }
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
  // let page_id = _options.page_id;
  // let lockTime = false;
  // if (isTabPage) {
  //   //锁缓存
  //   // if (this.isHomePage) {
  //   //   this.loadTabData = this.loadTabData || {};
  //   //   let label = "$#" + page_id + "$#";
  //   //   if (!this.loadTabData[label]) {
  //   //     lockTime = false;
  //   //     this.loadTabData[label] = this.loadTabData[label] || true;
  //   //     app.CDateH.setCatchDate('index');
  //   //   } else {
  //   //     if (app.CDateH.checkCatchData("index")) {
  //   //       this.loadTabData = {};
  //   //       this.loadTabData[label] = true;
  //   //       lockTime = false;
  //   //     }
  //   //     lockTime = true
  //   //   }
  //   // } else {
  //   //   //不是主页
  //   //   lockTime = false;
  //   // }
  //   let cur_name = "custom" + page_id;
  //   this.cur_name = cur_name;
  //   this[cur_name] = this[cur_name] || this.selectComponent("#" + this.cur_name);
  //   if (this.oldPageId && this.oldPageId != page_id) {
  //     let oldName = "custom" + this.oldPageId;
  //     this[oldName] && typeof(this[oldName].unListen) == "function" && this[oldName].unListen();
  //   }
  //   this.oldPageId = page_id;
  //   this[cur_name].getCustomData(_options, this.isHomePage, lockTime) 
  // } else {
  //   lockTime = true;
  //   this.custom = this.custom || this.selectComponent("#" + this.cur_name);
  //   this.custom.getCustomData(_options, this.isHomePage, lockTime);
  //   this.cur_name = "custom" + page_id; 
  // }

  loadFrame.call(this,this.currentId);
  this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
  this.couponAssist.getData(this.currentId);
}

function loadFrame(id) { 
  if (this.last_id != id || !this.inited) {
    this.last_id = id;
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
        this.inited = true;
        (ops.pageType == 'getParentPage') && 
        this.setData({
          pageEnable: 1
        })
        let data = res.data || {};
        this.serverTime = data.server_time || '';
        let pageModelList = data.pageModelList || [];
        pageModelList = pageModelList.map(item=>{
          item.setting && (item.setting.moduleId = item.moduleId);
          item.setting && (item.setting.code = item.code);
          return item
        })
        this.setData({
          img_url: data.imgUrl || '',
          pageModelList: pageModelList,
        })
        // setPageData.call(this, pageModelList); //init
        console.log('骨架',this.data.pageModelList)
        // wx.nextTick(() => {
        //   loadData.call(that, false, false); //首次加载数据
        // })
      }
    }).catch(e=>{
      (ops.pageType == 'getParentPage') && 
      this.setData({
        pageEnable: 0
      }) 
    })
  }else {
    // wx.nextTick(() => {
    //   loadData.call(that, true);
    // })
    console.log('重置数据');
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


function checkSalesVolume(){
  return app.sysTemConfig("is_show_goods_sales_volume").then(data=>{
    this.setData({
      showSalesVolume: data.Value == 1 || false
    })
  })
}

function checkIsEnable(data,check){
  if(data.is_enable != 1){
    noDataSet.call(this,!check && !this.data.showNav?true:false);
    return false
  }else if(this.data.hidePage){
    this.setData({
      hidePage:false
    })
  }
  return true
}

