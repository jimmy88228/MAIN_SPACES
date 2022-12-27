import {
  CountDown
} from "../../../common/manager/timer-manager/index";
const App = getApp();
Page(App.BP({
  data: {
    activityInfo: {},
    countDownTime: {
      hours: 0,
      minutes: 0,
      seconds: 0
    },
  },
  onLoad() {

  },

  onShow() {
    getActivityDetail.call(this)
      .then(() => {
        setCountDown.call(this)
      })
      .then(() => {
        this.goodsList = this.goodsList || this.selectComponent("#goods-list");
        this.goodsList.loadData({activityId: this.data.activityInfo.id || 0});
      })
  },
  handleScrollToLower() {
    this.goodsList = this.goodsList || this.selectComponent("#goods-list");
    this.goodsList.loadNextPage();
  },
  onShareAppMessage(){}
}))

function getActivityDetail() {
  this.showLoading();
  return App.Http.QT_GoodsApi.activityDetail()
    .then(res => {
      if (res.code == 1) {
        let activityInfo = res.data || {};
        this.setData({
          activityInfo
        })
        return activityInfo
      }
      return Promise.reject(res.msg || "获取活动详情失败")
    })
    .catch(err => {
      console.log("getActivityDetail", err);
      App.SMH.showToast({
        title: err
      })
    })
    .finally(() => {
      this.hideLoading()
    })
}

function setCountDown() {
  let {
    status,
    start_time,
    end_time,
    date: server_time,
  } = this.data.activityInfo;
  start_time = start_time.replace(/-/g, '/'), end_time = end_time.replace(/-/g, '/'), server_time = server_time.replace(/-/g, '/'); // 兼容ios
  let targetDate = new Date(status == 1 ? end_time : start_time);
  if (!this.countDown) {
    this.countDown = new CountDown(new Date(server_time) || new Date());
  }
  this.countDown.setTarget(targetDate);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        stopCountDown.call(this);
      } else {
        let days = parseInt(e.value / (1000 * 60 * 60 * 24));
        let hours = parseInt(days * 24 + (e.value % (24 * 3600 * 1000)) / (3600 * 1000));
        let minutes = parseInt((e.value % (3600 * 1000)) / (60 * 1000));
        let seconds = parseInt((e.value % (1000 * 60)) / 1000);
        this.setData({
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