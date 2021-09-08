// pages/micro_mall/coupon_center/receive/receive.js
import WxSub from "../../../../common/helper/handle/wxSubscribe";
import StrH from "../../../../common/helper/handle/strHandle";
import WxGH from "../../../../common/helper/handle/wxGroupHandle";
import MyDate from "../../../../common/support/utils/date-util";
const app = getApp();
Page(app.BP({
  data: {
    receiveInfo:{},
    recordList:[],
    sendUser:{},
    status:{
      0: "可领取",
      1: "领取成功",
      2: "已抢完",
      3: "已失效"
    },
  },
  record_page: 0,
  hasMore: true,
  onLoad: function (options) {
    this.options = options;
    initPageHome.call(this);
  },
  onReady: function () {

  },
  onShow: function () {
    getSendCouponDetail.call(this,"isOnShow");
    this.record_page = 0;
    getStaffCouponTaskRecord.call(this);
    listen.call(this);
  },
  onHide: function () {
    unListen.call(this);
  },
  onUnload: function () {
    unListen.call(this);
  },
  onPullDownRefresh: function () {
    getSendCouponDetail.call(this).finally(()=>{
      wx.stopPullDownRefresh();
    });
    this.record_page = 0;
    getStaffCouponTaskRecord.call(this);
  },
  onReachBottom(e){
    this.pageTab = this.pageTab || this.selectComponent("#pageTab");
    this.pageTab.reachBottom();
  },
  onShareAppMessage: function () {
    let ops = this.options;
    let receiveInfo = this.data.receiveInfo;
    return {
      isCustom: true,
      path: "/" + this.route + "?shareId=" + ops.shareId +'&fromUser=' + ops.fromUser,
      title: receiveInfo.shareTitle,
      imageUrl: receiveInfo.shareImage
    }
  },
  swiperChange(e){
    let detail = e.detail || {};
    let recordList = this.data.recordList || [];
    if((recordList.length - parseInt(detail.current)) < 2 && this.hasMore){
      getStaffCouponTaskRecord.call(this);
    }
  },
  noFunc(){

  },
  receiveCoupon(){
    receiveStaffCoupon.call(this).then(()=>{
      if(this.tmplIds.length > 0){
        afterSetWxSubscribe.call(this,this.tmplIds)
      }
    }).finally(()=>{
      getSendCouponDetail.call(this);
      this.record_page = 0;
      getStaffCouponTaskRecord.call(this);
    })
  },
  loginCallback(){
    if(!this.data.isLogin){
      this.setData({
        isLogin: app.LM.isLogin
      })
    }
    app.SMH.showToast({
      title:"登录完成，请重新领取"
    })
  },
  showDesc(e){
    let dataset = e.currentTarget.dataset || {};
    let activieTaskId = this.data.activieTaskId || ""
    if(activieTaskId == dataset.taskId){
      activieTaskId = ""
    }else{
      activieTaskId = dataset.taskId || ""
    }
    this.setData({
      activieTaskId: activieTaskId
    })
  },
}))
function initPageHome(){
  this.pageHome = this.pageHome || this.selectComponent("#pageHome");
  this.pageHome.initPageHome(null,true);
}
function getSendCouponDetail(type){
  let ops = this.options;
  if(!ops.shareId) return;
  return app.DistrApi.getSendCouponDetail({
    params: {
      userToken: app.LM.userToken,
      shareId: ops.shareId,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      data.surplusCount = parseInt(parseInt(data.totalCount) - parseInt(data.sendCount));
      if(data.sendCount == 0 || !data.sendCount){
        data.sendPercen = 0;
        data.surplusPercen = 100
      }else{
        data.sendPercen = ((parseInt(data.sendCount) / parseInt(data.totalCount))* 100).toFixed(0);
        data.surplusPercen = (100 - parseInt(data.sendPercen)).toFixed(0);
      }
      let fromTime,toTime;
      if(data.status == 1){
        fromTime = data.couponInfo.use_start_date && data.couponInfo.use_start_date.replace(/\-/g, "/");
        toTime = data.couponInfo.use_end_date && data.couponInfo.use_end_date.replace(/\-/g, "/");
      }else{
        fromTime = data.fromDate && data.fromDate.replace(/\-/g, "/");
        toTime = data.toDate && data.toDate.replace(/\-/g, "/");
      }
      data.fromTimeStr = MyDate.format(new Date(fromTime), "MM月dd日 hh:mm");
      data.toTimeStr = MyDate.format(new Date(toTime), "MM月dd日 hh:mm");
      this.setData({
        receiveInfo: data
      })
      if(type == "isOnShow" && data.pageId){
        initPage.call(this, data.pageId);
      }
      if(data.status == 0 && type == "isOnShow"){
        getTpls.call(this);
      }
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
function getStaffCouponTaskRecord(){
  let ops = this.options || {};
  if(!ops.shareId) return;
  let page = this.record_page + 1 || 1;
  return app.DistrApi.getStaffCouponTaskRecord({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      shareId: ops.shareId,
      pageIndex: page,
      pageSize: app.Conf.PAGE_SIZE,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let dataList = data.dataList || [];
      let totalCount = data.totalCount || 0;
      let recordList = this.data.recordList || [];
      if(page != 1){
        dataList = dataList.concat(recordList);
      } 
      this.record_page = page;
      this.hasMore = dataList.length < totalCount;
      if(page == 1 && dataList.length==1 && !this.hasMore){ //单个数据也启动循环
        dataList = dataList.concat(dataList);
      }
      this.setData({
        recordList: dataList 
      })
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
function receiveStaffCoupon(){
  let ops = this.options;
  if(!ops.shareId) return;
  if(ops.fromUser == app.LM.userToken){ 
    app.SMH.showToast({
      title: "发起者不可领取"
    })
    return Promise.reject();
   }
  return app.DistrApi.receiveStaffCoupon({
    data: {
      userToken: app.LM.userToken,
      shareId: ops.shareId,
      brandCode: app.Conf.BRAND_CODE,
      channelId: WxGH.groupId || ""
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      app.SMH.showToast({
        title: "领取成功"
      })
      return Promise.resolve(e);
    }else{
      if(e.code == 0){
        showFail.call(this);
      }else{
        app.SMH.showToast({
          title: e.msg
        })
      }
    }
    return Promise.reject();
  })
}
function showFail(){
  getUserSimpleInfo.call(this).then(()=>{
    this.receiveFail = this.receiveFail || this.selectComponent("#receiveFail");
    this.receiveFail.show();
  })
}
function getUserSimpleInfo(){
  let sendUser = this.data.sendUser || {};
  let ops = this.options || {};
  if(!sendUser.userToken || sendUser.userToken != ops.fromUser){
    return app.UserApi.getUserSimpleInfo({
      params:{
        userToken: ops.fromUser,
        brandCode: app.Conf.BRAND_CODE
      }
    }).then(e=>{
      if(e.code == 1){
        let data = e.data || {};
        sendUser.userToken = ops.fromUser;
        sendUser.realName = data.realName;
        sendUser.portrait_path = data.portrait_path;
        this.setData({
          sendUser: sendUser
        })
      }
    })
  }else{
    return Promise.resolve();
  }
}
function getTpls(){
  let ops = this.options || {};
  this.setData({
    isOwn: ops.fromUser && ops.fromUser == app.LM.userToken ? true : false
  })
  if(ops.fromUser == app.LM.userToken) {
    return;
  }
  WxSub.getTpls("STAFF_COUPON").then(data=>{
    if (data && data.length > 0){
      this.tplsList = data || [];
      this.tplsListObj = StrH.createJsonByKey(this.tplsList,'wxTplId');
      console.log('this.tplsListObj', this.tplsListObj)
      this.tmplIds = [];
      for(let i = 0; i < data.length; i++){
        this.tmplIds.push(data[i].wxTplId)
      }
    }
    return Promise.resolve(data)
  });
}
function afterSetWxSubscribe(tmplIds){
  return WxSub.setWxSubscribe(tmplIds).then(res => {
    if (res.errMsg.indexOf("ok") != -1) {
      reqSubscribe.call(this, res, null);
    } else {
      app.SMH.showToast({
        title: res.errMsg
      })
    }
  }).catch(error => {
    if (error && error.type == 'showError') {
      app.SMH.showToast({
        title:"请允许订阅消息在小程序设置中开启"
      })
    }else{}
  })
}
function reqSubscribe(subResult, setSub) {
  console.log('subResult', subResult)
  let tplsList = this.tplsList || [];
  let reqList = [];
  let receiveInfo = this.data.receiveInfo || {};
  for (let i = 0; i < tplsList.length; i++) {
    let wxTplId = tplsList[i].wxTplId || "";
    let tplType = tplsList[i].tplType;
    reqList.push({
      actId: receiveInfo.actId,
      tplType: tplType,
      brandTplId: tplsList[i].brandTplId,
      state: subResult[wxTplId],
      actTaskId: receiveInfo.taskId,
      actShareId: receiveInfo.shareId
    })
  }
  WxSub.setSubscribe(reqList, setSub,"STAFF_COUPON").then(res=>{
    app.SMH.showToast({
      title: "订阅成功"
    })
  })
}
function initPage(pageId){
  let type = !this.firstSet ? {loadDataType:"bottom"} : {};
  this.firstSet = true;
  this.pageTab = this.pageTab || this.selectComponent("#pageTab");
  this.pageTab.getPageData({
    page_id: pageId,
    ...type,
  });
}
//监听用户
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
}