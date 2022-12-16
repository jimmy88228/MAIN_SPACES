const App = getApp();
Page(App.BP({
  onShow(){
    this.init();
  },
  init(){
    this.getUserInfo();
    this.getVisitStore();
    this.getUserOrderCount();
  },
  getUserInfo(){
    return App.LM.reSetSimpleInfo().then(res=>{
      console.log('res',res)
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
  getUserOrderCount(){
    return App.Http.QT_UserApi.getUserOrderCount({
      data: { 
      },
    }).then(res=>{
      console.log('res',res)
    })
  },
}))