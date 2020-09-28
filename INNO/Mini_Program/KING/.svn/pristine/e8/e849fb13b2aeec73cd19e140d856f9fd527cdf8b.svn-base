// pages/micro_mall/sk/activity-sk/rule/rule.js
const app = getApp();
Page(app.BP({ 
  data: {

  }, 
  onLoad: function (options) {
    this.options = options;
    loadData.call(this);
  }, 
  onUnload(){
    app.globalData.ruleInfo && delete app.globalData.ruleInfo;
  }
}))
function loadData(){
  let data = app.globalData.ruleInfo;
  this.setData({
    ruleInfo: data || '',
  })
  // if(data){
  //   this.setData({
  //     ruleInfo:data,
  //   })
  // }else{
  //   let params = {
  //     activityId: this.options.activityId,
  //     brandCode: app.Conf.BRAND_CODE
  //   }
  //   let extra = {
  //     diy:true
  //   }
  //   return app.RunApi.go('SecKillApi','getActivity',params,extra).then(res=>{
  //     this.setData({
  //       ruleInfo:res.data && res.data.rules || ''
  //     })
  //   })
  // }
  // console.log('ruleInfo', this.data.ruleInfo)
}