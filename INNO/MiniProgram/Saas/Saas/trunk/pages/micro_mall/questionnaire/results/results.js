// pages/micro_mall/questionnaire/results/results.js
const app = getApp();
Page(app.BP({
  data: {},
  onLoad: function (options) {
    this.options = options;
    this.setData({
      showResult: options.showResult || 0,
    });
    if (options.showResult == 1){
      loadData.call(this);
    }else{
      this.setData({
        showPage:true
      })
    }
    // 如果投票页面设置了终止页，那这个页面是展示终止页用的。 options应该不含什么参数，但是缓存会有终止页的富文本字符串
    const terminatedOption = app.StorageH.get("terminatedOption");
    terminatedOption && this.setData({terminatedOption});
    app.StorageH.remove("terminatedOption")
  },
  back(){
    wx.switchTab({
      url: "/pages/micro_mall/index/index"
    })
  }
}))

function loadData(){
  let params = {
    voteActivityId: this.options.voteActivityId || 0,
    cookieId: "",
  }
  return app.RunApi.go("VoteApi","get_VoteResultList",params).then(res=>{
    console.log('res',res);
    this.setData({
      info:res.data || [],
      showPage:true
    })
  })
}