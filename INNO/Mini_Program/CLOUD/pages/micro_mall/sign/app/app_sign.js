import initCalendar, {
  setSelectedDays,
  disableDay
} from '../../../component/calendar/main.js';
const app = getApp();
const Year = new Date().getFullYear();
const Month = new Date().getMonth() + 1;
const Dates = new Date().getDate();
Page(app.BP({
  data: {
    // 签到记录
    setRecord: [],
    sign_succ: false,
    htmlVal: '',
    _showAnim_op: '',
    pointVal:0,
  },
  onLoad() {
    let close = this.data.brand_info.icon_url + "micro_mall/Mobile_close.png";
    this.isIos = app.SIH && app.SIH.isIos || false;
    this.setData({
      close: close
    })
    getUserPoint.call(this);
  },
  onReady() {
    this.pageHome = this.pageHome || this.selectComponent("#pageHome");
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.calendarId = this.calendarId || this.selectComponent("#calendarId");
    this.pageHome.initPageHome();
    this.loading = false;
  },
  onShow: function() {
    let self = this;
    // getSignRecord.call(this);
    // getSignInfo.call(this);
    initCalendar({
      multi: true,
      noDefault: true,
      whenChangeMonth: (currentSelect, allSelectedDays) => {
        let begin = initDate.call(this, allSelectedDays.year, allSelectedDays.month).firstDay;
        let end = initDate.call(this, allSelectedDays.year, allSelectedDays.month).lastDay;
        let endTime = initDate.call(this, allSelectedDays.year, allSelectedDays.month).endTime;
        getSignRecord.call(self, begin, end);
        // 比较当前是否处于签到范围，处于进入数组添加
        if (Date.parse(begin) <= Date.parse(self.data.activityEndTime) && Date.parse(self.data.activityEndTime) <= Date.parse(endTime) || Date.parse(self.data.activityEndTime) <= Date.parse(endTime)) {
          diableTime.call(self, begin, end);
        }
      },
      afterCalendarRender(ctx) {
        diableTime.call(self, initDate.call(this).firstDay, initDate.call(this).lastDay);
      },
      onTapDay(currentSelect, event) {}
    });
    listen.call(this);
  },
  onHide() {
  },
  onUnload() {
  },
  getSignRule() {
    createAppSign.call(this); 
  },
  prevImg() {
    let self = this;
    wx.previewImage({
      current: self.data.signData.bgImage,
      urls: [self.data.signData.bgImage]
    });
  },
  handle_rule(e) {
    // console.log('点击', e, this.data.signData.bgImage);
    this.setData({
      _showRule: e && e.detail || false
    })
    wx.nextTick(() => {
      this.setData({
        _showAnim: true
      })
    });
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab && this.pageTab.setPageScroll(true);
  },
  cancel_rule() {
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab && this.pageTab.setPageScroll(false);
    this.setData({
      _showAnim: false
    })
    setTimeout(() => {
      this.setData({
        _showRule: false
      })
    }, 300)
  },
  handle_rich(e) {
    console.log('handle_rich', e);
  },
  // signStatusEvent(e) {
  //   let boolean = e && e.detail || false;
  //   if (boolean) {
  //     console.log('-------展示');
  //     setTimeout(() => {
  //       let that = this;
  //       this.setData({
  //         hideCurrent: false,
  //         _showAnim_op: 'opacity:1;',
  //         initTransform:true,
  //         showPadding: ''
  //       });
  //       wx.nextTick(() => {
  //         that.setData({
  //           _showAnim_op_extra: 'transform:translateY(0);'
  //         })
  //       })
  //     }, 100)
  //   } else {
  //     console.log('-------隐藏');
  //     this.calendarId && this.calendarId.showMore && this.calendarId.showMore({}, 'fromSign', false)
  //     this.setData({
  //       _showAnim_op: 'opacity:0;background:transparent;',
  //       // _showAnim_op_extra: '',
  //       initTransform: false,
  //       showPadding: 'padding-top:0;'
  //     });
  //     let that = this;
  //     wx.nextTick(() => {
  //       that.setData({
  //         _showAnim_op_extra: ''
  //       })
  //     })
  //     setTimeout(() => {
  //       this.setData({
  //         hideCurrent: true,
  //       })
  //     }, 500)
  //   }
  // },
  onReachBottom(e) {
    console.log('触底');
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab.reachBottom();
  },
  _noFn() {},
}))

function getSignInfo() {
  if (!app.LM.isLogin) {
    return
  };
  return app.UserApi.getAppSign({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    extraData: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data || {};
      let signData = Object.assign({ ...data
      }, {
        sign_status: Number(data.sign_status)
      });
      this.setData({
        signData: signData,
        htmlVal: data.activity_detail || '',
        activityEndTime: data.activityEndTime
      });
      return Promise.resolve(e);
    }
    app.SMH.showToast({
      "title": e.msg
    })
  })
}

//签到
function createAppSign() {
  if (!app.LM.isLogin) return;
  if (!this.loading) {
    this.loading = true;
    return app.UserApi.createAppSign({
      data: {
        brandCode: app.Conf.BRAND_CODE,
        userToken: app.LM.userKey
      },
      extraData: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == 1) {
        let data = e.data;
        this.setData({
          ruleList: data
        });
        wx.nextTick(()=>{
          this.setData({
            sign_succ: true
          });
          this.signRule = this.signRule || this.selectComponent("#signRule");
          this.signRule.show();
        })
        addRecord.call(this);
        getSignInfo.call(this);
        getUserPoint.call(this);
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
  if (!app.LM.isLogin) return;
  return app.UserApi.getSignRecord({
    data: {
      beginDate: beginDate,
      endDate,
      endDate,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    extraData: {
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

function listen() {
  this._checkUserLogin().finally(()=>{
    if(app.LM.isLogin) {
      getSignRecord.call(this);
      getSignInfo.call(this).then(res => {
        if (!(res && res.data && res.data.page_id)) {
          this.setData({
            hideCustom: true
          })
          return
        }
        this.pageTab = this.pageTab || this.selectComponent("#pageTab");
        this.pageTab && this.pageTab.getPageData({
          page_id: res.data.page_id,
          loadDataType:"bottom"
        });
      });
    }
  })
}

function getUserPoint(){
  return app.UserApi.getUserPointAmount({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        pointVal: res.data||0
      })
    }
  })
}