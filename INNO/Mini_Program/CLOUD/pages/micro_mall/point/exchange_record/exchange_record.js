const app = getApp();

Page(app.BP({
  
  data: {
    iconUrl: app.Conf.ICON_URL,
    logData:[],
    isReady:false,
  },
  page:0,
  hasMore:true,
  onShow(){
    getExchangeLogList.call(this);
  },
  onLoad: function (options) {
  },
  onReachBottom(){
    if (!this.hasMore){
      app.SMH.showToast({
        title: "已经到底啦！"
      });
    }else{
      getExchangeLogList.call(this);
    }
  }
}))


function getExchangeLogList() {
  this.page = this.page + 1;
  return app.IntegralApi.getExchangeLogList({
    params: {
      pageIndex: this.page,
      pageSize: app.Conf.PAGE_SIZE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let logData = this.data.logData;
      let list = data.list
      logData = logData.concat(list);
      this.setData({
        logData: logData
      })
      if (logData.length == data.totalCount){
        this.hasMore = false;
      }
      return Promise.resolve(e);
    } else {
      if (e.msg) {
        app.SMH.showToast({
          title: e.msg
        });
      }
      return Promise.reject();
    }
  })
}