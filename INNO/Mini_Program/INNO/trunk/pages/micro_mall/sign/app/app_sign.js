const app = getApp(); 
Page(app.BP({
  data: {
    // 签到记录
    setRecord: [],
    sign_succ: false,
    htmlVal: '',
    _showAnim_op: '',
    pointVal:0,
    prize:[{},{},{},{}],
    calendar:{}
  },
  onLoad() {
  },
  onReady() {
    this.pageHome = this.pageHome || this.selectComponent("#pageHome");
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    // this.calendarId = this.calendarId || this.selectComponent("#calendarId");
    this.pageHome.initPageHome();
    this.loading = false;
    app.LM.loginAsync(true).finally(()=>{
      this._checkUserLogin();
      this.setAdsPop(); 
      this.signMod = this.selectComponent('#signMod');
      console.log('this.signMod',this.signMod)
      this.signMod.onLoadFnc();
      this.signMod.onShowFnc();
    })
  },
  onShow: function() { 
  }, 
  customPageId(e){
    let detail = e.detail||{};
    let page_id = detail.page_id||0;
    if(page_id){
      this.pageTab = this.pageTab || this.selectComponent("#pageTab");
      this.pageTab && this.pageTab.getPageData({
        page_id,
        loadDataType: "bottom"
      });
    }else{
      this.setData({
        hideCustom: true
      })
    }
  },
  onReachBottom() {
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab.reachBottom();
  }, 
  setAdsPop(){
    this.setData({
      adsPop: {
        isIndex:3,
        page_id:0,
      }
    })
  }
}))

// function getSignInfo() {
//   if (!app.LM.isLogin) {
//     return
//   };
//   return app.UserApi.getAppSign({
//     params: {
//       userToken: app.LM.userToken,
//       brandCode: app.Conf.BRAND_CODE
//     },
//     other: {
//       isShowLoad: true
//     }
//   }).then(e => {
//     if (e.code == 1) {
//       let data = e.data || {};
//       let signData = Object.assign({ ...data
//       }, {
//         sign_status: Number(data.sign_status)
//       });
//       this.setData({
//         signData: signData,
//         htmlVal: data.activity_detail || '',
//         activityEndTime: data.activityEndTime
//       });
//       return Promise.resolve(e);
//     }
//     app.SMH.showToast({
//       "title": e.msg
//     })
//   })
// }

// //签到
// function createAppSign() {
//   if (!app.LM.isLogin) return;
//   if (!this.loading) {
//     this.loading = true;
//     return app.UserApi.createAppSign({
//       data: {
//         userToken: app.LM.userToken,
//         brandCode: app.Conf.BRAND_CODE
//       },
//       other: {
//         isShowLoad: true
//       }
//     }).then(e => {
//       if (e.code == 1) {
//         let data = e.data;
//         this.setData({
//           ruleList: data
//         }); 
//         getSignInfo.call(this).then(res=>{
//           this.signRule = this.signRule || this.selectComponent("#signRule");
//           this.signRule.show();
//         });
//         addRecord.call(this);
//         getUserPoint.call(this);
//         return Promise.resolve(e);
//       }
//       app.SMH.showToast({
//         "title": e.msg || "签到异常"
//       });
//     }).finally(() => {
//       this.loading = false;
//     })
//   }
// }

// // 获取签到记录
// function getSignRecord(beginDate = initDate.call(this).firstDay, endDate = initDate.call(this).lastDay) {
//   if (!app.LM.isLogin) return;
//   return
//   return app.UserApi.getSignRecord({
//     data: {
//       userToken: app.LM.userToken,
//       brandCode: app.Conf.BRAND_CODE,
//       beginDate,
//       endDate,
//     },
//     other: {
//       isShowLoad: true
//     }
//   }).then(e => {
//     if (e.code == 1) {
//       let record = e.data;
//       let setRecord = record.map(item => getTimeObj.call(this, item));
//       this.setData({
//         setRecord: setRecord
//       });
//       console.log('setRecord',setRecord)
//       setSelectedDays(setRecord);
//       return Promise.resolve(e);
//     }
//     app.SMH.showToast({
//       "title": e.msg
//     });
//   })
// }

// function initDate(year = Year, month = Month) {
//   const curMonthLast = new Date(year, month, 0);
//   let firstDay = 1;
//   let lastDay = curMonthLast.getDate();
//   return {
//     firstDay: `${year}-${month}-${firstDay}`,
//     lastDay: `${year}-${month}-${lastDay}`,
//     // 比较时间节点，开始时间最小，结束时间设置最大值
//     endTime: new Date(year, month - 1, lastDay, 24, 0, 0)
//   }
// }

// function diableTime(begin, end) {
//   let curTime = getTimeObj.call(this, end);
//   let curMonthCol = [];
//   for (let i = 0; i < curTime.day; i++) {
//     curMonthCol.push(`${curTime.year}-${curTime.month}-${i + 1}`);
//   }
//   let disableTimes = curMonthCol.filter(item => Date.parse(new Date(item)) > Date.parse(this.data.activityEndTime));
//   let disableCol = disableTimes.map(item => getTimeObj.call(this, item));
//   disableDay(disableCol);
// }

// function addRecord() { 
//   let curDate = {
//     year: Year,
//     month: Month,
//     day: Dates
//   };
//   let allRecord = [...this.data.setRecord, curDate];
//   this.setData({
//     setRecord: allRecord
//   });
//   setSelectedDays(allRecord);
// }

// function getTimeObj(date) {
//   return {
//     year: (new Date(date)).getFullYear(),
//     month: (new Date(date)).getMonth() + 1,
//     day: (new Date(date)).getDate()
//   };
// }

// function listen() {
//   if (app.LM.isLogin) {
//     this.setData({
//       isLogin: true
//     })
//     getSignRecord.call(this);
//     getSignInfo.call(this).then(res => {
//       if (!(res && res.data && res.data.page_id)) {
//         this.setData({
//           hideCustom: true
//         })
//         return
//       }
//       this.pageTab = this.pageTab || this.selectComponent("#pageTab");
//       this.pageTab && this.pageTab.getPageData({
//         page_id: res.data.page_id,
//         loadDataType:"bottom"
//       });
//       // this.pageTab && this.pageTab.fromPage('fromSign');
//     });
//     return;
//   }
//   this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
//     if (app.LM.isLogin) {
//       this.setData({
//         isLogin: true
//       })
//       getSignRecord.call(this);
//       getSignInfo.call(this).then(res => {
//         if (!(res && res.data && res.data.page_id)) {
//           this.setData({
//             hideCustom: true
//           })
//           return
//         }
//         this.pageTab = this.pageTab || this.selectComponent("#pageTab");
//         this.pageTab.getPageData({
//           page_id: res.data.page_id,
//           loadDataType:"bottom"
//         });
//         // this.pageTab && this.pageTab.fromPage('fromSign');
//       });
//     }
//   });
// }

// function unListen() {
//   if (this.listenLoginStatuId) {
//     app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
//   }
// }

// function getUserPoint(){
//   return app.UserApi.getUserPointAmount({
//     params:{
//       brandCode: app.Conf.BRAND_CODE,
//       userToken: app.LM.userToken
//     }
//   }).then(res=>{
//     if(res.code == 1){
//       this.setData({
//         pointVal: res.data||0
//       })
//     }
//   })
// }