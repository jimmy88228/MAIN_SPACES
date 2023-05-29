// pages/micro_mall/inviteAward/extraPage/friMore.js
const app = getApp();
Page(app.BP({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options||{};
    let buyAc = this.data.brand_info.default_icon_url + "inviteAward/buyAc.png";
    let buy = this.data.brand_info.default_icon_url + "inviteAward/buy.png";
    let invite = this.data.brand_info.default_icon_url + "inviteAward/invite.png";
    let inviteAc = this.data.brand_info.default_icon_url + "inviteAward/inviteAc.png";
    this.setData({
      acShare, buyAc, buy, down, friHead, invite, inviteAc
    })
    loadData.call(this);
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

function loadData(){
  let _params =  { url: "getInviteUserRecord", params: { activityId: this.options.id||0, pageIndex: 1, pageSize: app.Conf.PAGE_SIZE,brandCode: app.Conf.BRAND_CODE,userToken: app.LM.userKey} };
  return setApi(_params).then(res=>{
    console.log(res);
    if(res.code == '1'){
      let friData = res.data||{};
      this.setData({
        friData
      })
    }
  });
}



function setApi(data = {}) {
  let { api = "UserApi", url = "", params, extra = {} } = data;
  return app.RunApi.go(api, url, params, extra).catch(e => {
    return Promise.resolve(e);
  });
}