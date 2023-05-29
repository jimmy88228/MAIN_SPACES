// components/micro-page/items/goods-list/goods-list.js
import mcBehavior from '../../../help/mc-behavior.js'
import TLH from '../../../../template/help/tag-list-help'
const app = getApp();
const NumTextTrans={
  "one":1,
  "two":2,
  "three":3,
  "four":4,
}
const goodsSearch = {
  goodsCat:"CA", //标准分类
  vcat:"VC", //虚拟分类
  goods:"goods",//指定商品
  goodsBrand:"BRANDCODE",//商品品牌
  vat:"VA", //应该没用了,先保留
}
const MAX_SORT_NUM = 500;
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        n && this.init(n);
      }
    },
    curTab:{
      type:Number,
      value:0
    },
  },
  attached(){
    this.isAttached = true;
  },
  data: {
    htmlNodes:"",
    NumTextTrans,
    screenWidth:app.SIH.screenWidth,
    chooseGoodsInfo:{},
    customBuy:0
  },
  methods: {
    init(_data){
      let group =  _data && _data.goodsGroup||[];
      let listData = getInitData(group,this.data.curTab);
      refreshGoodsJson.call(this,group||[]);
      this.setData({
        _data, 
        init:true,
        listData,
        showTab: group.length>1,
      });
    },
    loadData(_data){
      getSysConf.call(this,'goods_list_show_buy_button','customBuy');
      let _p = getParams(this.data._data||{},this);
      return app.RunApi.go(_p.m,_p.api,_p.url,_p.params,_p.extra).then(res=>{
        let data = res.data||{};
        let tagList = data.goodsTagList||[];
        let tagJson = this.data.tagJson||{};
        tagJson = TLH.setTagJson({tagList}) || {};
        this.setData({
          tagJson,
          isInited:true,
          listData: data.goods_list || data.goodsList || [],
        })
        console.log('listData',this.data.listData,res)
        if(!this.data._data.open_slide){ //swiper 先不刷新
          this.mcItemRefresh();
        }
      }).catch(e=>{
        this.setData({
          listData:[],
          isInited:true
        })
        this.mcItemRefresh();
        console.log('catch',e)
      })
    },
    onTap(e){
      let detail = e&&e.detail||{};
      let type = detail.type||"";
      if(type == 'tab'){
        let curTab = detail.curTab||0;
        let group =  this.data._data && this.data._data.goodsGroup||[];
        this.setData({
          curTab
        })
        this.refreshData()
      }
    },
    refreshData(){
      this.loadData();
    }, 
    loadTag(e){
      TLH.loadTag(e,this);
    },
    buy(e,noCheck=false){  //noCheck:onshow回来
      let goodsId = (noCheck ? this.tempInfo.goodsId : this.getDataset(e,'goodsId')) ||0;
      let issueId = (noCheck ? this.tempInfo.issueId : this.getDataset(e,'issueId')) ||0;
      let img = noCheck ? this.tempInfo.img : this.getDataset(e,'img')||0;
      this.tempInfo = {goodsId,img,issueId}
      return checkIsCanBuy.call(this,goodsId,issueId).then(goodsInfo=>{
        return getSumaryGoodsProductInfo.call(this,goodsId,goodsInfo,issueId).then(sku=>{
          this.specMod || (this.specMod = this.selectComponent('#specMod'));      
          let chooseGoodsInfo = this.chooseGoodsInfo||{};
          let select_goods = JSON.parse(JSON.stringify(chooseGoodsInfo[goodsId]||{}));
          let product_id = select_goods.productInfo && select_goods.productInfo.product_id||0;
          this.initData = {
            sku,
            select_goods,
            extraInfo:{
              goodsId,
              goodsInfo,
              product_id,
              default_img:img,
              issued_id: issueId
            }
          }
          this.specMod && this.specMod.initData({ 
            ...this.initData
          });
        });
      })
    },
    changeData(e){
      let detail = e.detail||{};
      let data = detail.data||{};
      let update = detail.update||false;
      let goodsId = data.goods_id||0;
      let select_goods = JSON.parse(JSON.stringify(data));
      if(goodsId){
        this.chooseGoodsInfo || (this.chooseGoodsInfo = {});
        this.chooseGoodsInfo[goodsId] = data;
      }
      this.setData({select_goods});
      console.log('chooseGoodsInfo',update,detail);
      if(update){
        this.buy({},true);
      }
    },
    confirmSelect(e){
      let detail = e.detail||{};
      let type = detail.type||{};
      let cb = detail.cb;
      console.log('confirmSelect',detail)
      createShoppingCart.call(this,type,cb)
    }, 
  }
}))

