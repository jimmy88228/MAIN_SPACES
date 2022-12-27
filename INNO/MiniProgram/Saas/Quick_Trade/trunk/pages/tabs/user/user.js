const App = getApp();
Page(App.BP({ 
  data:{
    userData:{},
    inited:false,
    isLogin:false
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
      if(res.code == 1){
        let data = res.data||{};
        this.setUserData(data);
      }
    })
  },
  getUserOrderCount(){
    return App.Http.QT_UserApi.getUserOrderCount({
      data: { 
      },
    }).then(res=>{ 
      if(res.code == 1){
        let data = res.data||{};
        this.setUserData(data);
      } 
    })
  },
  checkIdentity(){
    return App.LM.checkIfStore().then(res=>{
      let storeStaffInfo = res || {};
      this.setUserData({isStaff: !!storeStaffInfo.staff_id || false});
      console.log('storeStaffInfo',storeStaffInfo)
    })
  },
  clickcallback(){
    this.setData({isLogin:App.LM.isLogin})
  }
}))