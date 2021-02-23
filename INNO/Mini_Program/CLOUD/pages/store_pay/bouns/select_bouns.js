// pages/micro_mall/buy/buy_coupon.js
const app = getApp();
Page(app.BP({
  data: {
    coupon_list:[],
    no_use_bonus:false,
    use_bonus:"",
  },  
  page:1,
  options:{},
  onLoad: function (options) {
       this.options = options;
       getBonusList.call(this);
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
  onReachBottom: function (e) {

  },
  onShareAppMessage: function () {

  },
  onShowUseLimit:function(e){
    let id = e.currentTarget.dataset.id;
    let coupon_list = this.data.coupon_list;
    for (let i in coupon_list ){
      if (i == id){
        coupon_list[i].showLimit = !coupon_list[i].showLimit;
      }else{
        coupon_list[i].showLimit=false;
      }
    }
    this.setData({
      coupon_list: coupon_list
    });
    
    
  },
  noUseCoupon:function(){
    if (this.isLoading) { return };
    this.isLoading = true;
    let no_use_bonus = this.data.no_use_bonus;
    this.setData({
      no_use_bonus: !no_use_bonus,
      use_bonus:{}
    })
    //删除缓存数据
    let userChoiceData = app.StorageH.get("userChoiceData") || {};
    delete userChoiceData.use_coupon;
    app.StorageH.set('userChoiceData', userChoiceData); 
    wx.showLoading();
    let _timer =setTimeout(function () {
      clearTimeout(_timer);
      wx.navigateBack();
    }, 500);
  },
  useCoupon:function(e){
    if (this.isLoading){return};
    this.isLoading = true;
    let bonus_id = e.currentTarget.dataset.bonus_id;
    let coupon_list = this.data.coupon_list;
    for (let i in coupon_list){
      if (coupon_list[i].bonus_id == bonus_id){
        let use_bonus=coupon_list[i];
        this.setData({
          use_bonus: use_bonus
        })
        use_bonus = use_bonus;
        let userChoiceData = app.StorageH.get("userChoiceData") || {};
        userChoiceData.use_coupon = use_bonus
        app.StorageH.set('userChoiceData', userChoiceData);
        wx.showLoading(); 
        let _timer = setTimeout(function () {
          clearTimeout(_timer);
          wx.hideLoading();
          wx.navigateBack();
        }, 500);
        return 
      }
      
    }
  }
}));
function getBonusList(){
     return app.SmktPayApi.getOfflineCouponusList({
          params: {
               pageIndex: this.page,
               pageSize: app.Conf.PAGE_SIZE,
               bonusIds: this.options.bonus_ids
          },
          other: {
               isShowLoad: true
          }
     }).then(e => {
          if (e.code == "1") {
               let data = e.data;
               for (let i in data) {
                    data[i].showLimit = false;
                    data[i].type_money = parseFloat(data[i].type_money);
               }
              let userChoiceData = app.StorageH.get("userChoiceData") || {};
               this.setData({
                    coupon_list: data,
                    use_bonus: userChoiceData.use_coupon || {}
               })
          }
          return Promise.reject();
     })
}