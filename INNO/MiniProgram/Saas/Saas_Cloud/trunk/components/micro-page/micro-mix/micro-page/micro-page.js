// components/micro-page/micro-mix/micro-page/micro-page.js
import mcBehavior from '../../help/mc-behavior.js'
import {LogMap} from '../../../../common/manager/log-map'
import WxApi from '../../../../common/helper/wx-api-helper.js';
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
    extraH:{ //用于导航栏菜单定位
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
    },
    isHideAdsPop: {
      type:Boolean,
      value:false
    },
    isHideAllFixedBtn:{
      type:Boolean,
      value:false
    },
    isHideContact:{
      type:Boolean,
      value:false
    },
    isHideAllBtn:{ // 隐藏 以上各组件
      type: Boolean,
      value: false,
      observer:function(n){
        n && this.setData({
          isHideAssist: true,
          isHideAdsPop: true,
          isHideContact: true,
          isHideShare: true,
          isHidePageHome: true,
          isHideAllFixedBtn:true
        })
      }
    },
    autoShow:{
      type:Boolean,
      value:false
    },
    isHidePageHome:{
      type: Boolean,
      value: false
    },
    nodataDirectlyHide: { // 如果没有内容，是否直接隐藏
      type: Boolean,
      value: false
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
    // initNavH:'80rpx',
    screenWidth:app.SIH.screenWidth,
    navImg: {}
  },

  observers: {
    tabCurr(nV){ 
      let index = nV || 0;
      let navImg = this.data.navImg;
      console.log("tabCurr", nV,"----", navImg,navImg[index]);
      if(navImg[index] && navImg[index].scale == 1){
        for(let i in navImg){
          if(i == index){
            navImg[i].scale = 1.5;
          } else {
            navImg[i].scale = 1;
          }
        }
        this.setData({navImg: navImg})
      }
    }
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
  pageLifetimes:{
    show(){
        this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        this.pageHome && !this.properties.isHidePageHome && this.pageHome.initPageHome();
    }
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
        console.log("不是扫码进入的",this._options);
        getCustomTabRequest.call(this, this._options);
      }
      this.checkLogin();
    },
    checkLogin(){
      if(this.data.isLogin)return
      return this.checkLoginAsync();
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
      this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
      this[this.cur_name] && this[this.cur_name].reachBottom();
    },
    handle_scroll(top,type="") {  //需要父页面调用原生的 onPageScroll()
      if(type != "hideBackTop" && !this.data.isHideAllFixedBtn){
        checkBackTop.call(this,top);
      }
      this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
      let _top = parseInt((top + (this.screenHeight||0)));
      this[this.cur_name] && this[this.cur_name].scroll(_top);
    }, 
    getActivityId(){
      this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
      let activityId = this.couponAssist && this.couponAssist.getActivityId && this.couponAssist.getActivityId();
      return activityId || 0;
    },
    backTopTap(){
      wx.pageScrollTo({
        scrollTop:0,
        duration:500,
      })
    },
    setAdsPop(){
      this.setData({
        adsPop:this.adsPop || {}
      })
    },
    setAutoShow(){
      this[this.cur_name] && this[this.cur_name].setAutoShow && this[this.cur_name].setAutoShow();
    }, 
  },
}))

