const App = getApp();
Page(App.BP({
  data: {
    storeData: {}
  },
  onLoad(query) {
    this.pageQuery = query;
    let {
      consignee,
      mobilePhone,
      storeName
    } = query;
    this.setData({
      store_data: {
        consignee,
        mobilePhone,
        storeName
      }
    })
  },
  onInputSync(e) {
    this.setData({
      [`store_data.${e.target.dataset.key}`]: e.detail.value
    });
    console.log("store_data", this.data.store_data)
  },

  submitStore(){ 
    let store_data = this.data.store_data;
    let mobileReg = /(^\d{2,4}-\d{7,8}$)|(^\d{11}$)/;
    let warn = "";
    if (!store_data.consignee){
      warn = "收货人不能为空!";
    } else if (!store_data.mobilePhone) {
      warn = "手机号码不能为空!";
    } else if (!(mobileReg.test(store_data.mobilePhone))){
      warn = "请输入正确的手机号码！";
    }
    if(warn){
      App.SMH.showToast({
        "title": warn
      })
      return;
    }
    App.StorageH.set("store_data", store_data);
    App.SMH.showToast({
      "title": "选择成功"
    });
    let _timer = setTimeout(function(){
      clearTimeout(_timer);
      wx.navigateBack();
    },500)
    
  },
}))