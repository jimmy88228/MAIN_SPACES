import {
  CountDown
} from "../../../common/manager/timer-manager/index";
const App = getApp();
Page(App.BP({
  data: {
    activityInfo: {},
    countDownTime: {
      days:0,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
  },
  onLoad(){ 
    wx.setBackgroundColor({
      backgroundColor:App.SH.pageStyleObj['main-color'],
    })
    this.setView({ 
      goodsListRef: { get: () => this.findView("#goods-list") }, 
    })
  },
  onShow() {
    this.refresh();
  },
  refresh(){ 
    return getActivityDetail.call(this)
      .then(() => setCountDown.call(this))
      .then(res => {
        let activityInfo = this.data.activityInfo||{};
        let {id: activityId = 0, status: activityStatus = 0} = activityInfo || {};
        this.activityId = activityId;
        this.goodsListRef && this.goodsListRef.loadData({activityId, activityStatus});
        return res;
      })
      .finally(()=>{
        this.setData({isInit:true});
      })
  },
  refresherrefresh(){ 
    this.refresh().finally(()=>{
      this.goodsListRef && this.goodsListRef.refreshEnd();
    });
  },
  onHide() {
    stopCountDown.call(this);
  }, 
  onShareAppMessage(){},
}))

function getActivityDetail() {
  const storeInfo = App.StoreH.storeInfo || {};
  if (!storeInfo.storeId) {
    console.log("getActivityDetail 没有店铺id，不请求和提示", storeInfo);
    return Promise.reject()
  }
  this.showLoading();
  return App.Http.QT_GoodsApi.activityDetail()
    .then(res => {
      if (res.code == 1) {
        let activityInfo = res.data || {};
        activityInfo.status = doubleCheckActivityStatus(activityInfo);
        activityInfo.needRefresh = !!(this.data.activityInfo && this.data.activityInfo.status == 2);
        this.setData({
          activityInfo
        })
        return activityInfo
      }
      return Promise.reject(res.msg || "获取活动详情失败")
    })
    .catch(err => {
      console.log("getActivityDetail", err);
      return Promise.reject(err);
    })
    .finally(() => {
      this.hideLoading()
    })
}

function doubleCheckActivityStatus (activityInfo = {}) { // 前端再判断一次活动状态，以防万一
  const {start_time, date, end_time} = activityInfo;
  let status = 0; // 活动未开始
  if (!start_time && !date && !end_time) status = 2; // 活动已过期
  else if (date < start_time) status = 0; // 活动未开始
  else if (date >= end_time) status = 2; // 活动已过期
  else status = 1; // 活动进行中
  return status
}

function setCountDown() {
  let {
    status,
    start_time,
    end_time,
    date: server_time,
    id,
  } = this.data.activityInfo;
  start_time = start_time.replace(/-/g, '/'), end_time = end_time.replace(/-/g, '/'), server_time = server_time.replace(/-/g, '/'); // 兼容ios
  if (status == 2 || !id)return; // 活动已过期，就不用再进行倒计时了
  let targetDate = new Date(status == 1 ? end_time : start_time);
  if (!this.countDown) this.countDown = new CountDown(new Date(server_time) || new Date());
  this.countDown.setTarget(targetDate);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        this.refresherrefresh();
        stopCountDown.call(this);
      } else {
        let days = parseInt(e.value / (1000 * 60 * 60 * 24));
        let hours = parseInt((e.value % (24 * 3600 * 1000)) / (3600 * 1000));
        // let hours = parseInt(days * 24 + (e.value % (24 * 3600 * 1000)) / (3600 * 1000));
        let minutes = parseInt((e.value % (3600 * 1000)) / (60 * 1000));
        let seconds = parseInt((e.value % (1000 * 60)) / 1000);
        this.setData({
          "countDownTime.days": days,
          "countDownTime.hours": hours,
          "countDownTime.minutes": minutes,
          "countDownTime.seconds": seconds,
        })
      }
    });
  }
}

function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
    delete this.countDown;
    console.log("stop")
  }
}