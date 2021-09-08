import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
import StrH from "../../common/helper/handle/strHandle.js";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      allData: Object,
      showCount: {
        type: Boolean,
        value: false
      },
      select_goods:{
        type: Object,
        value: {
          select_color: "", //选择颜色对象
          select_size: "", //选择尺码对象
          select_color_id: 0, //选择颜色id
          select_size_id: 0, //选择尺码id
          select_goods_count: 1, //选择商品数量
          productInfo: {},
        }
      }
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      // select_goods: { //选择的商品
      //   select_color: "", //选择颜色对象
      //   select_size: "", //选择尺码对象
      //   select_color_id: 0, //选择颜色id
      //   select_size_id: 0, //选择尺码id
      //   select_goods_count: 1, //选择商品数量
      //   productInfo: {},
      // },
    },
    attached() {},
    detached() {},
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transform: translate(0,0);transition: opacity 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transform: translate(0,110%);transition: opacity 300ms ease-in-out;"
        });
        return 300;
      },
      initData(params){
        this.show();
        if(params.isCustom){
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
        let color_id = dataset.color_id;
        let color_name = dataset.color_name;
        let select_goods = this.data.select_goods;
        if (color_id == select_goods.select_color_id) return;
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
        let size_name = dataset.size_name;
        let select_goods = this.data.select_goods;
        if (size_id == select_goods.select_size_id) return;
        select_goods.select_size_id = size_id;
        select_goods.select_size = size_name;
        this.setData({
          select_goods: select_goods,
        });
        getSpecNumMap.call(this);
      },
      
      // reduceGoodsNum: function () {
      //   var select_goods = this.data.select_goods;
      //   if (select_goods.select_goods_count > 1) {
      //     select_goods.select_goods_count--;
      //     this.setData({
      //       select_goods: select_goods
      //     })
      //   }
      // },
      // addGoodsNum: function () {
      //   let select_goods = this.data.select_goods;
      //   let inventory_count = select_goods.productInfo.product_number;
      //   if (select_goods.select_goods_count < inventory_count) {
      //     select_goods.select_goods_count++;
      //     this.setData({
      //       select_goods: select_goods
      //     })
      //   }
      // },
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
      confirmSelect(){
        this.dismiss();
        this.triggerEvent("confirmSelect", this.data.select_goods);
      }
    }
  })
);
function getSpecNumMap(obj = {}) {
  console.log("obj getSpecNumMap", obj)
  let color_spec = this.data.color_spec;
  let size_spec = this.data.size_spec;
  let select_goods = this.data.select_goods;
  let specList = this.data.ProductList;
  if (obj.product_id){
    let ProkeyList = this.data.ProkeyList || {};
    let ProItem = ProkeyList[obj.product_id] || {};
    console.log(ProItem,"ProItem");
    select_goods.productInfo = ProItem;
    select_goods.select_color_id = ProItem.color_id;
    select_goods.select_color = ProItem.color_name;
    select_goods.select_size_id = ProItem.size_id;
    select_goods.select_size = ProItem.size_name;
    this.setData({
      select_goods: select_goods
    })
    return;
  }
  let goodsExtend = this.data.goodsExtend;
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
        // size_key_list[size_id] = {
        //   size_name: canSelectSpec[i].size_name,
        //   product_number: canSelectSpec[i].product_number,
        // }
        if (!tem_size[size_id]) {
          size_arr.push({
            size_id: size_id,
            size_name: canSelectSpec[i].size_name,
            size_n: StrH.ellipsisStr(canSelectSpec[i].size_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_size[size_id] = true;
        }
        if (canSelectSpec[i].size_id == select_goods.select_size_id) {
          select_goods.productInfo = canSelectSpec[i];
          // break;
        }
      }
    }
    this.setData({
      select_goods: select_goods,
      size_arr: size_arr
      // size_key_list: size_key_list
    })

  } else { //选择颜色
    let canSelectSpec = [];
    let min_m_price = null,
      max_m_price = null,
      min_price = null,
      max_price = null,
      min_point = null,
      max_point = null;
    // let color_key_list = {},
    //   size_key_list = {};
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
        // size_key_list[size_id] = {
        //   size_name: canSelectSpec[i].size_name,
        //   product_number: canSelectSpec[i].product_number,
        // }
        if (!tem_size[size_id]) {
          size_arr.push({
            size_id: size_id,
            size_name: canSelectSpec[i].size_name,
            size_n: StrH.ellipsisStr(canSelectSpec[i].size_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_size[size_id] = true
        }
      } else if (select_goods.select_size_id) { //设置颜色
        let color_id = canSelectSpec[i].color_id;
        // color_key_list[color_id] = {
        //   color_name: canSelectSpec[i].color_name,
        //   product_number: canSelectSpec[i].product_number,
        // }
        if (!tem_color[color_id]) {
          color_arr.push({
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
    productInfo.max_exchange_point = max_point;
    productInfo.max_market_price = max_m_price;
    productInfo.max_price = max_price;
    productInfo.min_exchange_point = min_point;
    productInfo.min_market_price = min_m_price;
    productInfo.min_price = min_price;
    this.setData({
      select_goods: select_goods
    })

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
  // let color_key_list = {},
  //   size_key_list = {},
  let color_spec = {},
    size_spec = {},
    color_size = {},
    size_color = {},
    color_arr = [],
    size_arr = [];
  let ProkeyList = {};
  select_goods.productInfo = TotalInfo;
  select_goods.select_size_id = "";
  for (let i in ProductList) {
    // let color_id = ProductList[i].color_id;
    // color_key_list[color_id] = {
    //   color_name: ProductList[i].color_name,
    // };
    // if (!color_spec[color_id]) color_spec[color_id] = [];
    // color_spec[color_id].push(ProductList[i]);
    // let size_id = ProductList[i].size_id;
    // size_key_list[size_id] = {
    //   size_name: ProductList[i].size_name,
    // };
    // if (!size_spec[size_id]) size_spec[size_id] = [];
    // size_spec[size_id].push(ProductList[i]);
    ProkeyList[ProductList[i].product_id] = ProductList[i]

    let color_id = ProductList[i].color_id;
    let product_number = parseInt(ProductList[i].product_number);
    let color_item = {
      color_id: color_id,
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
      size_id: size_id,
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
    // color_key_list: color_key_list,
    // size_key_list: size_key_list,
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
    select_goods: select_goods
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
