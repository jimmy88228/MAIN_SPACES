// pages/micro_mall/questionnaire/results/results.js
const app = getApp();
Page(app.BP({
  data: {

  }, 
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
  },
 
  onShow: function () {

  },
  back(){
    wx.navigateBack({
      delta:-1
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