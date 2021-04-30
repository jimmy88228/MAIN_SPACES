// pages/component/micro-page/micro-mix/items/ac-goods-list/ac-goods-list.js
// pages/component/micro-page/items/goods-list/goods-list.js
import mcBehavior from '../../../help/mc-behavior.js';
import {CountDown} from '../../../../../../helper/manager/timer-manager.js';
import myDate from '../../../../../../support/utils/date-util.js';
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
  pageLifetimes: {
    show: function() {
      if(this.timeManager && this.timeManager.countDown){
        setModuleCountDown.call(this);
      }
    },
    hide: function() {
      if(this.timeManager && this.timeManager.countDown){
        stopCountDown.call(this,this.timeManager.countDown);
      }
    }, 
  },
  data: {
    htmlNodes:"",
    NumTextTrans,
    screenWidth:app.SIH.screenWidth,
  },
  methods: {
    init(_data){
      this.timeManager || (this.timeManager = {}) 
      let {activityGroup,listData} = getInitData(_data,this.data.curTab);
      this.setData({
        _data,
        init:true,
        listData,
        activityGroup,
        timeManager:this.timeManager,
        showTab: _data.activityGroup && _data.activityGroup.length>1 || false,
      });
    },
    loadData(_data){
      let _p = getParams(this.data._data||{},this);
      let res = test()||{}; //模拟数据
      let data = res.data||{};
      this.setData({
        isInited:true,
        listData: data.goods_list || [],
      })
      if(!this.data._data.open_slide){ //swiper 先不刷新
        this.mcItemRefresh();
      }
      setModuleCountDown.call(this);
      return Promise.resolve(res);

      return app.RunApi.go(_p.m,_p.api,_p.url,_p.params,_p.extra).then(res=>{
        let data = res.data||{};
        this.setData({
          isInited:true,
          listData: data.goods_list || [],
        })
        console.log('看看',data)
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
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      if(type == 'tab'){
        let curTab = dataset.index||0;
        this.setData({
          curTab
        })
        this.refreshData()
      }
    },
    refreshData(){
      this.loadData();
    }, 
  }
}))

