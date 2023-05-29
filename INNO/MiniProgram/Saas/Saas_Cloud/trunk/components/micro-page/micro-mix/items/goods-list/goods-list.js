// components/micro-page/items/goods-list/goods-list.js
import mcBehavior from '../../../help/mc-behavior.js'
import TLH from '../../../../template/help/tag-list-help'
import { checkCommission ,checkStoreCommission } from '../../../../../common/helper/commission-helper.js';
import { getPromotionLabels } from '../../../../promotionLabel/promotionHelper.js';
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
    customBuy:0,
    commission: {},
    showCommission: true,
    promotionLabels: {}
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
        getCommission.call(this);
        getPromLabels.call(this);
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
    buy(e,noCheck=false){ 
      let goodsId = noCheck ? this.tempInfo.goodsId : this.getDataset(e,'goodsId')||0;
      let img = noCheck ? this.tempInfo.img : this.getDataset(e,'img')||0;
      this.tempInfo = {goodsId,img}
      return checkIsCanBuy.call(this,goodsId).then(goodsInfo=>{
        return getSumaryGoodsProductInfo.call(this,goodsId,noCheck).then(data=>{
          this.specView || (this.specView = this.selectComponent('#specView'));      
          let chooseGoodsInfo = this.data.chooseGoodsInfo||{};
          let select_goods = JSON.parse(JSON.stringify(chooseGoodsInfo[goodsId]||{}));
          let product_id = select_goods.productInfo && select_goods.productInfo.product_id||0;
          this.specView && this.specView.initData({
            default_goods_img:img,
            goodsInfo, 
            product_id,
            select_goods,
            resetType:!noCheck && "all" || "",
            resetShipping:!noCheck,
            goodsType:"normal",
            isCustom:true,
            data,
          });
        });
      })
    },
    confirmSpec(e){
      let detail = e.detail || {};
      let goods_id = (detail.productInfo && detail.productInfo.goods_id) || 0; 
      let chooseGoodsInfo = this.data.chooseGoodsInfo || {};
      chooseGoodsInfo[goods_id] = detail;
      console.log('chooseGoodsInfo',goods_id,detail,chooseGoodsInfo);
      this.setData({
        chooseGoodsInfo
      })
    },
    shippingChange(e){
      let detail = e && e.detail || {};
      let select_goods = detail||{};
      this.setData({select_goods});
      this.buy({},true);
    },
  }
}))

function getParams(setting,that){
  let apiParams = {};
  apiParams.api = "CL_GoodsApi";
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
        goodsIdList : ids
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
        sortField: 'goods_id',
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

function checkIsCanBuy(goodsId){
  let params = { goodsId }
  return app.RunApi.go('GoodsApi','checkCanBuy',params).then(res=>{
    if(res.code == '1'){
      let data = res.data||{};
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
    app.SMH.showToast({title})
    return Promise.reject(e);
  })
}


function getSumaryGoodsProductInfo(goods_id,noCheck) {
  let params = {
    goodsId: goods_id || 0, 
  }
  let chooseGoodsInfo = this.data.chooseGoodsInfo||{};
  let select_goods = JSON.parse(JSON.stringify(chooseGoodsInfo[goods_id]||{}));
  let shippingInfo = select_goods.shippingInfo||{};
  let url = "getSumaryGoodsProductInfo"; 
  if(noCheck && shippingInfo.shippingType == 1 && shippingInfo.storeId){
    url = "getSumaryGoodsProductInfoByShippingStore";
    params.storeId = shippingInfo.storeId||0;
  }else{
    params.colorId=0;
    params.issueId=0;
  }
  return app.RunApi.go('GoodsApi',url,params).then(res=>{
    return res && res.data||{};
  });
}

function getSysConf(key,dataName=""){
  if(!dataName)return Promise.reject();
  return app.sysTemConfig(key).then(data => {
      this.setData({
        [dataName]: data.Value||0
      })
  })
}

// 获取店员的佣金信息
function getCommission(){
  const listData = this.data.listData || [];
  let ids = listData.map(item => item.goods_id).join(",");
  if (!ids) return
  let params = {
    goodsIds:ids,
    goodsType:"NORMAL",
    relatedId:0,
    byStore: true, // true为店员分销，false为分销员分销
  };
  const processFn = () => {
    app.RunApi.go('CL_GoodsApi','getGoodsCommissionAmount',params).then(res=>{
      let data = res.data||[];
      let commission = this.data.commission || {};
      data.forEach(item=>{
        commission[item.goods_id] = item
      })
      this.setData({
        commission,
        showCommission:true
      })
    })
  }
  return checkStoreCommission()
  .then(()=>processFn())
  .catch(err => {
    console.log("获取店铺分享佣金信息失败->", err)
    checkCommission().then(checkConf=>{
      if(checkConf.isShowCommission){
        params.byStore = false;
        processFn();
      }
    })
  })
}
function getPromLabels(){
  const listData = this.data.listData || [];
  let ids = listData.map(item => item.goods_id).join(",");
  if (!ids) return Promise.resolve("")
  return getPromotionLabels(ids)
    .then(promotionLabels => {
      this.setData({
        promotionLabels: {...this.data.promotionLabels, ...promotionLabels},
      })
      return Promise.resolve(promotionLabels);
    })
}