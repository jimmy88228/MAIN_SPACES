import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
import StrH from "../../../common/helper/handle/strHandle.js";
const app = getApp();
const BaseSelectGoodsInfo = {
  goods_id:0,          //商品id
  select_color: "",    //选择颜色对象
  select_size: "",     //选择尺码对象
  select_color_id: 0,  //选择颜色id
  select_size_id: 0,   //选择尺码id
  select_goods_count: 1, //选择商品数量
  productInfo:{},      //sku条码数据对象
  shippingInfo:{       //配送方式对象
    name:"",           //店铺名
    storeId:0,         //店铺id
    selfGet:0,         //允许开放的配送方式 0：全部，1：仅自提，2：仅快递
    shippingType:0,    //配送方式 默认快递
  }
}
/*
  sku:{
    GoodsTotalInfoEntity, //商品数据
    ListGoodsProductInfo, //条码数据
    goodsExtend,          //扩展
  }
*/

/*
  GoodsTotalInfoEntity:{
    goods_id: ""
    max_exchange_point: ""
    max_market_price: ""
    max_price: ""
    min_exchange_point: ""
    min_market_price: ""
    min_price: ""
    total_number: ""
  }
  ListGoodsProductInfo:[{
    color_id: ""
    color_name: ""
    exchange_point: ""
    goods_id: ""
    goods_type: 1
    market_price: ""
    product_id: ""
    product_number: ""
    product_sn: ""
    sale_price: ""
    size_id: ""
    size_name: ""
  }]
  goodsExtend:{
    attr_count: 
    color_name_title: ""
    goodsId: 0
    is_limit_buy: 0
    limit_buy_times: 0
    self_get: 0
    size_name_title: ""
  }
*/
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    externalClasses: ["ext-class"],
    properties: {
      goodsType:{ //normal
        type: String,
        value: ""
      },
      select_goods:{
        type: Object,
        value: {}
      },
      dimensionPlanInfo:{
        type: Object,
        value: {}
      },
      isShowHeader:{
        type: Boolean,
        value: true
      }, 
      isShowSpec:{
        type: Boolean,
        value: true  
      },
      isShowInv:{
        type: Boolean,
        value: true  
      },
      isShowCount: {
        type: Boolean,
        value: true
      },
      isShowTwoBtn:{
        type: Boolean,
        value: false
      },
      isShowBtn:{
        type: Boolean,
        value: true  
      },
      isShowPriceInfo:{
        type: Boolean,
        value: true  
      },
      isShowShipping:{
        type: Boolean,
        value: false
      },
      isShowSizeChart:{
        type: Boolean,
        value: false
      },
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;", 
    }, 
    pageLifetimes:{
      show(){
        //刷新配送方式 (页面返回
        this.inited && initShippingInfo.call(this);
        this.inited && this.jumpStoreNav(false)
      },
    },
    methods: {
      onDetached(){
        this.initCheckShipInv = false;
      },
      initData(params){
        this.checkCustomTab();
        this.allInfo = JSON.parse(JSON.stringify(params||{}));
        this.extraInfo = this.allInfo.extraInfo || {};
        let select_goods = this.allInfo.select_goods||{};
        console.log('initData',this.extraInfo.goodsId,params,JSON.parse(JSON.stringify(select_goods))); 
        if(Object.keys(select_goods).length == 0){
          select_goods = JSON.parse(JSON.stringify(BaseSelectGoodsInfo))
        }
        select_goods.goods_id = this.extraInfo.goodsId||0;
        emitData(this,false,select_goods);
        goodsProductInfoHandle.call(this, this.allInfo.sku); //sku数据结构处理
        this.properties.isShowShipping && initShippingInfo.call(this); //刷新配送方式 (点击
        setAnim.call(this,"show");
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
        // emitData(this);
        getSpecNumMap.call(this);
      },
      sizeSelect: function (e) {
        let dataset = e.currentTarget.dataset;
        let size_id = dataset.size_id;
        let goods_id = dataset.goods_id;
        let size_name = dataset.size_name;
        let select_goods = this.data.select_goods;
        if (size_id == select_goods.select_size_id) { //取消选中尺码
          select_goods.select_size_id = 0;
          select_goods.select_size = "";
          select_goods.productInfo = {};
          // this.setData({
          //   select_goods: select_goods,
          // });
          getSpecNumMap.call(this);
          return;
        }
        select_goods.goods_id = goods_id;
        select_goods.select_size_id = size_id;
        select_goods.select_size = size_name;
        // this.setData({
        //   select_goods: select_goods,
        // });
        getSpecNumMap.call(this);
      }, 
      reduceGoodsNum(e) {
        this.changeGoodsNum(e,"reduce")
      },
      inputGoodsNum(e){
        this.changeGoodsNum(e,"input")
      },
      addGoodsNum: function(e){
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
        select_goods.select_goods_count = num;
        emitData(this);
        // this.setData({
        //   "select_goods.select_goods_count": num
        // })
      },
      confirmSelect(e){
        // console.log('confirmSelect',e)
        let type = this.getDataset(e,'type') || "confirmSelect";
        this.triggerEvent('confirmSelect',{type,data:this.data.select_goods,cb:()=>{setAnim.call(this);}});
      }, 
      jumpStoreNav(bool){
        this.inited = bool || false;
      },
    }
  })
);
//初始化规格数据
function goodsProductInfoHandle(data = {}){
  let ProductList = data.ListGoodsProductInfo;
  let goodsExtend = data.goodsExtend;
  let extraInfo = this.extraInfo || {};
  let select_goods = this.data.select_goods || {};
  let color_spec = {},
    size_spec = {},
    color_size = {},
    size_color = {},
    color_arr = [],
    size_arr = [];
  let ProkeyList = {};
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
    }
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
    }
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
  setGallery.call(this,data.goods_gallery||extraInfo.goods_gallery);
  this.setData({
    color_size: color_size,
    size_color: size_color,
    color_arr: color_arr,
    size_arr: size_arr,
    goodsExtend: goodsExtend,
    default_img:extraInfo.default_img||""
  })
  this.color_spec = color_spec;
  this.size_spec = size_spec;
  this.ProkeyList = ProkeyList;
  let update = false;
  let storage = app.StorageH.get("select_store");
  if(!this.initCheckShipInv && (select_goods.shippingInfo.shippingType != 2) && storage.id && Object.keys(color_size).every(item=>color_size[item].total_num == 0)){
    // 自提没有库存，自动切换快递配送
    console.log('自提没有库存，自动切换快递配送',color_size);
    update = true;
    select_goods.shippingInfo.shippingType = 2;
  }
  this.initCheckShipInv=true;
  getSpecNumMap.call(this,{ //计算选中的规格
    product_id: extraInfo.product_id || 0
  },update);
  // console.log('color_arr',color_arr) //用来展示循环的颜色
  // console.log('size_arr',size_arr) //用来展示循环的尺码
  // console.log('color_spec',color_spec) //每个颜色所对应的尺码数组
  // console.log('size_spec',size_spec)  //每个尺码所对应的颜色数组
  // console.log('color_size',color_size) //每个颜色所对应的尺码对象（用于页面展示的库存判断）
  // console.log('size_color',size_color) //每个尺码所对应的颜色对象（用于页面展示的库存判断）
  // console.log('ProductList',ProductList) //所有的排列组合数据（数组）
  // console.log('ProkeyList',ProkeyList) //所有的排列组合数据(product_id对象)

}
//选中规格
function getSpecNumMap(obj = {},update=false) {
  let color_spec = this.color_spec;
  let size_spec = this.size_spec;
  let select_goods = this.data.select_goods;
  let allInfo = this.allInfo ||{};
  let goodsExtend = allInfo.sku && allInfo.sku.goodsExtend || {};
  let GoodsTotalInfoEntity = allInfo.sku && allInfo.sku.GoodsTotalInfoEntity || {};
  if (obj.product_id){ //指定选中
    let ProkeyList = this.ProkeyList || {};
    let ProItem = ProkeyList[obj.product_id] || {};
    select_goods.productInfo = ProItem;
    select_goods.select_color_id = ProItem.color_id;
    select_goods.select_color = ProItem.color_name;
    select_goods.select_size_id = ProItem.size_id;
    select_goods.select_size = ProItem.size_name;
    select_goods.goods_id = ProItem.goods_id;
    emitData(this,update);
    return;
  }
  // 选完
  if ((select_goods.select_color_id && select_goods.select_size_id) || (select_goods.select_color_id && goodsExtend.attr_count == 1)) {
    let canSelectSpec = color_spec[select_goods.select_color_id];
    for (let i in canSelectSpec) {
      if (goodsExtend.attr_count == 1) {
        select_goods.select_size_id = canSelectSpec[i].size_id;
        select_goods.productInfo = canSelectSpec[i];
        break;
      } else { 
        if (canSelectSpec[i].size_id == select_goods.select_size_id) {
          select_goods.productInfo = canSelectSpec[i]; 
        }
      }
    }
    console.log('选完',select_goods)
  } else { 
  //未选完
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
    // 设置canSelectSpec
    if (select_goods.select_color_id) {
      canSelectSpec = color_spec[select_goods.select_color_id];
    } else if (select_goods.select_size_id) {
      canSelectSpec = size_spec[select_goods.select_size_id];
    }
    for (let i in canSelectSpec) {
      if (select_goods.select_color_id) { //选颜色,就刷新尺码arr
        let size_id = canSelectSpec[i].size_id;
        if (!tem_size[size_id]) {
          size_arr.push({
            goods_id:canSelectSpec[i].goods_id,
            size_id: size_id,
            size_name: canSelectSpec[i].size_name,
            size_n: StrH.ellipsisStr(canSelectSpec[i].size_name),
          })
          tem_size[size_id] = true
        }
      } else if (select_goods.select_size_id) { //选尺码,就刷新颜色arr
        let color_id = canSelectSpec[i].color_id;
        if (!tem_color[color_id]) {
          color_arr.push({
            goods_id:canSelectSpec[i].goods_id,
            color_id: color_id,
            color_name: canSelectSpec[i].color_name,
            color_n: StrH.ellipsisStr(canSelectSpec[i].color_name),
          })
          tem_color[color_id] = true
        }
      }
      //获取价格区间 (选中其中一个规格)
      let market_price = canSelectSpec[i].market_price;
      let sale_price = canSelectSpec[i].sale_price;
      let exchange_point = canSelectSpec[i].exchange_point;
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
        size_arr: size_arr
      })
    } else if (select_goods.select_size_id) {
      this.setData({
        color_arr: color_arr
      })
    }
    select_goods.productInfo || (select_goods.productInfo = {});
    productInfo.max_exchange_point = max_point || GoodsTotalInfoEntity.max_exchange_point || 0;
    productInfo.max_market_price = max_m_price || GoodsTotalInfoEntity.max_market_price || 0;
    productInfo.max_price = max_price|| GoodsTotalInfoEntity.max_price || 0;
    productInfo.min_exchange_point = min_point|| GoodsTotalInfoEntity.min_exchange_point || 0;
    productInfo.min_market_price = min_m_price|| GoodsTotalInfoEntity.min_market_price || 0;
    productInfo.min_price = min_price|| GoodsTotalInfoEntity.min_price || 0;
    console.log('没选完',select_goods)
  }
  emitData(this,update);
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

