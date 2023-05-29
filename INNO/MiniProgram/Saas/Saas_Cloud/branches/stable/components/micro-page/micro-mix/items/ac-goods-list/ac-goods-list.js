// components/micro-page/micro-mix/items/ac-goods-list/ac-goods-list.js
import mcBehavior from '../../../help/mc-behavior.js';
import {CountDown} from '../../../../../common/manager/timer-manager.js';
import myDate from '../../../../../common/support/utils/date-util.js';
import Conf from '../../../../../conf'
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
const TipText = {
"integralSale" : "积分",
  "pinSale" : "拼团",
  "preSale" : "预售",
  "kanSale" : "砍价",
  "packageSale" : "搭配",
  "secKill" : "秒杀",
  "limitTimeSale" : "限时",
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
    extraInfo:{
      type:Object,
      value:{}, 
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
      _data.tipText = TipText[_data.code]; 
      let {activityGroup,listData} = getInitData(_data,this.data.curTab); 
      this.serverTime = this.data.extraInfo && this.data.extraInfo.server_time||"";
      // console.log('activityGroup',activityGroup)
      this.setData({
        _data,
        init:true,
        listData,
        activityGroup:activityGroup || [{}],
        timeManager:this.timeManager,
        showTab: activityGroup && activityGroup.length>1 || false,
      }); 
    },
    loadData(_data){
      getParams(this.data._data||{},this).then(API=>{
        if(API.extra && API.extra.hideTab){
          setTimeout(() => {
            this.setData({
              listData:[],
              isInited:true
            })
            // console.log('接口后',this.data._data.moduleId,this.data._data.code,this.data.listData)
            this.mcItemRefresh();
          }, 500);
          return
        }
        let cur = this.data.curTab||0;
        return app.RunApi.go(API.m,API.api,API.url,API.params,API.extra).then(res=>{
          let data = res.data||{};
          let list = trimList(this.data._data||{},data,this,cur) || [];
          this.setData({
            isInited:true,
            listData: list
          })
          // console.log('接口后',this.data._data.moduleId,this.data._data.code,this.data.listData)
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
        }).finally(()=>{
          setModuleCountDown.call(this);
        })
      });
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
  return new Promise((rs,rj)=>{
    return getActGroup(setting,that).then(activityGroup=>{
      // console.log('秒杀活动组',activityGroup)
      that.setData({
        activityGroup
      })
      let apiParams = {};
      apiParams.m = "GET";
      let goodsList,ids,curTab=that.data.curTab||0; 
      if(setting.code == 'secKill' || setting.code == 'limitTimeSale'){
        let cur = that.data.curTab||0;
        if((!activityGroup || !activityGroup[cur]) || activityGroup[cur].showTab != 1){
          apiParams.extra = {hideTab:true};
          // console.log('接口前',that.data._data.moduleId,that.data._data.code,apiParams,activityGroup)
          return rs(apiParams)
        }
        goodsList = activityGroup && activityGroup[cur] && activityGroup[cur].goodsList||[];
      }else{
        goodsList = setting.goodsList || []
      }
      ids = mapGoodsList(goodsList) || []; 
      let {url,api,params,extra} = trimParams({setting,ids,curTab});
      apiParams.params = params;
      apiParams.api = api;
      apiParams.url = url; 
      apiParams.extra = extra; 
      // console.log('接口前',that.data._data.moduleId,that.data._data.code,apiParams,activityGroup)
      return rs(apiParams)
    }).catch(e=>{
      return rs({extra:{hideTab:true}})
    })
  }) 
}

function mapGoodsList(arr=[],key){
  let result = [];
  for(let i = 0,len=arr.length;i<len;i++){
    result.push(arr[i].id);
  }
  return result
}
function getInitData(_data,index,that){
  let activityGroup = [],listData = [],len=0;
  try{
    if(_data.code == 'secKill' || _data.code == 'limitTimeSale'){ //有活动Tab的模块
      activityGroup = _data && _data.activityGroup || [{}];
      let item = activityGroup[index] || {};
      len = item.goodsList && item.goodsList.length || item.show_num || Conf.BRAND_CODE;
      (item.goodsListType != 'manual') && (len > 3) && (len = 3); //自动获取最多3个，避免占位出入太大
      listData = new Array(len).fill({});

    }else{ //没有活动Tab的模块
      len = _data.goodsList && _data.goodsList.length || _data.show_num || Conf.BRAND_CODE;
      (_data.activity_model != 'manual') && (len > 3) && (len = 3); 
      activityGroup = [{}];
      listData = new Array(len).fill({});
    }
    return {activityGroup,listData}
  }catch(e){
    console.log('catch',e)
    return {activityGroup,listData}
  } 
} 

function setModuleCountDown(){
    // console.log('进来setModuleCountDown',this.timeManager)
    let _data = this.data._data||{};
    let group = _data.activityGroup || [];
    let code = _data.code||"";
    let listData = this.data.listData||[];
    let timeManager = this.timeManager||{};
    timeManager.moduleId = _data.moduleId;
    let cur = this.data.curTab||0;
    if(code == 'secKill' || code == 'limitTimeSale'){ //有TAB
      timeManager.aCs || (timeManager.aCs = {})
      if(group[cur] && !timeManager.aCs[group[cur].activity_id]){
        //是否要检测多个活动最小、最大的开始、结束时间 //待开发 group
        timeManager.aCs[group[cur].activity_id] = {};
        timeManager.s_t = transDate(group[cur].start_time||""); //秒杀要判断是资格开始还是活动开始
        timeManager.e_t = transDate(group[cur].end_time||"");
        timeManager.rd_t = group[cur].ready_time && transDate(group[cur].ready_time||"") || "";

        timeManager.sv_t = transDate(this.serverTime);
        timeManager.active = 1;
        timeManager.countType = code;
        timeManager.aCs[group[cur].activity_id].s_t = transDate(group[cur].start_time||"");
        timeManager.aCs[group[cur].activity_id].e_t = transDate(group[cur].end_time||"");
        timeManager.aCs[group[cur].activity_id].rd_t = group[cur].ready_time && transDate(group[cur].ready_time||"") || "";
        timeManager.aCs[group[cur].activity_id].active = 1;
      }
    }else{ 
      let s_t = timeManager.s_t || "",e_t = timeManager.e_t || ""; //为了赋值最小最大
      listData.forEach(item=>{
        timeManager.aCs || (timeManager.aCs = {})
        if(!timeManager.aCs[item.activity_id]){
          // 拿最小开始和最大结束时间 
          timeManager.aCs[item.activity_id] = {}
          timeManager.aCs[item.activity_id].s_t = transDate(item.start_time);
          timeManager.aCs[item.activity_id].e_t = transDate(item.end_time);
          timeManager.aCs[item.activity_id].sv_t = transDate(this.serverTime);
          s_t = !s_t? transDate(item.start_time) : s_t < transDate(item.start_time) ? s_t : transDate(item.start_time);
          e_t = !e_t? transDate(item.end_time) : e_t < transDate(item.end_time) ? transDate(item.end_time) : e_t;
          timeManager.aCs[item.activity_id].active = 1;
        }
      })
      timeManager.s_t = s_t;
      timeManager.e_t = e_t;
      timeManager.sv_t = transDate(this.serverTime);
      timeManager.active = timeManager.s_t > timeManager.sv_t ? 0 : timeManager.e_t > timeManager.sv_t ? 1 : -1;
      timeManager.countType = 'goods';
    }
    
    if (!timeManager.countDown) {
      timeManager.countDown = new CountDown(timeManager.sv_t); 
    }
    if (!timeManager.countDown.isRunning) { //已存在的模块倒计时不会进去start
      let targetTime = timeManager.e_t;
      if (timeManager.s_t > timeManager.sv_t) {
        targetTime = timeManager.rd_t > timeManager.sv_t ? timeManager.rd_t : timeManager.s_t;
      }
      timeManager.countDown.setTarget(targetTime);
      timeManager.countDown.start(e => { 
        if (e.value <= 0) {
          // console.log('结束',e)
          stopCountDown.call(this,timeManager.countDown);
        } else {
          // console.log('进来',_data.moduleId,e);
          setTimeData.call(this,timeManager.aCs, e,timeManager.countType);
        }
      })
    }
    // console.log('timeManager',timeManager)
}

function transDate(str){
  return myDate.parse(str);
}

function setTimeData(aCs, time,countType){
  try{
    let serverTime = new Date(time.nowTime).getTime(); 
    let status = "",tabStatus="";
    for (let i in aCs) { //模块里面的多活动遍历
      if(aCs[i].active==-1)continue;
      let s_t = (aCs[i].s_t).getTime();
      let e_t = (aCs[i].e_t).getTime();
      let rd_t = aCs[i].rd_t && (aCs[i].rd_t).getTime();
      let active = 0; //0:未开始，1：进行中，2：资格开枪  -1:结束
      let _value = "";
      if (serverTime >= e_t) { //结束
        _value = "";
        active = -1;
        status = "已结束"
        tabStatus = "已结束"
      } else {
        let targetTime;
        if(countType == 'secKill'){
          targetTime = rd_t > serverTime ? rd_t : s_t > serverTime ? s_t : e_t;
          active = rd_t > serverTime ? 2 : s_t > serverTime ? 0 : 1;
          status = rd_t > serverTime ? "距资格开抢" : s_t > serverTime ? "距开始" : "距结束";
          tabStatus = rd_t > serverTime ? "敬请期待" : s_t > serverTime ? "敬请期待" : "秒杀中";

        }else{
          targetTime = s_t > serverTime ? s_t : e_t;
          active = s_t > serverTime ? 0 : 1;
          status = s_t > serverTime ? "距开始" : "距结束";
          tabStatus = s_t > serverTime ? "敬请期待" : "正在疯抢";
        }
        _value = targetTime - serverTime;
      }
      aCs[i] = {
        ...aCs[i],
        ...timeHandle.call(this, _value),
        active,
        status,
        tabStatus
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

function trimParams({setting,ids,curTab=0}){
  let rst = {api:"",url:"",params:{},extra:{diy:true}};
  let code = setting.code||"",activityGroup=setting.activityGroup||[{}];
  if(!activityGroup[curTab])return {};
  switch(code){
    case"integralSale":
    rst.api = "CL_PointApi";
    rst.url = "getPointMkGoodsListByUser"; 
    rst.params.searchVal = "";
      break;
    case"pinSale":
    rst.api = "CL_CollageApi";
    rst.url = "getCollageGroupGoodsList"; 
      break;
    case"preSale":
    rst.api = "CL_PreSaleApi";
    rst.url = "getPresaleGoodsList"; 
    rst.params.searchVal = "";
      break;
    case"kanSale":
    rst.api = "CL_BargainApi";
    rst.url = "getHagglePriceActivityList"; 
    rst.params.searchVal = "";
      break;
    case"packageSale":
    rst.api = "GoodsApi";
    rst.url = "getValidGoodsPackageList"; 
    rst.params.searchStr = "";
      break;
    case "secKill":
      rst.api = "CL_SecKillApi";
      rst.url = "getGoodsList";
      if (ids.length>0) {//手动
        rst.params = {
          goodsIds: ids.join(','),
          pageSize: ids.length || Conf.PAGE_SIZE,
         }
      }
      rst.params = {
        pageSize: activityGroup[curTab].show_num || Conf.PAGE_SIZE,
        pageIndex: 1,
        userToken: app.LM.userToken,
        activityId: activityGroup[curTab].activity_id || 0, 
        ...rst.params,
      }
      break;
    case "limitTimeSale":
      rst.api = "GoodsApi";
      rst.url = "getSumaryALLGoodsList";
      if (ids.length>0) { //手动
        rst.url = "getSeckillGoodList";
        rst.params = {
          issueId: activityGroup[curTab].activity_id || 0,  
          goodsIds: ids.join(','),
          pageIndex: 1,
          pageSize: ids.length || Conf.PAGE_SIZE,
          brandCode: Conf.BRAND_CODE,
         }
      }else{
        rst.params = {
          functype: 'SK',
          strWhere: '',
          sort_field: 'goods_id',
          sort_by: 'desc',
          goods_brand_ids: '',
          cate_Id: activityGroup[curTab].activity_id || 0,
          pageSize: activityGroup[curTab].show_num || Conf.PAGE_SIZE,
          pageIndex: 1,
          brandCode: Conf.BRAND_CODE,
          userToken: app.LM.userToken,
        }
      }
      break; 
    default:
      break;
  }
  //部分活动 统一处理
  if(code == "integralSale" || code == "pinSale"|| code == "preSale"|| code == "kanSale"|| code == "packageSale"){
    rst.params = {
      ...rst.params,
      pageIndex: 1,
      pageSize:ids.length || setting.show_num || Conf.PAGE_SIZE,
      brandCode: Conf.BRAND_CODE,
      activityIds:ids && ids.join(",") || ""
    }
  }
  return rst
}

function trimList(setting,data,that,cur){
    let code = setting.code||"";
    let list = []; 
    switch(code){
      case "integralSale":
      list = data && data.list||[];
      list.forEach(item=>{
        Object.assign(item, {
          goods_name:item.name||"",
          goods_thumb:item.picture||"",
          activity_id:item.mk_goods_id,
          price:item.sale_price,
        });
      })
        break;
      case "pinSale":
        list = data||[];
        list.forEach(item=>{
          Object.assign(item, {
            start_time:item.addtime,
            end_time:item.etime,
          });
        })
        break;
      case "preSale":
        list = data && data.dataList||[];
        list.forEach(item=>{
          Object.assign(item, {
            goods_thumb:item.act_img||"",
            price:item.min_presale_price,
            market_price:item.max_market_price || 0,
            start_time:item.presale_begin_time,
            end_time:item.presale_end_time,
          });
        }) 
        break;
      case "kanSale":
        list = data && data.dataList||[];
        list.forEach(item=>{
          Object.assign(item, {
            goods_name:item.goodsName||"",
            goods_thumb:item.goodsImg||"",
            activity_id:item.activityId,
            price:item.minBottomPrice,
            market_price:item.maxMarketPrice,
            start_time:item.fromTime,
            end_time:item.toTime,
          });
        }) 
        break;
      case "packageSale":
        list = data && data.dataList||[];
        list.forEach(item=>{
          Object.assign(item, {
            goods_name:item.packageName||"",
            goods_thumb:item.packageBgImage||"",
            activity_id:item.packageId,
            price:item.minSalePrice,
            max_price:item.maxSalePrice, 
            start_time:that.server_time,
            end_time:item.toDate, 
          });
        }) 
        break;
      case "secKill":
        list = data && data.list||[];
        list.forEach(item=>{
          Object.assign(item, {
            goods_name:item.goodsName||"",
            goods_thumb:item.picture||"",
            activity_id:item.activityId,
            market_price:item.marketPrice,
            percent:getPercent(item.inventoryRemnant, item.inventory),
          });
        })
        break;
      case "limitTimeSale":
        let type = data && data.goods_list ? 'auto' : 'manual'
        let l_t_s_ac_id = setting.activityGroup && setting.activityGroup[cur]&&setting.activityGroup[cur].activity_id||0;
        list = type == 'auto' ? data.goods_list : data;
        list.forEach(item=>{
          if(type == 'auto'){ //自动
            Object.assign(item, {
              activity_id:l_t_s_ac_id,
            });
          }else{
            Object.assign(item, {
              activity_id:l_t_s_ac_id,
            });
          }
        })
        break;
      default:
        break;
    }
    return list;
}
function getActGroup(_data,that){
  let tabExist = false,curTabExist = false;
  let activityGroup = _data.activityGroup||[];
  if(_data.code == 'secKill'){
    let params = {
      groupId: _data.group_id || 0, 
      brandCode: app.Conf.BRAND_CODE || ''
    };
    let extra = { diy : true };
    return app.RunApi.go('CL_SecKillApi','getActivityGroup',params,extra).then(res=>{
      let activityList = res.data && res.data.activityList || []; 
      for(let i = activityGroup.length-1;i>=0;i--){
        for(let j = 0,len=activityList.length;j<len;j++){
          if(activityList[j].activityId == activityGroup[i].activity_id){
            activityGroup[i].start_time = activityList[j].startTime;
            activityGroup[i].end_time = activityList[j].endTime;
            activityGroup[i].ready_time = activityList[j].readyTime;
            activityGroup[i].server_time = that.serverTime; 
            let unStart = transDate(activityList[j].startTime) > transDate(that.serverTime) || transDate(activityList[j].readyTime) > transDate(that.serverTime);
            activityGroup[i].tabStatus = unStart ? "敬请期待" : transDate(activityList[j].endTime) > transDate(that.serverTime) ? "秒杀中" : "已结束";
            activityGroup[i].showTab = 1;
            tabExist = true;
            curTabExist = true;
            break;
          }
        }
        if(!curTabExist){
          activityGroup.splice(i,1);
        }
        curTabExist = false;
      }
      that.setData({tabExist})
      return activityGroup
    })
  }else if(_data.code == 'limitTimeSale'){
    let activityGroup = _data.activityGroup||[];
    let params = { 
      issueId: 0, //读取整个列表
      brandCode:Conf.BRAND_CODE
    };
    let extra = { diy : true };
    return app.RunApi.go('GoodsApi','seckillGetGoodsList',params,extra).then(res=>{
      let activityList = res.data || [];
      for(let i = activityGroup.length-1;i>=0;i--){
        for(let j = 0,len=activityList.length;j<len;j++){
          if(activityList[j].issue_id == activityGroup[i].activity_id){
            activityGroup[i].start_time = activityList[j].stime;
            activityGroup[i].end_time = activityList[j].etime;
            activityGroup[i].server_time = that.serverTime; 
            let unStart = transDate(activityList[j].stime) > transDate(that.serverTime);
            activityGroup[i].tabStatus = unStart ? "敬请期待" : transDate(activityList[j].etime) > transDate(that.serverTime) ? "正在疯抢" : "已结束";
            activityGroup[i].showTab = 1;
            tabExist = true;
            curTabExist = true;
            break;
          }
        }
        if(!curTabExist){
          activityGroup.splice(i,1);
        }
        curTabExist = false;
      }
      that.setData({tabExist})
      return activityGroup
    })
  }else{
    return Promise.resolve([{}]);
  }
}

function getPercent(inven = 0, invenSum = 0) { //ok
  let percent = (invenSum == 0) ? 0 : inven / invenSum >= 1 ? 100 : inven / invenSum > 0.01 ? parseInt(((inven / invenSum) * 100).toFixed(2)) : parseFloat((inven / invenSum) * 100);
  percent = percent > 0 && percent < 1 ? 1 : percent;
  return percent;
}