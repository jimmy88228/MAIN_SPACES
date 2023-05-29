const App = getApp();
Page(App.BP({
  data: { 
  },
  onLoad(){ 
    this.init();
  },
  onShow(){
    this.actRef.onShowFunc();
  },
  onHide(){
    this.actRef.onHideFunc(); 
  },
  onUnload(){
    this.actRef.onHideFunc(); 
  }, 
  init(){ 
    wx.setBackgroundColor({
      backgroundColor:App.SH.pageStyleObj['main-color'],
    })
    this.setView({ 
      actRef: { get: () => this.findView("#act") }, 
    })
    this.actRef.onLoadFunc();
  },
  onShareAppMessage(){},
}))