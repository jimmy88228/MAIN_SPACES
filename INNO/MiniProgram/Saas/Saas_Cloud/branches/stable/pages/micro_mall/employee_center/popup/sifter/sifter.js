import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const dateTimePicker = require('../../help/dateTimePicker.js');
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    totalCount: {
      type: Number | String,
      value: 0
    },
    totalAmount: {
      type: Number | String,
      value: 0
    }
  },
  data: {
    bg_color: "",


    haveMore: true,
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    list: [],
    selectedEmployees: {},
    selectedEmployeesList: [],
  },
  ready() {
    let bInfo = this.data.brand_info || {};
    let bg_color = app.getColor(bInfo.style.bg_color, 0, 0, 0, 0.2);
    let staff_right = bInfo.icon_url + "micro_mall/staff/staff_right.png";
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      staff_right: staff_right,
      bg_color: bg_color,
      multiSelector_start: obj1.dateTimeArray,
      multiSelector_end: obj1.dateTimeArray,
      mul_array_start: obj1.dateTime,
      mul_array_end: obj1.dateTime
    })
    getUserStoreInfo.call(this);
  },
  pageLifetimes: {
    show() {
      this.reqParams = {
        pageIndex: 1,
        pageSize: app.Conf.PAGE_SIZE || 20
      }
    },
    hide() {

    }
  },
  methods: {
    handleFilter(e, needSumbit = true) {
      if (e.currentTarget.dataset.type === this.data.buttonIndex){
        reset.call(this)
        this.setData({
          buttonIndex: '',
          filter: !this.data.filter
        })
        needSumbit && submitData.call(this)
        return
      } else if (e.currentTarget.dataset.type == 'today') {
        this.quickTemp = [];
        this.setData({
          quickTemp: ''
        });
        reset.call(this);
        todayOrder.call(this, true);
        this.setData({
          buttonIndex: 'today'
        })
      } else if (e.currentTarget.dataset.type == 'week') {
        this.quickTemp = [];
        this.setData({
          quickTemp: ''
        });
        reset.call(this);
        weekOrder.call(this, true);
        this.setData({
          buttonIndex: 'week'
        })
      } else if (e.currentTarget.dataset.type == 'month') {
        this.quickTemp = [];
        this.setData({
          quickTemp: ''
        });
        reset.call(this);
        monthOrder.call(this, true);
        this.setData({
          buttonIndex: 'month'
        })
      } else if (e.currentTarget.dataset.type == 'set') {
        this._selectedEmployeesList = this.data.selectedEmployeesList
        if (this.quickTemp[0] && this.quickTemp[1]) {
          reset.call(this, true);
          this.quick = this.quickTemp;
          this.setData({
            buttonIndex: 'set'
          })
          needSumbit && submitData.call(this, this.currentIndex);
        } else if (this.quickTemp[0] || this.quickTemp[1]) {
          app.SMH.showToast({
            title: '请设置完整的自定义时间'
          })
          return
        } else {
          reset.call(this, true);
          needSumbit && submitData.call(this, this.currentIndex);
        }
      }
      needSumbit && this.setData({
        filter: !this.data.filter
      });
    },
    mul_change_start(e) {
      let tempArray = e.detail.value;
      let tempValue = this.data.multiSelector_start;
      this.quickTemp[0] = tempValue[0][tempArray[0]] + '-' + tempValue[1][tempArray[1]] + '-' + tempValue[2][tempArray[2]] + ' ' + tempValue[3][tempArray[3]] + ':' + tempValue[4][tempArray[4]];
      this.setData({
        mul_array_start: e.detail.value,
        [`quickTemp[${0}]`]: this.quickTemp[0]
      });
    },
    mul_change_end(e) {
      let tempArray = e.detail.value;
      let tempValue = this.data.multiSelector_end;
      this.quickTemp[1] = tempValue[0][tempArray[0]] + '-' + tempValue[1][tempArray[1]] + '-' + tempValue[2][tempArray[2]] + ' ' + tempValue[3][tempArray[3]] + ':' + tempValue[4][tempArray[4]];
      this.setData({
        mul_array_end: e.detail.value,
        [`quickTemp[${1}]`]: this.quickTemp[1]
      });
    },
    handleEmployeeSelectorOpen(){
      this.staffSelector = this.staffSelector || this.selectComponent("#staffSelector");
      this.staffSelector && this.staffSelector.activate();
    },
    handleSelectFinished(e){
      let selectedEmployeesList = e.detail || [];
      this.setData({selectedEmployeesList}) 
    },
    setDefault({dateType = "0",staffIds}){
      let clickEvent = {currentTarget:{dataset:{type: ""}}}
      this.staffIds = staffIds || [];
      // setInterval(() => {
      //   console.log("this.quick", this.quick)
      // }, 2000);
      return new Promise((resolve, reject) => {
        switch (dateType) {
          case "1": // 本月
            clickEvent.currentTarget.dataset.type = "month"
            this.handleFilter(clickEvent, false)
            resolve("month")
            break;
          case "2": // 本周
            clickEvent.currentTarget.dataset.type = "week"
            this.handleFilter(clickEvent, false)
            resolve("week")
            break;
          default:
            resolve("")
            break;
        }
      })
    },
    _noFn() { },
  }
}))

// 该用户店员信息
function getUserStoreInfo() {
  return app.LM.checkIfStore().then(data => {
    data = data || app.LM.storeInfo;
    if (data && data.staff_id) {
      this.storeInfo = data;
      this.setData({staff_type: data.staff_type || 0 })
      return Promise.resolve(data)
    } else return Promise.reject(data)
  }).catch(e => {
    console.log("获取店员信息失败, 原因: ", e)
    return Promise.reject("获取店员信息出错")
  })
}
function reset(quick = false) {
  if (!quick) {
    this.quick = [];
    this.quickTemp = [];
  }
}

// 今日 按钮
function todayOrder(goLoad = false) {
  var myDate = new Date();
  var ifromTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 00:00:00';
  var itoTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 23:59:59';
  this.quick[0] = ifromTime;
  this.quick[1] = itoTime;
  if (goLoad) {
    submitData.call(this, this.currentIndex, 'today');
  }
}
// 本月 按钮
function monthOrder(goLoad = false) {
  var myDate = new Date();
  var ifromTime = getMonthFirstDay.call(this) + ' 00:00:00';
  var itoTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 23:59:59';
  this.quick[0] = ifromTime;
  this.quick[1] = itoTime;
  if (goLoad) {
    submitData.call(this, this.currentIndex);
  }
}
// 本周按钮
function weekOrder(goLoad = false) {
  var myDate = new Date();
  var ifromTime = getWeekFirstDay.call(this) + ' 00:00:00';
  // var ifromTime = this.getWeekFirstDay() + ' 00:00:00';
  var itoTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 23:59:59';
  this.quick[0] = ifromTime;
  this.quick[1] = itoTime;
  if (goLoad) {
    submitData.call(this, this.currentIndex);
  }
}

// 本周第一天
function getWeekFirstDay() {
  var Nowdate = new Date();
  var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
  var M = Number(WeekFirstDay.getMonth()) + 1;
  return WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate();
}
// 获取本月第一天
function getMonthFirstDay() {
  var Nowdate = new Date();
  var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
  var M = Number(MonthFirstDay.getMonth()) + 1
  return MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
}

function submitData() {
  this.triggerEvent("confirm", {dateArray: this.quick || [], staffIds: this.data.selectedEmployeesList && this.data.selectedEmployeesList.map(item => item.staffId) || []})
}
