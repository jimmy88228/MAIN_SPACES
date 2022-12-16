const app = getApp();
Component(app.BTAB({
  properties: {

  },
  data: {
    selectArr: [], //存放被选中的值
    specView: [],
  },
  methods: {
    initSpec(totalInfo = {}, productList = [], extend = {}, selectGoods = {}){
      return;
      let colorJson = {},sizeJson = {};
      let specView = [ { name: (extend.color_name_title || "规格一"), item: [] } ,{name: (extend.size_name_title || "规格二"), item: []}];
      let productJson = {};
      for(let i = 0; i < productList.length; i++){
        let prodItem = productList[i];
        let color_id = prodItem.color_id;
        let size_id = prodItem.size_id;
        productJson[color_id + ',' + size_id] = prodItem;
        //
        if(!colorJson[color_id]){
          colorJson[color_id] = {
            name: prodItem.color_name
          }
          specView[0].item.push({
            id: prodItem.color_id,
            name: prodItem.color_name
          });
        }
        //
        if(!sizeJson[size_id]){
          sizeJson[size_id] = {
            name: prodItem.size_name
          };
          specView[1].item.push({
            id: prodItem.size_id,
            name: prodItem.size_name
          });
        }
      }
      this.setData({
        specView: specView
      })
      this.totalInfo = totalInfo;
      this.colorJson = colorJson;
      this.sizeJson = sizeJson;
      this.productJson = productJson;
      this.checkItem();
    },
    selectSpecEvent: function (e) {
      let dataset = e.currentTarget.dataset || {};
      let id = dataset.id;
      let sIndex = dataset.sIndex;
      let selectArr = this.data.selectArr;
      let isShow = dataset.isShow;
      let name = dataset.name;
      if (!isShow) return;
      if (selectArr[sIndex] && selectArr[sIndex].id == id) {
        selectArr[sIndex] = "";
      } else {
        selectArr[sIndex] = {
          id,
          name
        };
      }
      this.setData({
        selectArr: selectArr
      })
      this.checkItem();
    },
    checkItem: function () {
      let option = this.data.specView;
      let result = []; //定义数组储存被选中的值
      let selectArr = this.data.selectArr;
      for(let i = 0; i < option.length; i++){
        result[i] = (selectArr[i] && selectArr[i].id) ? selectArr[i].id : '';
      }
      for (let i = 0; i < option.length; i++) {
        let last = result[i]; //把选中的值存放到字符串last去
        for (let k = 0; k < option[i].item.length; k++) {
          result[i] = option[i].item[k].id; //赋值，存在直接覆盖，不存在往里面添加name值
          option[i].item[k].isShow = isMay.call(this, result); //在数据里面添加字段isShow来判断是否可以选择
        }
        result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
      }
      this.setData({
        specView: option
      })
      let proMsg = getProMsg.call(this, result);
      this.triggerEvent("confirmSpec", {
        ...proMsg,
        selectArr
      });
    }
  }
}))
function isMay (result) {
  //拼装 RegExp 关键词 
  let {hasNull, reg} = getReg.call(this, result);
  //选项存在空值，检测是否都为空库存；
  let productJson = this.productJson;
  if (hasNull) {
    let patt = new RegExp(reg);
    let hasStock = false;
    for(let i in productJson){
      if(patt.test(i)) {
        if(productJson[i].product_number > 0){
          hasStock = true;
        }
      }
    }
    return hasStock;
  }
  let key = result.join(",");
  if (productJson[key]){
    return productJson[key].product_number == 0 ? false : true;
  } else {
    return false;
  }
}
//选择信息
function getProMsg(result){
  let {hasNull, reg} = getReg.call(this, result);
  let productJson = this.productJson;
  if (hasNull){
    let min_market_price = null,
    max_market_price = null,
    min_price = null,
    max_price = null,
    min_exchange_point = null,
    max_exchange_point = null;
    let patt = new RegExp(reg);
    for (let i in productJson){
      if(patt.test(i)){
        min_market_price = (productJson[i].market_price < min_market_price || min_market_price == null) ? productJson[i].market_price : min_market_price;
        max_market_price = (productJson[i].market_price > max_market_price || max_market_price == null) ? productJson[i].market_price : max_market_price;
        min_price = (productJson[i].sale_price < min_price || min_price == null) ? productJson[i].sale_price : min_price;
        max_price = (productJson[i].sale_price > max_price || max_price == null) ? productJson[i].sale_price : max_price;
        min_exchange_point = (productJson[i].exchange_point < min_exchange_point || min_exchange_point == null) ? productJson[i].exchange_point : min_exchange_point;
        max_exchange_point = (productJson[i].exchange_point < max_exchange_point || max_exchange_point == null) ? productJson[i].exchange_point : max_exchange_point;
      }
    }
    return {
      max_exchange_point,
      max_market_price,
      max_price,
      min_exchange_point,
      min_market_price,
      min_price
    }
  } else {
    return productJson[result];
  }
}
function getReg(result){
  let hasNull = false, reg = "";
  for (let i = 0; i < result.length; i++) {
    let reS = result[i] == '' ? '.*' : result[i];
    reg += reS;
    if ( i < result.length - 1){
      reg += ","
    }
    if (!hasNull && result[i] == "") {
      hasNull = true;
    }
  }
  return {
    reg,
    hasNull
  }
}

