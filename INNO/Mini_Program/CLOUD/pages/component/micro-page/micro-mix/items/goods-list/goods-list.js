// pages/component/micro-page/items/goods-list/goods-list.js
import mcBehavior from '../../../help/mc-behavior.js'
import ParentNodes from '../../../help/parent-nodes'
const app = getApp();
const NumTextTrans={
  "one":1,
  "two":2,
  "three":3,
  "four":4,
}
const goodsSearch = {
  goodsCat:"CA",
  vat:"VA",
  goods:"goods",
  goodsBrand:"Brandcode"
}
Component(app.BTAB({
  behaviors: [mcBehavior],
  relations:ParentNodes,
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        // if(!this.isAttached)return
        n && this.init(n);
      }
    },
    showTab:{
      type:Boolean,
      value:false,
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
    screenWidth:app.SIH.screenWidth
  },
  methods: {
    init(_data){
      console.log('init goods-list');
      let group =  _data && _data.goodsGroup||[];
      this.setData({
        _data,
        showTab: group.length>1,
      });
      this.loadData();
    },
    loadData(extend){
      let _data = this.data._data||{};
      let apiPm = getParams(_data,extend);
      return app.RunApi.go(apiPm.m,apiPm.api,apiPm.url,apiPm.params,apiPm.extra).then(res=>{
        let data = res.data||{};
        this.setData({
          listData: data.goods_list || [],
          init:true
        })
        Promise.nextTick().then(()=>{
          this.itemRefresh();
          // setTimeout(() => {
          //   this.getQuery();
          // }, 1000);
          // console.log('数据更新',this.queryInfo)
          // this.queryInfo ={
          //               bottom: 378.5,
          //   dataset: {},
          //   height: 249.5,
          //   id: "main",
          //   left: 0,
          //   right: 375,
          //   top: 129,
          //   width: 375,
          //             }
        
        })
      })
    },
    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      if(type == 'tab'){
        let curTab = dataset.index||0;
        this.setData({
          curTab
        })
        this.refreshData(curTab)
      }
    },
    refreshData(index){
      // this.triggerEvent('singleSwitch',{index})
      this.loadData({index});
    }, 
  }
}))

function getParams(setting,extend={}){
  let apiParams = {};
  apiParams.api = "CL_GoodsApi";
  apiParams.extra = {diy:true};
  let goodsGroup = [],goodsList = [],ids,goodsListType, index=extend&&extend.index||0;
  if(Array.isArray(setting.goodsGroup)){
    goodsGroup = setting.goodsGroup||[];
    goodsList = goodsGroup[index].goodsList||[];
    goodsListType = goodsGroup[index].goodsListType;
    ids = mapGoodsList(goodsList) || [];
    if(goodsSearch[goodsGroup[index].goodsListType] == 'goods'){
      apiParams.url = "getALLGoodsListByGoodsIds";
      apiParams.m = "POST";
      apiParams.params = {
          goodsIdList : ids
      }
    }else{
      apiParams.url = "getSearchGoodsListBySkip";
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
        pageSize: 1000,
        pageIndex: 1,
        skipCount: setting.skip || 0,
        sortField: 'goods_id',
        sortBy: 'desc',
        goods_brand_ids: goodsListType == 'goodsBrand' ? ids : 0,
        storeId: '0',
      }
    }
  } 
  return apiParams
}

function mapGoodsList(arr=[],type){
  let result = [];
  for(let i = 0,len=arr.length;i<len;i++){
    result.push(arr[i].id);
  }
  return result
}
