// pages/micro_mall/questionnaire/date_picker/date_picker.js
// DatePicker/DatePicker.js
const dateUtil = require('./utils/dateutils.js')

let years = []
const months = []
const days = []
const hours = []
const minutes = []
const seconds = []
 

for (let i = 1970; i <= 2100; i++) {
  years.push(i);
}

for (let i = 1; i <= 12; i++) {
  months.push(i);
}

for (let i = 1; i <= 31; i++) {
  days.push(i);
}
for (let i = 0; i < 24; i++) {
  hours.push(i);
}

for (let i = 0; i < 60; i++) {
  minutes.push(i);
}
for (let i = 0; i < 60; i++) {
  seconds.push(i);
}

const modes = ["YMDhms", "YMDhm", "YMD", "MD", "hm"]

let beforeYear;
let beforeMonth;
let resultValue;
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: ""
    },
    date: {
      type: Number,
      value: new Date().getTime(),
    },
    mode: {
      type: String,
      value: 'MD',
      observer: function (newVal, oldVal, changedPath) {
        this.setDateByMode();
      }
    },
    isShowDatePicker: {
      type: Boolean,
      value: false
    },
    timeArr:{
      type: Array,
      value: [],
      observer: function (n,o) {
        if(n){
          initTime.call(this,n);
        }
      }
    }
  },
  data: {
    cMode: "",
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    value: [], 
    isShowYear: false,
    isShowMonth: false,
    isShowDay: false,
    isShowHour: false,
    isShoMinutes: false,
    isShowSeconds: false,
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {

      this.setDateByMode();

    },
    moved() { },
    detached() { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached() { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready() { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() { },
    hide() { },
    resize() { },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    setDateByMode() { 
      let year = dateUtil.getYear(this.data.date);
      let month = dateUtil.getMonth(this.data.date);
      this.setDays(year, month);
      let days = dateUtil.getDay(this.data.date);
      let hours = dateUtil.getHour(this.data.date);
      let minutes = dateUtil.getMinute(this.data.date);
      let seconds = dateUtil.getSecond(this.data.date);
      beforeYear = year;
      beforeMonth = month;
      console.log('beforeYear', beforeYear)
      console.log(this.data.timeArr[0])
      this.setData({
        value: [year - (this.data.timeArr[0] || 1970), month - 1, days - 1, hours, minutes, seconds],
        // value: [year - 1970, month - 1, days - 1, hours, minutes, seconds],
      })

      resultValue = this.data.value;
      console.log('resultValue', resultValue)
      this.setColumns();

    },
    setColumns() {

      let mode = this.data.mode;

      this.setData({

        isShowYear: mode == 'YMDhms' || mode == 'YMDhm' || mode == 'YMD',
        isShowMonth: mode == 'YMDhms' || mode == 'YMDhm' || mode == 'YMD' || mode == 'MD',
        isShowDay: mode == 'YMDhms' || mode == 'YMDhm' || mode == 'YMD' || mode == 'MD',
        isShowHour: mode == 'YMDhms' || mode == 'YMDhm' || mode == 'hm',
        isShoMinutes: mode == 'YMDhms' || mode == 'YMDhm' || mode == 'hm',
        isShowSeconds: mode == 'YMDhms',
      })
    },

    setDays(year, month) {


      if (year != beforeYear || beforeMonth != month) {
        beforeYear = year;
        beforeMonth = month;
        let dayCount = dateUtil.getDaysOfMonth(year, month);

        let days = [];

        for (let i = 1; i <= dayCount; i++) {

          days.push(i)
        }

        this.setData({

          days: days,
        })

      }


    },
    bindChange: function (e) {

      const val = e.detail.value
      resultValue = val;
      let year = this.data.years[val[0]];
      let month = this.data.months[val[1]];
      this.setDays(year, month);
    },
    onCancellClick() {
      this.triggerEvent('datePickerCancellEvent')
    },
    onOkClick() {
      if (this.isLoading)return
      this.isLoading = true;
      app.SMH.showLoading();
      setTimeout(()=>{
        app.SMH.hideLoading();
      },200)
      setTimeout(()=>{
        this.isLoading = false;
        const myEventDetail = {};
        myEventDetail.data = this.data.data;
        myEventDetail.date = this.getResultDate();
        this.triggerEvent('datePickerOkEvent', myEventDetail)
      },1000)
    },
    getResultDate() {
      let result = 0;
      let year = this.data.years[resultValue[0]];
      let month = this.data.months[resultValue[1]] - 1;
      let day = this.data.days[resultValue[2]];
      let hour = this.data.hours[resultValue[3]];
      let minutes = this.data.minutes[resultValue[4]];
      let seconds = this.data.seconds[resultValue[5]];
      console.log('jimmy', year, month, day, hour, minutes, seconds)
      result = new Date(year, month, day, hour, minutes, seconds).getTime();
      return result;
    }
  }
}))

function initTime(arr= []){
  arr = arr || [];
  if(arr && arr.length>1){
    years = [];
    for (let i = arr[0]; i <= arr[1]; i++) {
      years.push(i);
    }
    console.log('years', years)
    this.setData({
      years
    })
    this.setDateByMode();
  };
   
}