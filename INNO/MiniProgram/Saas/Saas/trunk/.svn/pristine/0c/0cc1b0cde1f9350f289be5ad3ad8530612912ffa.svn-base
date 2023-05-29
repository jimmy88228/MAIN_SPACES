// pages/micro_mall/user_info/logout/logout.js
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
const app = getApp();
Page(app.BP({ 
  data: {

  }, 
  onLoad() {
    this.loadData();
  },  
  loadData(){
    let userInfo = app.LM.userInfo || {};
    console.log('userInfo',userInfo)
    this.setData({
      userInfo
    })
  },
  logout(){
    this._throttle('logout'); 
    this._showModal({content:"确认注销账号吗"}).then(()=>{
      this._throttleApi('postResetUserToErp');
      return postResetUserToErp().then(res=>{
        app.StorageH.clear();
        app.LM.logout('all');
        setTimeout(() => { 
          wx.reLaunch({
            url: '/pages/micro_mall/user/user',
          })
        }, 1500);
        return res;
      }).finally(()=>{
        setTimeout(() => {
          this._throttleApi('postResetUserToErp','release','pages/micro_mall/user_info/logout/logout');
        }, 1500);
      })
    })
  },
}))  

function postResetUserToErp(){
  return app.UserApi.postResetUserToErp({
    data:{
      "userToken": app.LM.userToken,
      "brandCode": app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      app.SMH.showToast({title:"注销完成,正在返回菜单"})
      return res;
    }
    return Promise.reject(res); 
  }).catch(e=>{
    app.SMH.showToast({title:e.msg||"注销失败,请稍后再试"})
    return Promise.reject(e);
  })
}