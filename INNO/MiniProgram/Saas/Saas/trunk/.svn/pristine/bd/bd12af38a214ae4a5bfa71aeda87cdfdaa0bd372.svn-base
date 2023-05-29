// components/signMod/signMod.js
import initCalendar, {
  setSelectedDays,
  disableDay,
  getThisMonthDays
} from '../calendar/main.js';
const app = getApp();
const Year = new Date().getFullYear();
const Month = new Date().getMonth() + 1;
const Dates = new Date().getDate();
Component(app.BTAB({
  properties: {
    type:{
      type:String,
    },
    calendar:{
      type:Object,
      value:{},
    },
    isLogin:{
      type:Boolean,
      value:false,
    },
    isJump:{
      type:Boolean,
      value:true,
    },
  },
  lifetimes:{
    attached(){
      let close = this.data.brand_info.icon_url + "micro_mall/Mobile_close.png";
      let img_prize = this.data.brand_info.default_icon_url + 'sign/prize.png'
      let img_rule = this.data.brand_info.default_icon_url + 'sign/rule.png'
      this.setData({
        close: close,
        img_prize,
        img_rule
      })
    },
  },
  data: {
    setRecord: [],
    sign_succ: false,
    htmlVal: '',
    _showAnim_op: '',
    pointVal:0,
    prize:[{},{},{},{}], 
    info:{
      type:"GLOBAL",
      label:"SIGN",
      relatedType:"SIGN",
      // needSubscribe
      // relatedId
    },
  },
  methods: { 
    onLoadFnc(){ 
      getUserPoint.call(this);
    },
    onShowFnc() {
      console.log('onShowFnc')
      this.loadData();
      // //测试
      // setTimeout(() => {
      //   this.signRule = this.signRule || this.selectComponent("#signRule");
      //   this.signRule.showData({
      //     totalGiftPoint:441,
      //     totalGiftLottery:2,
      //     totalGiftBonus:3,
      //     continuousDays:4,
      //     giftBonusDetail:[{
      //       bonus_type_id:1,
      //       type_name:"测试",
      //       type_money:10,
      //       discount:3,
      //       bonus_type:1,
      //     },{
      //       bonus_type_id:2,
      //       type_name:"测试2",
      //       type_money:20,
      //       discount:4,
      //       bonus_type:4,
      //     }],
      //     signOrderActivityReward:{
      //       goodsId:1,
      //       goodsImg:"https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/goods/goods_thumb/20210112/20210112112017901_4457281.jpg",
      //       goodsName:"奖励商品"
      //     }
      //   });
      // }, 1000);
    },
    init() {
      if(this.inited && !app.globalData.updateSignStatus)return;
      app.globalData.updateSignStatus = false;
      this.inited = true;
      let that = this;
      initCalendar({
        multi: true,
        noDefault: true,
        signData:this.data.signData,
        whenChangeMonth: (currentSelect, allSelectedDays) => {
          let begin = initDate.call(this, allSelectedDays.year, allSelectedDays.month).firstDay;
          let end = initDate.call(this, allSelectedDays.year, allSelectedDays.month).lastDay;
          let endTime = initDate.call(this, allSelectedDays.year, allSelectedDays.month).endTime;
          getSignRecord.call(that, begin, end);
          // 比较当前是否处于签到范围，处于进入数组添加
          if (Date.parse(begin) <= Date.parse(that.data.activityEndTime) && Date.parse(that.data.activityEndTime) <= Date.parse(endTime) || Date.parse(that.data.activityEndTime) <= Date.parse(endTime)) {
            diableTime.call(that, begin, end);
          }
        },
        afterCalendarRender(ctx) {
          diableTime.call(that, initDate.call(this).firstDay, initDate.call(this).lastDay);
          checkIfNeedAutoExpandCalendar.call(that)
        },
        onTapDay(currentSelect, event) {}
      });
    },
    loadData() {
      return app.LM.loginAsync(true).finally(() => {
        getSignInfo.call(this).then(res => {
          this.init();
          getSignRecord.call(this);
          this.triggerEvent('customPageId',{page_id:res&&res.data&&res.data.page_id || 0}) 
        });
        get_SignOrderActivityInfo.call(this);
      })
    },
    createAppSign() {
      createAppSign.call(this);
    },
    handle_rule(e) {
      this.setData({
        _showRule: true
      })
      wx.nextTick(() => {
        this.setData({
          _showAnim: true
        })
      });
    },
    sign_show_toggle(e, bool = false){
      bool = bool || !!!this.data.sign_show_detail;
      if(!bool){
        this.calendarId = this.calendarId || this.selectComponent('#calendarId');
        this.calendarId.resetShowMore();
      }
      this.setData({sign_show_detail:bool})
    },
    cancel_rule() {
      this.setData({
        _showAnim: false
      })
      setTimeout(() => {
        this.setData({
          _showRule: false
        })
      }, 300)
    },
    handle_prize(e){
      wx.navigateTo({
        url: '/pages/micro_mall/sign/app/prize/prize',
      })
    },
    handle_rich(e) {
      console.log('handle_rich', e);
    },
    onTap(e){
      let dataset = this.getDataset(e);
      let type = dataset.type||"";
      if(type == 'jumpSign'){
        wx.navigateTo({
          url: '/pages/micro_mall/sign/app/app_sign',
        })
      }
    }
  }
}))

