// pages/micro_mall/seeding_grass/user_page/user_page.js
const app = getApp();
Page(app.BP({
  data: {
    grassData:{},
    l_publish:[],
    r_publish:[],
    publishData:[]
  },
  pageIndex:1,
  hasMore:true,
  onLoad: function (options) {
    this.options = options;
  },
  onReady: function () {

  },
  onShow: function () {
    getFriendsGrassCenter.call(this);
    getPublishData.call(this);
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
      getPublishData.call(this);
    } else {
      app.SMH.showToast({
        "title": "已经到底啦！"
      })
    }
  },
  getDetail(e) {
    let dataset = e.currentTarget.dataset || {};
    let id = dataset.id;
    if (id) {
      wx.navigateTo({
        url: '/pages/micro_mall/seeding_grass/article_detail/article_detail?id=' + id,
      })
    }
  },
  grassRelationHandle(){
    opGrassRelation.call(this);
  }
}))
function getFriendsGrassCenter(){
  return app.GrassApi.getFriendsGrassCenter({
    params:{
      related_UserId: this.options.related_userid,
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == 1){
      this.setData({
        grassData: e.data || {}
      })
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })
}
function getPublishData() {
  return app.GrassApi.getFriendsSharePubList({
    params: {
      pageIndex: this.pageIndex,
      pageSize: app.Conf.PAGE_SIZE,
      related_UserId: this.options.related_userid,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data || {};
      let list = data.data || [];
      let publishData = this.data.publishData;
      publishData = publishData.concat(list);
      if (data.records == publishData.length || data.records == list.length) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
      let l_publish = this.data.l_publish;
      let r_publish = this.data.r_publish;
      let l_data = [], r_data = [];
      for (let i in list) {
        if (i % 2 == 0) {
          l_data.push(list[i]);
        } else {
          r_data.push(list[i]);
        }
      }
      if (this.pageIndex == 1) {
        l_publish = l_data;
        r_publish = r_data;
      } else {
        l_publish = l_publish.concat(l_data);
        r_publish = r_publish.concat(r_data);
      }
      this.setData({
        publishData: publishData,
        l_publish: l_publish,
        r_publish: r_publish
      })
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })
}
//关注
function opGrassRelation() {
  let grassData = this.data.grassData;
  return app.GrassApi.opGrassRelation({
    data: {
      related_userId: this.options.related_userid,
      opType: grassData.isFocuse ? 0 : 1,//1:foucse,0:canceld
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    let warn = "操作失败";
    if (e.code == 1) {
      if (e.data == 1) {
        warn = grassData.isFocuse ? '取消关注' : '已关注';
        grassData.isFocuse = !grassData.isFocuse;
        this.setData({
          grassData: grassData
        })
      }
    }
    app.SMH.showToast({
      "title": warn
    })
  })
}