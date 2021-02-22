// pages/micro_mall/collageGroup/my_collage.js
var app = getApp();
Page(app.BP({
  /**
   * 页面的初始数据
   */
  data: {
    collage_status: ['全部','待成团','拼团成功','已失效'],
    select_status_t: 0,
    status_t_left: "12.5%",
    myCollage:[],
      jumpType: "custom"
  },
  page: 1,
  is_more:true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tababr = this.selectComponent("#custom_tabbar");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
       this.iniTabbar(this.data.brand_info);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.getMyCollage(this.data.select_status_t);
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
    if (this.is_more) {
      var select_status_t = this.data.select_status_t;
      this.page ++;
      this.getMyCollage(select_status_t);
    }else{
      app.SMH.showToast({
        title: "已经到底啦！"
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
      
  // },
  changestatus(e){
    var index = e.currentTarget.dataset.index;
    var status_t_left = (parseInt(index * 25) + 12.5)+ "%";
    this.setData({
      select_status_t: index,
      status_t_left: status_t_left
    })
    //加载所需数据
    this.is_more = true;
       this.page = 1;
    this.getMyCollage(index);
  },
  getMyCollage(status = 0){

       getUserCollageGroupOrderList.call(this, status);return;
  },
  getOrderInfo(e){
    var order_id = e.currentTarget.dataset.order_id;
    if(!order_id) return false;
    wx.navigateTo({
      url: '../order/order_info?order_id='+ order_id,
    })
  },
  getCollageInfo(e){
    var activity_id = e.currentTarget.dataset.activity_id;
    var user_activity_id = e.currentTarget.dataset.user_activity_id;
    var captain_id = e.currentTarget.dataset.captain_id;
    wx.navigateTo({
      url: 'my_collage_detail?activity_id='+ activity_id +'&user_activity_id='+ user_activity_id +'&captain_id='+ captain_id,
    })
  },
  iniTabbar(brand_info) {
    this.tababr.setTabbar([
      {
        "pagePath": "pages/micro_mall/collageGroup/activity_list",
        "text": "拼团首页",
        "iconPath": brand_info.icon_url + "micro_mall/tabbar/collage/Home.png",
        "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/collage/getHome.png",
        "is_this_page": false,
        "select_color": brand_info.style.font_color,
        "is_original_tab": false
      },
      {
        "pagePath": "pages/micro_mall/collageGroup/my_collage",
        "text": "我的团",
        "iconPath": brand_info.icon_url + "micro_mall/tabbar/collage/myCollage.png",
        "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/collage/getMyCollage.png",
        "is_this_page": true,
        "select_color": brand_info.style.font_color,
        "is_original_tab": false,
        "need_login": true,
      }
    ]);
  }
}))
function getUserCollageGroupOrderList(status){
     return app.CollageApi.getUserCollageGroupOrderList({
          params: {
               status: status||0,
               pageIndex: this.page,
               pageSize: app.Conf.PAGE_SIZE,
          },
          other: {
               isShowLoad: true
          }
     }).then(e => {
          if (e.code == "1") {
               var data = e.data;
               if (data.length < app.Conf.PAGE_SIZE ) {
                    this.is_more = false;
               }
               var myCollage = this.data.myCollage;
               if (this.page == 1) {
                    myCollage = data;
               } else {
                    myCollage = myCollage.concat(data);
               }
               this.setData({
                    myCollage: myCollage
               });

               return Promise.resolve(e);
          }
          return Promise.reject(e);
     })

}