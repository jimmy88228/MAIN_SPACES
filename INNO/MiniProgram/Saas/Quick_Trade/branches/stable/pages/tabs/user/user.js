const App = getApp();
Page(App.BP({ 
  data:{
    userData:{},
    inited:false,
    isLogin:true,
  },
  onLoad(){
    wx.setBackgroundColor({
      backgroundColor:App.SH.pageStyleObj['main-color'],
    })
  },
  onShow(){
    this.init();
  },
  init(){
    return App.LM.loginAsync(!this.inited).ignore(()=>{
      let isLogin = App.LM.isLogin;
      this.setData({isLogin})
      if(isLogin){
        this.getUserInfo();
        this.getUserOrderCount();
        this.checkIdentity();
      }
    }) 
  },
  setUserData(data){
    this.setData({
      userData:{
        ...this.data.userData,
        ...(data||{})
      }
    });
  },
  getUserInfo(){
    return App.LM.reSetSimpleInfo().then(res=>{
      console.log('reSetSimpleInfo',res)
      if(res.code == 1){
        let data = res.data||{};
        this.setUserData(data);
      }
    })
  },
  getUserOrderCount(){
    this.showLoading();
    return App.Http.QT_UserApi.getUserOrderCount({
      data: { 
      },
    }).then(res=>{ 
      if(res.code == 1){
        let data = res.data||{};
        this.setUserData(data);
      } 
    }).finally(() => {
      this.hideLoading();
    })
  },
  checkIdentity(){
    return App.LM.checkIfStore().then(res=>{
      let storeStaffInfo = res || {};
      this.setUserData({isStaff: !!storeStaffInfo.staff_id || false, staffType: storeStaffInfo.staff_type});
      console.log('storeStaffInfo',storeStaffInfo)
    })
  },
  clickcallback(){
    this.init();
  }
}))