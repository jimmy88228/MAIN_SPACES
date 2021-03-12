const app = getApp();
Page(app.BP({
  data: {
    activitList: [],
    isLogin: app.LM.isLogin
  },
  page: 1,
  onLoad: function(options) {
    this._checkUserLogin();
  },
  onUnload(){},
  onShow: function() {
    this.getBonusData(1);
  },
  onReachBottom: function() {
    this.reachBottomEvent();
  },
  onShareAppMessage: function() {},
  getBonusData(page) {
    getBonusDataReq.call(this, this.page);
  },
  reachBottomEvent() {
    var activitList = this.data.activitList;
    if (activitList.length == activitList[0].totalCount) {
      app.SMH.showToast({
        title:"已经到底啦！"
      })
    } else {
      this.getBonusData();
    }
  },
  jump(e){
    let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
    let url = dataset.url || '';
    if(url){
      wx.navigateTo({
        url: url,
      })
    }
  },
}))

function getBonusDataReq() {
  return app.ActApi.getBuyBonusActivitList({
    params: {
      pageSize: app.Conf.PAGE_SIZE,
      pageIndex: this.page,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    extraData: {
      isShowLoad: true
    }
  }).then(res => {
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