import MyDate from '../../../../common/support/utils/date-util.js';
import {
  CountDown
} from "../../../../common/manager/timer-manager.js";
let WxParse = require("../../../../components/thirdParty/wxParse/wxParse.js");
import WxSub from "../../../../common/helper/handle/wxSubscribe.js" 
import GetStatus from '../help/getStatus.js';
// import Promise from "../../../../libs/promise/promise";
import AllStaffApply from "../../../../common/manager/all-staff-apply" 
// const PAGE_TYPE = "SECKILL_GOODS";
const app = getApp();
Page(app.BP({
  data: {
    img_arr:[{},{}],
    ac_conf: app.Conf.style.n_sk_color || {},
    swiper_current:0,
    select_goods: { //选择的商品
      select_color: "", //选择颜色对象
      select_size: "", //选择尺码对象
      select_color_id: 0, //选择颜色id
      select_size_id: 0, //选择尺码id
      select_goods_count: 1, //选择商品数量
      productInfo: {}
    },
    //配送方式  0可全部，1仅限门店，2仅限快递配送（selectIndex一一对应）
    selectShipInfo: {
      selectIndex: 2
    }, 
  },
  extra:{
    diy:true
  },
  onLoad: function (options) {
    this.options = options;
    let goodsId = options.goodsId || 0;
    // console.log('options', this.options);
    let brand_info = this.data.brand_info;
    let sk_share = brand_info.icon_url + "micro_mall/sec_kill/sk_share.png?11";
    let sk_home = brand_info.icon_url + "micro_mall/sec_kill/sk_home.png?123";
    let rightbutton = brand_info.icon_url + "micro_mall/rightbutton.png";
    let m_color = app.getColor(this.data.ac_conf.theme_color, 7, 81, 113, 1) || '';
    let m_color_t = app.getColor(this.data.ac_conf.theme_color, 1, 90, 145, 1) || '';
    let m_bg_color = app.getColor(this.data.ac_conf.theme_color, 0, 0, 0, 0.6) || '';
    let m_bg_color_btn = app.getColor(this.data.ac_conf.theme_color, 0, 0, 0, 0.45) || '';
    this.setData({
      // isLogin:app.LM.isLogin,
      sk_share,
      sk_home,
      rightbutton,
      m_color,
      m_color_t,
      m_bg_color,
      m_bg_color_btn,
      goodsId,
    })
    loadComments.call(this);
    // getTpls.call(this);
  },
  
  onShow: function () {
    this.jumpVal = false;
    // listen.call(this);
    app.LM.loginAsync(true).finally(()=>{
      this.checkLoginChange();
      getShipStore.call(this);
      checkScene.call(this);
    })
}, 
  onHide: function () {
    unListen.call(this);
    stopCountDown.call(this)
  },
  onUnload: function () {
    unListen.call(this);
    app.StorageH.remove('select_store');
    stopCountDown.call(this);
  },
  onShareAppMessage(e) {
    let title = this.activityInfo.shareTitle || "秒杀助力分享";
    let activityId = this.options.activityId || this.activityInfo.activityId;
    let groupId = this.options.groupId || 0;
    let goodsId = this.data.goodsBaseInfo.goodsId || 0;
    let path = `pages/micro_mall/sk/goods-info-sk/goods-info-sk?groupId=${groupId}&activityId=${activityId}&goodsId=${goodsId}`;
    let gallery = this.data.gallery[this.data.select_goods.select_color_id] || {};
    let imageUrl = gallery && gallery[0] && gallery[0].imgUrl || '';
    let shareType = "SECKILL_GOODS";
    // let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
    if (e.target && e.target.dataset && e.target.dataset.route == 'index'){
      let target = app.LM.isLogin ? 1 : 0;
      shareType = "SECKILL_HELP";
      // shareType = app.ShareType.SECKILL_HELP || app.ShareType.NORMAL;
      path = `pages/micro_mall/sk/activity-sk/activity-sk?groupId=${groupId}&activityId=${activityId}&target=${target}`;
      imageUrl = this.activityInfo.shareImg || '';
      goAction.call(this,'index');
      share.call(this);
    }else{
      goAction.call(this);
    }
    return {
      shareType: shareType,
      isCustom: true,
      title: title,
      path: path,
      imageUrl: imageUrl,
    }
  },
  jump(e) {
    let dataset = e.currentTarget.dataset || {};
    let type = dataset.type || '';
    let url = dataset.url || '';
    if (type == 'index') {
      // 检测上一页
      let page = getCurrentPages();
      let last = page && page.length - 2;
      if (last >= 0 && page[last].route == 'pages/micro_mall/sk/activity-sk/activity-sk'){
        wx.navigateBack({
          delta:-1
        })
      }else{
        wx.redirectTo({
          url: url + `?groupId=${this.options.groupId || 0}`,
        })
      }
    } else if (type =='goods'){
      let goodsId = dataset.goodsId || 0;
      wx.navigateTo({
        url: `${url}?goods_id=${goodsId}`,
      })
    }
  },
  getShare(e){
    this.shareModule = this.shareModule || this.selectComponent('#shareModule');
    this.shareModule.checkIfStaffDstb();
  },
  checkIfStaffDstbCallBack(){
    // console.log('check完分销');
  },
  chooseShareType(data){
    let detail = data.detail;
    this.shareImg = this.shareImg || this.selectComponent("#shareImg");
    let goodsInfo = this.data.goodsBaseInfo || {};
    let activityInfo = this.data.activityInfo || {};
    goodsInfo.goods_name = goodsInfo.goodsName||"";
    goodsInfo.goods_sn = goodsInfo.goodsSn||"";
    goodsInfo.goods_id = goodsInfo.goodsId||0;
    goodsInfo.market_price = goodsInfo.marketPrice||0;
    goodsInfo.max_market_price = goodsInfo.maxMarketPrice || 0;
    goodsInfo.min_market_price = goodsInfo.minMarketPrice || 0;
    goodsInfo.max_price = goodsInfo.maxPrice || 0;
    goodsInfo.min_price = goodsInfo.minPrice || 0;
    goodsInfo.issued_id = this.options.activityId || this.activityInfo.activityId || 0;
    let opKind = "SECKILL_GOODS";
    let shareType = "SECKILL_GOODS";
    // let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
    // let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
    let activityId = this.options.activityId || this.activityInfo.activityId;
    let groupId = this.options.groupId || 0;
    let path = `pages/micro_mall/sk/goods-info-sk/goods-info-sk`;
    let gallery = this.data.gallery[this.data.select_goods.select_color_id] || {};
    let imageUrl = gallery && gallery[0] && gallery[0].imgUrl || '';
    let allData = {
      info:{
        imgUrl: imageUrl,
        goodsInfo: goodsInfo,
        path: path,
        opKind:opKind
      },
      scene: {
        "shareType": shareType,
        "activityId": activityId,
        'goodsId': goodsInfo.goods_id,
        "groupId": groupId,
        'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
      },
      draw:{
        template:"goods"
      },
    }
    this.setData({
      allData: allData
    })
    this.shareImg.show();
  },
  showPopup(e,type){
    if(this.loading_pop)return;
    popupLoading.call(this);
    getSku.call(this).then(res => {
      // this.popup = this.popup || this.selectComponent('#popup');
      // this.popup.show();
      if(type != "init"){
        setAnim.call(this,"show");
      }
    })
  },
  buy(){
    let cb = ()=>{
      let name = '';
      if (this.data.checkUserRank && this.data.checkLimit){
        getSku.call(this).then(res => {
          // this.popup = this.popup || this.selectComponent('#popup');
          // this.popup.show();
          setAnim.call(this,"show");
        }) 
      } else if (!this.data.checkUserRank){
        name = "该活动只对特定会员开放";
      } else if (!this.data.checkLimit){
        name = this.checkLimitMsg || `该场活动限购${this.goodsBaseInfo.limitCount}件商品.`;
      }
      if(!name)return;
      app.SMH.showToast({
        title: name
      });
    }
    if(globalSubscribe.call(this,this.options.activityId)){
      cb();
    }else{
      let tplsList = this.data.globalTpls||[],type = "GLOBAL",info={};
      WxSub.wxSubscribeHelp({tplsList,type,info}).then(res=>{
        globalSubscribe.call(this,this.options.activityId,'set');
        if(res){
          setGloabalSubscribe.call(this,res)
          app.SMH.showToast({
            title:"订阅成功"
          })
        };
        cb();
      })
    }
  },
  checkBuy(e){
    let cb = ()=>{
      this.checkBuyBool = true;
      let p2 = checkCondition.call(this, 'checkCondition');
      let p3 = checkCondition.call(this, 'checkUserRank');
      let p4 = checkCondition.call(this, 'checkLimit');
      showPage.call(this, [p2, p3, p4]).then(res=>{
        this.buy();
      });
    };
    if(globalSubscribe.call(this,this.options.activityId)){
      cb();
    }else{
      app.SMH.showToast({
        title:"注册成功,请重新点击按钮"
      })
    };
     
  },
  colorSelect(e){
    let detail = e.detail;
    // console.log('颜色选择', detail);
    setSelectInfo.call(this,'color',detail.color_id); 
    setProductInfo.call(this);
  },
  sizeSelect(e){
    let detail = e.detail;
    // console.log('尺码选择', detail);
    setSelectInfo.call(this,'size', detail.size_id);
    setProductInfo.call(this);
  },
  skuConfirm(e){
    let name = '';
    if (!this.data.checkUserRank) {
      name = "该活动只对特定会员开放";
    } else if (!this.data.checkLimit) {
      name = this.checkLimitMsg || `该场活动限购${this.goodsBaseInfo.limitCount}件商品.`;
    }
    if (name) {
      app.SMH.showToast({
        title: name
      });
      return
    };
    checkSkuSelect.call(this).then(res=>{
      checkPay.call(this).then(res=>{
        if (!this.jumpVal){
          this.jumpVal = true;
          let selectShipInfo = this.data.selectShipInfo||{};
          let userChoiceData = app.StorageH.get('userChoiceData') || {}; 
          let shippingType = selectShipInfo.selectIndex || 2;
          let storeId = selectShipInfo.id || 0;
          userChoiceData.rec_str = this.select_goods.productInfo.akId;
          app.StorageH.set('userChoiceData', userChoiceData); 
          // this.popup.dismiss();
          setAnim.call(this);
          wx.navigateTo({
            url: `/pages/micro_mall/sk/orders-sk/order-confirm?goodsId=${this.options.goodsId}&activityId=${this.options.activityId}&akId=${this.select_goods.productInfo.akId}&storeId=${storeId}&shippingType=${shippingType}`,
          })
        } 
      }).catch(e=>{
        this.jumpVal = false;
        app.SMH.showToast({
          title:e && e.msg || "商品异常"
        })
      })   
    })
  },
  shareCallBack(e){
    app.SMH.showToast({
      title:"授权成功，请重新操作"
    })
  },
  previewImage(e) {
    let dataset = e.currentTarget.dataset || {};
    let url = dataset.url || '';
    let arr = this.gallery_init && this.gallery_init[this.select_goods.select_color_id||0] || [];
    wx.previewImage({
      current: url,
      urls: arr
    })
  },
  handle_swiper(e){
    let swiper_current = e.detail && e.detail.current || 0;
    this.setData({
      swiper_current: swiper_current
    });
  },
  handle_tip(e) {
    let dataset = e.currentTarget.dataset || {};
    let type = dataset.type || '';
    if (type == 'grade') {
      app.SMH.showToast({
        title: `该活动只对特定会员开放`
      })
    }
  },
  changeGoodsColor: function (e) {
    let that = this;
    let color_id = e.detail.color_id || 0;
    setSelectInfo.call(this, 'color', color_id);
    setProductInfo.call(this); 
  },
  setSubscribe(e) {
    let that = this;
    let tplsList = this.tplsList || [];
    let tmplIds = [];
    let activityInfo = this.data.activityInfo;
    let subState = this.data.SubScribe ||　{};
    let select = 0;
    for (let i = 0; i < tplsList.length; i++) {
      if (tplsList[i].wxTplId) {
        tmplIds.push(tplsList[i].wxTplId);
      }
      if (subState[tplsList[i].tplType] != 0) {
        select += 1;
      }
      console.log('历史订阅:', select, '/', tplsList.length, tplsList[i].tplType, subState[tplsList[i].tplType]);
    }
    let bool = ((activityInfo.state == 2 && subState.SECKILL_START == 1) || (activityInfo.state == 1 && subState.SECKILL_READY == 1)) || false;
    let selectAll = select == tmplIds.length;
    if (selectAll || bool) {
      let subResult = {};
      for (let i = 0; i < tmplIds.length; i++) { //遍历
        let tempTplType = tplsList[i].tplType;
        subResult[tmplIds[i]] = bool ? subState[tempTplType] == 0 ? 'reject' :  "rejectInner" : "accept";
      }
      //updateSubState.call(this, { subResult: subResult })
      that.reqSubscribe(subResult, !bool);
      return;
    }
    WxSub.setWxSubscribe(tmplIds).then(res => {
      if (res.errMsg.indexOf("ok") != -1) {
        //updateSubState.call(this, { subResult:res})
        that.reqSubscribe( res, true);
      } else {
        app.SMH.showToast({
          title: res.errMsg
        })
      }
    }).catch(error => { 
      if (error && error.type == 'showError') {
        app.SMH.showToast({
          title: "请允许订阅消息在小程序设置中开启"
        })
      }
    })
  },
  reqSubscribe(subResult, setSub) {
    console.log('subResult', subResult)
    let that = this;
    let tplsList = this.tplsList || [];
    let reqList = [];
    let SubScribe = this.data.SubScribe || {};
    let goodsBaseInfo = this.data.goodsBaseInfo;
    for (let i = 0; i < tplsList.length; i++) {
      let wxTplId = tplsList[i].wxTplId || "";
      let tplType = tplsList[i].tplType;
      reqList.push({
        tplType: tplType,
        activityId: this.data.activityInfo.activityId,
        goodsId: goodsBaseInfo.goodsId,
        brandTplId: tplsList[i].brandTplId,
        state: subResult[wxTplId]
      })
      if (subResult[wxTplId]) {
        SubScribe[tplType] = WxSub.SubStatus[subResult[wxTplId]]
      }
      console.log('SubScribe', SubScribe)
    }
    WxSub.setSubscribe(reqList, setSub,"SECKILL").then(res=>{
      this.setData({
        SubScribe
      })
    })
  },
  loginBack(){
    app.SMG.showToast({
      title: "注册成功，请重新操作",
      duration: 3000
    })
  },

  shipSelect(e) {
    let detail = e.detail||{};
    let selectShipInfo = JSON.parse(JSON.stringify(this.data.selectShipInfo || {}));
    let selectIndex = selectShipInfo.selectIndex;
    // let dataset = e.currentTarget.dataset || {};
    this.setData({
      "selectShipInfo.selectIndex": detail.index || 0
    })
    if (selectIndex != detail.index && (!detail.jump)) {
      // getSumaryGoodsProductInfo.call(this, this.options);
      getSku.call(this);
    }
  },
  selectStore(e) {
    checkSkuSelect.call(this,false).then(()=>{
      let selectShipInfo = this.data.selectShipInfo || {};
      console.log(selectShipInfo, "selectShipInfo");
      let store_id = selectShipInfo.id || 0;
      // let key_word = selectShipInfo.key_word || "";
      let select_goods = this.data.select_goods || {};
      let proInfo = select_goods.productInfo||{};
      this.jumpSelfGet = true;
      wx.navigateTo({
        url: `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&pId=${proInfo.productId||0}&goodsNum=${select_goods.select_goods_count || 1}&fromType=sk`,
      })
    })
  },
  
}))
function getTpls(){
  return WxSub.getTpls("SECKILL").then(data => {
    if (data && data.length > 0) {
      this.tplsList = [];
      let activityInfo = this.data.activityInfo;
      for (let i = 0; i < data.length; i++){
        if (data[i].tplType != "SECKILL_LAUNCH_SUCC"){
          if (!(activityInfo.state == 2 && data[i].tplType == "SECKILL_READY")) {
            this.tplsList.push(data[i]);
          }
        }
      }
      checkSubState.call(this);
    }
  }).catch(e=>{
    return Promise.resolve();
  });
}
function getGlobalTpls(){
  return WxSub.getTpls("GLOBAL","SEC").then(data => {
    let globalTpls = data||[];
    this.setData({globalTpls});
  })
}
function loadData(update=false) {
  if (!this.options.activityId)return
  let params = {
    activityId: this.options.activityId,
    goodsId:this.options.goodsId || 0,
  };
  let extra = this.extra;
  extra.diy = false;
  return app.RunApi.go('SecKillApi', 'getGoodsDetail', params, extra).then(res => {
    if (res.code == 1) {
      let data = res.data || {};
      AllStaffApply.checkAllStaffApply(this,{goods_id:this.options.goodsId||0,relatedId:this.options.activityId||0,goodsType:"SKILL"});
      this.select_goods = this.data.select_goods;
      let gallery = createObjKeyVal.call(this, data.gallery, 'colorId','initImg') || {};
      let defaultSpec = data.defaultSpec || {};
      if (!this.init_s_c_id) {
        this.init_s_c_id = true;
        if (data.gallery && data.gallery.length > 1) {
          initImgArr.call(this, gallery);
        }
        // console.log('this.select_goods', this.select_goods)
        this.select_goods.select_color_id = defaultSpec.colorId || 0;
        this.select_goods.select_color = defaultSpec.colorName || "";
      }
      let goodsBaseInfo = data.goodsInfo || {};
      let activityInfo = data.activty || {};
      activityInfo.rtimeStr = MyDate.format(MyDate.parse(activityInfo.rtime || ''), "MM-dd HH:mm");
      activityInfo.stimeStr = MyDate.format(MyDate.parse(activityInfo.stime || ''), "MM-dd HH:mm");
      activityInfo.etimeStr = MyDate.format(MyDate.parse(activityInfo.etime || ''), "MM-dd HH:mm");

      this.activityInfo = activityInfo;
      if (goodsBaseInfo.desc && !this.desc){
        this.desc = true;
        this.setData({
          showDesc:true
        })
        WxParse.wxParse('article', 'html', goodsBaseInfo.desc, this, 0);
      }
      showPriceExplain.call(this);
      this.setData({
        color_img: data.gallery,
        gallery,
        goodsBaseInfo,
        activityInfo,
        default_id: defaultSpec.colorId || 0,
        colorNum: this.colorNum || 0,
        select_goods: this.select_goods
      })
      let p1 = setDownTime.call(this, update);
      let p2 = checkCondition.call(this,'checkCondition');
      let p3 = checkCondition.call(this,'checkUserRank');
      let p4 = checkCondition.call(this,'checkLimit');
      let p5 = getTpls.call(this);
      let p6 = this.showPopup({},"init");
      let p7 = getGlobalTpls.call(this);
      showPage.call(this, [p1, p2, p3,p4,p5,p6,p7]);
      console.log('select_goods', this.select_goods);
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
  // .catch(e=>{
  //   app.SMH.showToast({
  //     title: e && e.msg||"商品异常"
  //   })
  // })
}

function getSku(){
  if (!this.options.activityId || !this.options.goodsId) return
  let selectShipInfo = this.data.selectShipInfo||{};
  let params = {
    activityId: this.options.activityId,
    goodsId: this.options.goodsId,
    storeId: selectShipInfo.selectIndex == 1 ? selectShipInfo.id||0:0
  };
  return app.RunApi.go('SecKillApi', 'getProducts', params, this.extra).then(res => {
    if (res.code == '1') {
      let goodsExtend = res.data.goodsExtend || {};
      let goodsTotalInfo = res.data.goodsTotalInfo || {}; //区间
      let productList = res.data.productList || []; 
      let select_goods = this.select_goods;
      this.goodsTotalInfo = goodsTotalInfo;
      if (!select_goods.productInfo.productId){
        select_goods.productInfo = goodsTotalInfo;
      }
      let skuObj = {};
      let colorArr = [];
      let sizeArr = [];
      let tempSize = {};
      // let firstSku = "";
      // let firstName = "";
      // let exsist = false;
      productList.forEach((item,index)=>{
        // if(!firstSku){
        //   firstSku = item.colorId;
        //   firstName = item.colorName;
        // }
        // if (!exsist){
        //   exsist = select_goods.select_color_id == item.colorId;
        // }
        if (!skuObj[item.colorId]){
          skuObj[item.colorId] = {};
          colorArr.push({ colorId: item.colorId, colorName: item.colorName });
          if (goodsExtend.attrCount == 1){
            skuObj[item.colorId]={...item};
          }else{
            skuObj[item.colorId].colorId = item.colorId;
            skuObj[item.colorId].colorName = item.colorName; 
          }
        }
        if (!tempSize[item.sizeId]) {
          tempSize[item.sizeId] = {};
          tempSize[item.sizeId].sizeId = item.sizeId || '';
          tempSize[item.sizeId].sizeName = item.sizeName || '';
          sizeArr.push(tempSize[item.sizeId]);
        }
        if (goodsExtend.attrCount == 2) {
          skuObj[item.colorId].sizeList = skuObj[item.colorId].sizeList || {};
          skuObj[item.colorId].sizeList[item.sizeId] = item;
        }
      });
      this.setData({
        colorArr,
        sizeArr,
        skuObj,
        select_goods,
        goodsExtend,
      })
      if (goodsExtend.attrCount == 1 && !select_goods.productInfo.productId) { //单规格初始化 赋值productInfo
        this.colorSelect({ detail: { 'color_id': select_goods.select_color_id}});
      }
      return Promise.resolve(res);
    }
    return Promise.reject();
  })
}


function createObjKeyVal(obj, key,type) {
  if (obj instanceof Array) {
    let json = {};
    let initImg = {};
    for (let i = 0; i < obj.length; i++) {
      let Id = obj[i][key];
      if (!json[Id]) {
        json[Id] = [];
      }
      json[Id].push(obj[i]);
      
      if (type && type == 'initImg') {
        if (!initImg[Id]) {
          initImg[Id] = [];
        }
        initImg[Id].push(obj[i] && obj[i].imgUrl || '')
      }
    }
    this.gallery_init = initImg || {};
    return json;
  }
}


function setDownTime(update=false) {
  let activityInfo = this.activityInfo || {};
  let state = activityInfo.state || 0;
  let startTime = MyDate.parse(activityInfo.serverTime || '') || '';
  let endTime = 0;
  let check = checkTime.call(this);
  if (check.timeDown) {
    endTime = check.etime || 0;
  }
  stopCountDown.call(this);
  // console.log(state,'开始 结束时间', startTime, endTime)
  if (!startTime || !endTime) return
  if (!this.countDown || update) {
    stopCountDown.call(this);
    this.countDown = new CountDown(startTime);
  }
  this.countDown.setTarget(endTime);
  setTime.call(this, this.countDown);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        // console.log('更新状态');
        stopCountDown.call(this);
        loadData.call(this, true);
      }
      setTime.call(this, e);
    });
  } 
  return Promise.resolve();
} 

