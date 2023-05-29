import MyDate from "../../../../common/support/utils/date-util.js";
import LM from "../../../../common/manager/login-manager";
// import Conf from "../../../../conf";
const app = getApp();
const PAGE_TYPE = "Live_DETAILS";
/*
* liveStatus： // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常 (直播未结束，直接切出去) 107：已过期
*/
const livePlayer = requirePlugin('live-player-plugin');
Page(app.BP({

  data: {
    brand_info:app.globalData.brand_info,
    roomsList:[],
    goodsJson:{},
    liveStatus:{},
    hideShareModal:true,
    id:0,//后台自增ID
    roomId:0,//直播间ID
    templateIds:[],//需要授权的模板ID
    success_tempIds:[],//用户允许授权的模板ID
    subscribeStatus:false,//用户是否订阅下一次直播
    nextRoomId:0,
    act_data:{},
    customTab:false,
    page_id:0,
    isLogin:false,
    allData:{},
    navH: 64
  },
  hasMore: true,
  page: 0,
  timeTxt:{
    0: "今天",
    1: "明天"
  },
  onLoad: function (options) {
    this.options = options
    this.getParams(this.options)
        .then(res=>{
          getLiveRoomList.call(this);
          this._checkUserLogin();
        })
  },
  onReady: function () {},
  onShow: function (options) {
    getNextLiveRoom.call(this)
  },
  onHide: function () {
    unListen.call(this);
  },
  onUnload: function () {
    unListen.call(this);
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
     return {
       title:this.data.roomsList.name,
       path:'/pages/micro_mall/live/live_detail/live_detail?id='+this.data.id,
       imageUrl:this.data.roomsList.shareImg
     };
  },
  joinLive(e){
    let roomId = this.data.roomId;
    let brandCode = app.Conf.BRAND_CODE;
    let userToken = LM.userToken;
    let customParams = encodeURIComponent(JSON.stringify({ fromUser: userToken , roomId: roomId,brandCode:brandCode}))
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`,
    })
  },
  //检测是否预定下一场直播
  checkSubscribeNextLive:function(){
    livePlayer.getSubscribeStatus({ room_id: this.data.nextRoomId })
        .then(res => {
          this.setData({
            subscribeStatus:res.is_subscribe
          })
        }).catch(err => {
      this.setData({
        subscribeStatus:false
      })
    })
  },
  //订阅下一场直播
  subscribeNextLive(){
    this.setData({
      subscribeStatus: true
    })
  },
  handleJump(e) {
    let dataset = e.currentTarget.dataset;
    let url = dataset.url;
    if (url && dataset.good > 0) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  //获取参数
  getParams(options){
     if(options.id){
       this.setData({
         id:options.id
       })
       return Promise.resolve();
     }else {
      //判断是否从二维码进入
      return app.SHP.getParams(["page_id"]).then((params) => {
          if(params.page_id){
            this.setData({
              id:params.page_id
            })
          }else{
            wx.redirectTo({
              url:'/pages/micro_mall/live/live_square_new/live_square_new'
            })
          }
          return Promise.resolve((params))
        })
      }
    },
  //分享
  getShare() {
    console.log('getShare')
    this.shareModule = this.shareModule || this.selectComponent("#shareModule");
    this.shareModule.checkIfStaffDstb();
  },
  chooseShareType(data) {
    let detail = data.detail;
    if(detail.shareId == 6){
      wx.navigateTo({
        url: '/pages/micro_mall/distribution_center/activity/activity',
      })
      return
    }

    this.shareImg = this.shareImg || this.selectComponent("#shareImg");
    let roomsList = this.data.roomsList||{};
    let allData = {
      info:{
        imgUrl: roomsList.coverImg || "",
        opKind: 'liveDetailShare',
        extend_id:this.data.id,
        goodsInfo: getNeedInfo(roomsList),
      },
      scene: {
        "shareType": 'liveDetailShare',
        'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : "",
        "page_id": this.data.id,
      },
      draw:{
        template:"goods"
      },
    }
    this.staffInfo = detail.staffInfo;
    this.getNavH(data);
    this.setData({
      allData: allData
    })
    this.shareImg.show();
  },
  getNavH(data){
    let detail = data.detail || {};
    this.setData({
      navH: parseFloat(detail.navH),
      statusH: parseFloat(detail.statusH)
    })
  },
  checkIfStaffDstbCallBack(data) {
    let detail = data.detail;
    this.staffInfo = detail.staffInfo
  },
  previewImg(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  }
}))
function getLiveRoomList(){
  let params = {
    brandCode: app.Conf.BRAND_CODE,
    id:this.data.id
  }
  let extra = {
    diy: false,
    isShowLoad: false
  }
  return app.RunApi.go('LiveApi', 'GetLiveRoomDetail', params, extra).then(res => {
    if (res.code == '1') {
      let data = res.data || [];
      let roomId = data.roomId;
      let liveStatus = {
        roomId: roomId,
        status: data.liveStatus,
        startTime: data.startTime,
        endTime: data.endTime
      }
      liveStatus = signleTimeHandle.call(this, liveStatus);
      this.setData({
        roomsList: data,
        liveStatus: liveStatus,
        roomId:roomId
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
      liveStaus.staueStr = "直播已结束"
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

function getNextLiveRoom(){
  let that = this
  let params = {
    brandCode: app.Conf.BRAND_CODE
  }
  let extra = {
    diy: false,
    isShowLoad: false
  }
  return app.RunApi.go('LiveApi', 'GetNextLiveRoom', params, extra).then(res => {
    if (res.code == '1') {
      that.setData({
        nextRoomId:res.data
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).finally(() => {
    //获取最新的直播间信息之后,检测是否订阅
    that.checkSubscribeNextLive();
  })
}
function unListen() {
  this.timer && clearInterval(this.timer);
  clearTimeout(this.loadingId);
}
function getNeedInfo(data) {
  return {
    goods_name:data.name||"",
    goods_sn:"直播开始时间 " + (MyDate.format(MyDate.parse(data.startTime||""),'M.dd HH:mm'))
  }
}