import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
import StrH from "../../common/helper/handle/strHandle.js";
const app = getApp();
const BaseGoodsInfo = {
  goods_id:0,
  select_color: "", //选择颜色对象
  select_size: "", //选择尺码对象
  select_color_id: 0, //选择颜色id
  select_size_id: 0, //选择尺码id
  select_goods_count: 1, //选择商品数量
  productInfo: {},
  shippingType:2,
  storeId:0,
  selfGet:0
}
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    externalClasses: ["ext-class"],
    properties: {
      allData: Object,
      showCount: {
        type: Boolean,
        value: false
      },
      select_goods:{
        type: Object,
        value: JSON.parse(JSON.stringify(BaseGoodsInfo))
      },
      isShowShipping:{
        type: Boolean,
        value: false
      },
      isShowCart:{
        type: Boolean,
        value: false
      },
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;", 
    },
    attached() {},
    detached() {},
    pageLifetimes:{
      show(){
        initShippingInfo.call(this);
      }
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transform: translate(0,0);transition: all 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transform: translate(0,110%);transition: all 300ms ease-in-out;"
        });
        return 300;
      },
      initData(params){
        // this.show();
        let select_goods = this.data.select_goods;
        select_goods.select_goods_count = 1;
        this.setData({select_goods})
        this.params = params;
        this.checkCustomTab();
        setAnim.call(this,"show")
        this.allInfo = JSON.parse(JSON.stringify(params||{}));
        console.log('initData',params,JSON.parse(JSON.stringify(this.data.select_goods))); 
        if(params.fromType=='customBuy'){
          goodsProductInfoHandle.call(this, params.data, params);
          initShippingInfo.call(this,true);
        }else if(params.isCustom){
          goodsProductInfoHandle.call(this, params.data, params); 
        } else {
          getSumaryGoodsProductInfo.call(this,params);
          if(params.product_id){
            getSumaryGoodsDetailData.call(this, params);
          }
        }
      },
      colorSelect: function (e) {
        let dataset = e.currentTarget.dataset;
        let goods_id = dataset.goods_id;
        let color_id = dataset.color_id;
        let color_name = dataset.color_name;
        let select_goods = this.data.select_goods;
        if (color_id == select_goods.select_color_id) return;
        select_goods.goods_id = goods_id;
        select_goods.select_color_id = color_id;
        select_goods.select_color = color_name;
        this.setData({
          select_goods: select_goods
        })
        getSpecNumMap.call(this);
      },
      sizeSelect: function (e) {
        let dataset = e.currentTarget.dataset;
        let size_id = dataset.size_id;
        let goods_id = dataset.goods_id;
        let size_name = dataset.size_name;
        let select_goods = this.data.select_goods;
        if (size_id == select_goods.select_size_id) {
          select_goods.select_size_id = 0;
          select_goods.select_size = "";
          select_goods.productInfo = {};
          this.setData({
            select_goods: select_goods,
          });
          getSpecNumMap.call(this);
          return;
        }
        select_goods.goods_id = goods_id;
        select_goods.select_size_id = size_id;
        select_goods.select_size = size_name;
        this.setData({
          select_goods: select_goods,
        });
        getSpecNumMap.call(this);
      }, 
      reduceGoodsNum(e) {
        this.changeGoodsNum(e,"reduce")
      },
      inputGoodsNum(e){
        this.changeGoodsNum(e,"input")
      },
      addGoodsNum: function (e) {
        this.changeGoodsNum(e,"add")
      },
      changeGoodsNum(e,click_type){
        click_type = click_type + "";
        let warn = "";
        let select_goods = this.data.select_goods;
        let num = 1;
        let o_num = parseInt(select_goods.select_goods_count) || 1;
        let goodsExtend = this.data.goodsExtend || {};
        let limit_count = select_goods.productInfo && parseInt(select_goods.productInfo.product_number) || 1;
        if (goodsExtend.is_limit_buy == 1 && limit_count > parseInt(goodsExtend.limit_buy_times || 0)) {//获取最大数量限制
          limit_count = goodsExtend.limit_buy_times;
        }
        switch(click_type){
          case "input":
            let value = e.detail && parseInt(e.detail.value);
            if(value > o_num){
              if (value < limit_count) {//add
                num = value;
              }else{
                num = limit_count;
                warn = "超出了最大可选数量"
              }
            }else{//reduce
              if( value > 1 ){
                num = value;
              }else{
                num = 1
              }
            }
            break;
          case "add":
            if (o_num < limit_count) {
              num = o_num + 1;
            }else{
              return;
            }
            break;
          case "reduce":
            if ( o_num > 1 ) {
              num = o_num - 1;
            }else{
              return;
            }
            break;
          default:
              console.log("未知类型",click_type);
            return;
        }
        if(warn){
          app.SMH.showToast({
            title: warn
          })
        }
        this.setData({
          "select_goods.select_goods_count": num
        })
      },
      confirmSelect(e){
        console.log('confirmSelect',e)
        let type = this.getDataset(e,'type') || "confirmSelect";
        if(type == 'cart' || type == 'buy'){
          createShoppingCart.call(this,type).finally(()=>{
            this.triggerEvent('confirmSelect',{...(this.data.select_goods||{}),ruleId:this.params.ruleId});
          });
        }else{
          setAnim.call(this);
          this.triggerEvent('confirmSelect',{...(this.data.select_goods||{}),ruleId:this.params.ruleId});
        }
      },
      shippingChange(e){
        let detail = e&&e.detail||{};
        let index = detail.index||2;
        let storeId = detail.store_id||0;
        let update = detail.update||false;
        let select_goods = this.data.select_goods||{};
        select_goods.shippingType = index||2;
        select_goods.storeId = storeId||0;
        // select_goods.selfGet = 
        this.setData({
            select_goods
        })
        console.log('shippingChange',e,update)
        if(update){
             
        }
      }
    }
  })
);
function getSpecNumMap(obj = {}) {
  let color_spec = this.data.color_spec;
  let size_spec = this.data.size_spec;
  let select_goods = this.data.select_goods;
  let goodsExtend = this.data.goodsExtend;
  let GoodsTotalInfoEntity = this.allInfo.data && this.allInfo.data.GoodsTotalInfoEntity || {};
  if (obj.product_id){
    let ProkeyList = this.data.ProkeyList || {};
    let ProItem = ProkeyList[obj.product_id] || {};
    console.log(ProItem,"ProItem");
    select_goods.productInfo = ProItem;
    select_goods.select_color_id = ProItem.color_id;
    select_goods.select_color = ProItem.color_name;
    select_goods.select_size_id = ProItem.size_id;
    select_goods.select_size = ProItem.size_name;
    select_goods.goods_id = ProItem.goods_id;
    this.setData({
      select_goods: select_goods
    })
    return;
  }
  if ((select_goods.select_color_id && select_goods.select_size_id) || (select_goods.select_color_id && goodsExtend.attr_count == 1)) {
    let canSelectSpec = color_spec[select_goods.select_color_id];
    // let size_key_list = {};
    let size_arr = [], tem_size = {};
    for (let i in canSelectSpec) {
      if (goodsExtend.attr_count == 1) {
        select_goods.select_size_id = canSelectSpec[i].size_id;
        select_goods.productInfo = canSelectSpec[i];
        break;
      } else {
        let size_id = canSelectSpec[i].size_id; 
        let goods_id = canSelectSpec[i].goods_id; 
        if (!tem_size[size_id]) {
          size_arr.push({
            goods_id,
            size_id,
            size_name: canSelectSpec[i].size_name,
            size_n: StrH.ellipsisStr(canSelectSpec[i].size_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_size[size_id] = true;
        }
        if (canSelectSpec[i].size_id == select_goods.select_size_id) {
          select_goods.productInfo = canSelectSpec[i]; 
        }
      }
    }
    select_goods.select_goods_count = 1;
    this.setData({
      select_goods: select_goods,
      size_arr: size_arr 
    })
    console.log('选完',select_goods)
    if(this.allInfo && this.allInfo.fromType == 'customBuy'){
      this.triggerEvent('confirmSelect',{...(this.data.select_goods||{}),ruleId:this.params.ruleId});
    }
  } else { //选择颜色
    let canSelectSpec = [];
    let min_m_price = null,
      max_m_price = null,
      min_price = null,
      max_price = null,
      min_point = null,
      max_point = null; 
    let color_arr = [],
      size_arr = [],
      tem_color = {},
      tem_size = {};
    let productInfo = select_goods.productInfo;
    if (select_goods.select_color_id) {
      canSelectSpec = color_spec[select_goods.select_color_id];
    } else if (select_goods.select_size_id) {
      canSelectSpec = size_spec[select_goods.select_size_id];
    }
    for (let i in canSelectSpec) {
      if (select_goods.select_color_id) { //设置尺码
        let size_id = canSelectSpec[i].size_id;
        if (!tem_size[size_id]) {
          size_arr.push({
            goods_id:canSelectSpec[i].goods_id,
            size_id: size_id,
            size_name: canSelectSpec[i].size_name,
            size_n: StrH.ellipsisStr(canSelectSpec[i].size_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_size[size_id] = true
        }
      } else if (select_goods.select_size_id) { //设置颜色
        let color_id = canSelectSpec[i].color_id;
        if (!tem_color[color_id]) {
          color_arr.push({
            goods_id:canSelectSpec[i].goods_id,
            color_id: color_id,
            color_name: canSelectSpec[i].color_name,
            color_n: StrH.ellipsisStr(canSelectSpec[i].color_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_color[color_id] = true
        }
      }
      //获取价格区间
      let market_price = canSelectSpec[i].market_price;
      let sale_price = canSelectSpec[i].sale_price;
      let exchange_point = canSelectSpec[i].exchange_point;
      console.log('canSelectSpec',canSelectSpec[i],select_goods)
      if (min_m_price == null || min_m_price > parseFloat(market_price)) {
        min_m_price = parseFloat(market_price)
      }
      if (max_m_price == null || max_m_price < parseFloat(market_price)) {
        max_m_price = parseFloat(market_price)
      }
      if (min_price == null || min_price > parseFloat(sale_price)) {
        min_price = parseFloat(sale_price)
      }
      if (max_price == null || max_price < parseFloat(sale_price)) {
        max_price = parseFloat(sale_price)
      }
      if (min_point == null || min_point > parseFloat(exchange_point)) {
        min_point = parseFloat(exchange_point)
      }
      if (max_point == null || max_point < parseFloat(exchange_point)) {
        max_point = parseFloat(exchange_point)
      }
    }
    if (select_goods.select_color_id) {
      this.setData({
        // size_key_list: size_key_list
        size_arr: size_arr
      })
    } else if (select_goods.select_size_id) {
      this.setData({
        // color_key_list: color_key_list
        color_arr: color_arr
      })
    }
    productInfo.max_exchange_point = max_point || GoodsTotalInfoEntity.max_exchange_point || 0;
    productInfo.max_market_price = max_m_price || GoodsTotalInfoEntity.max_market_price || 0;
    productInfo.max_price = max_price|| GoodsTotalInfoEntity.max_price || 0;
    productInfo.min_exchange_point = min_point|| GoodsTotalInfoEntity.min_exchange_point || 0;
    productInfo.min_market_price = min_m_price|| GoodsTotalInfoEntity.min_market_price || 0;
    productInfo.min_price = min_price|| GoodsTotalInfoEntity.min_price || 0;
    this.setData({
      select_goods: select_goods
    })
    console.log('没选完',select_goods)
    console.log(this.data.size_color)
  }
}
//获取规格
function getSumaryGoodsProductInfo(options = {}) {
  return app.GoodsApi.getSumaryGoodsProductInfo({
    params: {
      goodsId: options.goods_id || "20888",
      colorId: 0, //options.color_id || 0,
      userToken: app.LM.userToken,
      issueId: options.issued_id || 0,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      goodsProductInfoHandle.call(this, data, options);
    }
  })
}
function goodsProductInfoHandle(data = {}, options = {}){
  let TotalInfo = data.GoodsTotalInfoEntity;
  let ProductList = data.ListGoodsProductInfo;
  let goodsExtend = data.goodsExtend;
  let select_goods = this.data.select_goods; 
  let color_spec = {},
    size_spec = {},
    color_size = {},
    size_color = {},
    color_arr = [],
    size_arr = [];
  let ProkeyList = {};
  if(options.reset){ //重置所有
    select_goods = JSON.parse(JSON.stringify(BaseGoodsInfo));
    select_goods.productInfo = TotalInfo;
  }else{ //重置size_id
    select_goods.productInfo = TotalInfo;
    select_goods.select_size_id = "";
  }
  for (let i in ProductList) {
    ProkeyList[ProductList[i].product_id] = ProductList[i]

    let color_id = ProductList[i].color_id;
    let goods_id = ProductList[i].goods_id;
    let product_number = parseInt(ProductList[i].product_number);
    let color_item = {
      goods_id,
      color_id,
      color_name: ProductList[i].color_name,
      color_n: StrH.ellipsisStr(ProductList[i].color_name),
      // product_number: ProductList[i].product_number
    }
    // color_key_list[color_id] = color_item;
    if (!color_spec[color_id]) {
      color_spec[color_id] = [];
      color_arr.push(color_item)
    }
    color_spec[color_id].push(ProductList[i]);
    let size_id = ProductList[i].size_id;
    let size_item = {
      goods_id,
      size_id,
      size_name: ProductList[i].size_name,
      size_n: StrH.ellipsisStr(ProductList[i].size_name),
      // product_number: ProductList[i].product_number
    }
    // size_key_list[size_id] = size_item;
    if (!size_spec[size_id]) {
      size_spec[size_id] = [];
      size_arr.push(size_item)
    }
    size_spec[size_id].push(ProductList[i]);
    if (!color_size[color_id]) {
      color_size[color_id] = {
        total_num: product_number
      };
    } else {
      color_size[color_id]["total_num"] = color_size[color_id]["total_num"] ? color_size[color_id]["total_num"] + product_number : product_number
    }
    color_size[color_id][size_id] = ProductList[i];
    if (!size_color[size_id]) {
      size_color[size_id] = {
        total_num: product_number
      };
    } else {
      size_color[size_id]["total_num"] = size_color[size_id]["total_num"] ? size_color[size_id]["total_num"] + product_number : product_number
    }
    size_color[size_id][color_id] = ProductList[i];
  }
  let goods_gallery = data.goods_gallery;
  let color_img = createObjKeyVal.call(this, goods_gallery, "color_id") || {};
  this.setData({
    color_img: color_img,
    color_size: color_size,
    size_color: size_color,
    color_arr: color_arr,
    size_arr: size_arr,
    color_spec: color_spec,
    size_spec: size_spec,
    goodsExtend: goodsExtend,
    ProductList: ProductList,
    ProkeyList: ProkeyList,
    TotalInfo: TotalInfo,
    select_goods: select_goods,
    default_goods_img:options.default_goods_img||""
  })
  getSpecNumMap.call(this,{
    product_id: options.product_id || 0
  });
}
//
function getSumaryGoodsDetailData(options = {}) {
  return app.GoodsApi.getSumaryGoodsDetailData({
    params: {
      goodsId: options.goods_id || 0,
      productId: options.product_id || 0,
      colorId: options.color_id || 0,
      userToken: app.LM.userToken,
      issue_id: options.issued_id || 0,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let goods_info = data.goods_info;
      let goods_gallery = data.goods_gallery;
      let color_img = createObjKeyVal.call(this, goods_gallery, "color_id") || {};
      this.setData({
        color_img: color_img
      })
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}

//数组转jSON
function createObjKeyVal(obj, key) {
  if (obj instanceof Array) {
    let json = {};
    for (let i in obj) {
      let Id = obj[i][key];
      if (!json[Id]) {
        json[Id] = [];
      }
      json[Id].push(obj[i])
    }
    return json;
  }
}

function initShippingInfo(bool=false) {
  if(this.allInfo && this.allInfo.fromType == 'customBuy'){
    let select_goods = this.data.select_goods||{};
    select_goods.selfGet = this.allInfo.goodsInfo && this.allInfo.goodsInfo.self_get || 0;
    this.setData({select_goods})
  }
  if(this.properties.isShowShipping){
    this.shippingTypeMod = this.shippingTypeMod || this.selectComponent('#shippingTypeMod');   
    this.shippingTypeMod.initShippingInfo(bool);
  }
}

function createShoppingCart(type) {
  let select_goods = this.data.select_goods || {}
  let productInfo = select_goods.productInfo || {};
  let allInfo = this.allInfo||{};
  let goodsInfo = allInfo.goodsInfo||{};
  let goodsExtend = allInfo.data && allInfo.data.goodsExtend||{}; 
  let tip = "";
  if (!productInfo.product_id){
    if (goodsExtend && goodsExtend.attr_count == 2) {
      tip = `请选择${!select_goods.select_color_id ? goodsExtend.color_name_title : goodsExtend.size_name_title}`
    }else{
      tip = `请选择${goodsExtend.color_name_title||"完整规格"}`
    }
  }  else if(!select_goods.shippingType && select_goods.selfGet == 0){
    tip = "请选择配送方式" 
  }
  else if ((select_goods.selfGet == 0 || select_goods.selfGet == 1) && select_goods.shippingType == 1 && !select_goods.storeId || (select_goods.selfGet == 1 && !select_goods.shippingType)){
    tip = "请选择自提店铺"
  }
  if(tip){
    app.SMH.showToast({
      "title": tip
    })
    return Promise.reject();
  }
  return app.BuyApi.createBuyCarInsert({
    data: {
      "userToken": app.LM.userToken,
      "goods_id": select_goods.goods_id,
      "product_id": productInfo.product_id,
      "goods_number": select_goods.select_goods_count,
      "goods_type": goodsInfo.sale_type || 0,
      "brandCode": app.Conf.BRAND_CODE,
      "issued_id": 0,
      "url_code": "",
      "is_buy_now": type == 'buy' ? 1 : 0,
      "shippingStoreId": select_goods.shippingType == 1 ? select_goods.storeId : 0,
      "clientSessionId": app.LgMg.channel && app.LgMg.channel.clientSessionId,
      "visitLogId": app.LgMg.pageLog && app.LgMg.pageLog.logId
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      if (type == 'buy') {
        let userChoiceData = app.StorageH.get('userChoiceData') || {};
        userChoiceData.rec_str = data;
        app.StorageH.set('userChoiceData', userChoiceData);
        let store_id = select_goods.shippingType == 1 && select_goods.storeId || 0;
        wx.navigateTo({
          url: '/pages/micro_mall/buy/buy?rec_str=' + data + '&store_id=' + store_id,
          complete:()=>{
            setAnim.call(this);
          }
        }) 
      } else {
        app.SMH.showToast({
          "title": "加入成功"
        })
        setAnim.call(this);
      }
      return Promise.resolve(e);
    } else {
      app.SMH.showToast({
        "title": e.msg
      })
    }
    return Promise.reject();
  })
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