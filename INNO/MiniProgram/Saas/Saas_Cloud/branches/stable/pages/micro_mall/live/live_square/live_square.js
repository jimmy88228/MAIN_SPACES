import MyDate from "../../../../common/support/utils/date-util.js";
const app = getApp();
/*
* liveStatus： // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常 (直播未结束，直接切出去) 107：已过期
*/
const livePlayer = requirePlugin('live-player-plugin');
Page(app.BP({

  data: {
    roomsList:[],
    goodsJson:{},
    liveStatus:{}
  },
  hasMore: true,
  page: 0,
  timeTxt:{
    0: "今天",
    1: "明天"
  },
  onLoad: function (options) {
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.hasMore = true;
    this.page = 0;
    getLiveRoomList.call(this);
  },
  onHide: function () {
    this.timer && clearInterval(this.timer);
  },
  onUnload: function () {
    this.timer && clearInterval(this.timer);
  },
  onPullDownRefresh: function () {
    this.page = 0;
    getLiveRoomList.call(this).then(()=>{
      wx.stopPullDownRefresh();
      app.SMH.showToast({
        title:"刷新成功"
      })
    });
  },
  onReachBottom: function () {
    if (this.hasMore){
      getLiveRoomList.call(this);
    }else{
      app.SMH.showToast({
        title:"已经到底啦！"
      })
    }
  },
  onShareAppMessage: function () {

  },
  joinLive(e){
    let dataset = e.currentTarget.dataset || {};
    let roomId = dataset.roomId;
    let shareActivityId = dataset.shareActivityId;
    if (roomId){
      let userToken = app.LM.userToken;
      let customParams = encodeURIComponent(JSON.stringify({ fromUser: userToken , roomId: roomId}))
      if(shareActivityId){
        wx.navigateTo({
          url: '/pages/micro_mall/live/live_activity/live_activity?roomId=' + roomId + '&activityId=' + shareActivityId,
        })
      }else{
        wx.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`,
        })
      }
      
    }
  }
}))
function getLiveRoomList(){
  let page = this.page;
  page += 1; 
  let params = {
    brandCode: app.Conf.BRAND_CODE,
    pageIndex: page,
    pageSize: app.Conf.PAGE_SIZE
  }
  let extra = {
    diy: true,
    isShowLoad: false
  }
  return app.RunApi.go('LiveApi', 'getLiveRoomList', params, extra).then(res => {
    if (res.code == '1') {
      console.log(res);
      let data = res.data || [];
      this.page = page;
      let index = page - 1 || 0;
      let key = `roomsList[${page - 1}]`;
      this.hasMore = data.length == 0 ? false : true;
      let liveStatus = this.data.liveStatus;
      for(let i = 0; i < data.length; i++){
        let roomId = data[i].roomId;
        liveStatus[roomId] = {
          roomId: roomId,
          status: data[i].liveStatus,
          startTime: data[i].startTime,
          endTime: data[i].endTime
        }
        liveStatus[roomId] = signleTimeHandle.call(this, liveStatus[roomId]);
      }
      this.setData({
        [key]: data,
        liveStatus: liveStatus
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).finally(() => {
    if (this.data.roomsList.length > 0 && this.data.roomsList[0].length > 0){
      getLiveStatusHandle.call(this);
    }
  })
}
function getLiveStatusHandle(){
  this.timer && clearInterval(this.timer);
  this.timer = setInterval(()=>{
    getLiveStatus.call(this);
  },10000)
}
function getLiveStatus(){
  let liveStatus = this.data.liveStatus || {};
  for (let i in liveStatus) {
    const roomId = i;
    livePlayer.getLiveStatus({ room_id: roomId })
      .then(res => {
        // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常 (直播未结束，直接切出去)
        console.log("直播res", roomId, res)
        liveStatus[i].status = res.liveStatus;
        liveStatus[i] = signleTimeHandle.call(this, liveStatus[i]);
        let key = `liveStatus.${i}`;
        this.setData({
          [key]: liveStatus[i]
        })
      })
      .catch(err => {
        console.log("err", err)
      })
  }
}
function signleTimeHandle(liveStaus){
  let startTime = liveStaus.startTime.replace(/\-/g, "/");
  let startDate = new Date(startTime);
  let endTime = liveStaus.endTime.replace(/\-/g, "/");
  let endDate = new Date(endTime);
  let nowDate = new Date();
  if (nowDate.getTime() > endDate.getTime()){
    liveStaus.status = "103";
  }
  switch(liveStaus.status + ""){
    case "102":
      let month = startDate.getDay();
      let day = parseInt(startDate.getDate());
      let nowday = parseInt(new Date().getDate());
      if ((day - nowday) >= 0 && (day - nowday) < 2) {
        let time_txt = this.timeTxt[day - nowday] || "";
        let time = MyDate.format(startDate, "HH:mm");
        liveStaus.staueStr = time_txt + time + "开播"
      } else {
        let time = MyDate.format(startDate, "yyyy年MM月dd HH:mm");
        liveStaus.staueStr = time + "开播"
      }
      liveStaus.className = "before_staue";
      break;
    case "103":
      liveStaus.staueStr = "已结束"
      liveStaus.className = "after_staue";
      break;
    case "101":
    case "105":
      liveStaus.staueStr = "直播中"
      liveStaus.className = "living_staue";
      break;
    case "104":
    case "106":
    case "107":
      liveStaus.staueStr = "已过期"
      liveStaus.className = "over_staue";
      break;
  }
  return liveStaus;
}