function getParams(setting,that){
  let apiParams = {};
  apiParams.api = "CL_GoodsApi";
  apiParams.extra = {diy:true};
  let activityGroup=setting.activityGroup,goodsList=setting.goodsList||[],ids,goodsListType,index=that.data.curTab||0; 
  if(true||Array.isArray(activityGroup)){
    ids = mapGoodsList(goodsList) || [];
    if(goodsList.length>0){
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
function getInitData(_data,index){
  let activityGroup = [],listData = [],len=0;
  try{
    if(_data.code == 'secKill' || _data.code == 'limitTimeSale'){ //有活动Tab的模块
      activityGroup = _data && _data.activityGroup || [{}];
      let item = activityGroup[index] || {};
      len = item.goodsList && item.goodsList.length || 1;
      (item.goodsListType != 'manual') && (len > 3) && (len = 3); //自动获取最多3个，避免占位出入太大
      activityGroup.forEach(item=>{
        item.start_time = "2021-04-21 00:00";
        item.end_time = "2021-04-30 00:00";
        item.server_time = "2021-04-22 00:00";
      })
    }else{
      len = _data.goodsList && _data.goodsList.length || _data.show_num || 1;
      (_data.activity_model != 'manual') && (len > 3) && (len = 3); 
      activityGroup = [{}];
    }
    listData = new Array(len).fill({}); 
  }catch(e){
    console.log('catch',e)
  }
  return {activityGroup,listData}
}

function test(){
  return {
    "data": {
      "allCount": 2,
      "pages": 1,
      "is_sk": 0,
      "user_integral": 0,
      "goods_list": [
        {
          "goods_id": 1030,
          "activity_id":10301,
          "goods_sn": "CES1",
          "goods_name": "CES1商品",
          "goods_brief": "卖点",
          "goods_thumb": "https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210323/20210323110247441_8158543.jpg",
          "goods_thumb2": "https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210323/20210323110247441_8158543.jpg",
          "market_price": 99.00,
          "price": 0.01,
          "sale_type": 0,
          "color_id": 0,
          "sort_order": 0,
          "salesVolume": 100,
          "start_time": "2021-04-21 00:00",
          "end_time": "2021-04-30 00:00", 
          "integral": "1",
        },
        {
          "goods_id": 25,
          "activity_id":250,
          "goods_sn": "Henry02",
          "goods_name": "「一口价」特价长袖套装牛奶丝",
          "goods_brief": "",
          "goods_thumb": "https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210317/20210317102946790_1102767.jpg",
          "goods_thumb2": "https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210317/20210317102946790_1102767.jpg",
          "market_price": 59.00,
          "price": 0.01,
          "sale_type": 0,
          "color_id": 0,
          "sort_order": 0,
          "salesVolume": 100,
          "start_time": "2021-04-21 23:59",
          "end_time": "2021-04-28 00:00", 
          "integral": "22",
        }, 
      ],
      "serverTime":"2021-04-27 00:00",
      "goodsTagList": [],
      "img_domain": "https://devimgtest.innourl.com/SAAS_IMAGE/",
      "sortField": "goods_id",
      "sortBy": "asc"
    },
    "code": 1
  }
}

function setModuleCountDown(){
    this.serverTime = "2021-4-27 23:59:50"; //到时候获取最新的serverTime
    console.log('进来setModuleCountDown',this.timeManager)
    let _data = this.data._data||{};
    let group = _data.activityGroup || [];
    let code = _data.code||"";
    let listData = this.data.listData||[];
    let timeManager = this.timeManager||{};
    timeManager.moduleId = _data.moduleId;
    let cur = this.data.curTab||0;
    if(code == 'secKill' || code == 'limitTimeSale'){ 
      // console.log('group[cur]',group[cur],group,cur)
      timeManager.aCs || (timeManager.aCs = {})
      if(!timeManager.aCs[group[cur].activity_id]){
        //是否要检测多个活动最小、最大的开始、结束时间 //待开发
        timeManager.aCs[group[cur].activity_id] = {};
        timeManager.s_t = transDate(group[cur].start_time||"");
        timeManager.e_t = transDate(group[cur].end_time||"");
        timeManager.sv_t = transDate(this.serverTime);
        timeManager.active = 1;
        timeManager.countType = 'activity';
        timeManager.aCs[group[cur].activity_id].s_t = transDate(group[cur].start_time||"");
        timeManager.aCs[group[cur].activity_id].e_t = transDate(group[cur].end_time||"");
        timeManager.aCs[group[cur].activity_id].active = 1;
      }
    }else{
      timeManager.s_t = transDate("2021-04-21 00:00");
      timeManager.e_t = transDate("2021-04-30 00:00");
      timeManager.sv_t = transDate(this.serverTime);
      timeManager.active = 1;
      timeManager.countType = 'goods';
      // timeManager.countType = _data.code == 'packageSale' ? 'none':'goods';
      let s_t = "",e_t = "",active = 1; //为了赋值最小最大
      listData.forEach(item=>{
        timeManager.aCs || (timeManager.aCs = {})
        if(!timeManager.aCs[item.activity_id]){
          // 拿最小开始和最大结束时间 //待开发
          timeManager.aCs[item.activity_id] = {}
          timeManager.aCs[item.activity_id].s_t = transDate(item.start_time);
          timeManager.aCs[item.activity_id].e_t = transDate(item.end_time);
          timeManager.aCs[item.activity_id].sv_t = transDate(this.serverTime);
          timeManager.aCs[item.activity_id].active = 1;
        }
      })
    }
    if (!timeManager.countDown) {
      timeManager.countDown = new CountDown(timeManager.sv_t); 
    }
    if (!timeManager.countDown.isRunning) { //已存在的模块倒计时不会进去start
      let targetTime = timeManager.e_t;
      if (timeManager.s_t > timeManager.sv_t) {
        targetTime = timeManager.s_t;
      }
      timeManager.countDown.setTarget(targetTime);
      timeManager.countDown.start(e => { 
        if (e.value <= 0) {
          console.log('结束',e)
          stopCountDown.call(this,timeManager.countDown);
        } else {
          // console.log('进来',_data.moduleId,e);
          setTimeData.call(this,timeManager.aCs, e);
        }
      })
    }
    console.log('timeManager',timeManager)
}

function transDate(str){
  return myDate.parse(str);
}

function setTimeData(aCs, time){
  try{
    let serverTime = new Date(time.nowTime).getTime(); 
    for (let i in aCs) { //模块里面的多活动遍历
      if(aCs[i].active>=2)continue;
      let s_t = (aCs[i].s_t).getTime();
      let e_t = (aCs[i].e_t).getTime();
      let active = 0; //0:未开始，1：进行中，2：结束
      let _value = "";
      if (serverTime >= e_t) { //结束
        _value = "";
        active = 2;
      } else {
        let targetTime = s_t > serverTime ? s_t : e_t;
        active = s_t > serverTime ? 0 : 1;
        _value = targetTime - serverTime;
      }
      // console.log('active',active,_value)
      aCs[i] = {
        ...aCs[i],
        ...timeHandle.call(this, _value),
        active,
      }
    } //先遍历全部活动 再下面setData
    this.setData({
      timeManager:this.timeManager
    })
    // console.log('倒计时',this.data.timeManager)
  }catch(e){
    console.log(e,'catch')
  } 
}

function timeHandle(value) {
  if (!value) return "";
  let day = Math.floor(value / (60 * 60 * 24 * 1000));
  let hour = parseInt(value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
  let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((value % (1000 * 60)) / 1000);
  let data = {};
  data.day = day;
  data.hour = hour > 9 ? hour : '0' + hour;
  data.min = minutes > 9 ? minutes : '0' + minutes;
  data.sec = seconds > 9 ? seconds : '0' + seconds;
  return data;
}

function stopCountDown(countDown) {
  if (countDown) {
    countDown.stop();
  }
}