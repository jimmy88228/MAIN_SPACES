// pages/micro_mall/buy/modules/redPopup/redPopup.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
import strH from "../../../../../common/helper/handle/strHandle.js";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: "apply-shared",
  },
  properties:{},
  data: {
    boxStyle: "opacity:0;transform:translateY(100%);transition: all 300ms ease-in-out;",
    chooseDiscountGoods: [],
    temChooseDiscountGoods:[], // 临时选择优惠购商品
    idProductChooseGoods: {}, //
    idGoodsChoose: {},
    selectAllCount: 0,
  },
  thisPage: null,
  attached(){
    this.getPage();
  },
  observers:{
    temChooseDiscountGoods:function(data){
      console.log("temChooseDiscountGoods---", data);
      let idGoodsChoose = {}, selectAllCount = 0;
      for(let i = 0; i < data.length; i++){
        // let productInfo = data[i].productInfo || {}
        let key = data[i].key;
        if(key){
          if(idGoodsChoose[key]){
            idGoodsChoose[key].number = idGoodsChoose[key].number + (data[i].number || 0);
          } else {
            idGoodsChoose[key] = {
              number: (data[i].number || 0)
            }
          }
          selectAllCount = selectAllCount + (data[i].number || 0)
        }
      }
      console.log("selectAllCount", this.data.selectAllCount);
      console.log("idGoodsChoose", this.data.idGoodsChoose);
      let idProductChooseGoods = strH.createJsonByKey(data, "activityProductId") || {};
      this.setData({
        idProductChooseGoods: idProductChooseGoods,
        idGoodsChoose: idGoodsChoose,
        selectAllCount: selectAllCount
      })
      computedBuyLimit.call(this, data, this.data.ruleList, this.data.orderBuyLimit, selectAllCount);
    }
  },
  pageLifetimes:{
    show(){
      let userChoiceData = app.StorageH.get("userChoiceData") || {};
      let select_goods = userChoiceData.select_goods;
      if(select_goods && this.chooseGoods.goodsId){
        this.confirmSpec({detail: {...select_goods,ruleId:select_goods.ruleId}});
        delete userChoiceData.select_goods;
        app.StorageH.set("userChoiceData", userChoiceData); 
      }
    }
  },
  methods: {
    getPage(){
      !this.thisPage && (this.thisPage = getCurrentPages().slice(-1)[0] || {});
      return this.thisPage;
    },
    onAttached() {
      this.setTouchId = setTimeout(()=>{
        this.setTouchCancel(true);
      },500)
      this.setData({
        boxStyle: "opacity:1;transform:translateY(0);transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      clearTimeout(this.setTouchId);
      this.setData({
        boxStyle: "opacity:0;transform:translateY(100%);transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    initData(ops){
      this.show();
      if(!ops.activityId) return;
      this.ops = ops || {};
      return app.CL_GoodsApi.getActivityGoodsList({
        data:{
          "activityId": ops.activityId,
          "orderAmount": ops.amountForDiscountBuy, 
        },
        other:{
          isShowload:true
        }
      }).then(res=>{
        if(res.code == 1){
          let data = res.data || {};
          let ruleList = data.ruleList || [];
          let chooseDiscountGoods = this.getPage().data.chooseDiscountGoods || [];
          this.setData({
            temChooseDiscountGoods: chooseDiscountGoods,
            ruleList: ruleList,
            orderBuyLimit: data.orderBuyLimit || 0,
            amountForDiscountBuy: ops.amountForDiscountBuy
          })
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      })
    },
    addDiscount(){
      let temChooseDiscountGoods = this.data.temChooseDiscountGoods || [];
      let discountBuyGoods = [];
      for(let i = 0; i < temChooseDiscountGoods.length; i++){
        let number = temChooseDiscountGoods[i].number;
        let activityProductId = temChooseDiscountGoods[i].activityProductId;
        discountBuyGoods.push({
          number,
          activityProductId
        })
      }
      this.getPage().setData({
        chooseDiscountGoods: temChooseDiscountGoods,
        discountBuyGoods: discountBuyGoods
      })
      app.SMH.showToast({
        title: "选择成功"
      })
      this.getPage().getCheckOut();
      this.dismiss();
    },
    showProduct(e){
      let ops = this.ops || {};
      let dataset = e.currentTarget.dataset || {};
      let chooseGoods = getGoods.call(this, dataset.ruleIndex, dataset.goodsIndex);
      if(!checkExchange.call(this, dataset)) return;
      return app.CL_GoodsApi.getActivityGoodsProduct({
        data:{
          "activityId": ops.activityId,
          "goodsId": dataset.goodsId,
          "colorId": 0, 
          "ruleId":dataset.ruleId||0
        },
        other:{
          isShowload:true
        }
      }).then(res=>{
        if(res.code == 1){
          let data = res.data || {};
          let goodsExtend = data.goodsExtend || [];
          let inventory_model_config = goodsExtend.inventory_model_config; // 2： 仅取仓库库存
          let ListGoodsProductInfo = data.ListGoodsProductInfo || [];
          let idProductChooseGoods = this.data.idProductChooseGoods || {};
          let defaultProductId = 0; 
          //换算每个规格剩余可选数量
          for(let i = 0; i < ListGoodsProductInfo.length; i++){
            let activtyProductId = ListGoodsProductInfo[i].activtyProductId || 0;
            ListGoodsProductInfo[i].product_id = activtyProductId;
            if (inventory_model_config == 2){
              ListGoodsProductInfo[i].product_number = ListGoodsProductInfo[i].warehouse_product_number || 0;
            }else{
              ListGoodsProductInfo[i].product_number += ListGoodsProductInfo[i].warehouse_product_number || 0;
            }
            let product_number = parseInt(ListGoodsProductInfo[i].product_number);
            let limitNum = Math.min((chooseGoods.mixNum), product_number);
            let selectNumber = (idProductChooseGoods[activtyProductId] && idProductChooseGoods[activtyProductId].number) || 0;
            console.log('limitNum',limitNum , chooseGoods.mixNum , selectNumber, product_number,chooseGoods)
            ListGoodsProductInfo[i].product_number = limitNum<=0?0:limitNum;
            if(!defaultProductId && limitNum > 0){
              defaultProductId = activtyProductId
            }
            //库存
          }
          console.log('超值购',defaultProductId,ListGoodsProductInfo)
          //提示
          if(!defaultProductId){
            app.SMH.showToast({
              title: "该商品暂无可换购库存"
            });
            return Promise.reject(res);
          }
          this.specView = this.specView || this.selectComponent("#specView");
          this.specView && this.specView.initData({
            isCustom: 1,
            product_id: defaultProductId,
            data: data,
            ruleId:dataset.ruleId||0
          });
          return Promise.resolve(res);
        }else{ 
          app.SMH.showToast({
            title: res&&res.msg||"商品数据异常"
          });
        }
        return Promise.reject(res);
      })
    },
    confirmSpec(e){
      let detail = e.detail || {};
      let activityProductId = (detail.productInfo && detail.productInfo.product_id) || 0;
      let ruleId = detail.ruleId||0;
      let key = ruleId + '_' + detail.goods_id;
      let temChooseDiscountGoods = this.data.temChooseDiscountGoods || [];
      let addIndex = "";
      for(let i = 0; i < temChooseDiscountGoods.length; i++){
        let temGoods = temChooseDiscountGoods[i] || {};
        if(temGoods.activityProductId == activityProductId){// 之前选择过的
          addIndex = i;
          break;
        }
      }
      if(parseInt(addIndex) == 0 || addIndex){
        temChooseDiscountGoods[addIndex].number = temChooseDiscountGoods[addIndex].number + (detail.select_goods_count || 0);
      } else {
        temChooseDiscountGoods.push({
          productInfo: detail.productInfo || {},
          activityProductId: activityProductId,
          number: (detail.select_goods_count || 0),
          goodsInfo: this.chooseGoods || {},
          key
        });
      }
      this.setData({
        temChooseDiscountGoods: temChooseDiscountGoods || []
      })
      console.log("temChooseDiscountGoods", temChooseDiscountGoods);
    },
    getGoodsDetail(e){
      let dataset = e.currentTarget.dataset || {};
      let ops = this.ops || {};
      let idProductChooseGoods = this.data.idProductChooseGoods || {};
      let chooseGoods = getGoods.call(this, dataset.ruleIndex, dataset.goodsIndex);
      let userChoiceData = app.StorageH.get("userChoiceData") || {};
      if(!checkExchange.call(this, dataset)) return;
      userChoiceData.idProductChooseGoods = idProductChooseGoods;
      userChoiceData.chooseGoods = chooseGoods;
      app.StorageH.set("userChoiceData", userChoiceData);
      wx.navigateTo({
        url: '/pages/micro_mall/buy/discount/discount_goods?activityId=' + (ops.activityId || 0) + '&goodsId=' + (dataset.goodsId) + '&isFit=' + (dataset.isFit || 0) + '&ruleId=' + dataset.ruleId||0
      })
    },
    _noFn() {},
  }
}))
function checkExchange(dataset){
  dataset = dataset || {};
  let warn = "";
  let selectAllCount = this.data.selectAllCount || 0, orderBuyLimit = this.data.orderBuyLimit || 0;
  let idGoodsChoose = this.data.idGoodsChoose || {};
  let {goodsId=0,ruleId=0}=dataset;
  let key = `${ruleId}_${goodsId}`
  let chooseNum = (idGoodsChoose[key] && idGoodsChoose[key].number) || 0;
  console.log('checkExchange',key,dataset.mixNum,chooseNum,idGoodsChoose)
  if(!dataset.isFit){
    warn = '还没达到该换购门槛';
  } else if(selectAllCount >= orderBuyLimit && orderBuyLimit > 0){ //针对整单
    warn = '已超过换购件数，最大换购数量为' + orderBuyLimit + '件';
  } else if(!(dataset.mixNum > 0)){ // 针对单个商品
    warn = chooseNum>0 ? '该商品已达最大换购数' : '该商品暂无换购数'
  }  
  // } else if(!(dataset.mixNum > chooseNum)){ // 针对单个商品
  //   warn = '该商品已超出最大换购数(' + dataset.mixNum + ')'
  // }
  if(warn){
    app.SMH.showToast({
      title: warn
    })
    return false;
  }
  return true;
}
//
function getGoods(ruleIndex, goodsIndex){
  let ruleList = this.data.ruleList || [];
  this.chooseGoods = ruleList[ruleIndex].goodsList[goodsIndex] || {};
  return this.chooseGoods
}
//换算剩余可选择数量
function computedBuyLimit(selectData, ruleList, orderBuyLimit = 0, selectAllCount = 0){
  orderBuyLimit = parseInt(orderBuyLimit - selectAllCount)
  let hasChange = false;
  for(let i = 0; i < ruleList.length; i++){
    let goodsList = ruleList[i].goodsList || [];
    for(let j = 0; j < goodsList.length; j++){
      let goods = goodsList[j] || {};
      let key = `${goods.rule_id}_${goods.goodsId}`
      let chooseNum = (this.data.idGoodsChoose[key] && this.data.idGoodsChoose[key].number) || 0;  
      let mixNum = Math.min(orderBuyLimit, goods.orderBuyLimit - chooseNum, (goods.userBuyLimit - goods.userHadBuy - chooseNum));
      console.log('computedBuyLimit',goods,mixNum,',',orderBuyLimit,chooseNum, goods.orderBuyLimit, (goods.userBuyLimit - goods.userHadBuy))
      if(goodsList[j].mixNum != mixNum){
        goodsList[j].mixNum = mixNum || 0;
        hasChange = true;
      }
    }
  }
  if(hasChange){
    this.setData({
      ruleList: ruleList
    })
  }
  return ruleList;
}
function throttle(time=500) {
  time=time||500;
  this.lockTime = true;
  this.throttleId = setTimeout(()=>{
    this.lockTime = false;
  },time)
}