import PageJump from "../../../common/helper/page-jump.js";
import strH from "../../../common/helper/handle/strHandle.js";
import { checkCommission } from "../../../common/helper/commission-helper.js";
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true
  },
  properties: {
    page_module_list: { // bindType = 15时，传入为单个活动的detail
      type: Object,
      value: {},
    },
    tagVal: {
      type: Object,
      value: {},
    },
    LIMIT_GOODSIDS: {
      type: Number,
      value: 0,
    },
    tagList: {
      type: Object,
      value: {},
    },
    m_item: {
      type: Object,
      value: {},
      observer: function(n, o) {
        // console.log("进来 商品数据", this.data.page_module_list.moduleId,JSON.parse(JSON.stringify(n)))
        if(n && n.length>0){
          this.setData({
            m_data: n
          })
          n && init.call(this);
        }
      }
    },
    img_url: {
      type: String,
      value: '',
    },

    goodsTagList: {
      type: Object,
      value: {},
    },

    sysConf: {
      type: Object,
      value: {}
    },
    showSalesVolume:{
      type:Boolean,
      value:false
    }
  },
  data: {
    showInit:true,
    commission:{},
    initArr:[],
    default_bg: "#EB213A",
    m_data:[]
  },
  attached(){
    this.pageIndex = 0;
    this.ceilNum = 1;
    this.goodsTagList=[];
    let l_color = app.getColor(this.data.brand_info.style.font_color, -4, 37, 0, 1) || '';
    this.setData({
      l_color
    })
  },
  methods: {
    goLink: function(e) {
      let that = this;
      let type = e.type;
      let dataset = e.type == "clickcallback" ? (e.detail || {}) : (e.currentTarget.dataset || {});
      let goods_id = dataset.goods_id || 0;
      if (!goods_id)return
      let page_module_list = this.properties.page_module_list || {};
      if(page_module_list.bindType == 1 ){
        dataset.name = "GOODS"
      } else if (page_module_list.bindType == 2){
        dataset.name = "GOODS_LIST"
      }
      PageJump(dataset);
    },
    loadData(){
      if(this.isLoading)return
      this.isLoading = true;
      let data = this.data.page_module_list||{};
      if(data.bindType == 1){
      // if(data.bindType == 1 && data.moduleStyles != 4 && data.moduleItem.itemList && data.moduleItem.itemList.length>this.data.LIMIT_GOODSIDS){
        let params = {
          goodIds: this.goodsIdsArr[this.pageIndex] && this.goodsIdsArr[this.pageIndex].join(',') || ""
        }
        return app.RunApi.go('GoodsApi','getALLGoodsListByGoodsIds',params).then(res=>{
          let goodsList = res.data && res.data.goodsList||[];
          let ids = [];
          for (let i = 0, len = goodsList.length; i < len; i++) {
            let item = goodsList[i];
            ids.push(item.goods_id);
            item.salesVolumeStr = strH.numberCarryBit(item.salesVolume);
          }
          ids=ids.join(',');
          ids && getCommission.call(this,ids)
          let goodsTagList = res.data && res.data.goodsTagList||[];
          this.goodsTagList = [...this.goodsTagList,...goodsTagList];
          this.setData({
            m_item:[...this.data.m_item,...goodsList]
          })
          // console.log('进来 m_item',this.data.page_module_list.moduleId,this.data.m_item,goodsList)
        }).finally(()=>{
          this.isLoading = false;
          this.pageIndex += 1;
          _triggerEvent.call(this,{
            bool: this.pageIndex>this.ceilNum-1,
            tag:this.goodsTagList,
            mod:this.data.page_module_list,
          })
        })
      }else if(data.bindType == 2){
      // }else if(data.bindType == 2 && data.moduleStyles != 4 && (data.pageSize==0 || data.pageSize>this.data.LIMIT_GOODSIDS)){
        let limit = this.data.LIMIT_GOODSIDS;
        let i = this.pageIndex;
        let pageSize,skipCount=limit * i,allCount=this.allCount;
        if(allCount){
          pageSize = allCount - limit * i > limit ? limit : allCount - limit * i;
        }else{
          pageSize = data.moduleStyles == '4' ? (data.pageSize||5000) : data.pageSize < limit ? (data.pageSize||limit) : limit
        }
        let params = {
          functype: data.catType || 'CA',
          catId: data.catId || 0,
          strAttrId: '',
          strAttrValue: '',
          colorCatId: 0,
          startPrice: -1,
          endPrice: -1,
          strWhere: '',
          pageIndex: 1,
          pageSize:pageSize,
          skipCount: skipCount || 0,
          sortField: 'goods_id',
          sortBy: 'desc',
          goods_brand_ids: '',
          storeId: '0',
        }
        return app.RunApi.go('GoodsApi','getSearchGoodsListBySkip',params).then(res=>{
          let goodsList = res.data && res.data.goods_list||[];
          let goodsTagList = res.data && res.data.goodsTagList||[];
          this.goodsTagList = [...this.goodsTagList,...goodsTagList];
          this.allCount = res.data.allCount||0;
          this.end = pageSize<limit || this.allCount <= skipCount+pageSize;
          let ids = [];
          for (let i = 0, len = goodsList.length; i < len; i++) {
            let item = goodsList[i];
            ids.push(item.goods_id);
            item.salesVolumeStr = strH.numberCarryBit(item.salesVolume);
          }
          ids=ids.join(',');
          getCommission.call(this,ids);
          this.setData({
            m_item:[...this.data.m_item,...goodsList]
          })
          console.log('进来 m_item',this.data.page_module_list.moduleId,this.data.m_item,goodsList)
        }).finally(()=>{
          this.isLoading = false;
          this.pageIndex += 1; 
          _triggerEvent.call(this,{
            bool: this.end,
            tag:this.goodsTagList,
            mod:this.data.page_module_list,
          })
        })
      } 
    }, 
    modInit(){
      let data = this.data.page_module_list||{};
      if(data.bindType == 1){
      // if(data.bindType == 1 && data.moduleStyles != 4 && data.moduleItem.itemList && data.moduleItem.itemList.length>this.data.LIMIT_GOODSIDS){
        try{
          this.pageIndex = 0;
          this.goodsIdsArr = getIds.call(this,data.moduleItem.itemList,data) || [];
          console.log('进来modInit',this.goodsIdsArr);
          this.loadData();
        }catch(e){
          console.log(e)
        }
      }
      if(data.bindType == 2){
      // if(data.bindType == 2 && data.moduleStyles != 4 && (data.pageSize==0 || data.pageSize>this.data.LIMIT_GOODSIDS)){
        try{ 
          console.log('进来modInit分类');
          this.loadData();
        }catch(e){
          console.log(e)
        }
      } 
    }
  }
}))