//初始化配送方式
function initShippingInfo() {
  if(this.properties.isShowShipping){
    let select_goods = this.data.select_goods||{};
    let shippingInfo = select_goods.shippingInfo; 
    let goodsInfo = this.extraInfo.goodsInfo||{};
    shippingInfo.selfGet = goodsInfo.self_get || 0; 
    emitData(this);
    this.shippingTypeMod = this.shippingTypeMod || this.selectComponent('#shippingTypeMod');   
    this.shippingTypeMod.initShippingInfo();
  }
} 

function setGallery(goods_gallery){
  if(goods_gallery){
    let color_img = createObjKeyVal.call(this, goods_gallery, "color_id") || {};
    this.setData({
      color_img: color_img,
      goods_gallery
    })
  }
}

function emitData(_this,update=false,_data){
  let data = _data || _this.data.select_goods||{};
  let goodsId = _this.extraInfo.goodsId||0;
  _this.triggerEvent("ChangeData",{data,update,goodsId,fromType:"specView"});
}

function setAnim(type){
  this.specPop = this.specPop || this.selectComponent('#specPop') ;
  if(type == "show"){
    this.style_select_show = true;
    this.specPop.setShow(); 
  }else {
    this.initCheckShipInv = false;
    this.style_select_show = false;
    this.specPop.setHide();
  }
}