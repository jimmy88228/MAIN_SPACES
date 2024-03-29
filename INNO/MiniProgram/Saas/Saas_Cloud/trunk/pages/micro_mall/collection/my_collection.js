// pages/myCollection/my_collection.js
var app=getApp();
Page(app.BP({
  data: {
    brand_info: {},
    allInfo:{},
    collectList:[],
    delCollect:"",
    sys_config:{},
      del: "",
      showImg: true,
      isEmpty: false
  },
  page:0,
  hasMore:true,
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(){

    // this.onloadData();
    this.page = 0;
    getFavLogList.call(this);
  },
  onLoad: function (options) {
      let del = this.data.brand_info.icon_url + "micro_mall/collection/del.png";
      let collection_none = this.data.brand_info.icon_url + "micro_mall/collection/collection_none.png";
      this.setData({
          del: del,
          collection_none: collection_none,
          showImg: false
      });
  },
    onHide() {
        this.setData({
          collectList: [],
            isEmpty: false
      })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  onReachBottom(){
    if(this.hasMore){
      getFavLogList.call(this);
    }else{
      app.SMH.showToast({
        "title":"已经到底啦！"
      })
    }
  },
  /**
   * load数据
  */
  onloadData:function(){
    var that = this;
    app.wxReq("","collection_getList","",function(info){
      var list_data = info.data;
      var sys_config = info.system_config;
      that.setData({
        collectList: list_data,
        sys_config: sys_config
      })
    })
  },
  ondelCollection:function(e){
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.goods_id;
    let goods_index = dataset.goods_index;
    let log_id = dataset.logId;
    let delNum={
      goods_id: goods_id,
      goods_index: goods_index,
      log_id: log_id
    }
    this.setData({
      delCollect: delNum
    });
    
  },
  onOkAlertMsg:function(){
    let that = this;
    let collectList = this.data.collectList;
    let delCollect = this.data.delCollect;
    delFavGoodsLog.call(this, delCollect);
  },
  onCancaAlertMsg:function(){
    this.setData({
      delCollect:""
    })
  }
}))
function getFavLogList() {
  this.page = this.page + 1; 
  return app.CL_GoodsApi.getFavLogList({
    params: {
      "pageIndex": this.page,
      "pageSize": app.Conf.PAGE_SIZE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if(e.code == 1){
      let data = e.data;
      let list = data.data;
      let collectList = this.data.collectList;
      collectList = collectList.concat(list);
      if (collectList.length == data.total) {
        this.hasMore = false;
      }
      this.setData({
        allInfo: data,
        collectList: collectList
      })
        if (this.data.collectList.length == 0) {
            this.setData({
                isEmpty: true
            });
        }
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}

function delFavGoodsLog(delCollect = "") {
  let log_id = delCollect.log_id;
  let goods_index = delCollect.goods_index;
  return app.CL_GoodsApi.delFavGoodsLog({
    data: {
      "logId": log_id,
      "goodsId": 0,
      "brandCode": app.Conf.BRAND_CODE,
      "userToken": app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let collectList = this.data.collectList;
      collectList.splice(goods_index, 1);
      this.setData({
        collectList: collectList,
        delCollect: ""
      })
      app.SMH.showToast({
        "title":"删除成功"
      })
        if (this.data.collectList.length == 0) {
            this.setData({
                isEmpty: true
            });
        }
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}