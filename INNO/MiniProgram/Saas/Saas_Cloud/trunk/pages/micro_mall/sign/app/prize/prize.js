// pages/micro_mall/sign/app/prize/prize.js
const app = getApp(); 
Page(app.BP({ 
  data: {
    arr:[{},{}],
    list:[],
    level:[{showName:'LV1'},{showName:'LV2'},{showName:'LV3'},],
  },
  pageIndex:1,
  hasMore:true,
  onLoad: function (options) {
    let img_receive = this.data.brand_info.default_icon_url + 'sign/receive.png'
    this.setData({
      img_receive
    })
    this.loadData();
  }, 
  onReady: function () {

  }, 
  onShow: function () {

  }, 
  onHide: function () {

  },  
  onUnload: function () {

  }, 
  onPullDownRefresh: function () {

  }, 
  onReachBottom: function () {
    if(this.hasMore){
      this.loadData();
    }else{
      app.SMH.showToast({
        title:"没有更多数据了!"
      })
    }
  }, 
  onShareAppMessage: function () {

  },
  loadData(){
    get_UserSignOrderActivityReward.call(this).then(data=>{
      this.hasMore = this.pageIndex * app.Conf.PAGE_SIZE < data.totalCount;
      this.pageIndex += 1;
      let list = data.list||[];
      list.forEach((item)=>{
        item.levelList = getLevelList(item)
      })
      this.setData({list:{...this.data.list,...list},totalCount:data.totalCount||0});
    });
  },
  jump(e){
    let dataset = this.getDataset(e);
    let goodsId = dataset.goodsId||0;
    wx.navigateTo({
      url: `/pages/micro_mall/goods/goods_info?goods_id=${goodsId}`,
    })
  }
}))

function get_UserSignOrderActivityReward(){
  return app.CL_UserApi.get_UserSignOrderActivityReward({
    data: {
      receiveType:-1,
      pageIndex:this.pageIndex,
      pageSize:app.Conf.PAGE_SIZE,
      userToken:  app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    console.log('get_UserSignOrderActivityReward',res)
    return (res.data||{});
  })
}

function getLevelList(item){
  let len = item.activityTotalSort;
  let list = []
  for(let i = 0;i<len;i++){
    list.push({
      choosed:i<=item.sort-1,
      showName :  "LV" + (i + 1)
    })
  }
  return list;
}