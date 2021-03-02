import MyDate from "../../../../support/utils/date-util.js";
import StrH from "../../../../support/utils/string-util";
const app = getApp();
/*
* liveStatus： // 101: 直播中, 102: 未开始, 103s: 已结束, 104: 禁播, 105: 暂停中, 106: 异常 (直播未结束，直接切出去) 107：已过期
*/
const livePlayer = requirePlugin('live-player-plugin');
Page(app.BP({

  data: {
    roomsList:[],
    goodsJson:{},
    liveStatus:{},
    percentage: 0,
  },
  hasMore: true,
  page: 0,
  timeTxt:{
    0: "今天",
    1: "明天"
  },
  firstShowJoin: true, 
  onLoad: function (options) {
    this.options = options;
    initMenuButton.call(this);
    initPageHome.call(this);
  },
  onReady: function () {
    console.log("onReady")
    // getLiveShareAct.call(this).then(()=>{
    //   getLiveActVisitRecord.call(this);
    // })
  },
  onShow: function () {
    console.log("onShow")
    this.hasMore = true;
    this.page = 0;
    getLiveShareAct.call(this).then(()=>{
      getLiveActVisitRecord.call(this);
    })
    loadPostLiveActVisitRecord.call(this);
    listen.call(this);
  },
  onHide: function () {
    unListen.call(this);
  },
  onUnload: function () {
    unListen.call(this);
  },
  onPullDownRefresh: function () {
    this.page = 0;
    getLiveShareAct.call(this).then(()=>{
      getLiveActVisitRecord.call(this);
      wx.stopPullDownRefresh();
      app.SMH.showToast({
        title:"刷新成功"
      })
    });
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
    let path = this.route;
    let actInfo = this.data.actInfo || {};
    path = path + '?' + StrH.getPageParamsStr(this.options || {});
    return {
      isCustom:true,
      path: path,
      title: actInfo.activityName,
      imageUrl: actInfo.activeImage
    }
  },
  joinLive(e){
    let ops = this.options || {};
    let that = this;
    let detail = e.detail || {};
    if(typeof(detail.isHelp) == "boolean" && !detail.isHelp){//不助力
      delete this.options.fromUser;
      return;
    }
    let actInfo = this.data.actInfo || {};
    if (actInfo.roomId){
      getLiveStatus.call(this,actInfo.roomId).then(status=>{
        app.SMH.showLoading();
        wx.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${actInfo.roomId}`,
          success(){
            console.log("直播状态 status",status);
            if(status == 101){
              postLiveActVisitRecord.call(that);
              delete that.options.fromUser;
            }else{
              setTimeout(()=>{
                app.SMH.hideLoading();
              },1000);
            }
            
          }
        })
      })
    }
  },
  showJoinList(){
    this.joinPop = this.joinPop || this.selectComponent("#joinPop");
    this.joinPop.show();
  },
  showRule(){
    this.actRule = this.actRule || this.selectComponent("#actRule");
    this.actRule.show();
  }
}))
function initPageHome(){
  this.pageHome = this.pageHome || this.selectComponent("#pageHome");
  this.pageHome.initPageHome(null,true);
}
function getLiveShareAct(){
  let ops = this.options || {};
  let params = {
    activityId: ops.activityId,
  }
  let extra = {
    diy: false,
    isShowLoad: false
  }
  return app.RunApi.go('LiveApi', 'getLiveShareAct', params, extra).then(res => {
    if (res.code == '1') {
      console.log(res);
      let data = res.data || {};
      let bonusList = data.detail || [];
      let fromTime = data.fromTime && data.fromTime.replace(/\-/g, "/") || "";
      let toTime = data.toTime && data.toTime.replace(/\-/g, "/") || "";
      data.fromTimeStr = MyDate.format(new Date(fromTime), "MM月dd日 hh:mm");
      data.toTimeStr = MyDate.format(new Date(toTime), "MM月dd日 hh:mm");
      let helpData =  {
        activeImage: data.activeImage
      }
      for(let i = 0;i < bonusList.length; i++ ){
        bonusList[i].requestNumber = parseInt(bonusList[i].requestNumber);
      }
      this.setData({
        actInfo: data,
        helpData: helpData,
        bonusList: bonusList
      })
      if(data.status == 1){//0未开始，1进行中，2已结束
        switchHelpTip.call(this);
      }
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}
function getLiveActVisitRecord(){
  let ops = this.options || {};
  let page = this.page;
  page += 1; 
  let params = {
    activityId: ops.activityId,
    pageIndex: page,
    pageSize: app.Conf.PAGE_SIZE,
  }
  let extra = {
    diy: false,
    isShowLoad: false
  }
  return app.RunApi.go('LiveApi', 'getLiveActVisitRecord', params, extra).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      let detailList = data.detailList || [];
      // let key = `visitRecord[${page - 1}]`;
      if(detailList.length == 0){
        this.hasMore = false;
        return;
      }else{
        this.hasMore = true;
      }
      this.page = page;
      if(page > 1){
        let visitRecord  = this.data.visitRecord || [];
        detailList = visitRecord.concat(detailList);
      }
      
      //计算进度
      let totalCount = data.totalCount || 0;
      let actInfo = this.data.actInfo || {};
      let maxNumber = actInfo.maxRequestNumber;
      let percentage = parseFloat(((totalCount / maxNumber) * 100).toFixed(2));
      this.setData({
        visitRecord: detailList,
        totalCount: totalCount,
        percentage: percentage
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}
function loadPostLiveActVisitRecord(){
  let ops = this.options || {};
  if(!ops.fromUser) return;
  if(app.LM.openId){
    postLiveActVisitRecord.call(this, true);
    return;
  }
  this.isCheckLoginHandleId = app.EB.listen("isCheckLoginHandle", () => {
    postLiveActVisitRecord.call(this, true);
  });
}
function postLiveActVisitRecord(isLoad){
  let ops = this.options || {};
  if(!ops.fromUser) return;
  if(ops.fromUser == app.LM.userToken) return;
  let params = {
    fromUserToken: ops.fromUser,
    activityId: ops.activityId,
    cookieid: app.LM.openId,
    sharedType: "card",
    status: isLoad ? 0 : 1, //状态，0进入活动页，1进入直播
    brandCode: app.Conf.BRAND_CODE
  }
  let extra = {
    diy: false,
    isShowLoad: true
  }
  return app.RunApi.go('POST','LiveApi', 'postLiveActVisitRecord', params, extra).then(res => {
    if (res.code == '1') {
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}
function switchHelpTip(){
  let ops = this.options || {}
  if(ops.fromUser && ops.fromUser != app.LM.userToken){
    this.joinTip = this.joinTip || this.selectComponent("#joinTip");
    this.joinTip.show();
  }
}
function getLiveStatus(roomId){
    let ops = this.options || {};
    if(!ops.fromUser){
      return Promise.resolve(0);
    }
    return livePlayer.getLiveStatus({ room_id: roomId })
    
      .then(res => {
        // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常 (直播未结束，直接切出去)
        return Promise.resolve(res.liveStatus);
      })
      .catch(err => {
        console.log("err", err)
      })
}
function initMenuButton(){
  // let menuButton = wx.getMenuButtonBoundingClientRect()
  // this.setData({
  //   menuButton: menuButton
  // })
}
function listen() {
  if (app.LM.isLogin){
    this.setData({
      isLogin: true
    })
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if(app.LM.isLogin){
      this.setData({
        isLogin: true
      })
    }
  });
}
function unListen() {
  if (this.listenLoginStatuId){
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
  if(this.isCheckLoginHandleId){
    app.EB.unListen("isCheckLoginHandle", this.isCheckLoginHandleId);
  }
}