//获取页面tab数据
function getCustomTabRequest(ops = {}) {
  let apiPack = {
    api:"CL_GoodsApi",
    url:"getCustomPagesInfo",
  }
  let params = {
    userToken:app.LM.userToken,
    // brandCode:app.Conf.BRAND_CODE,
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
    if (e.code == 1 && e.data) {
      console.log('getCustomPageInfo',e)
      let data = e.data || {};
       let navInfoBox = data.navInfo || {};
      let navInfo = navInfoBox.navInfo || {};
      let moduleList = navInfoBox.moduleList || [];
      let navList = navInfo.pageList || [];
      let isTabPage = false,page_id = 0,showType = "top",showNav = (navList.length > 0);
      let pageName = data.page_name || data.pageName ||"首页";
      setTitleHandle.call(this,pageName);
      navList = navList.filter(item=>{
        return item.is_enable == 1
      })
      console.log('navList',navList,showNav,navInfo)
      // if((showNav && navList.length == 0)){ //页面不生效
      if(data.is_enable != 1 || (showNav && navList.length == 0)){ //页面不生效
        noDataSet.call(this, true);
        return
      }else if(this.data.hidePage){
        noDataSet.call(this,false);
      }
      let pageStyleConfig = {
        backgroundColor:data.backgroundColor,
        backgroundImage:data.backgroundImage,
        backgroundPosition:data.backgroundPosition,
      }
      let navPageStyleConfig = {
        backgroundColor:navInfo.backgroundColor,
        backgroundImage:navInfo.backgroundImage,
        backgroundPosition:navInfo.backgroundPosition,
      }
      if (!showNav) { //不是tab页面,取page_id
        page_id = data.page_id || ops.page_id || 0;
        navList.push({
          is_enable: true,
          page_id,
        })
      } else { //tab页面,取list的第一个page_id
        page_id = navList[0].page_id;
        showType = this.data.showType || navInfo.type||"top"
        isTabPage = true;
      }
      let compareId = data.page_id || ops.page_id || page_id;
      if(this.frameInited && this.initPageId && this.initPageId == compareId){
        console.log('微页面不刷新 同一个page_id:',compareId,this.initPageId)
        return
      }else{
        console.log('微页面刷新 新page_id:',compareId,this.initPageId)
      }
      navList.forEach(item=>{
        item.pageModelList = [];
      })
      this.adsPop = {
        isIndex:LogMap[this.currentPage.route] == "INDEX" ? 1 : 0,
        page_id:page_id
      }
      this.initPageId = data.page_id || ops.page_id || page_id; //赋值page_id
      this.currentId = page_id; //赋值page_id
      this.cur_name = "custom" + this.currentId;
      this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name); 
      shareMsgSaving.call(this,data)
      this.setAdsPop();
      this.setData({
        pageInfo: data || {},
        navList,
        pageStyleConfig,
        navPageStyleConfig,
        navInfo,
        showType,
        showNav,
        moduleList,
        isTabPage: isTabPage,
        isHomePageConf: this.data.customTab, 
      })
      console.log('navList',navList,'moduleList',moduleList,)
      this._options.page_id = page_id;
      getItemData.call(this, this._options);
      this.triggerEvent('getPageId', { page_id: this.currentId });
      return Promise.resolve(e);
    }else if (typeof e.msg === "string" && e.msg.indexOf("绑定店铺")) {
      if(this.data.navList.length<=0){ //数据异常
        noDataSet.call(this, true);
        checkIfNeedBackHome();
      }
    }else{
      if(this.data.navList.length<=0){ //数据异常
        noDataSet.call(this, true, true);
        checkIfNeedBackHome();
      }
    }
    return Promise.reject(e);
  })
}
function noDataSet(bool=true, abnormal = false){
  this.setData({
    hidePage:bool,
    abnormal
  })
  bool && this.triggerEvent("no-data");
}
//扫码进入
function analysisParams() {
  app.SHP.getParams(["page_id", "staff_code", "staffCode"]).then((params) => {
    let ops = {
      ...this._options,
      ...params
    }
    this._options = JSON.parse(JSON.stringify(ops))
    console.log('扫码进入',ops)
    getCustomTabRequest.call(this, ops);
  })
}

//获取页面数据
function getItemData(_options) {
  loadFrame.call(this,this.currentId);
  if (!this.data.isHideAssist) {
    this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
    this.couponAssist.getData(this.currentId);
  }
}

function loadFrame(id) {
  this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
  let check = this[this.cur_name].reset(this.currentId);
  if (check) {
    let params = {
      pageId: id || 0,
      // brandCode:app.Conf.BRAND_CODE
    },apiPack = {
      api:"CL_GoodsApi",
      url:"getCustomPageDataScript",
      extra:{diy:true}
    }
    return app.RunApi.go(apiPack.api, apiPack.url, params,apiPack.extra).then(res => {
      if (res.code == 1) {
        this.frameInited = true;
        let data = res.data || {};
        let pageModelList = data.pageModelList || [];
        let navList = this.data.navList || [],cur = this.data.tabCurr; 
        let extraInfo = {page_id : this.currentId};
        for(let key in data){
          if(key != 'pageModelList'){
            extraInfo[key] = data[key];
          }
        } 
        let isShowCs = false;
        pageModelList.forEach(item=>{
          item.setting && (item.setting.code = item.code||"");
          item.setting && (item.setting.moduleId = item.moduleId||0);
          item.code == 'customerService' && (isShowCs = true);
        })
        this.setData({
          [`navList[${cur}]`]:{
            ...navList[cur],
            pageModelList,
            extraInfo,
            isShowCs,
          },
        })
        // shareMsgSaving.call(this,data)
        console.log('骨架',this.currentId,cur,this.data.navList,extraInfo)
      }
    })
  }
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
  console.log('shareMsgSaving',data)
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
  this.setData({
    url_value: data.wx_poster_image || '',
    page_id_value: this.currentId || 0
  })
  this.triggerEvent('pageShareSaving', shareConf);
  if(!this.properties.isHideShare){
    this.button_share = this.button_share || this.selectComponent('#button_share');
    let timer = setTimeout(() => {
      this.button_share.onShowFn(); //onshow请求
      timer && clearTimeout(timer);
    }, 100) 
  }
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

function checkIfNeedBackHome(){
  let pages = getCurrentPages(), page = pages[pages.length - 1] || {};
  if (page.route != "pages/micro_mall/index/index" && page.options && (page.options.fromModule === "COUPON")){ // 从优惠券列表页面跳转过来的，如果报错了，要帮用户跳转回首页
    let timer1 = setTimeout(() => {
      WxApi.switchTab({url: "/pages/micro_mall/index/index"})
        .then(() => {
          let timer2 = setTimeout(() => {app.SMH.showToast({title: "暂无跳转路径", duration: 3000}); clearTimeout(timer2)}, 500)
        });
      clearTimeout(timer1)
    }, 1000)
  }
}