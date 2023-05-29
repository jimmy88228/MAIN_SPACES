// pages/micro_mall/presale/presale_address_list.js
const app=getApp();
Page(app.BP({
  /**
   * 页面的初始数据
   */
  data: {
      address_list:[],
       sys_info: {}
  },
  req_data: {},
page: 1,
is_more: true,
is_pull_down: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       this.req_data = options
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
       this.page = 1;
       this.getInitData();
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
       this.is_more = true;
       this.page = 1;
       this.is_pull_down = true;
       this.getInitData();
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
     getInitData: function () {
          var that = this;
          var reqData = {
               page: this.page,
          }
          app.wxReq('', 'presale_getAddressList', reqData, function (info) {
               var address_list = info.data;
               var sys_info = info.system_config;
               that.setData({
                    address_list: address_list,
                    sys_info: sys_info
               });
               if (that.is_pull_down) {
                    wx.stopPullDownRefresh()
                    app.SMH.showToast({
                         title:"刷新成功！"
                    })
               }
               that.page++;
          });
     },
     addNewAddress:function(){
          var activity_id = this.req_data.activity_id;
          var product_id = this.req_data.product_id;
          var product_number = this.req_data.product_number;
          wx.navigateTo({
               url: 'presale_address_info'
          })
     },
     setDafaultAddr: function (e){
          var that = this;
          var is_default = e.currentTarget.dataset.is_default;
          var address_id = e.currentTarget.dataset.address_id;
          if (is_default == 1) {
               return;
          }
          var reqData = {
               address_id: address_id
          }
          app.wxReq('', 'presale_setDefaultAddress', reqData, function (info) {
               var address_list = that.data.address_list;
               for (var j in address_list) {
                    if (address_list[j].address_id == address_id) {
                         address_list[j].is_default = '1';
                    } else {
                         address_list[j].is_default = '0';
                    }
               }
               that.setData({
                    address_list: address_list
               })
          });
     },
     choiceAddress:function(e){
          var address_list = this.data.address_list;
          var address_index = e.currentTarget.dataset.address_index;
          var address_info = address_list[address_index];
          app.StorageH.set('pre_default_address_info', address_info);
          wx.navigateBack({
               delta: 1
          })
     },
     editAddress:function(e){
          e.currentTarget.dataset.addr_id;
     }
      
}))