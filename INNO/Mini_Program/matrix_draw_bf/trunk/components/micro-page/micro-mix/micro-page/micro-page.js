// pages/component/micro-page/micro-mix/micro-page/micro-page.js
import mcBehavior from '../../help/mc-behavior.js'
const app = getApp();
const setTitle = {
  ["pages/micro_mall/index/index"]: true,
  ["pages/micro_mall/custom_page/custom_page"]: true,
  ["pages/micro_mall/guide_point/guide_point"]: true,
  ["pages/micro_mall/live_custom/live_custom"]: true,
}
Component({ 
  behaviors: [mcBehavior,Behavior.BaseBehavior],
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
    },
    isLogin:{
      type:Boolean,
      value:false
    },
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
    // checkSalesVolume.call(this);
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
        console.log("不是扫码进入的",this._options);
        getCustomTabRequest.call(this, this._options);
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
      if(type != "hideBackTop"){
        checkBackTop.call(this,top);
      }
      this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
      let _top = parseInt((top + (this.screenHeight||0)));
      this[this.cur_name] && this[this.cur_name].scroll(_top);
    }, 
    getActivityId(){
      // this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
      // let activityId = this.couponAssist.getActivityId();
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
})

//获取页面tab数据
function getCustomTabRequest(ops = {}) {
  let apiPack = {
    api:"GoodsApi",
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
      let isTabPage = false,page_id = 0,showType = "top",showNav = (navList.length > 0);
      navList = navList.filter(item=>{
        return item.is_enable == 1
      })
      console.log('navList',navList,showNav)
      if(data.is_enable != 1 || (showNav && navList.length == 0)){ //页面不生效
        noDataSet.call(this);
        return
      }else if(this.data.hidePage){
        noDataSet.call(this,false);
      }
      let _data = {
        backgroundColor:data.backgroundColor,
        backgroundImage:data.backgroundImage,
        backgroundPosition:data.backgroundPosition,
      }
      if (!showNav) { //不是tab页面
        page_id = data.page_id || ops.page_id || 0;
        navList.push({
          is_enable: true,
          page_id,
        })
      } else {
        page_id = navList[0].page_id;
        showType = this.data.showType || navInfo.type||"top"
        isTabPage = true;
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
    }else{
      if(this.data.navList.length<=0){ //数据异常
        noDataSet.call(this);
      }
    }
    return Promise.reject(e);
  })
}
function noDataSet(bool=true){
  this.setData({
    hidePage:bool
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
    console.log('扫码进入',ops)
    getCustomTabRequest.call(this, ops);
  })
}

//获取页面数据
function getItemData(_options) {
  loadFrame.call(this,this.currentId);
  // this.couponAssist = this.couponAssist || this.selectComponent("#couponAssist");
  // this.couponAssist.getData(this.currentId);
}

