// pages/store_pay/cards/select_prepaid.js
var app=getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    brand_info: app.globalData.brand_info,
    prepaid_list:[],
    no_use_prepaid:false,
    prepaid_radio_list:[],
    use_prepaid_cardId:'',
  },
     options:{},
     page:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       this.options = options;
       getPrepaidCardList.call(this);
   // this.getPrepaidList(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      brand_info: app.globalData.brand_info,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  },
  /**
   * 选择储值卡
   */
  selectCard:function(e){
    var id = e.currentTarget.dataset.id;
    
    var prepaid_radio_list = this.data.prepaid_radio_list;
    var no_use_prepaid = this.data.no_use_prepaid;

    if(typeof id != 'undefined'){//选择储值卡
      // console.log(id,"选择");
      prepaid_radio_list[id].selected = !prepaid_radio_list[id].selected;
      this.setData({
        no_use_prepaid: false,
        prepaid_radio_list: prepaid_radio_list
      })
    }else{//不选择储值卡
      // console.log(id,"不选择");
      for (var i in prepaid_radio_list){
        prepaid_radio_list[i].selected = false;
      }
      this.setData({
        prepaid_radio_list: prepaid_radio_list,
        no_use_prepaid: !no_use_prepaid
      })
    }
    

  },
  /**
   * 确定使用的储值卡
  */
  confirmUseCard:function(){
    var prepaid_list = this.data.prepaid_list;
    var prepaid_radio_list = this.data.prepaid_radio_list;
    var use_prepaids=[];
    for (var i in prepaid_list){
      if (prepaid_radio_list[i].selected){
        use_prepaids.push(prepaid_list[i]);
      }
    }
    // console.log(use_prepaids);
    app.StorageH.set('use_prepaids', use_prepaids);
    wx.navigateBack();
  }
}));
function getPrepaidCardList() {

     return app.UserApi.getPrePaidCardList({
          params: {
               pageIndex: this.page,
               pageSize: app.Conf.PAGE_SIZE,
               storeId: this.options.post_store_id,
               prepaidCards: this.options.card_ids,
               brandCode: app.Conf.BRAND_CODE,
               userToken: app.LM.userKey
          },
          other: {
               isShowLoad: true
          }
     }).then(e => {
          if (e.code == "1") {
               var data = e.data;
            
               var prepaid_radio_list = [];
               for (var i in data) {
                    prepaid_radio_list.push({
                         selected: false
                    })
               }
               this.setData({
                    prepaid_list: data,
                    prepaid_radio_list: prepaid_radio_list
               })
          }
          return Promise.reject();
     })
}