function getParams(setting,that){
  let apiParams = {};
  apiParams.api = "GoodsApi";
  // apiParams.extra = {diy:true};
  let goodsGroup = [],goodsList = [],ids,goodsListType, index=that.data.curTab||0;
  if(Array.isArray(setting.goodsGroup)){
    goodsGroup = setting.goodsGroup||[];
    goodsList = goodsGroup[index].goodsList||[]; 
    goodsListType = goodsGroup[index].goodsListType;
    ids = mapGoodsList(goodsList) || [];
    if(goodsSearch[goodsGroup[index].goodsListType] == 'goods'){ //指定商品
      apiParams.url = "getALLGoodsListByGoodsIds";
      apiParams.m = "POST";
      apiParams.params = {
          goodIds : ids.join(','),
      }
    }else{
      let showNum = goodsGroup[index].showNum || MAX_SORT_NUM;
      apiParams.url = "getSearchGoodsListBySkip"; //分类
      ids = ids.join(',');
      apiParams.params = {
        functype: goodsSearch[goodsListType] || 'CA',
        catId: goodsListType != 'goodsBrand' ? ids : 0,
        strAttrId: '',
        strAttrValue: '',
        colorCatId: 0,
        startPrice: -1,
        endPrice: -1,
        strWhere: '',
        pageSize: showNum,
        pageIndex: 1,
        skipCount: setting.skip || 0,
        sortField: 'DEFAULT',
        sortBy: 'desc',
        goods_brand_ids: goodsListType == 'goodsBrand' ? ids : 0,
        storeId: '0',
      }
    }
  }
  console.log('apiParams',setting,apiParams)
  return apiParams
}

function mapGoodsList(arr=[],type){
  let result = [];
  for(let i = 0,len=arr.length;i<len;i++){
    result.push(arr[i].id);
  }
  return result
}
function getInitData(arr,index){
  let data = [];
  try{
    let item = arr[index] || {};
    let len =  item.goodsList && item.goodsList.length || 0;
    (len > 3) && (item.goodsListType != 'goods') && (len = 3);
    len && (data = new Array(len).fill({}));
  }catch(e){}
  return data
}

function refreshGoodsJson(group){
  if(!group)return
  this.goodsJson || (this.goodsJson = {});
  for(let i=0,len=group.length;i<len;i++){
    let goodsInfo = group[i];
    let goodsList = goodsInfo && goodsInfo.goodsList||[];
    for(let j=0,len=goodsList.length;j<len;j++){
      let item = goodsList[j];
      !this.goodsJson[item.id] && (this.goodsJson[item.id] = item);
    }
  }; 
  this.setData({
    goodsJson:this.goodsJson
  })
}


function checkIsCanBuy(goodsId, issueId){
  let params = { goodsId, issueId };
  let item = this.checkIsCanBuyInfo && this.checkIsCanBuyInfo[goodsId];
  if(item) {
    if (item.can_buy) return Promise.resolve(item);
    else {
      item.reason && app.SMH.showToast({title: item.reason})
      return Promise.reject(item);
    }
  }
  return app.RunApi.go('GoodsApi','checkCanBuy',params).then(res=>{
    if(res.code == '1'){
      let data = res.data||{};
      this.checkIsCanBuyInfo || (this.checkIsCanBuyInfo = {});
      this.checkIsCanBuyInfo[goodsId] = data;
      if(!data.can_buy){
        return Promise.reject(res);
      }
      return Promise.resolve(data)
    }
    return Promise.reject(res);
  }).catch(e=>{
    let title = "该商品无法购买";
    if(e && e.code == '1'){
      title = e.data && e.data.reason;
    }else{
      title = e.msg;
    }
    this.checkIsCanBuyInfo[goodsId].reason = title
    app.SMH.showToast({title})
    return Promise.reject(e);
  })
}