function getSignInfo() {
  if (!app.LM.isLogin) {
    return Promise.reject()
  };
  return app.UserApi.getAppSign({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data || {};
      let {nextGetGiftDay,nextMonthGetGiftDay,dayGiftType} = getNextGetGiftDay(data);
      let signData = Object.assign({
        ...data
      }, {
        nextGetGiftDay,
        dayGiftType,
        nextMonthGetGiftDay,
        sign_status: Number(data.sign_status)
      });
      initSub.call(this,signData);
      this.setData({
        signData: signData,
        htmlVal: data.activity_detail || '',
        activityEndTime: data.activityEndTime
      });
      console.log('signDatasignData',signData)
      return Promise.resolve(e);
    }
    app.SMH.showToast({
      "title": e.msg
    })
  })
}
function get_SignOrderActivityInfo() {
  if (!app.LM.isLogin) {
    return Promise.reject()
  };
  return app.UserApi.get_SignOrderActivityInfo({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) { 
      let info = e.data;
      if(info){
        this.setData({signOrderActivityInfo:getOrderActInfo(info)});
        console.log('signOrderActivityInfo',this.data.signOrderActivityInfo)
        wx.nextTick(()=>{
          this.signContinuousId || ( this.signContinuousId = this.selectComponent('#signContinuousId'));
          this.signContinuousId && this.signContinuousId.init();
        })
      }
      return Promise.resolve(e);
    }
    app.SMH.showToast({
      "title": e.msg
    })
  }).finally(()=>{
    this.setData({
      inited:true
    })
  })
}

//签到
function createAppSign() {
  if (!app.LM.isLogin) return Promise.reject();
  if (!this.loading) {
    this.loading = true;
    return app.UserApi.createAppSign({
      data: {
        userToken: app.LM.userToken,
        brandCode: app.Conf.BRAND_CODE
      },
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == 1) {
        let data = e.data; 
        app.globalData.updateSignStatus = true;
        get_SignOrderActivityInfo.call(this);
        getUserPoint.call(this);
        getSignInfo.call(this).then(res => {
          this.signRule = this.signRule || this.selectComponent("#signRule");
          this.signRule.showData(data,this.data.signOrderActivityInfo);
          if(!this.inited){
            this.init();
          }
          addRecord.call(this);
        });
        return Promise.resolve(e);
      }
      app.SMH.showToast({
        "title": e.msg || "签到异常"
      });
    }).finally(() => {
      this.loading = false;
    })
  }
}

// 获取签到记录
function getSignRecord(beginDate = initDate.call(this).firstDay, endDate = initDate.call(this).lastDay) {
  if (!app.LM.isLogin){
    setSelectedDays([]);
    return Promise.reject();
  };
  return app.UserApi.getSignRecord({
    data: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      beginDate,
      endDate,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let record = e.data;
      let setRecord = record.map(item => getTimeObj.call(this, item));
      this.setData({
        setRecord: setRecord
      }); 
      setSelectedDays(setRecord);
      return Promise.resolve(e);
    }
    app.SMH.showToast({
      "title": e.msg
    });
  })
}

