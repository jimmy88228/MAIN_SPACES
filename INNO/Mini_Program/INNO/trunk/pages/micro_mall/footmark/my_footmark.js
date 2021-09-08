// pages/micro_mall/footmark/my_footmark.js
import MyDate from '../../../common/support/utils/date-util.js';
var app=getApp();
Page(app.BP({
  data: {
    brand_info: app.globalData.brand_info,
    date_list:[],
    goods_list:[],
    sys_config:{}
  },
  page:0,
  hasMore:true,
  onLoad: function (options) {},
  onShow(){
    // addGoodsVisitLog.call(this);
    this.page = 0;
    this.hasMore = true;
    getGoodsVisitLogList.call(this);
  },
  onReady: function () {
    
  },
  onReachBottom(){
    if(this.hasMore){
      getGoodsVisitLogList.call(this)
    }else{
      app.SMH.showToast({
        "title":"已经到底啦！"
      })
    }
  },
  onShareAppMessage: function () {
  
  },
  /**
   * 删除
  */
  delGood:function(e){
    var that = this;
    var dataset = e.currentTarget.dataset;
    var goods_id = dataset.goods_id;
    var v_id = dataset.v_id;

    //goods_id 和 v_id都为0时，清空(暂时没有清空功能)；
    if ( goods_id == 0 && v_id == 0 ){
      return;
    }
    wx.showModal({
      title: '',
      content: '是否删除该浏览商品？',
      success: function (res) {
        if (res.confirm) {
          var reqData={
            goods_id: goods_id,
            v_id: v_id
          }
          //
          // that.installData("goods_removeGoodsVisitLog",reqData);

        } else if (res.cancel) {
          
        }
      }
    })
  },
  /**
   * 下拉刷新
  */
  onPullDownRefresh:function(){
    this.page = 0;
    getGoodsVisitLogList.call(this);
  }
  /**
   * 
  */
}))
function getGoodsVisitLogList() {
  this.page = this.page + 1;
  return app.GoodsApi.getGoodsVisitLogList({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      pageIndex: this.page,
      pageSize: app.Conf.PAGE_SIZE,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      let list = data.data;
      let dates = new Set();
      let goods_list = [];
      let goods_data = this.data.goods_data;
      let goods_data_list = {};
      if(this.page == 1){
        goods_data = list;
      }else{
        goods_data = goods_data.concat(list);
      }
      if (data.total == goods_data.length){
        this.hasMore = false;
      }
      let j = -1;
      for (let i in goods_data) {
        let time = goods_data[i].v_time;
        let time_arr = time.split(" ");
        let date_arr = time_arr[0] ? time_arr[0].split("-") : [];
        let time_str = date_arr.join("/");
        let d_time = MyDate.format(new Date(time_str),"yyyy-MM-dd");
        if (!(dates.has(d_time))) {
          j++;
          goods_list[j] = [];
        }
        goods_list[j].push(goods_data[i]);
        dates.add(d_time);
      }
      let date_list = [...dates];
      this.setData({
        date_list: date_list,
        goods_list: goods_list,
        goods_data: goods_data
      })
      wx.stopPullDownRefresh();
    }
  })
}