function getSumaryGoodsProductInfo(goods_id,goodsInfo,issueId) {
  let params = {
    goodsId: goods_id || 0, 
  }
  let chooseGoodsInfo = this.chooseGoodsInfo||{};
  let select_goods = JSON.parse(JSON.stringify(chooseGoodsInfo[goods_id]||{}));
  let shippingInfo = select_goods.shippingInfo||{};
  let url = "getSumaryGoodsProductInfo"; 
  // console.log('接口',goods_id,shippingInfo.shippingType , shippingInfo.storeId , select_goods )
  let storage = app.StorageH.get("select_store");
  if(goodsInfo.self_get != 2 && shippingInfo.shippingType != 2 && (shippingInfo.storeId || storage.id)){ 
    url = "getSumaryGoodsProductInfoByShippingStore";
    params.storeId = shippingInfo.storeId||storage.id||0;
    params.issueId=issueId || 0;
  }else{
    params.colorId=0;
    params.issueId=issueId || 0;
  }
  return app.RunApi.go('GoodsApi',url,params).then(res=>{
    return res && res.data||{};
  });
}


//加购物车
function createShoppingCart(type,cb) {
  let select_goods = this.data.select_goods || {}
  let productInfo = select_goods.productInfo || {};
  let shippingInfo = select_goods.shippingInfo||{};
  let extraInfo = this.initData.extraInfo||{};
  let goodsInfo = extraInfo.goodsInfo||{};
  let goodsExtend = this.initData.sku.goodsExtend;
  let tip = "";
  console.log('createShoppingCart',type)
  if (!productInfo.product_id){
    if (goodsExtend && goodsExtend.attr_count == 2) {
      tip = `请选择${!select_goods.select_color_id ? goodsExtend.color_name_title : goodsExtend.size_name_title}`
    }else{
      tip = `请选择${goodsExtend.color_name_title||"完整规格"}`
    }
  }  else if(!shippingInfo.shippingType && shippingInfo.selfGet == 0){
    tip = "请选择配送方式" 
  } else if ((shippingInfo.selfGet == 0 || shippingInfo.selfGet == 1) && shippingInfo.shippingType == 1 && !shippingInfo.storeId || (shippingInfo.selfGet == 1 && !shippingInfo.shippingType)){
    tip = "请选择自提店铺"
  }
  if(tip){
    app.SMH.showToast({
      "title": tip
    })
    return Promise.reject();
  }
  let issued_id = (goodsInfo.sale_type == "5" && goodsInfo.is_started == "0") ? 0 : extraInfo.issued_id;
  let goods_type = (goodsInfo.sale_type == "5" && goodsInfo.is_started == "0") ? productInfo.goods_type : goodsInfo.sale_type;
  return app.BuyApi.createBuyCarInsert({
    data: {
      "userToken": app.LM.userToken,
      "goods_id": select_goods.goods_id,
      "product_id": productInfo.product_id,
      "goods_number": select_goods.select_goods_count,
      "goods_type": goods_type,
      "brandCode": app.Conf.BRAND_CODE,
      "issued_id": issued_id,
      "url_code": "",
      "is_buy_now": type == 'buy' ? 1 : 0,
      "shippingStoreId": shippingInfo.shippingType == 1 ? shippingInfo.storeId : 0,
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
        let store_id = shippingInfo.shippingType == 1 && shippingInfo.storeId || 0;
        wx.navigateTo({
          url: '/pages/micro_mall/buy/buy?rec_str=' + data + '&store_id=' + store_id,
          // complete:()=>{
          //   setAnim.call(this);
          // }
        }) 
      } else {
        app.SMH.showToast({
          "title": "加入成功"
        })
      }
      return Promise.resolve(e);
    } else {
      app.SMH.showToast({
        "title": e.msg
      })
    }
    return Promise.reject();
  }).then(()=>{
    cb && typeof(cb) == 'function' && cb()
  })
}

function getSysConf(key,dataName=""){
  if(!dataName)return Promise.reject();
  return app.sysTemConfig(key).then(data => {
      this.setData({
        [dataName]: data.Value||0
      })
  })
}