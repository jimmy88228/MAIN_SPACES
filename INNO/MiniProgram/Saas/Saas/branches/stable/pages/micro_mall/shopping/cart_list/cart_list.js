// pages/micro_mall/shopping/cart_list/cart_list.js
import PromH from "../../../../common/helper/handle/promHandle.js";
import { modifyCartSelfGet, cantSelfGet } from "../../goods/module/videoLiveChannelControl/helper.js";
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {
    checkIphoneX: {
      type: Boolean,
      value: false
    },
    customTab: {
      type: Boolean,
      value: false
    },
    hasCustomData:{
      type: Boolean,
      value:false
    },
    options: {
      type: Object,
      value: {}
    },
    isEditAll: {
      type: Boolean,
      value: false,
      observer:function(n){
        this.editCartEvent(n);
      }
    }
  },
  data: {
    scrollAnimation: false,
    brand_info: {},
    cartArr: [],
    cartArrJson: {},
    edit_all: false,
    select_all: false,
    select_onLine: false,//线上商品包括组合，另取变量控制全选
    select_states: {},
    total_count: {
      market_money: 0.00,
      money: 0.00,
      integral: 0,
      cart_num: 0,
      product_str: '0',
      rec_str: '0',
      promotionInfo:{},
    },
    types: {
      "offLine": "offLine",
      "onLine": "onLine"
    },
    changeShipInfo: {},
    promotionInfo: {},
    setShare:false,
    navPlace:app.SIH.navPlace
  },
  distance: 0,
  edit_index: 0,
  selectCarts: "",
  limitRuleType:{},
  ready() {
    let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
    let g_add = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add.png";
    let g_add_none = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add_none.png";
    let g_reduce = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_reduce.png";
    let g_reduce_none = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
    this.setData({
      ls_icon2: ls_icon2,
      ls_icon1: ls_icon1,
      g_add: g_add,
      g_add_none: g_add_none,
      g_reduce: g_reduce,
      g_reduce_none: g_reduce_none,
    })
    this.toasts_bar = this.toasts_bar || this.selectComponent("#toasts_bar");
  },
  detached(){
    checkDefaultSelect.call(this, 'set');
    unListen.call(this);
  },
  pageLifetimes: {
    show: function () {
    },
    hide: function () {
      checkDefaultSelect.call(this,'set');
      unListen.call(this);
    },
  },
  methods: {
    onShowFnc(){
      if (!this.onshowBool){
        checkDefaultSelect.call(this);
        listen.call(this);
      } 
    },
    //初始化所有编辑
    completeAllCart: function () {
      let edit_states = this.data.edit_states;
      for (let i in edit_states) {
        edit_states[i].edit = false;
      }
      this.setData({
        edit_all: false,
        edit_states: edit_states
      })
    },
    //
    editCartEvent: function (status) {
      let edit_all = this.data.edit_all;
      if(status != edit_all){
        this.setData({
          edit_all: status
        })
      }
    },
    //全选
    // selectedAll: function (e) {
    //   let cartArrJson = this.data.cartArrJson;
    //   let select_all = this.data.select_all;
    //   select_all = !select_all;
    //   let result = recursionSelect.call(this, cartArrJson, select_all);
    //   this.setData({
    //     cartArrJson: result,
    //     select_all: select_all
    //   })
    //   totalNumHandle.call(this, "all", select_all);
    // },
    /**
     *单个选择切换 
     */
    singleSelectConfirm(e) {
      let goodsJson = this.data.goodsJson||{};
      let dataset = e.currentTarget.dataset || {};
      let is_invalid = dataset.is_invalid;
      let index = dataset.index;
      let recId = dataset.recId;
      let select = dataset.select;
      if(is_invalid != 0 || (goodsJson[recId].extend_field1 && goodsJson[recId].extend_id != '1')){
        return
      }
      if (typeof (index) == "undefined") return;
      if(recId && goodsJson[recId] && !select){
        if(checkInvalid.call(this,recId)){
          return
        }
      }
      setClickStatus.call(this, dataset,"single");
      checkAllSelect.call(this,dataset.moduleIndex, dataset.cartsIndex);
      totalNumHandle.call(this);
    },
    itemSelect(e) {
      let dataset = e.currentTarget.dataset || {};
      if (typeof (dataset.moduleIndex) == "undefined" && typeof (dataset.cartsIndex) == "undefined") {
        return;
      }
      setClickStatus.call(this,dataset,"all");
      checkAllSelect.call(this,dataset.moduleIndex, dataset.cartsIndex);
      totalNumHandle.call(this);
    }, 

    changeShipping(e) {
      let dataset = e.currentTarget.dataset || {};
      let key = dataset.key;
      if (!key) return;
      let goodsJson = this.data.goodsJson || {};
      let item = goodsJson[key];
      let changeShipInfo = {
        "isSelfGet": item.isSelfGet || 0,
        "rec_id": item.rec_id,
        "store_id": item.shipping_store_id || 0,
        "store_name": item.shipping_store_name || ""
      }
      modifyCartSelfGet(changeShipInfo)
      this.setData({
        changeShipInfo: changeShipInfo
      })
      this.shipPop = this.shipPop || this.selectComponent("#shipPop");
      this.shipPop.show();
    },
    changeCallback() {
      getBuyCarGoodList.call(this);
    },
    addGoodsNum(e) {
      changeGoodsNum.call(this, e, 'add');
    },
    reduceGoodsNum(e) {
      changeGoodsNum.call(this, e, 'reduce');
    },
    inputGoodsNum(e){
      changeGoodsNum.call(this, e, 'input');
    },
    delectShoppingCart: function (e) {
      let that = this;
      let dataset = this.getDataset(e);
      let recId = dataset.recId || 0;
      let data = dataset.data||{};
      let total_count = this.data.total_count;
      if (!recId && total_count.cart_num == 0) {
        app.SMH.showToast({
          "title": "没有勾选商品"
        })
        return;
      }
      wx.showModal({
        title: '',
        content: (recId || !this.data.select_all) ? '确定删除选中商品' : '确定清空购物车',
        success: function (res) {
          if (res.confirm) {
            let isBackage = data.isBackage || ""; 
            if(isBackage){
              let cartsIndex = dataset.cartsIndex||0;
              let moduleIndex = dataset.moduleIndex||0;
              let cartArr = that.data.cartArr||[];
              let editItems = cartArr[moduleIndex].items[cartsIndex];
              recId = "";
              for (let i = 0; i < editItems.items.length; i++) {
                if(editItems.items[i].isBackage == isBackage){
                  recId += (recId?",":"") + editItems.items[i].recId
                }
              }
            }
            console.log('dataset',dataset,recId);
            return app.BuyApi.delCartStroage({
              data: {
                "rectIds": recId || total_count.rec_str,
                "brandCode": app.Conf.BRAND_CODE,
                "userToken": app.LM.userToken,
                "clientSessionId": app.LgMg.channel && app.LgMg.channel.clientSessionId,
                "visitLogId": app.LgMg.pageLog && app.LgMg.pageLog.logId
              },
              other: {
                isShowLoad: true
              }
            }).then(e => {
              if (e.code == "1") {
                getBuyCarGoodList.call(that);
              }
            })
          }
        }
      })
    },
    handleScoll(e) {
      this.distance = e.detail.scrollLeft;
      this.canScroll = true; //不能滑动时为false
    },
    handleMove(e) {
      this.moveSecond = e.changedTouches[0].clientX;
      this.abs = this.moveSecond - this.moveStart;
      this.log = this.abs<= 0?"show":"hide";
      this.show = this.abs <= 0;
      this.temp = this.show ? "show":"hide";
      this.moveStart = this.moveSecond
    },
    handleStart(e) {
      this.canScroll = false;
      let touches = e.changedTouches[0] || {};
      this.moveStart = touches.clientX || 0;
    },
    handleEnd(e) {
      let dataset = e.currentTarget.dataset;
      let edit_states = this.data.edit_states || {};
      let recId = dataset.recId || "";
      let str = "";
      let setData = false;
      let timer = setTimeout(() => { //秒操作滑动需要延迟 
        if (this.canScroll) {
          if (this.show && this.distance > 12) { //显示 大于53 ios
            if (this.distance <= 53) {
              str = 60 + 'px'
              edit_states[recId].showDelete = str;
              setData = true;
            }else if(!edit_states[recId].showDelete){
              str = 60 + 'px';
              edit_states[recId].showDelete = str;
            }
          } else if (this.show && this.distance > 0) { //恢复隐藏
            str = ''
            edit_states[recId].showDelete = str;
            setData = true;
          } else if (!this.show && this.distance < 40) { //隐藏  小于0 ios
            if (this.distance >= 0) {
              str = ''
              edit_states[recId].showDelete = str;
              setData = true;
            }
          } else if (!this.show) { //恢复显示
            str = 60 + 'px'
            edit_states[recId].showDelete = str;
            setData = true;
          }
        }
        if(setData){
          this.setData({
            edit_states: edit_states
          })
        }
        timer && clearTimeout(timer);
      }, 200)
    },
    loginCallback(detail = {}) {
      if (!detail.rec_str) return;
      if (detail.storeId) {
        wx.navigateTo({
          url: '/pages/micro_mall/buy/Mwin_buy/buy?rec_str=' + detail.rec_str + '&store_id=' + detail.store_id,
        })
      } else {
        wx.navigateTo({
          url: '/pages/micro_mall/buy/buy?rec_str=' + detail.rec_str + '&store_id=' + detail.store_id,
        })
      }
    },
    noFun() {
    },
    goDetail: function (e) {
      let dataset = e.currentTarget.dataset || {};
      let url = dataset.url || '';
      wx.navigateTo({
        url: url,
      })
    },
    goSettleEvent: function (e) {
      let total_count = this.data.total_count;
      if (total_count.cart_num == 0) {
        return;
      }
      if (total_count.warn) {
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setSingleBtn("确定");
        this.pageDialog.setCentent(total_count.warn);
        this.pageDialog.show()
        return;
      }
      checkCartIsNormal.call(this, total_count.rec_str).then(res => {
        let userChoiceData = {
          "product_str": total_count.product_str,
          "rec_str": total_count.rec_str
        }
        app.StorageH.set('userChoiceData', userChoiceData);
        this.loginCallback(total_count);
      }).catch(e => {
        wx.redirectTo({
          url: '/pages/micro_mall/tips_page/abnormal',
        })
      })
    },
    promotion_detail(e){
      this.promotion = this.promotion || this.selectComponent('#promotion');
      this.promotion.init(null, this.data.total_count.promotionInfo || {});
    },
    onPageScroll(e){
      if(this.data.hasCustomData){
        this.pageTab || (this.pageTab = this.selectComponent(`#${this.data.microType}`));
        this.pageTab && this.pageTab.handle_scroll(e&&e.scrollTop);
      }
    },
    onReachBottom(e){
      if(this.data.hasCustomData){
        this.pageTab || (this.pageTab = this.selectComponent(`#${this.data.microType}`));
        this.pageTab && this.pageTab.reachBottom();
      }
    },
    getPromDetail(e){
      let dataset = e.currentTarget.dataset || {};
      let ruleId = dataset.ruleId;
      if(!ruleId){ return }
      let promJson = this.data.promJson ||{};
      let CurrentPromote = promJson[ruleId];
      app.StorageH.set("CurrentPromote", CurrentPromote)
      wx.navigateTo({
        url: '/pages/micro_mall/goods/promote_activity/promote_activity?ruleId=' + ruleId,
      })
    },
    getCouponList(e){
      let dataset = e.currentTarget.dataset || {};
      console.log("getCouponList",dataset);
      this.couponList = this.couponList || this.selectComponent("#couponList");
      this.couponList.getCouponList(dataset.goodsId);
    },
    cancelSign(e){
      console.log('cancelSign');
      this.setData({cancelSignBool:true});
      let storage = app.StorageH.get('curSignActInfo',{});
      storage.id = this.data.curSignActInfo.id;
      app.StorageH.set('curSignActInfo',storage,60*24*365);
    }
  }
}))
//获取购物车列表
function getBuyCarGoodList() {
  console.log('进来 购物车列表')
  // return app.BuyApi.getBuyCarGoodList({
  //   params: {
  //     userToken: app.LM.userToken,
  //     brandCode: app.Conf.BRAND_CODE
  //   },
  //   other: {
  //     isShowLoad: true
  //   }
  // })
  return app.BuyApi.getShoppingCartList({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  })
  .then(e => {
    if (e.code == 1) {
      let data = e.data || {};
      let goodsList = data.goodsList || [];
      let promList = data.promList || [];
      let cartArr = [],goodsJson = {},cartKeys = {},promJson={},edit_states={};
      let thisRuleId = 0;
      //拼装促销
      for(let i = 0;i < promList.length; i++){
        //
        let promItem = promList[i];
        let giftItemList = [];
        let goodsArr = promItem.goodsList || [];
        let goodsStr = "";
        //所属商品
        for(let j = 0;j < goodsArr.length; j++){
          goodsStr = goodsStr ? goodsStr + ';' + goodsArr[j].recId : goodsArr[j].recId
        }
        //
        let conditionList = promItem.conditionList || [];
        let tip1 = {},tip2 = "";
        for(let j = 0; j < conditionList.length;j++){
          let giftList = conditionList[j].giftList || [],keyTip={};
          for(let k = 0; k < giftList.length; k++){
            let giftType = giftList[k].giftType;
            let mapGiftType = PromH.getGiftRule(giftType);
            let giftTips = giftList[k].giftTips;
            let ruleTypeStr = PromH.limitRuleType[giftType];
            if(PromH.keyTip[mapGiftType] && PromH.keyTip[mapGiftType].showDetail){
              if(!tip1[mapGiftType]){
                tip1[mapGiftType] = {
                  tip: ruleTypeStr,
                  txt: ""
                };
              }
              tip1[mapGiftType].txt = tip1[mapGiftType].txt ? tip1[mapGiftType].txt + "；" + giftTips : giftTips;
            }else{
              if(tip2.indexOf(ruleTypeStr) == -1){
                tip2 = tip2 ? tip2 + ";" + ruleTypeStr : ruleTypeStr
              }
            }
            //为促销详情拼装
            let index = keyTip[mapGiftType];
            let cdn_num = conditionList[j].conditionNumber;
            let condition = promItem.conditionType == 1 ? "满" + cdn_num + "元" : "满" + cdn_num + "件"
            if(typeof(index) == "undefined"){
              index = giftItemList.length;
              keyTip[mapGiftType] = index;
              giftItemList.push({
                txt: ruleTypeStr,
                // goodsList:[],
                list: [],
                condition:[],
                tip: [],
                key: index,
                type: giftType,
                // condition: promItem.conditionType == 1 ? "满" + conditionList[j].conditionNumber + "元" : "满" + conditionList[j].conditionNumber + "件"
              })
            }
            //giftItemList[index].tip = giftItemList[index].tip ? giftItemList[index].tip + ";" + giftTips : giftTips;
            giftItemList[index].tip.push(giftTips);
            giftItemList[index].condition.push(condition)
            if(giftType == 1){
              giftItemList[index].list.push(giftList[k].giftList);
            }else if(giftType == 2){
              if(giftList[k].giftList.length>0){
                giftItemList[index].list = giftItemList[index].list || [];
                giftItemList[index].list.push(giftList[k].giftList);
              }
            }
            // if(giftType == 1){
            //   // giftItemList[index].couponList = giftItemList[index].couponList.concat(giftList[k].giftList);
            //   giftItemList[index].list.push(giftList[k].giftList);
            // }
            // if(giftType == 2){
            //   giftItemList[index].goodsList = giftItemList[index].goodsList.concat(giftList[k].giftList);
            // }
          }
        }
        //
        delete promItem.conditionList;
        delete promItem.goodsList;
        promItem.tip1Arr = tip1;
        promItem.tip2Arr = (tip2 && tip2.split(";")) || [];
        promJson[promItem.ruleId] = JSON.parse(JSON.stringify(promItem));
        promJson[promItem.ruleId].giftList = giftItemList;
        console.log('promJson',i,promJson)
        promItem = {
          goodsStr: goodsStr,
          ruleId: promItem.ruleId
        };
        promList[i] = promItem;
      }
      //拼装商品结构
      for(let i = 0; i < goodsList.length; i++){
        let goods = goodsList[i];
        let storeId = goods.shipping_store_id || goods.store_id || 0;
        let storeName = storeId ? goods.shipping_store_name || goods.store_name : "快递配送";
        let key = storeId || "normal"
        let id = "";
        let item = {
          type: goods.platform_src,
          select: false,
          edit: false,
          onLine: goods.store_id ? false : true,
          storeName: storeName,
          storeId: key,
          items:[]
        }
        //检测当前商品所属ruleId
        for(let j = 0;j < promList.length; j++){
          let goodsStr = ";" + promList[j].goodsStr + ";" || "";
          if(goodsStr.indexOf(";" + goods.rec_id + ";") != -1){
            thisRuleId = promList[j].ruleId;
            break;
          }
        }
        //
        let key_thisRuleId = key + "_" + thisRuleId;
        let ruleIDItems = null;
        if(typeof(cartKeys[key]) == "undefined"){
          cartKeys[key] = cartArr.length;
          item.id = cartArr.length;
          id = item.id;
          cartArr.push(item)
        }
        ruleIDItems = cartArr[cartKeys[key]].items;
        if(typeof(cartKeys[key_thisRuleId]) == "undefined"){
          cartKeys[key_thisRuleId] = ruleIDItems.length || 0;
          id = cartArr[cartKeys[key]].id + "-" + ruleIDItems.length;
          ruleIDItems.push({
            edit: false,
            select: false,
            ruleId: thisRuleId,
            id: id,
            items:[]
          })
        }
        let isSelect = false;
        if(this.selectCarts.indexOf(',' + goods.rec_id + ',') != -1){
          isSelect = true
        }
        id = ruleIDItems[cartKeys[key_thisRuleId]].id + "-" + ruleIDItems[cartKeys[key_thisRuleId]].items.length
        cartArr[cartKeys[key]].items[cartKeys[key_thisRuleId]].items.push({
          edit: false,
          select: isSelect,
          id: id,
          isBackage: goods.extend_field1,
          recId: goods.rec_id
        })
        cartArr[cartKeys[key]].items[cartKeys[key_thisRuleId]].select = cartArr[cartKeys[key]].items[cartKeys[key_thisRuleId]].items.every(e_item=>e_item.select);
        goodsJson[goods.rec_id] = goods;
        edit_states[goods.rec_id] = {
          eidt: false
        }

      }
      this.cartKeys = cartKeys;
      this.setData({
        cartArr: cartArr,
        goodsJson: goodsJson,
        promJson: promJson,
        hasData: goodsList.length > 0 ? true : false,
        edit_states: edit_states
      })
      console.log("promList",promList)
      console.log("promJson",promJson)
      console.log("goodsJson",goodsJson)
      console.log("cartArr",cartArr)
      cartArr.forEach((item,i)=>{
        checkAllSelect.call(this,i,0,{init:true});
      })
      totalNumHandle.call(this);
      initShoppingAds.call(this);
      // checkSelectCarts.call(this);
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
function initShoppingAds(){
  getShoppingAds.call(this).then(resData => {
    if(!resData.pageId || resData.pageId==0){Promise.reject();};
    this.setData({hasCustomData:true});
    this.nextTick().then(()=>{
      let type = !this.firstSet ? {loadDataType:"bottom"} : {};
      this.firstSet = true;
      this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
      console.log("resData",resData,this.data.hasCustomData,this);
      this.pageTab.getPageData({ 
        page_id: resData.pageId,
        ...type,
      });
    })
  })
}

function getShoppingAds(){
  return app.GoodsApi.getShoppingAds({
    params:{
      brandCode: app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then((res)=>{
    if (res && res.code == '1' && res.data) {
      let data = res.data;
      return Promise.resolve(data);
    }
    return Promise.reject();
  })
}

function setSelectCarts(recId, select ,check=false) {
  if(!recId){ return }
  let selectCarts = this.selectCarts || "";
  if(select){
    if(selectCarts.indexOf(',' + recId + ',') == -1){
      selectCarts = selectCarts ? selectCarts + recId + ',' : ',' + recId + ',';
    }
  }else{
    if(selectCarts.indexOf(',' + recId + ',') != -1){
      selectCarts = selectCarts.replace(new RegExp(',' + recId + ',', 'g'), ",");
    }
  }
  console.log('当前购物车',select,selectCarts);
  this.selectCarts = selectCarts
}
//

//递归循环
function recursionSelect(items, select) {
  for (let i = 0; i < items.length; i++) {
    items[i].select = select;
    let id = items[i]
    if (items[i].items && items[i].items.length > 0) {
      recursionSelect(items[i].items, select);
    } else if (id) {
      continue;
    }
  }
  return items;
}

//计算合计
function totalNumHandle(type, isSelect) {
  let goodsJson = this.data.goodsJson;
  let selectCarts = this.selectCarts ||  "";
  let money = 0, market_money = 0, integral = 0;
  let select_cart = 0, select_nums = 0, select_store = 0;
  let product_str = '', rec_str = '';
  let discount_money = 0;
  let is_invalid_num = 0;
  // let self_get_num = 0;
  // let express_num = 0;
  let isStore = false, isSelfget = false, noSelfget = false, choiceMoreStore = false;
  for(let i in goodsJson){
    let editItem = goodsJson[i];
    let rec_id = editItem.rec_id;
    if (selectCarts.indexOf(',' + rec_id + ',') != -1 || (type == "all" && isSelect)) {//已选
      let s_store_id = editItem.shipping_store_id;
      let store_id = editItem.store_id;
      let is_invalid = editItem.is_invalid;
      let product_id = editItem.product_id;
      //判断为纯方式选择
      if (s_store_id) {//门店
        isSelfget = true
        if (select_store && !choiceMoreStore) {
          choiceMoreStore = select_store != s_store_id ? true : false
        }
        select_store = s_store_id;
      } else if (store_id) {//线下
        isStore = true
        select_store = store_id;
      } else {//快递配送
        noSelfget = true;
      }
      //失效
      if (is_invalid == 1 || is_invalid == 4) { // is_invalid=4因为搭配套餐而不能单独购买
        is_invalid_num += parseInt(editItem.number) * 1
      }
      if (editItem.goods_type == "1") {
        if (parseFloat(editItem.goods_price) > 0) {
          money += parseInt(editItem.number) * parseFloat(editItem.goods_price);
        }
      } else {
        if (parseFloat(editItem.exchange_price) > 0) {
          money += parseInt(editItem.number) * parseFloat(editItem.exchange_price);
        }
      }
      market_money += parseInt(editItem.number) * parseFloat(editItem.market_price);
      integral += parseInt(editItem.number) * parseFloat(editItem.integral);
      select_nums += parseInt(editItem.number) * 1;
      product_str = product_str == "" ? product_id : product_str + "," + product_id
      rec_str = rec_str == "" ? rec_id : rec_str + "," + rec_id
      select_cart++;
    }
  }
  if (type == "all") {
    if (isSelect) {
      this.selectCarts = ',' + rec_str + ',';
    } else {
      this.selectCarts = "";
    }
  }
  let warn = "";
  if (isStore && isSelfget) {//不同线
    warn = "大屏商品请单独下单";
  } else if (isStore && noSelfget) {//不同店铺
    warn = "大屏商品请单独下单";
  } else if (isSelfget && noSelfget) {//不同门店类型
    warn = "配送方式不一致请区分下单";
  } else if (is_invalid_num > 0) {//存在失效
    warn = "无效商品不可结算"
  } else if (choiceMoreStore) {
    warn = "多家门店自提订单请分开下单";
  }
  let total_count = {
    money: money.toFixed(2),
    integral: integral,
    cart_num: select_nums,
    product_str: product_str,
    rec_str: rec_str,
    store_id: select_store,
    warn: warn,
    market_money: market_money,
    discount_money: discount_money,
  }
  countPromotion.call(this, rec_str, total_count);
}
//修改数量
function changeGoodsNum(e, change_type) {
  let dataset = e.currentTarget.dataset || {};
  let recId = dataset.recId;
  // let inputType = dataset.inputType;
  if (!recId) return;
  let goodsJson = this.data.goodsJson || {};
  let goodsData = goodsJson[recId] || {};
  let limit_num = parseInt(goodsData.product_number);
  //搭配套餐商品不允许修改数量
  if (goodsData.extend_field1) return;
  let reqUrl = "", number = 1, isAdd = false,warn = "";
  switch(change_type){
    case "input" :
      let o_number = parseInt(goodsData.number);
      let value = e.detail.value;
      value = value.replace(/[^\d]/g,'');
      if(value < 1){
        value = 1;
        warn = "最少可选数量为1"
      }else if(value > limit_num){
        value = limit_num;
        warn = "超出了最大可选数量"
      }
      number = value - o_number;
      if(number > 0){
        reqUrl = "addCartStroageNum";
        isAdd = true;
      }else if(number < 0){
        reqUrl = "subtractCartStroageNum";
        isAdd = false;
      }else{
        let dataKey = `goodsJson.${recId}.number`;
        this.setData({
          [dataKey]: o_number
        })
        return;
      }
      break;
    case "add" :
      reqUrl = "addCartStroageNum";
      isAdd = true;
      break;
    case "reduce":
      reqUrl = "subtractCartStroageNum"
      isAdd = false;
      break;
    default:
      console.log("未知类型",change_type);
      return;
  }
  return app.BuyApi[reqUrl]({
    data: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken,
      rectId: recId,
      number: Math.abs(number),
      clientSessionId: app.LgMg.channel && app.LgMg.channel.clientSessionId,
      visitLogId: app.LgMg.pageLog && app.LgMg.pageLog.logId
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      if (isAdd) {
        goodsData.number = parseInt(goodsData.number) + parseInt(Math.abs(number));
      } else {
        goodsData.number = parseInt(goodsData.number) - parseInt(Math.abs(number));
      }
      // edit_data[key][index] = goodsData
      if(warn){
        app.SMH.showToast({
          title: warn
        })
      }
      let dataKey = `goodsJson.${recId}`;
      this.setData({
        [dataKey]: goodsData
      })
      totalNumHandle.call(this);
      return Promise.resolve(e);
    }
    app.SMH.showToast({
      title: e.msg
    })
    return Promise.reject();
  })
}

function listen() {
  getShippingConfig.call(this);
  if (app.LM.isLogin) {
    this.setData({
      isLogin: true
    })
    if (this.isBuyBack) {
      return;
    }
    checkSignReward.call(this);
    getBuyCarGoodList.call(this);
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if (app.LM.isLogin) {
      this.setData({
        isLogin: true
      })
      checkSignReward.call(this);
      getBuyCarGoodList.call(this);
    }
  });
}
function unListen() {
  this.isBuyBack = false;
  if (this.listenLoginStatuId) {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
  this.completeAllCart();
}

function checkCartIsNormal(rec_str = '') {
  let data = {
    recIds: rec_str,
    brandCode: app.Conf.BRAND_CODE
  },
    extra = {
      diy: true
    };
  return app.RunApi.go('GoodsApi', 'checkJieSuanCartstorage', data, extra).then(res => {
    if (res.code == 1) {
      if (res.data == 1) {
        return Promise.resolve();
      }
    }
    return Promise.reject();
  }).catch(e => {
    return Promise.reject();
  })
}
function getShippingConfig() {
  app.sysTemConfig("shipping_config").then(data => {
    this.setData({
      shipConfig: data.Value || "1",
    })
  })
}

function countPromotion(rec_str = '', total_count) {
  if (!rec_str) {
    let data = {
      discountAmount: 0,
      goodsAmount: 0,
      isFreeShipping: 0,
      sum_money: 0
    };
    total_count.money = 0;
    total_count.promotionInfo = data
    this.setData({
      total_count
    })
    return
  }
  this.cur_rec_str = rec_str;
  let params = {
    recIds : rec_str
  }
  return app.RunApi.go('post', 'GoodsApi', 'countPromotionInfoByJieSuan', params).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      let sum_money = parseFloat((data.goodsAmount - data.discountAmount).toFixed(2)) || 0;
      data.sum_money = sum_money;
      total_count.money = sum_money || 0;
      total_count.promotionInfo = data
      this.setData({
        total_count
      })
      return Promise.resolve();
    }
    return Promise.reject();
  })
}

function setClickStatus(dataset = {},check_type=""){
  console.log(check_type,dataset)
  let moduleIndex = dataset.moduleIndex;
  let cartsIndex = dataset.cartsIndex;
  let index = dataset.index;
  let isBackage = dataset.isBackage || false;
  let cartArr = this.data.cartArr || [];
  let editItems = [],editItem = {};
  let setDataName = "";
  if (check_type == 'single'){
    editItems = cartArr[moduleIndex].items[cartsIndex];
    editItem = editItems.items[index];
    editItem.select = !editItem.select; //点击处按钮状态改变
    let selectAllItem = true;
    if (isBackage) {//套餐商品
      console.log('套餐',editItems.items)
      for (let i = 0; i < editItems.items.length; i++) {
        if(editItems.items[i].isBackage == isBackage){
          editItems.items[i].select = editItem.select;
          let recId = editItems.items[i].recId || 0;
          setSelectCarts.call(this, recId, editItem.select)
        }
      }
      selectAllItem = editItem.select;
    } else {  //普通商品、门店自提  
      if(editItem.select){
        for (let i = 0; i < editItems.items.length; i++) {
          let recId = editItems.items[i].recId || 0;
          if(checkInvalid.call(this,recId)){ //非法商品不检测全选
            // console.log('跳过')
            continue
          }
          if (!editItems.items[i].select) { //检测是否有没选中的商品,若存在就全选为false
            selectAllItem = false;
            break;
          }
        }
      }else{
        selectAllItem = false;
      }
      let recId = editItem.recId || 0;
      setSelectCarts.call(this, recId, editItem.select)
    }
    editItems.select = selectAllItem;  //控制套餐、自提的外按钮状态 （普通商品在这里无作用）
    setDataName = 'cartArr[' + moduleIndex + '].items[' + cartsIndex + ']';
  } else if (check_type == "all"){
    if (typeof (cartsIndex) != "undefined") { //促销、套餐商品全选，目前不开放
      editItems = cartArr[moduleIndex].items[cartsIndex];
      editItems.select = !editItems.select;
      for (let i = 0; i < editItems.items.length; i++) {
        let item = editItems.items[i];
        item.select = editItems.select;
        let recId = item.recId || 0;
        setSelectCarts.call(this, recId, editItems.select)
      }
      setDataName = 'cartArr[' + moduleIndex + '].items[' + cartsIndex + ']'
    } else { //模块总选择
      editItems = cartArr[moduleIndex];
      editItems.select = !editItems.select;
      for (let i = 0; i < editItems.items.length; i++) {
        let item = editItems.items[i];
        item.select = editItems.select;
        for (let j = 0; j < item.items.length; j++) {
          let recId = item.items[j].recId||0;
          if(checkInvalid.call(this,recId)){
            continue
          }
          item.items[j].select = editItems.select;
          setSelectCarts.call(this, recId, editItems.select)
        }
      }
      setDataName = 'cartArr[' + moduleIndex + ']';
    }
  }

  if (setDataName){
    this.setData({
      [`${setDataName}`]: editItems //（点击处以及外按钮和总按钮的更新）
    })
  }
}

//更新套餐、自提外按钮状态 和 快递配送总按钮状态 （除了默认选中，其他情况都只更新快递配送总按钮状态）
function checkAllSelect(moduelIndex, cartsIndex, obj = {}) {
  let cartArr = this.data.cartArr || [];
  let checkAll = obj && obj.bool || false;
  let selectAllItem = true,exitsInvalid;
  if(typeof(cartsIndex) != "undefined" || checkAll){
    let editItem = cartArr[moduelIndex];
    let len = editItem.items.length - 1;
    for (let i = 0; i <= len; i++) {
      if(!editItem.items[i].select && !obj.init){
        selectAllItem = false;
        break;
      }
      let editItemChild = editItem.items[i].items || [];
      for (let j = 0; j < editItemChild.length; j++) {
        let item = editItemChild[j];
        let recId = item.recId||0;
        if(checkInvalid.call(this,recId)){
          if(obj.init && this.selectCarts && this.selectCarts != ','){
            // 选中商品检测非法
            if(this.selectCarts.indexOf((',' + recId + ',')) != -1){
              // 去除非法recId
              exitsInvalid = true;
              this.selectCarts = this.selectCarts.replace(new RegExp(',' + recId + ',', 'g'), ",");
              item.select = false;
              console.log('去除非法recId',recId)
            }
          }
          continue
        }
        if (!editItemChild[j].select) {
          selectAllItem = false;
          if(!obj.init){
            break;
          }
        }
      }
    }
    if(editItem.select != selectAllItem || exitsInvalid){
      editItem.select = selectAllItem;
      this.setData({
        ['cartArr[' + moduelIndex + ']']: editItem
      })
    }
  }
}
function checkOneMoreOrder() {
  let storage = app.StorageH.get('One_More_Order') || {};
  if (storage.recIds && storage.update) {
    this.selectCarts = "," + storage.recIds + ",";
    this.failArr = storage.failArr || [];
    this.setData({
      failArr: this.failArr
    });
  }
  app.StorageH.remove('One_More_Order');
  if (this.failArr && this.failArr.length > 0){
    this.tips_window = this.tips_window || this.selectComponent('#tips_window');
    this.tips_window.init(this.failArr);
    this.failArr = [];
    this.tips_window.show();
  }
   
}

function checkDefaultSelect(type="get"){ 
  let storage = app.StorageH.get('CART_DEFAULT_SELECT') || {};  
  if(!type || type == 'get'){
    this.onshowBool = true;
    this.selectCarts = storage.recIds || ""; //默认选中
    checkOneMoreOrder.call(this);            //再来一单默认选中
  }
  if (type == 'set'){
    this.onshowBool = false;
    storage.recIds = this.selectCarts;
    app.StorageH.set('CART_DEFAULT_SELECT', storage) || {};  
  }
}

function checkInvalid(recId){  //true是非法,false是正常
  let goodsJson = this.data.goodsJson||{};
  if(goodsJson[recId].is_invalid != 0 || (goodsJson[recId].number > goodsJson[recId].product_number || goodsJson[recId].product_number == 0)){
  // if(goodsJson[recId].is_invalid == 1 || goodsJson[recId].is_invalid == 2 || goodsJson[recId].is_invalid == 3 || (goodsJson[recId].number > goodsJson[recId].product_number || goodsJson[recId].product_number == 0)){
    return true
  }
  return false
}

function checkSignReward(){
  let params = {
    receiveType:0,
    pageIndex:1,
    pageSize:app.Conf.PAGE_SIZE
  }
  return app.RunApi.go('UserApi','get_UserSignOrderActivityReward',params).then(res=>{
    let data = res.data||{};
    let list = data.list||[];
    let curSignActInfo = list[0]||{};
    let storage = app.StorageH.get('curSignActInfo',{});
    if(curSignActInfo.id && storage.id != curSignActInfo.id){
      this.setData({curSignActInfo,cancelSignBool:false})
    }
    return curSignActInfo;
  })
}

// function checkSelectCarts(){
//   if(!this.selectCarts)return
//   let goodsJson = this.data.goodsJson;
//   for(let recId in goodsJson){
//     let key = "," + recId + ",";
//     if(recId)
//   }
// }