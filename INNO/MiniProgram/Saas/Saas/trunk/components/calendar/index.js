import { getCurrentPage, warn } from './utils';
import {
  jump,
  isLeftSlide,
  isRightSlide,
  whenChangeDate,
  renderCalendar,
  whenMulitSelect,
  whenSingleSelect,
  calculateNextWeekDays,
  calculatePrevWeekDays,
} from './main.js';
const GetDayOfWeekName = ["周日","周一","周二","周三","周四","周五","周六"];
const app = getApp();
let page = {};
// 存储所有的时间
let allDays = [];
// 存储当前周时间
let allWeeks = [];
Component(app.BTAB({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  data: {
      isShowMore: false,
      date: [],
        //   控制上个月显示的时间
      empytGrids: true,
        //   控制下个月显示的时间
      lastEmptyGrids: true,
      allowScroll: true,
      handleMap: {
          prev_year: 'chooseYear',
          prev_month: 'chooseMonth',
          next_month: 'chooseMonth',
          next_year: 'chooseYear'
      },
      _activityEndTime: '',
      GetDayOfWeekName,
  },
  properties: {
    calendar: {
      type: Object,
      observer(nV, oV) {
          if (nV && nV.days) {
              this.setData({
                  date: nV.days,
                  currentYear: nV.curYear,
                  currentMonth: nV.curMonth
              });
          }
          // console.log('calendarcalendar',nV)
          if (!this.data.isShowMore) setCurWeek.call(this, nV);
      }
    },
    signData:{
      type:Object,
      value:{},
      observer(n,o){
        if(n){
          let df = this.data.brand_info.default_icon_url + 'sign/';
          let imgObj = {"type_coupon":df + "type_coupon.png","type_draw": df + "type_draw.png","type_much": df + "type_much.png","type_reward": df + "type_reward.png","type_point": df + "type_point.png","type_none": df + "type_none.png","type_normal": df + "type_" + n.dayGiftType + ".png"};
          this.setData({imgObj})
        }
      }
    },
    activityEndTime: {
        type: String,
        observer(nV, oV) {
            this.setData({
                _activityEndTime: nV
            });
        }
    },
    type: {
        type: String,
        value:""
    }, 
  },
  lifetimes: {
    attached: function() {
      page = getCurrentPage();
    }
  }, 
  ready(){
    let bg_color = this.data.brand_info.style.bg_color;
    let font_color = this.data.brand_info.style.font_color;
    let l_bg_color = app.getColor(bg_color, 0, 0, 0, 0.4);
    this.setData({
      l_bg_color: 'background:' + l_bg_color + ';color:' + font_color+';' || '',
    })
  },
  methods: {
    chooseDate(e) {
        if (scrollCondition.call(this)) {
            const { type } = e.currentTarget.dataset;
            if (!type) return;
            let isNext = (type.indexOf('next') !== -1) ? true : false;
            if (!this.data.allowScroll && isNext) {
                app.SMH.showToast({
                    "title": '签到活动时间截止到: ' + this.data._activityEndTime
                });
                return;
            }
            const methodName = this.data.handleMap[type];
            this[methodName](type);
        }
    },
    chooseYear(type) {
      const { curYear, curMonth } = this.data.calendar;
      if (!curYear || !curMonth) return warn('异常：未获取到当前年月');
      let newYear = curYear;
      let newMonth = curMonth;
      if (type === 'prev_year') {
        newYear = curYear - 1;
      } else if (type === 'next_year') {
        newYear = curYear + 1;
      }
      this.calculate(curYear, curMonth, newYear, newMonth);
    },
    chooseMonth(type) {
      const { curYear, curMonth } = this.data.calendar;
      if (!curYear || !curMonth) return warn('异常：未获取到当前年月');
      let newYear = curYear;
      let newMonth = curMonth;
      if (type === 'prev_month') {
        newMonth = curMonth - 1;
        if (newMonth < 1) {
          newYear = curYear - 1;
          newMonth = 12;
        }
      } else if (type === 'next_month') {
        newMonth = curMonth + 1;
        if (newMonth > 12) {
          newYear = curYear + 1;
          newMonth = 1;
        }
      }
      this.calculate(curYear, curMonth, newYear, newMonth);
    },
    calculate(curYear, curMonth, newYear, newMonth) {
      whenChangeDate({
        curYear,
        curMonth,
        newYear,
        newMonth
      });
      page.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      });
      renderCalendar(newYear, newMonth);
    },
    /**
     * 日期点击事件
     * @param {!object} e 事件对象
     */
    tapDayItem(e) {
      const { idx, disable } = e.currentTarget.dataset;
      if (disable) return;
      let currentSelected = {}; // 当前选中日期
      let { days, selectedDay: selectedDays, todoLabels } =
        this.data.calendar || []; // 所有选中日期
      const config = page.config;
      const { multi, onTapDay } = config;
      const opts = {
        e,
        idx,
        onTapDay,
        currentSelected,
        selectedDays,
        todoLabels,
        days: days.slice()
      };
      if (multi) {
        whenMulitSelect(opts);
      } else {
        whenSingleSelect(opts);
      }
    },
    doubleClickToToday() {
      if (page.config.multi) return;
      if (this.count === undefined) {
        this.count = 1;
      } else {
        this.count += 1;
      }
      if (this.lastClick) {
        const difference = new Date().getTime() - this.lastClick;
        if (difference < 500 && this.count >= 2) {
          jump();
        }
        this.count = undefined;
        this.lastClick = undefined;
      } else {
        this.lastClick = new Date().getTime();
      }
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
        if (scrollCondition.call(this)) {
            const t = e.touches[0];
            const startX = t.clientX;
            const startY = t.clientY;
            page.slideLock = true; // 滑动事件加锁
            page.setData({
                'gesture.startX': startX,
                'gesture.startY': startY
            });
        }
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
        if (scrollCondition.call(this)) {
            const self = page;
            if (isLeftSlide.call(self, e)) {
                if (this.data.allowScroll) {
                    self.setData({
                        'calendar.leftSwipe': 1
                    });
                    if (page.weekMode) return calculateNextWeekDays.call(page);
                    this.chooseMonth('next_month');
                } else {
                    app.SMH.showToast({
                        "title": '签到活动时间截止到: ' + this.data._activityEndTime
                    });
                }
            }
            if (isRightSlide.call(self, e)) {
                self.setData({
                    'calendar.rightSwipe': 1
                });
                if (page.weekMode) return calculatePrevWeekDays.call(page);
                this.chooseMonth('prev_month');
            }
        }
    },
    calendarTouchend(e) {
        if (scrollCondition.call(this)) {
            page.setData({
                'calendar.leftSwipe': 0,
                'calendar.rightSwipe': 0
            });
        }
    },
    showMore(e,label='',bool=false) {
        if(label == 'fromSign'){
          //签到
          if (this.data.isShowMore != bool){
            this.setData({
              isShowMore: bool,
            });
          }else{
            return
          }
        }else{
          //点击
          this.setData({
              isShowMore: !this.data.isShowMore,
          });
        }
        if (!this.data.isShowMore) {
          setCurWeek.call(this, this.data.calendar);
        } else {
          this.setData({
            empytGrids: true,
            lastEmptyGrids: true,
            date: allDays
          });
        }
        return
        // resetDate.call(this);
    },
    resetShowMore(){
      if(this.data.isShowMore){
        this.setData({
          isShowMore: !this.data.isShowMore,
        });
        setCurWeek.call(this, this.data.calendar);
      }
    },
    handle_rule(){
      let params = {
        show:true
      }
      this.triggerEvent('ruleFnc',params);
    },
  }
}));
function getWeek() {
    const dateOfToday = Date.now();
    const dayOfToday = (new Date().getDay() + 7) % 7;
    const curMonth = new Date().getMonth() + 1;
    const daysOfThisWeek = Array.from(new Array(7))
        .map((_, i) => {
            const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
            const _month = date.getMonth() + 1 || "";
            const _date = date.getDate() || "";
            return date.getFullYear() +
                '-' +
                String(_month).padStart(2, '0') +
                '-' +
                String(_date).padStart(2, '0')
        });
    let initWeek = daysOfThisWeek.filter(item => {
        return new Date(item).getMonth() + 1 === curMonth;
    });
    let controlStatus = daysOfThisWeek.some(item => {
        if (new Date(item).getMonth() + 1 < curMonth) {
            this.setData({
                empytGrids: true,
                lastEmptyGrids: false
            });
        } else if (new Date(item).getMonth() + 1 > curMonth) {
            this.setData({
                empytGrids: false,
                lastEmptyGrids: true
            });
        } else {}
        return (new Date(item).getMonth() + 1 < curMonth || new Date(item).getMonth() + 1 > curMonth);
    });
    // 所有日期为当前月份
    if (!controlStatus) {
        this.setData({
            empytGrids: false,
            lastEmptyGrids: false
        });
    }
    let initDate = initWeek.map(item => new Date(item).getDate());
    return initDate;
}
function setCurWeek(nV) {
    let days = nV.days;
    let curMonth = nV.curMonth;
    let curYear = nV.curYear;
    let curWeekRes = [];
    allDays = nV.days && [...nV.days] || [];
    if (days) {
        if (!(curMonth == (new Date().getMonth() + 1) && curYear == new Date().getFullYear())) {
          let empytGridsLen = nV.empytGrids && nV.empytGrids.length || 0;
            let curWeekLen = 7 - empytGridsLen;
            curWeekRes = [...nV.days].slice(0, curWeekLen);
            this.setData({
                empytGrids: true,
                lastEmptyGrids: false
            });
        } else {
            let curWeekCol = getWeek.call(this);
            days.forEach(item => {
              curWeekCol.forEach(date => {
                if (date == item.day) {
                  curWeekRes.push(item);
                }
              });
            });
        }
        this.setData({
            date: curWeekRes
        });
        allWeeks = [...curWeekRes];
        // console.log('allWeeks',allWeeks)
    }
}

function scrollCondition() {
    let nextYear = this.data.currentYear;
    let nextMonth = this.data.currentMonth;
    if (this.data.currentMonth + 1 > 12) {
        nextMonth = 1;
        ++nextYear;
    } else {
        ++nextMonth;
    }
    let nextMonthLast = new Date(nextYear, nextMonth, 0).getDate();
    let curMonthCol = [];
    for (let i = 0; i < nextMonthLast; i++) {
        curMonthCol.push(`${nextYear}-${nextMonth}-${i + 1}`);
    }
    let isAllDisabled = curMonthCol.every(item => Date.parse(new Date(item)) > Date.parse(this.data._activityEndTime));
    this.setData({
        allowScroll: !isAllDisabled
    });
    return (this.data.date.length <= 7) ? false : true;
}

function getTimeObj(date) {
    return {
        year: (new Date(date)).getFullYear(),
        month: (new Date(date)).getMonth() + 1,
        day: (new Date(date)).getDate()
    };
}