function initDate(year = Year, month = Month) {
  const curMonthLast = new Date(year, month, 0);
  let firstDay = 1;
  let lastDay = curMonthLast.getDate();
  return {
    firstDay: `${year}-${month}-${firstDay}`,
    lastDay: `${year}-${month}-${lastDay}`,
    // 比较时间节点，开始时间最小，结束时间设置最大值
    endTime: new Date(year, month - 1, lastDay, 24, 0, 0)
  }
}

function diableTime(begin, end) {
  let curTime = getTimeObj.call(this, end);
  let curMonthCol = [];
  for (let i = 0; i < curTime.day; i++) {
    curMonthCol.push(`${curTime.year}-${curTime.month}-${i + 1}`);
  }
  let disableTimes = curMonthCol.filter(item => Date.parse(new Date(item)) > Date.parse(this.data.activityEndTime));
  let disableCol = disableTimes.map(item => getTimeObj.call(this, item));
  disableDay(disableCol);
}

function addRecord() {
  let curDate = {
    year: Year,
    month: Month,
    day: Dates
  };
  let allRecord = [...this.data.setRecord, curDate];
  this.setData({
    setRecord: allRecord
  });
  setSelectedDays(allRecord);
}

function getTimeObj(date) {
  return {
    year: (new Date(date)).getFullYear(),
    month: (new Date(date)).getMonth() + 1,
    day: (new Date(date)).getDate()
  };
}
 

function initSub(actInfo){
  if(!this.initSub){
    this.initSub = true;
    let info = this.data.info||{};
    let relatedId = actInfo.activityId || 0;
    let storage = app.StorageH.get('SUBSCRIBE_GLOBALSIGN',{});
    let needSubscribe = !(storage.SIGN && storage.SIGN[relatedId] || false);
    info = {
      ...info,
      needSubscribe,
      relatedId
    }
    this.setData({info})
  }
}

//积分
function getUserPoint(){
  return app.UserApi.getUserPointAmount({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        point: res.data
      })
    }
  })
}

function getOrderActInfo(info){
  let list = info.detailList||[];
  let currentContinueDay = info.currentContinueDay||0;
  info.sumContinueDay = currentContinueDay;
  for(let i = 0,len=list.length;i<len;i++){
    let item = list[i];
    if(item.isReach || (i == 0)){
      info.nextGetContinueInfo = item;
      info.nextGetContinueInfo.nextGetContinueDay = item.continueDay - currentContinueDay >= 0 ? item.continueDay - currentContinueDay : 0;
      if(i+1 != info.currentSort){
        info.sumContinueDay += item.continueDay;
      }
    }else{
      break;
    }
  }
  return info
}

function getNextGetGiftDay(data){
  let needSignDay = (data.sign_status == 1 ? data.needSignDay - 1 : data.needSignDay);
  let DayOfMonth = getThisMonthDays(Year,Month);
  let nextGetGiftDay = Dates + needSignDay;
  console.log('nextGetGiftDay',nextGetGiftDay,DayOfMonth,Year,Month);
  let nextMonthGetGiftDay = nextGetGiftDay > DayOfMonth ? nextGetGiftDay - DayOfMonth : 0;
  let giftNum = 0,signActivityGift = data.signActivityGift,dayGiftType="";
  if(signActivityGift.gift_point > 0){
    giftNum += 1;
    dayGiftType = "point";
  }
  if(signActivityGift.gift_bonus_list && signActivityGift.gift_bonus_list.length>0){
    giftNum += 1;
    dayGiftType = "coupon";
  }
  if(signActivityGift.gift_activity_num > 0){
    giftNum += 1;
    dayGiftType = "draw";
  } 
  dayGiftType = giftNum > 1 ? "much" : giftNum <= 0 ? 'none' : dayGiftType;
  return {nextGetGiftDay,nextMonthGetGiftDay,dayGiftType}
}

function checkIfNeedAutoExpandCalendar() {
  let is_fold = 1; // 1折叠 0展开
  this.data.signData && this.data.signData.is_fold == 0 && (is_fold = 0);
  this.calendarId = this.calendarId || this.selectComponent('#calendarId');
  const calendarHasExpandModule = this.calendarId && this.calendarId.data && (this.calendarId.data.type == "style1" || this.calendarId.data.type == "style2");
  if (calendarHasExpandModule && this.data.isLogin && is_fold == 0) {
    this.sign_show_toggle({}, true);
    // wx.nextTick(() => {
      this.calendarId.showMore();
    // })
  }
}