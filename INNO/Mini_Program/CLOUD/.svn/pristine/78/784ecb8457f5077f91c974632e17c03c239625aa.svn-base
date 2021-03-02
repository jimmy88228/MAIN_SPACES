// pages/micro_mall/seeding_grass/my_publish/my_publish.js
const app = getApp();
Page(app.BP({
  data: {
    grassData:{},
    publishData:[],
    l_publish:[],
    r_publish:[],
  },
  pageIndex:1,
  hasMore:true,
  jumpJson:{
    focuse:"/pages/micro_mall/seeding_grass/my_follow/my_follow",
    fans:"/pages/micro_mall/seeding_grass/my_fans/my_fans",
    collects:"/pages/micro_mall/seeding_grass/my_collection/my_collection",
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    getUserGrass.call(this);
    getPublishData.call(this);
  },
  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
  },

  onReachBottom: function () {
    if(this.hasMore){
      this.pageIndex = this.pageIndex + 1;
      getPublishData.call(this);
    }else{
      app.SMH.showToast({
        "title":"已经到底啦！"
      })
    }
  },
  getDetail(e){
    let dataset = e.currentTarget.dataset || {};
    let id = dataset.id;
    let key = dataset.key;
    if(id){
      wx.navigateTo({
        url: '/pages/micro_mall/seeding_grass/article_detail/article_detail?id=' + id +'&isSelf=1',
      })
    } else if (key){
      let url = this.jumpJson[key];
      wx.navigateTo({
        url: url
      })
    }
  }
}))
function getUserGrass() {
  return app.GrassApi.getMyGrassCenter({
    params: {
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      this.setData({
        grassData: e.data || {}
      })
      return Promise.resolve(e);
    } else {
      return Promise.reject(e);
    }
  })
}
function getPublishData(){
  return app.GrassApi.getMySharePubList({
    params:{
      pageIndex: this.pageIndex,
      pageSize:app.Conf.PAGE_SIZE,
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == 1){
      let data = e.data || {};
      let list = data.data || [];
      let publishData = this.data.publishData;
      console.log(publishData.length);
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
//删除发布
function delPublish() {
  return app.GrassApi.delPublish({
    data: {
      "pubIds": pubInfo.pub_id,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      app.SMH.showToast({
        "title": "删除成功",
        "duration": 3000
      })
      wx.navigateBack({
        fail() {
          wx.navigateTo({
            url: '/pages/micro_mall/seeding_grass/my_publish/my_publish',
          })
        }
      })
      return;
    } else {
      app.SMH.showToast({
        "title": "操作失败"
      })
    }
  })
}