function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
  }
} 

function setTime(e) {
  let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
  this.setData({
    time: e.format(day > 0 ? "dd天 HH:mm:ss" : "HH:mm:ss")
  });
} 

function setSelectInfo(type='',data=0){
  let select_goods = this.select_goods || {};
  let skuObj = this.data.skuObj || {};
  let tempColor = type == 'color' ? data : select_goods.select_color_id
  if(type == 'color'){
    console.log('进来1',!skuObj[tempColor],skuObj,tempColor)
    if (!skuObj[tempColor]){
      let gallery = this.data.gallery;
      select_goods.select_color_id = data;
      select_goods.select_color = gallery[data].colorName;
      this.setData({
        swiper_current: 0
      })
      return;
    }
    let goodsExtend = this.data.goodsExtend || {}; 
    select_goods.select_color_id = data;
    select_goods.select_color = skuObj[data].colorName || '';  
    let size_id = select_goods.select_size_id; 
    this.setData({
      swiper_current:0
    })
    if (size_id && skuObj[data].sizeList){
      if ((!skuObj[data].sizeList[size_id])){ //点颜色时 已选中的尺寸不存在于点击的颜色 清除操作
        // console.log('清除尺码 ', skuObj[data].sizeList[size_id]);
        select_goods.select_size_id = 0;
        select_goods.select_size = '';
        select_goods.productInfo = this.goodsTotalInfo;
        (!this.popup) && (this.popup = this.selectComponent('#popup'));
        this.popup.clearSize();
      }
    }
  }else if(type == 'size'){
    let color_id = select_goods.select_color_id ;
    let size_id = data ;
    select_goods.select_size_id = data;
    select_goods.select_size = color_id && skuObj[color_id].sizeList && skuObj[color_id].sizeList[size_id] && skuObj[color_id].sizeList[size_id].sizeName || ''; 
  }  
  // console.log('select_goods', select_goods);
}


