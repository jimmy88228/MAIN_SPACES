const App = getApp();
Page(App.BP({
  data:{
    userData:{},
    inited:false,
  },
  onShow(){
    this.init();
  },
  init(){
    App.LM.loginAsync(!this.inited).finally(()=>{
      this.getUserInfo();
      this.getUserOrderCount();
    })
    
    this.getVisitStore();
  },
  getUserInfo(){
    return App.LM.reSetSimpleInfo().then(res=>{
      if(res.code == 1){
        let data = res.data||{};
        this.setData({
          userData:{
            ...this.data.userData,
            ...data
          }
        });
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
        this.setData({
          userData:{
            ...this.data.userData,
            ...data
          }
        });
      } 
    })
  },
  getVisitStore(){
    return App.Http.QT_UserApi.getVisitStore({
      data: { 
      },
    }).then(res=>{
      console.log('res',res)
    })
  },
}))