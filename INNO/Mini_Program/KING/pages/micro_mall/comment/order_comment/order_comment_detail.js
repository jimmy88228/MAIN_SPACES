// pages/micro_mall/comment/order_comment/order_comment_detail.js
let app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    commentDetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getMyCommentDetail.call(this,this.options);
  },

  /** 
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))
function getMyCommentDetail(options = {}){
  return app.GoodsApi.getMyCommentDetail({
    params:{
      userToken:app.LM.userToken,
      orderId: options.order_id,
      goodsId: options.goods_id,
      isOnlineOrder: options.isOnlineOrder,
      brandCode: app.Conf.BRAND_CODE
    },
    other:{isShowLoad:true}
  }).then( e=>{
    if(e.code == "1"){
      let data = e.data;
      let commentImg = [];
      for(let i = 1; i <= 10; i++){
        commentImg.push({
          imgUrl: data['img' + i + '_path'] || ""
        });
      }
      this.setData({
        commentDetail: data,
        commentImg: commentImg
      })
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}