function setProductInfo(){
  let goodsExtend = this.data.goodsExtend || {};
  let select_goods = this.select_goods || {};
  let skuObj = this.data.skuObj || {};
  if (goodsExtend.attrCount==1){
    if (select_goods.select_color_id){
      select_goods.productInfo = skuObj[select_goods.select_color_id] || {};
      console.log('选满', select_goods);
    }
  }else if (goodsExtend.attrCount==2){
    let color_id = select_goods.select_color_id;
    let size_id = select_goods.select_size_id;
    if(color_id && size_id){
      select_goods.productInfo = skuObj[color_id] && skuObj[color_id].sizeList && skuObj[color_id].sizeList[size_id] || {};
      console.log('选满', select_goods);
    } 
  }
  this.setData({
    select_goods
  })
}

function checkSkuSelect(isCheckShip=true){
  //缺一个检查库存逻辑
  let name = '';
  let color_id = this.select_goods.select_color_id;
  let size_id = this.select_goods.select_size_id;
  let goodsExtend = this.data.goodsExtend;  
  let selectShipInfo = this.data.selectShipInfo||{};
  console.log("selectShipInfo",selectShipInfo);
  if (!color_id){
    name = `请选择${goodsExtend.color_name_title || "完整规格"}`
  } else if (!size_id && goodsExtend.attrCount==2){
    name = `请选择${goodsExtend.size_name_title || "完整规格"}`
  } else if(isCheckShip){
    if(goodsExtend.selfGet == 2 && selectShipInfo.selectIndex != 2){
      name = "请选择配送方式" 
    }else if (goodsExtend.selfGet == 1 && (selectShipInfo.selectIndex != 1 || !selectShipInfo.id)){
      name = "请选择自提店铺"
    }else if(goodsExtend.selfGet = 0 && (selectShipInfo.selectIndex == 1 && !selectShipInfo.id)){
      name = "请选择自提店铺"
    }
  } 
  if(name){
    app.SMH.showToast({
      title: `${name}`
    })
    return Promise.reject();
  }
  let inventoryRemnant = this.select_goods.productInfo && this.select_goods.productInfo.inventoryRemnant || 0
  if (!inventoryRemnant){
    app.SMH.showToast({
      title: `商品已售罄`
    })
    return Promise.reject();
  }
  return Promise.resolve();

} 

