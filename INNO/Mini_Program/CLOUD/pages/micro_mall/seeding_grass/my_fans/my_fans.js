const app = getApp();
Page(app.BP({

  data: {
    fansData: []
  },
  pageIndex: 1,
  hasMore: true,
  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {
    onShowEvent.call(this);
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
  },

  onReachBottom: function () {
    if (this.hasMore) {
      this.pageIndex = this.pageIndex + 1;
      this.search = this.search || this.selectComponent("#search");
      this.search.search({
        pageIndex: this.pageIndex
      })
    } else {
      app.SMH.showToast({
        title: "已经到底啦！"
      })
    }
  },
  searchCallback(res) {
    //搜索数据回调处理
    let detail = res.detail || {};
    dataHandle.call(this, detail.data)
  },
  fansHandle(e) {
    let dataset = e.currentTarget.dataset;
    let index = dataset.index;
    let fansData = this.data.fansData || {};
    let fansItem = fansData[index] || {};
    let that = this;
    if (fansItem.isFocuse){
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setCentent(`确认不再关注?`);
      this.pageDialog.setTwoBtn({
        name: "取消",
        tap: function () { that.pageDialog.dismiss(); }
      }, {
          name: "确定",
          tap: function () {
            opGrassRelation.call(that, index);
            that.pageDialog.dismiss();
          }
        })
      this.pageDialog.show();
    }else{
      opGrassRelation.call(this, index);
    }
    
  },
  getUserPage(e) {
    let dataset = e.currentTarget.dataset;
    console.log(dataset);
    let related_userid = dataset.related_userid;
    if (related_userid) {
      wx.navigateTo({
        url: '/pages/micro_mall/seeding_grass/user_page/user_page?related_userid=' + related_userid,
      })
    }
  }
}))
function onShowEvent() {
  this.hasMore = true;
  this.search = this.search || this.selectComponent("#search");
  this.search.search();
}
function dataHandle(data = {}) {
  let fansData = this.data.fansData;
  let list = data.data || [];
  this.pageIndex = data.pageIndex || 1;
  if (data.records == fansData.length || list.length == 0) {
    this.hasMore = false;
  } else {
    list.map((item, index) => {
      if(item.isEachFocuse){
        item.isFocuse = 1
      }else{
        item.isFocuse = 0
      }
    })
    if(this.pageIndex == 1){
      fansData = list;
    }else{
      fansData = fansData.concat(list);
    }
    this.setData({
      fansData: fansData
    })
  }
}
function opGrassRelation(index) {
  let fansData = this.data.fansData || [];
  let fansItem = fansData[index];
  return app.GrassApi.opGrassRelation({
    data: {
      related_userId: fansItem.related_userId,
      opType: fansItem.isFocuse ? 0 : 1,//1:foucse,0:canceld
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    extraData: {
      isShowLoad: true
    }
  }).then(e => {
    let warn = "操作失败";
    if (e.code == 1) {
      if (e.data == 1) {
        warn = fansItem.isFocuse ? '取消关注' : '已关注';
        fansItem.isFocuse = !fansItem.isFocuse;
        fansData[index] = fansItem;
        console.log(fansData);
        this.setData({
          fansData: fansData
        })
      }
    }
    app.SMH.showToast({
      "title": warn
    })
  })
}