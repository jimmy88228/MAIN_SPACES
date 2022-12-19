// pages/micro_mall/seeding_grass/my_collection/my_collection.js
const app = getApp();
Page(app.BP({
  data: {
    collectData: [],
    l_collect: [],
    r_collect: [],
  },
  pageIndex: 1,
  hasMore: true,
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.pageIndex = 1;
    this.hasMore = true;
    getcollectData.call(this);
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
      getcollectData.call(this);
    } else {
      app.SMH.showToast({
        "title": "已经到底啦！"
      })
    }
  },
  getDetail(e){
    let dataset = e.currentTarget.dataset || {};
    let id = dataset.id;
    if (id) {
      wx.navigateTo({
        url: '/pages/micro_mall/seeding_grass/article_detail/article_detail?id=' + id,
      })
    }
  },
  removeCollect(e) {
    let dataset = e.currentTarget.dataset || {};
    let id = dataset.id;
    let type = dataset.type;
    let that = this;
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setCentent(`是否删除该收藏？`);
    this.pageDialog.setTwoBtn({
      name: "取消",
      tap: function() { that.pageDialog.dismiss(); }
    }, {
        name: "确定",
        tap: function () {
          collectReq.call(that, id, type);
          that.pageDialog.dismiss();
        }
      })
    this.pageDialog.show();
    
  },
}))
//
function getcollectData() {
  return app.GrassApi.getMyCollectPubList({
    params: {
      pageIndex: this.pageIndex,
      pageSize: app.Conf.PAGE_SIZE,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data || {};
      let list = data.data || [];
      let collectData = this.data.collectData;
      if (data.records == collectData.length || data.records == list.length) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
      setCollectData.call(this, list);
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })
}
function setCollectData(list = []){
  let l_collect = this.data.l_collect;
  let r_collect = this.data.r_collect;
  let l_data = [], r_data = [];
  for (let i in list) {
    if (i % 2 == 0) {
      l_data.push(list[i]);
    } else {
      r_data.push(list[i]);
    }
  }
  if (this.pageIndex == 1) {
    l_collect = l_data;
    r_collect = r_data;
  } else {
    l_collect = l_collect.concat(l_data);
    r_collect = r_collect.concat(r_data);
  }
  this.setData({
    collectData: list,
    l_collect: l_collect,
    r_collect: r_collect
  })
}
//
//取消收藏
function collectReq(id,type){
  if(!id){return}
  return app.GrassApi.removeCollectSharePublish({
    data: {
      "pubIds": id,
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    let warn = "操作失败";
    if(e.code == 1){
      if(e.data == 1){
        warn = "删除成功";
        let list = this.data.collectData || [];
        for (let i in list){
          if (list[i].id == id){
            list.splice(i,1);
            break;
          }
        }
        setCollectData.call(this, list);
      }
    }
    app.SMH.showToast({
      "title": warn
    })
  })
}