function loadFrame(id) {
  this[this.cur_name] = this[this.cur_name] || this.selectComponent("#" + this.cur_name);
  let check = this[this.cur_name].reset(this.currentId);
  if (check) {
    let params = {
      pageId: id || 0,
    },apiPack = {
      api:"GoodsApi",
      url:"getCustomPageDataScript",
      extra:{diy:true}
    }
    // ,ops = this.options||{}; 
    // if(ops.pageType == 'getParentPage'){
    //   params={ brandCode: app.Conf.BRAND_CODE };
    //   apiPack.url = "getParentPageDataScript";
    // }
    return app.RunApi.go(apiPack.api, apiPack.url, params,apiPack.extra).then(res => {
      if (res.code == 1) {
        this.frameInited = true;
        let data = res.data || {};
        this.serverTime = data.server_time || '';
        let pageModelList = data.pageModelList || [];
        let navList = this.data.navList || [],cur = this.data.tabCurr; 
        
        // pageModelList = pageModelList.concat([
        //   {
        //     code:"integralSale",
        //     moduleId:441,
        //     setting:
        //     {"content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u79ef\u5206\u5546\u57ce \u4e00\u884c\u4e09\u4e2a","textAlign":"center","textColor":"#1271D5","bgColor":"#F2C188","nameFontSize":16,"showMore":true,"showMoreStyle":"style2","showMoreText":"\u67e5\u770b\u66f4\u591a","activity_model":"manual","show_num":10,"layout":"three","open_slide":true,"gutter":0,"goodsList":[{"id":1030,"goods_id":"40049","img_url_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/index\/gallery\/20201210\/20201210115243870_7530604.png","name":"\u54c8\u54c8\u54c8\u54c8222","goods_name":"\u5496\u5561\u732b","sale_price":"1000.00","market_price":"1000.00","integral":"1","start_time":"2021-04-21 00:00","end_time":"2021-04-30 00:00"},{"id":25,"goods_id":"43155","img_url_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/index\/gallery\/20210329\/20210329164231991_8785780.jpg","name":"\u6d4b\u8bd5ERP\u5e93\u5b58","goods_name":"MIWA_ALL_TEST1","sale_price":"0.03","market_price":"0.03","integral":"1","start_time":"2021-04-21 00:00","end_time":"2021-04-30 00:00"}],"tag":"","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0}
        //   },
        //   {
        //     code:"integralSale",
        //     moduleId:442,
        //     setting:
        //     {"activity_model":"auto","show_num":3,"layout":"three","open_slide":true,"gutter":0,"goodsList":[],"tag":"","content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u79ef\u5206\u5546\u57ce \u81ea\u52a8\u83b7\u53d63","textAlign":"left","textColor":"#FF214D","bgColor":"#94C8FF","nameFontSize":16,"showMore":false,"showMoreStyle":"style1","showMoreText":"\u67e5\u770b\u66f4\u591a","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0}
        //   },
        //   {
        //     code:"pinSale",
        //     moduleId:443,
        //     setting:
        //     {"content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u62fc\u56e2 \u4e00\u884c\u4e24\u4e2a","textAlign":"left","textColor":"#F348FF","bgColor":"#80BEFF","nameFontSize":16,"showMore":false,"showMoreStyle":"style1","showMoreText":"\u67e5\u770b\u66f4\u591a","activity_model":"manual","show_num":10,"layout":"two","open_slide":true,"gutter":0,"goodsList":[{"id":1030,"name":"\u54c8\u54c8\u54c8\u54c8222"},{"id":25,"name":"\u6d4b\u8bd5ERP\u5e93\u5b58"}],"tag":"","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0}          
        //   },
        //   {
        //     code:"kanSale",
        //     moduleId:444,
        //     setting:
        //     {"content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u780d\u4ef7 \u4e00\u884c\u4e00\u4e2a","textAlign":"left","textColor":"","bgColor":"","nameFontSize":16,"showMore":false,"showMoreStyle":"style1","showMoreText":"\u67e5\u770b\u66f4\u591a","activity_model":"manual","show_num":10,"layout":"one","open_slide":true,"gutter":0,"goodsList":[{"id":9093,"img_url_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/index\/gallery\/20210329\/20210329171046839_0072431.jpg","name":"\u780d\u4ef7ERP\u5e93\u5b58","sale_price":"0.50","market_price":"0.50"}],"tag":"","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0}
        //   },
        //   {
        //     code:"preSale",
        //     moduleId:445,
        //     setting:
        //     {"content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u9884\u552e \u5217\u8868","textAlign":"left","textColor":"","bgColor":"","nameFontSize":16,"showMore":false,"showMoreStyle":"style1","showMoreText":"\u67e5\u770b\u66f4\u591a","activity_model":"manual","show_num":10,"layout":"list","open_slide":true,"gutter":0,"goodsList":[{"id":1221,"img_url_thumb":"","goods_name":"\u6807\u51c6\u5546\u54c1","name":"2\u6708\u9884\u552eMUCA710A","sale_price":"9.00","market_price":"9.00"}],"tag":"","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0}
        //   },
        //   {
        //     code:"packageSale",
        //     moduleId:446,
        //     setting:
        //     {"content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u642d\u914d\u5957\u9910 \u4e00\u5927\u4e24\u5c0f ","textAlign":"left","textColor":"","bgColor":"","nameFontSize":16,"showMore":false,"showMoreStyle":"style1","showMoreText":"\u67e5\u770b\u66f4\u591a","activity_model":"manual","show_num":10,"layout":"bigSmall","open_slide":true,"gutter":0,"goodsList":[{"id":1084,"goods_id":0,"img_url_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/index\/gallery\/20210129\/20210129100553747_4146020.png","name":"MIWA\u5957\u9910_T1","sale_price":"10.00","market_price":"10.00"},{"id":1082,"goods_id":0,"img_url_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/index\/gallery\/20210415\/20210415221811574_7100681.jpg","name":"\u6d4b\u8bd5\u54e6","sale_price":"40.00","market_price":"40.00"},{"id":1081,"goods_id":0,"img_url_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/index\/gallery\/20201210\/20201210103611777_1503770.jpg","name":"1272","sale_price":"300.00","market_price":"300.00"},{"id":1072,"goods_id":0,"img_url_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/index\/gallery\/20201214\/20201214143153471_0788041.jpg","name":"\u6309\u8d27\u53f7","sale_price":"1.00","market_price":"1.00"}],"tag":"","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0}
        //   },
        //   {
        //     code:"limitTimeSale",
        //     moduleId:447,
        //     setting:
        //     {"content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u79d2\u6740","textAlign":"center","textColor":"","bgColor":"","nameFontSize":16,"showMore":true,"showMoreStyle":"style1","showMoreText":"\u67e5\u770b\u66f4\u591a","layout":"three","open_slide":true,"gutter":0,"activityGroup":[{"name":"\u9648\u6653\u98de\u6d4b\u8bd5\u79d2\u6740\u81ea\u63d0","activity_id":7110,"goodsListType":"manual","goodsList":[{"id":43264,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210422\/20210422174314398_1872726.jpg","name":"\u65f6\u5c1a\u4f11\u95f2\u77ed\u8896\u5957\u88c5","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043264","tag":""},{"id":43261,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421141847813_4622372.jpg","name":"CES11111","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043261","tag":""},{"id":43260,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421133834832_8502566.jpg","name":"MIWA_4_21_02","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043260","tag":""}],"show_num":3},{"name":"3-12cs","activity_id":7111,"goodsListType":"manual","goodsList":[{"id":43264,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210422\/20210422174314398_1872726.jpg","name":"\u65f6\u5c1a\u4f11\u95f2\u77ed\u8896\u5957\u88c5","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043264","tag":""},{"id":43263,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/original_img\/20210422\/20210422174008635_1125223.jpg","name":"\u67d4\u7f8e\u7b80\u96c5\u77ed\u8896\u957f\u88e4","sale_price":"0.00","market_price":"0.00","goods_sn":"1203100","tag":""},{"id":43260,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421133834832_8502566.jpg","name":"MIWA_4_21_02","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043260","tag":""},{"id":43261,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421141847813_4622372.jpg","name":"CES11111","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043261","tag":""}],"show_num":4},{"name":"\u52a9\u529bERP\u5e93\u5b58","activity_id":7112,"goodsListType":"auto","goodsList":[],"show_num":30}],"tag":"","currTab":"tab0","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0,"start_time": "2021-04-21 00:00","end_time": "2021-04-30 00:00"}
        //   },
        //   {
        //     code:"secKill",
        //     moduleId:448,
        //     setting:
        //     {"content_switch":{"show_goods_name":true,"show_price":true,"show_time":true,"show_button":true},"openHeader":true,"headerTitle":"\u79d2\u6740","textAlign":"left","textColor":"","bgColor":"","nameFontSize":16,"showMore":true,"showMoreStyle":"style1","showMoreText":"\u67e5\u770b\u66f4\u591a","layout":"three","open_slide":true,"gutter":0,"activityGroup":[{"name":"\u9648\u6653\u98de\u6d4b\u8bd5\u79d2\u6740\u81ea\u63d0","activity_id":7110,"goodsListType":"manual","goodsList":[{"id":43264,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210422\/20210422174314398_1872726.jpg","name":"\u65f6\u5c1a\u4f11\u95f2\u77ed\u8896\u5957\u88c5","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043264","tag":""},{"id":43261,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421141847813_4622372.jpg","name":"CES11111","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043261","tag":""},{"id":43260,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421133834832_8502566.jpg","name":"MIWA_4_21_02","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043260","tag":""}],"show_num":3},{"name":"3-12cs","activity_id":7111,"goodsListType":"manual","goodsList":[{"id":43264,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210422\/20210422174314398_1872726.jpg","name":"\u65f6\u5c1a\u4f11\u95f2\u77ed\u8896\u5957\u88c5","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043264","tag":""},{"id":43263,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/original_img\/20210422\/20210422174008635_1125223.jpg","name":"\u67d4\u7f8e\u7b80\u96c5\u77ed\u8896\u957f\u88e4","sale_price":"0.00","market_price":"0.00","goods_sn":"1203100","tag":""},{"id":43260,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421133834832_8502566.jpg","name":"MIWA_4_21_02","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043260","tag":""},{"id":43261,"goods_thumb":"http:\/\/devimgtest.innourl.com\/SAAS_IMAGE\/images\/INNO\/goods\/goods_thumb\/20210421\/20210421141847813_4622372.jpg","name":"CES11111","sale_price":"0.00","market_price":"0.00","goods_sn":"INNO043261","tag":""}],"show_num":4},{"name":"\u52a9\u529bERP\u5e93\u5b58","activity_id":7112,"goodsListType":"auto","goodsList":[],"show_num":30}],"tag":"","currTab":"tab0","backgroundColor":"","backgroundImage":"","backgroundPosition":"top","marginTop":0,"marginBottom":0,"paddingLeftRight":0,"start_time": "2021-04-21 00:00","end_time": "2021-04-30 00:00"}
        //   },
        // ])

        pageModelList.forEach(item=>{
          item.setting && (item.setting.code = item.code||"");
          item.setting && (item.setting.moduleId = item.moduleId||0);
        })
        this.setData({
          [`navList[${cur}]`]:{
            ...navList[cur],
            pageModelList
          }
        })
        shareMsgSaving.call(this,data)
        console.log('骨架',this.currentId,cur,this.data.navList)
      }
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