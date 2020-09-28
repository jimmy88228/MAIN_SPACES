// pages/micro_mall/buyBonus/getBonusActivitList.js
const app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    activitList: [],
    isLogin: app.LM.isLogin
  },
  page: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    listen.call(this);
  },
  onUnload(){
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  },
  onShow: function() {
    this.getBonusData(1);
  },
  onReachBottom: function() {
    this.reachBottomEvent();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getBonusData(page) {
    getBonusDataReq.call(this, this.page);
    // var that = this;
    // if (page){
    //   this.page = page;
    // }else{
    //   this.page = this.page + 1;
    // }
    // app.wxReq('', 'buyBonus_getBonusActivityList', {
    //   page: this.page
    // }, function (info) {
    //   var data = info.data;
    //   var activitList = that.data.activitList;
    //   if (page == 1){
    //     activitList = data;
    //   }else{
    //     activitList = activitList.concat(data);
    //   }
    //   that.setData({
    //     activitList: activitList
    //   });
    // })
  },
  reachBottomEvent() {
    var activitList = this.data.activitList;
    if (activitList.length == activitList[0].totalCount) {
      // app.appToast("已经到底啦！");
      app.SMH.showToast({
        title:"已经到底啦！"
      })
    } else {
      this.getBonusData();
    }
  },
  // toBuy: function(e) {
  //   var activityId = e.currentTarget.dataset.activityId;
  //   wx.navigateTo({
  //     url: './getBonusActivityDetail?activityId=' + activityId,
  //   })
  // },
  // /**
  //  * 购买授权
  //  */
  // buyClick(e) {
  //   if (e && e.detail && e.detail.activityId) {
  //     wx.navigateTo({
  //       url: './getBonusActivityDetail?activityId=' + e.detail.activityId,
  //     });
  //   } else {
  //     console.log('buyClick', e); 
  //   }
  // },
  _noFn(e) {},
  jump(e){
    let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
    let url = dataset.url || '';
    if(url){
      wx.navigateTo({
        url: url,
      })
    }
  },
  /**
   * 授权确定
   */
  // authorizeClick() {
  //   this.getBonusData(1);
  // }
}))

function getBonusDataReq() {
  return app.ActApi.getBuyBonusActivitList({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      pageSize: app.Conf.PAGE_SIZE,
      pageIndex: this.page
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    console.log(res, "res");
    if (res.code == "1") {
      let data = res.data;
      let activitList = this.data.activitList;
      if (this.page == 1) {
        activitList = data;
        if (data && data.length <= 0) {
          this.setData({
            empty: true
          })
        }
      } else {
        activitList = activitList.concat(data);
      }
      this.setData({
        activitList: activitList
      });
    }
  })
}

function listen(){
  if (app.LM.isLogin && this.data.isLogin) return
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if (app.LM.isLogin && !this.data.isLogin) {
      this.setData({
        isLogin: true
      })
    }
  });
}