const App = getApp();
Page(App.BP({
  data: {
    activityInfo: {},
    countDownTime: {
      days:0,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
  },
  onLoad(options){ 
    this.options = options;
    this.init(); 
  },
  onUnload(){
    this.actRef.onHideFunc(); 
  },
  onShow(){
    this.actRef.onShowFunc();
  },
  onHide(){
    this.actRef.onHideFunc(); 
  },
  init(){ 
    wx.setBackgroundColor({
      backgroundColor:App.SH.pageStyleObj['main-color'],
    })
    this.storage = App.StorageH.get('curActivityGoods')||{};
    this.setView({ 
      actRef: { get: () => this.findView("#act") }, 
    })
    this.actRef.onLoadFunc();
  },
  save(){
    this._showModal({content:"确认要发布吗"}).then(()=>{
      this.setType('save');
      this.backAction();
    })
  },
  back(){
    this.setType('back');
    this.backAction();
  },
  setType(type){
    let data = this.storage;
    let id = this.options.id || 0;
    data[id] || (data[id] = {});
    data[id].type = type;
    App.StorageH.set('curActivityGoods',data);
  }
}))