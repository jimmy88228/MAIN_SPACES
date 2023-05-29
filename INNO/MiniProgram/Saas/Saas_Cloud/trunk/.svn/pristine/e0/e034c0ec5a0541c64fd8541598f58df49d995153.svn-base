// pages/micro_mall/spread-page/spread-page.js
const app = getApp();
Page(app.BP({
  data: {

  },
  onLoad(options){
    this.options = options;
    this.init();
  },
  init(){
    return app.LM.loginAsync(true).finally(()=>{
      return this.loadData().then(actInfo=>{
        let id = actInfo.id||0;
        return activityLog.call(this,id).then(res=>{
          console.log('activityLog',res);
        });
      });
    })
  },
  loadData(){
    return getAct.call(this).then(res=>{
      if(res.code == 1){
        let actInfo = res.data||{};
        this.setData({actInfo});
        return Promise.resolve(actInfo);
      }
      return Promise.reject(res);
    }).catch(e=>{
      app.SMH.showToast({
        title:e&&e.msg||"活动未开启"
      })
      setTimeout(() => {
        this.onTap({currentTarget:{dataset:{type:"btn"}}});
      }, 3000);
      return Promise.reject(e);
    })
  },
  onTap(e){
    let dataset = this.getDataset(e);
    let type = dataset.type||"";
    if(type == 'btn'){
      wx.switchTab({
        url: '/pages/micro_mall/user/user',
      })
    }
  }
}))

function getAct(){
  return app.UserApi.getThirdPpartyChannelActivity({
    params:{
      channelKey:getBrand(this.options.brand),
      brandCode:app.Conf.BRAND_CODE
    }
  })
}

function getBrand(brand){
  return brand;
}

function activityLog(id){
  let params = {
    appletOpenId : app.LM.openId || "",
    relatedId : id || 0
  }
  return app.RunApi.go('POST','UserApi','postThirdPpartyChannelActivityLog',params)
}