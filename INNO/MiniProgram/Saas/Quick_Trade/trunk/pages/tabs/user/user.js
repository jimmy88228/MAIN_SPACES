const App = getApp();
Page(App.BP({ 
  data:{
    userData:{}, 
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
    return App.LM.loginAsync().ignore(()=>{
      let isLogin = App.LM.isLogin;
      this.setData({isLogin})
      if(isLogin){
        this.getUserInfo();
        this.getUserOrderCount();
        this.get_User_AfterSaleOrderCount();
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
    // console.log('userData',this.data.userData)
  },
  getUserInfo(){
    this.showLoading();
    return App.LM.reSetSimpleInfo().then(res=>{
      if(res.code == 1){
        let data = res.data||{};
        this.setUserData(data);
      }
      return res;
    }).finally(()=>{
      this.hideLoading();
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
  get_User_AfterSaleOrderCount(){
    this.showLoading();
    return App.Http.QT_OrderReturnApi.get_User_AfterSaleOrderCount({
      data: { 
      },
    }).then(res=>{ 
      if(res.code == 1){
        let _data = res.data||{};
        let data = {userAfterSaleSum:_data.orderSum};
        this.setUserData(data);
      } 
    }).finally(() => {
      this.hideLoading();
    })
  },
  get_Staff_AfterSaleOrderCount(){
    this.showLoading();
    return App.Http.QT_OrderReturnApi.get_Staff_AfterSaleOrderCount({
      data: { 
      },
    }).then(res=>{ 
      if(res.code == 1){
        let _data = res.data||{};
        let data = {staffAfterSaleSum:_data.orderSum};
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
      if(storeStaffInfo.staff_code){
        this.get_Staff_AfterSaleOrderCount();
      }
    })
  },
  clickcallback(){
    this.init();
  }
}))