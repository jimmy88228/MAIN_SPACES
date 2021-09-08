// pages/micro_mall/buyBonus/getBonusActivitList.js
const app = getApp();
Page(app.BP({ 
  data: {
    activitList: [],
    isLogin: app.LM.isLogin
  },
  page: 1, 
  onLoad: function(options) {
    app.LM.loginAsync().finally(()=>{
      this.getBonusData(1);
    })
  },
  onUnload(){
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  },
  onReachBottom: function() {
    this.reachBottomEvent();
  }, 
  onShareAppMessage: function() {},
  resetData(){
    this.page = 1;
    this.data.activitList = [];
    this.getBonusData(1);
  },
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
      wx.nextTick(()=>{
        activitList.forEach((item,index)=>{
          initCountDownData.call(this,item,index,item.serverTime)
        })
      })
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

function initCountDownData(data,index,serverTime){
  if(!data)return;
  let result = {};
  result.stime = data.fromTime || "";
  result.etime = data.toTime || "";
  result.serverTime = serverTime || "";
  result.acName = "购礼";
  result.type = "list-buyBonus"
  let id = `actCountDownId${index}`;
  let component = this.selectComponent(`#${id}`);
  component.initData(result,()=>{
      this.resetData();
  });
}