// pages/micro_mall/shopping/cart_list/cart_list.js
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
    setShare:false
  },
  distance: 0,
  edit_index: 0,
  selectCarts: "",
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
    editCartEvent: function () {
      let edit_all = this.data.edit_all;
      this.setData({
        edit_all: !edit_all,
      })
    },
    //全选
    selectedAll: function (e) {
      let cartArrJson = this.data.cartArrJson;
      let select_all = this.data.select_all;
      select_all = !select_all;
      let result = recursionSelect.call(this, cartArrJson, select_all);
      this.setData({
        cartArrJson: result,
        select_all: select_all
      })
      totalNumHandle.call(this, "all", select_all);
    },
    /**
     *单个选择切换 
     */
    singleSelectConfirm(e) {
      let dataset = e.currentTarget.dataset || {};
      if (typeof (dataset.index) == "undefined") return;
      setClickStatus.call(this, dataset,"single");
      checkAllSelect.call(this,dataset.plcIndex, dataset.typeIndex);
      totalNumHandle.call(this);
    },
    itemSelect(e) {
      let dataset = e.currentTarget.dataset || {};
      if (typeof (dataset.plcIndex) == "undefined" || typeof (dataset.typeIndex) == "undefined") {
        return;
      }
      setClickStatus.call(this,dataset,"all");
      checkAllSelect.call(this,dataset.plcIndex, dataset.typeIndex);
      totalNumHandle.call(this);
    }, 

    changeShipping(e) {
      let dataset = e.currentTarget.dataset || {};
      let key = dataset.key;
      let index = dataset.index || 0;
      if (!key) return;
      let cartItems = this.data.cartJson[key];
      let item = cartItems[index] || cartItems[0];
      let changeShipInfo = {
        "isSelfGet": item.isSelfGet || 0,
        "rec_id": item.rec_id,
        "store_id": item.shipping_store_id || 0,
        "store_name": item.shipping_store_name || ""
      }
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
      let dataset = e.currentTarget.dataset || {};
      let recId = dataset.recId || 0;
      // let key = dataset.key;
      // let index = dataset.index;
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
        // this.loginPage = this.loginPage || this.selectComponent("#loginPage");
        // this.loginPage.checkLogin(total_count, "need");
        this.loginCallback(total_count);
      }).catch(e => {
        wx.redirectTo({
          url: '/pages/micro_mall/tips_page/abnormal',
        })
      })
    },
    promotion_detail(e){
      // this.promotionBool = !this.promotionBool;
      this.promotion = this.promotion || this.selectComponent('#promotion');
      this.promotion.init(null, this.data.total_count.promotionInfo || {});
    },
    onReachBottom(e){
      this.pageTab = this.pageTab || this.selectComponent("#pageTab");
      this.pageTab.reachBottom();
    }
  }
}))
//获取购物车列表
function getBuyCarGoodList() {
  console.log('进来 购物车列表')
  return app.BuyApi.getBuyCarGoodList({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    console.log('进来 购物车列表 then')

    if (e.code == 1) {
      this.selectCarts = this.selectCarts || ""; //默认选择
      let list_data = e.data || [];
      this.checkFirst = null
      let cartArr = [], cartArrJson = [], cartJson = {}, select_states = {}, edit_states = {};
      let hasStoreCart = false, hasNormalCart = false, hasKey = {}, keyIndex = 0, item_index = 0;
      hasKey = {
        "isSelfget": 0,
        "noSelfget": 1
      }
      let initObj = {};
      for (let i = 0; i < list_data.length; i++) {
        let lItem = list_data[i];
        let rec_id = lItem.rec_id;
        let exchange_price = parseFloat(list_data[i].exchange_price);
        lItem.exchange_price = exchange_price.toFixed(2);
        lItem.product_number = parseInt(lItem.product_number);
        let pla_src = (lItem.platform_src == "wap" || lItem.platform_src == "wxapp") ? "wxapp" : lItem.platform_src;
        let extend_field1 = lItem.extend_field1;
        let extend_id = lItem.extend_id || 0;
        let store_id = lItem.store_id || 0;
        let store_name = lItem.store_name || "";
        let s_store_id = lItem.shipping_store_id || 0;
        let s_store_name = lItem.shipping_store_name || "";
        if (typeof (hasKey[pla_src]) == "undefined") {
          hasKey[pla_src] = keyIndex;
          cartArrJson.push({
            type: pla_src,
            selected: false,
            edit: false,
            items: [
              {
                type: "isSelfget",
                select: false,
                edit: false,
                items: []
              },
              {
                type: "noSelfget",
                select: false,
                edit: false,
                items: []
              }
            ]
          })
          keyIndex++;
        }
        let pla_index = hasKey[pla_src];
        let key = "",//记录购物车模块key
          type_index = "",
          type = "";//记录门店自提/快递配送
        let addItem = [];
        switch (pla_src) {
          case "wxapp":
            if (s_store_id) {//门店自提
              type = "isSelfget";
              type_index = hasKey[type];
              key = extend_field1 ? s_store_id + '_' + extend_field1 : pla_src + '_' + s_store_id;
            } else {
              type = "noSelfget";
              type_index = hasKey[type];
              key = extend_field1 ? extend_field1 : rec_id;
            }
            break;
          case "mwin":
            if (store_id) {
              type = "noSelfget";
              key = store_id;
              type_index = hasKey[type];
            }
            break;
          default:
            if (s_store_id) {//门店自提
              type = "isSelfget";
              type_index = hasKey[type];
              key = extend_field1 ? s_store_id + '_' + extend_field1 : pla_src + '_' + s_store_id;
            } else {
              type = "noSelfget";
              type_index = hasKey[type];
              key = extend_field1 ? extend_field1 : rec_id;
            }
            break; 
        }
        addItem = cartArrJson[pla_index].items[type_index].items || [];
        if (!cartJson[key]) {
          addItem.push({
            isStore: store_id && Number(store_id) > 0 ? true : false,
            storeId: Number(store_id) || Number(s_store_id) || 0,
            isSelfget: Number(s_store_id) ? true : false,
            isBackage: extend_field1 ? true : false,
            storeName: (Number(store_id) && store_name) || (Number(s_store_id) && s_store_name) || "",
            select: false,
            items: [],
            id: key,
           })
          hasKey[key] = addItem.length - 1;
          cartJson[key] = [];
        }
        if (this.selectCarts.indexOf(',' + rec_id + ',') != -1){
          initObj[hasKey[type]] = initObj[hasKey[type]] || {};
          initObj[hasKey[type]].bool = true;
          let typeName = store_id && Number(store_id) > 0 ? "isSelfget" : extend_field1 ? "isBackage" : "normal";
          initObj[hasKey[type]][typeName] = true;
        }
        addItem[hasKey[key] || 0].items.push({
          select: this.selectCarts.indexOf(',' + rec_id + ',')!=-1? true:false,
          rec_id: rec_id
        })
        if (extend_field1 && extend_id == 1) {
          extend_id == "1" ? cartJson[key].splice(0, 0, lItem) : cartJson[key].push(lItem);
        } else {
          cartJson[key].push(lItem);
        }
        edit_states[rec_id] = {
          eidt: false
        }
        continue;
      }   
      this.setData({
        cartArrJson: cartArrJson,
        cartJson: cartJson,
        hasData: list_data.length > 0 ? true : false,
        edit_states: edit_states
      })
      // console.log("cartArrJson",cartArrJson);
      // console.log("cartJson",cartJson);
      for (let item in initObj){
        checkAllSelect.call(this,0, parseInt(item), initObj[item]);
      }
      this.hasKey = hasKey || {};
      totalNumHandle.call(this);
      initShoppingAds.call(this);
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
  // .catch(e => {
  //   wx.redirectTo({
  //     url: '/pages/micro_mall/tips_page/abnormal',
  //   })
  // })
}
function initShoppingAds(){
  // this.pageTab = this.pageTab || this.selectComponent("#pageTab");
  // this.pageTab.getPageData({
  //   pageType: "cart"
  // });
  getShoppingAds.call(this).then(resData => {
    let that = this;
    // let temp = resData && resData.ModuleList&&resData.ModuleList[0]||{};
    console.log("resData", resData)
    if(!resData.pageId || resData.pageId==0){Promise.reject();}
    wx.nextTick(() => {
      // that.embedCustom = that.embedCustom || that.selectComponent('#embedId');
      // that.embedCustom.getPageData(resData);
      let type = !this.firstSet ? {loadDataType:"bottom"} : {};
      this.firstSet = true;
      this.pageTab = this.pageTab || this.selectComponent("#pageTab");
      console.log("resData",resData)
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
    if (res && res.code == '1' && res.data ) {
      let data = res.data || {};
      let moduleList = data.ModuleList || [];
      // if(moduleList.length > 0){
      //   this.setData({
      //     hasAds: true
      //   })
      //   return Promise.resolve(res.data);
      // }
      return Promise.resolve(res.data);
    }
    //
    // if (this.data.hasAds){
    //   this.setData({
    //     hasAds: false
    //   })
    // }
    return Promise.reject();
  })
}

function getSelectCarts(key, index, select) {
  let cartItems = this.data.cartJson[key];
  let selectCarts = this.selectCarts || "";
  if (index == "all") {
    for (let i = 0; i < cartItems.length; i++) {
      let rec_id = cartItems[i].rec_id;
      if (select && (selectCarts.indexOf(',' + rec_id + ',') == -1) || !selectCarts) {
        selectCarts = selectCarts ? selectCarts + rec_id + ',' : ',' + rec_id + ',';
      } else if (!select && selectCarts.indexOf(',' + rec_id + ',') != -1) {
        selectCarts = selectCarts.replace(new RegExp(',' + rec_id + ',', 'g'), ",");
      }
    }
  } else {
    let rec_id = cartItems[index].rec_id;
    if (select && (selectCarts.indexOf(',' + rec_id + ',') == -1) || !selectCarts) {
      selectCarts = selectCarts ? selectCarts + rec_id + ',' : ',' + rec_id + ',';
    } else if (selectCarts.indexOf(',' + rec_id + ',') != -1) {
      selectCarts = selectCarts.replace(new RegExp(',' + rec_id + ',', 'g'), ",");
    }
  }
  // console.log('当前购物车',selectCarts);
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
  let cartJson = this.data.cartJson || {};
  let selectCarts = this.selectCarts ||  "";
  let money = 0, market_money = 0, integral = 0;
  let select_cart = 0, select_nums = 0, select_store = 0;
  let product_str = '', rec_str = '';
  let discount_money = 0;
  let is_invalid_num = 0;
  let self_get_num = 0;
  let express_num = 0;
  let isStore = false, isSelfget = false, noSelfget = false, choiceMoreStore = false;
  for (let i in cartJson) {
    let items = cartJson[i] || [];
    for (let j = 0; j < items.length; j++) {
      let editItem = items[j] || {};
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
        if (is_invalid == 1) {
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
  console.log("输入",e);
  let dataset = e.currentTarget.dataset || {};
  let key = dataset.key;
  let index = dataset.index;
  let recId = dataset.recId;
  let inputType = dataset.inputType;
  if (typeof (key) == "undefined" || typeof (index) == "undefined") return;
  let edit_data = this.data.cartJson || {};
  let goodsData = edit_data[key][index] || {};
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
        let dataKey = `cartJson.${key}[${index}].number`;
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
      edit_data[key][index] = goodsData
      if(warn){
        app.SMH.showToast({
          title: warn
        })
      }
      this.setData({
        cartJson: edit_data
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
    getBuyCarGoodList.call(this);
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if (app.LM.isLogin) {
      this.setData({
        isLogin: true
      })
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
  let index = dataset.index || 0;
  let plcIndex = dataset.plcIndex || 0;
  let typeIndex = dataset.typeIndex || 0;
  let cartsI = dataset.cartsI;
  let type = dataset.type || "";
  let channel = dataset.channel || "";
  let isBackage = dataset.isBackage || false;
  let cartArrJson = this.data.cartArrJson || [];
  let editItems = [];
  let setDataName = "";
  if (check_type == 'single'){
    editItems = cartArrJson[plcIndex].items[typeIndex].items[cartsI];
    let id = editItems.id;
    editItems.items[index].select = !editItems.items[index].select; //点击处按钮状态改变
    let selectAllItem = true
    if (isBackage) {//套餐商品
      for (let i = 0; i < editItems.items.length; i++) {
        editItems.items[i].select = editItems.items[index].select;
      }
      selectAllItem = editItems.items[index].select;
      getSelectCarts.call(this, id, "all", editItems.items[index].select);
    } else {  //普通商品、门店自提  
      for (let i = 0; i < editItems.items.length; i++) {
        if (!editItems.items[i].select) {
          selectAllItem = false;
        }
      }
      getSelectCarts.call(this, id, index, editItems.items[index].select);
    }
    editItems.select = selectAllItem;  //控制套餐、自提的外按钮状态 （普通商品在这里无作用）
    setDataName = 'cartArrJson[' + plcIndex + '].items[' + typeIndex + '].items[' + cartsI + ']';
  }
  
  else if (check_type == "all"){
    if (typeof (cartsI) != "undefined") { //门店自提、套餐商品外按钮
      editItems = cartArrJson[plcIndex].items[typeIndex].items[cartsI];
      editItems.select = !editItems.select;
      let id = editItems.id;
      for (let i = 0; i < editItems.items.length; i++) {
        editItems.items[i].select = editItems.select
      }
      getSelectCarts.call(this, id, "all", editItems.select);
      setDataName = 'cartArrJson[' + plcIndex + '].items[' + typeIndex + '].items[' + cartsI + ']';
    } else { //微商城 快递配送总按钮
      if (this.hasKey["noSelfget"] == typeIndex) {
        editItems = cartArrJson[plcIndex].items[typeIndex];
        editItems.select = !editItems.select;
        for (let i = 0; i < editItems.items.length; i++) {
          let item = editItems.items[i];
          item.select = editItems.select;
          let id = item.id;
          for (let j = 0; j < item.items.length; j++) {
            item.items[j].select = editItems.select;
          }
          getSelectCarts.call(this, id, "all", editItems.select);
        }
        setDataName = 'cartArrJson[' + plcIndex + '].items[' + typeIndex + ']';
      }
    }
  }

  if (setDataName){
    this.setData({
      [`${setDataName}`]: editItems //（点击处以及外按钮和总按钮的更新）
    })
  }
}

//更新套餐、自提外按钮状态 和 快递配送总按钮状态 （除了默认选中，其他情况都只更新快递配送总按钮状态）
function checkAllSelect(plcIndex, typeIndex, obj = {}) {
  let checkAll = obj && obj.bool || false;
  let hasKey = this.hasKey || {};
  let selectAllItem = true;
  //更新套餐、自提外按钮状态
  if (typeIndex == 0 && checkAll || obj['isBackage']) {
    let cartArrJson = this.data.cartArrJson || [];
    let editItem = cartArrJson[plcIndex].items[typeIndex];
    let start = 0, len = editItem.items.length - 1;
    for (let i = 0; i <= len; i++) {
      let editItemChild = editItem.items[i].items || [];
      selectAllItem = true;
      for (let j = 0; j < editItemChild.length; j++) {
        if (!editItemChild.select && this.selectCarts.indexOf(',' + editItemChild[j].rec_id + ',') == -1) {
          selectAllItem = false;
          break;
        }
      }
      //状态不一致情况，纠正
      if (editItem.items[i].select != selectAllItem) {
        editItem.items[i].select = selectAllItem;
        this.data.cartArrJson[plcIndex].items[typeIndex].items[i] = editItem.items[i]
        this.setData({
          ['cartArrJson[' + plcIndex + '].items[' + typeIndex + '].items[' + i + ']']: editItem.items[i]
        })
      }
    }
  }

  //更新快递配送总按钮状态
  if (typeIndex == 1 || checkAll) {
    selectAllItem = true;
    let cartArrJson = this.data.cartArrJson || [];
    let editItem = cartArrJson[plcIndex].items[typeIndex]
    for (let i = 0; i < editItem.items.length; i++) {
      if (!editItem.items[i].select && this.selectCarts.indexOf(',' + editItem.items[i].id + ',') == -1) {
        selectAllItem = false;
        break;
      }
    }
    //状态不一致情况，纠正
    if (editItem.select != selectAllItem) {
      editItem.select = selectAllItem;
      this.setData({
        ['cartArrJson[' + plcIndex + '].items[' + typeIndex + ']']: editItem
      })
    }
  }
}

function checkOneMoreOrder() {
  let storage = app.StorageH.get('One_More_Order') || {};
  if (storage.recIds && storage.update) {
    this.selectCarts = "," + storage.recIds + ",";
    let sucArr = storage.sucArr || [];
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