function checkPay(){
  let akId = this.select_goods.productInfo.akId;
  let selectShipInfo = this.data.selectShipInfo
  if(!akId)return
  let params={
    akId,
    userToken: app.LM.userToken,
    shippingType: selectShipInfo.selectIndex || 2,
    storeId: selectShipInfo.id || 0
  }
  return app.RunApi.go('SecKillApi', 'checkPay', params, this.extra).then(res=>{
    if(res.code=='1'){
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    return Promise.reject(e);
  })
} 

function checkCondition(_url ='checkCondition'){
  if(!this.data.isLogin){
    return Promise.reject();
  }
  let url = _url || 'checkCondition'
  if (this.data.activityInfo.shareCondition == 0 && url == 'checkCondition'){
    this.setData({
      [`${url}`]: true
    })
    return Promise.resolve();
  }
  let params = {
    activityId: this.options.activityId,
    userToken: app.LM.userToken,
  }
  if (url == 'checkLimit'){
    params = {
      goodsId: this.options.goodsId,
      ...params
    }
  }
  let check = false;
  return app.RunApi.go('SecKillApi', url, params, this.extra).then(res => {
    if (res.code == '1') {
      this.setData({
        [`${url}`]:true
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e => {
    if (url == 'checkLimit'){
      this.checkLimitMsg = e.msg || `该场活动限购${this.goodsBaseInfo.limitCount}件商品.`
    }
    this.setData({
      [`${url}`]: false
    })
    return Promise.resolve(e);
  })
}

function share() {
  let params = {
    activityId: this.options.activityId || this.activityInfo.activityId,
    userToken: app.LM.userToken
  }
  return app.RunApi.go('post','SecKillApi', 'addActivityLaunch', params, this.extra)
}

function listen() {
  if (app.LM.isLogin) {
    if(!this.data.isLogin){
      this.setData({
        isLogin: true
      });
    }
    return
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
    // checkScene.call(this,true);
  });
} 

function unListen() {
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}

function showPage(arr=[]) {
  let p = new Promise((rs, rj) => {
    return Promise.all(arr).then(res => {
      rs(res);
    }).catch(e => {
      rj(e);
    });
  });
  return p.finally(() => {
    this.setData({
      showPage: true
    })
    return Promise.resolve();
  }) 
}

function checkTime(){
  let activityInfo = this.activityInfo || {};
  let result = GetStatus.getTimeMsg.call(this, activityInfo);
  result = result || {};
  this.setData({
    timeText: result.text || '',
    time: result.time || ''
  })
  // console.log('time文案', result, this.data.timeText);
  return result
}

function checkScene(reset = false){
  let scene = this.options.scene;
  if (scene && !this.data.showPage) {
    app.SHP.getParams(["goodsId", "activityId"]).then((params) => {
      this.options = {
        ...this.options,
        ...params
      }
      loadData.call(this);
    })
  } else if(!this.data.showPage){
    loadData.call(this);
  } else if (!this.data.checkCondition){
    checkCondition.call(this, 'checkCondition');
    if (reset){
      checkCondition.call(this, 'checkUserRank');
      checkCondition.call(this, 'checkLimit');
    }
  }
}

function goAction(type=''){
  let name = 'GOODS_SHARE';
  let position = 'SECKILL_GOODS_DETAIL';
  let params = {
    activityId: this.options.activityId || 0,
    goodsId: this.options.goodsId || 0,
  }
  if(type == 'index'){
    name = 'ACTIVITY_SHARE';
    params = {
      activityId: this.options.activityId || 0,
      groupId: this.options.groupId || 0
    }
  }
   
  this.addActionLog(name, position, params);
}
function popupLoading(){
  this.loading_pop = true;
  setTimeout(()=>{
    this.loading_pop = false;
  },500)
}


//
function showPriceExplain() {
  app.sysTemConfig("is_show_price_explain").then(res => {
    if (res.Value == "1") {
      app.sysTemConfig("brand_url").then(data1 => {
        app.sysTemConfig("goods_price_explain").then(data2 => {
          this.setData({
            priceExplain: data1.Value + data2.Value
          })
        })
      })

    }
  })
}


function initImgArr(obj = {}) {
  this.colorNum = 0;
  if(Object.getOwnPropertyNames){
    this.colorNum = Object.getOwnPropertyNames(obj).length;
  }else{
    for (let i in obj) {
      this.colorNum += 1;
    }
  }
}
 
function checkSubState() {
  let info = this.activityInfo || {};
  let tplsList = this.tplsList || [];
  let key = WxSub.getKeyTemplate("SECKILL") || {};
  let SubScribe = {};
  tplsList.forEach(item => {
    SubScribe[item.tplType] = info[key[item.tplType]];
  }) 
  // this.subState = SubScribe; 
  this.setData({
    SubScribe,
    tplsList
  })
  console.log('初始化', SubScribe)
}

function updateSubState(e) {
} 

function createObjKeyValJson(obj, key) {
  if (obj instanceof Array) {
    let json = {};
    for (let i = 0; i < obj.length; i++) {
      let Id = obj[i][key];
      if (!json[Id]) {
        json[Id] = (obj[i])
      }
    }
    return json;
  }
}

function getShipStore() {
  let select_store = app.StorageH.get("select_store") || {};
  let selectShipInfo = this.data.selectShipInfo || {};
  if (select_store.id && selectShipInfo.selectIndex==1) {
    let store_id = select_store.id;
    let goodsExtend = this.data.goodsExtend||{};
    selectShipInfo.id = store_id; 
    selectShipInfo.name = select_store.name||""; 
    this.setData({
      selectShipInfo: selectShipInfo
    })
    if(this.jumpSelfGet){
      this.jumpSelfGet = false;
      getSku.call(this);
    }
  }else{
    selectShipInfo.selectIndex = 2;
    this.setData({
      selectShipInfo: selectShipInfo
    })
  }
}

function setAnim(type){
  this.specPop = this.specPop || this.selectComponent('#specPop') ;
  if(type == "show"){
    this.style_select_show = true;
    this.specPop.setShow(); 
  }else {
    this.style_select_show = false;
    this.specPop.setHide();
  }
}
 
function  loadComments(params) {
  this.comments = this.comments || this.selectComponent('#comments');
  this.comments.initData(this.options.goodsId);
}

function globalSubscribe(id=0,type='get'){
  if(type == 'get'){
    let GLOBAL_SUBSCRIBE = app.StorageH.get('GLOBAL_SUBSCRIBE',{})||{};
    let globalTpls = this.data.globalTpls||[];
    if(globalTpls.length<=0 || GLOBAL_SUBSCRIBE.SEC && GLOBAL_SUBSCRIBE.SEC[id])return true 
  }else if(type == 'set'){
    let GLOBAL_SUBSCRIBE = app.StorageH.get('GLOBAL_SUBSCRIBE',{})||{};
    GLOBAL_SUBSCRIBE.SEC || (GLOBAL_SUBSCRIBE.SEC = {});
    GLOBAL_SUBSCRIBE.SEC[id] = true;
    app.StorageH.set('GLOBAL_SUBSCRIBE',GLOBAL_SUBSCRIBE,60*24*365);
  }
}

function setGloabalSubscribe(detail={}){ //订阅接口传参处理
  let subResult = detail.subResult || {};
  let tplsList = this.data.globalTpls || [];
  let reqList = [];
  for (let i = 0; i < tplsList.length; i++){
    let wxTplId = tplsList[i].wxTplId || "";
    let tplType = tplsList[i].tplType || "";
    let brandTplId = tplsList[i].brandTplId || 0;
    let state=subResult[wxTplId];
    console.log('subResult',subResult,wxTplId)
    reqList.push({
      relatedType:'SECKILL_ACTIVITY',
      relatedId:this.options.activityId,
      extendId1:this.options.goodsId,
      tplType,
      brandTplId,
      state
    }) 
  }
  WxSub.setSubscribe(reqList,null,'GLOBAL');
}