function init() {
  let init = checkInit.call(this);
  if (init) return
  let page_module_list = this.data.page_module_list || '';
  if (page_module_list.moduleStyles == '4') {
    let id = '#marquee'
    let marquee = this.selectComponent(id);
    marquee && marquee.initScroll(this.data.m_data, page_module_list);
  }
} 

function checkInit() {
  let data = this.data.m_data || [];
  if (data && data.length==0) {
    setInitArr.call(this);
    return true
  }else{
    installArr.call(this);
  }
  this.setData({
    showInit: false
  })
  return false
}

function setInitArr() {
  if (this.setInitAlready) {
    return
  }
  this.setInitAlready = true;
  let initArr = [];
  let data = this.data.page_module_list || {};
  let style = data.moduleStyles || '';
  if (style == '1' || style == '4' || style == '6') {
    initArr = new Array(1).fill({});
  } else if (style == '2') {
    initArr = new Array(2).fill({});
  } else if (style == '3' || style == '5') {
    initArr = new Array(3).fill({});
  }
  this.setData({
    initArr: initArr
  })
  // console.log('初始化', initArr, data) 
}

function installArr(){
  let data = this.data.page_module_list || {};
  let itemList = data.moduleItem && data.moduleItem.itemList || [];
  //
  if(itemList.length > 0  && (data.bindType != 15 || (data.bindType == 15 && data.bind_type == 1))){
    let m_item = this.data.m_item || [];
    sortByArr.call(this, m_item, itemList);
  }
}

function sortByArr(m_item, keyList){
  let m_json = strH.createJsonByKey(m_item,"goods_id");
  let data = []
  for (let i = 0; i < keyList.length; i++){
    let goodsId = keyList[i].goods_id;
    if(!m_json[goodsId]){
      continue
    }
    data.push(m_json[goodsId] || {})
  }
  this.setData({
    m_data: data 
  })
}


function getIds(data,moduleData) { //传参初始化  SwitchApi 函数用到
  let goodsIds = [];
  let goodsIdsSum = [];
  let limit = this.data.LIMIT_GOODSIDS;
  data.forEach(item => {
    if (item.goods_id) {
      goodsIds.push(item.goods_id)
    }
  })
  if(moduleData.moduleStyles!=4){
    let _len = Math.ceil(goodsIds.length/limit);
    let mo = goodsIds.length%limit;
    this.ceilNum = _len;
    for(let i = 0,len=_len;i<len;i++){
      let extra = (i == len - 1 && mo>0) ? mo : limit
      goodsIdsSum.push(goodsIds.slice(i*limit,i*limit+extra));
    }
  }else{
    goodsIdsSum.push(goodsIds);
  }
  return goodsIdsSum
}

function getCommission(ids){
  let params = {
    goodsIds:ids,
    goodsType:"NORMAL",
    relatedId:0
  };
  return checkCommission().then(checkConf=>{
    if(checkConf.isShowCommission){
      app.sysTemConfig('goods_list_close_commission').then(res=>{
        if(!res || res.Value != 1){
          return app.RunApi.go('CL_GoodsApi','getGoodsCommissionAmountByTypeAll',params).then(res=>{
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
      })
    }
  });
}

function setEmpty(bool=true){
  this.setData({
    hidePage:bool
  })
}

function _triggerEvent(data={}){
  this.triggerEvent('goodsListTap',{...data});
}