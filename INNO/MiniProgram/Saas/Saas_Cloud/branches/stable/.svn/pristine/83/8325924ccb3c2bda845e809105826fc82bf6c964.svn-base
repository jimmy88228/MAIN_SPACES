const app = getApp();
Page(app.BP({
  data: {
    selectStore: {},
    receiveDetail: {},
    navH: 80
  },
  onLoad(options) {
    this.options = options || {};
    app.LM.loginAsync(false).finally(() => {
      if(this.data.isLogin != app.LM.isLogin){
        this.setData({
          isLogin: app.LM.isLogin 
        })
      }
    })
  },
  onReady() {
  },
  onShow() {
    this.getChooseStore();
    getExchangeDetail.call(this);
  },
  onHide() {
  },
  setNavH(e){
    let detail = e.detail || {};
    this.setData({
      navH: detail.navH + detail.statusH
    })
  },
  getLink(e, type, selectStore){
    let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
    type = type || dataset.type || "";
    selectStore = selectStore || this.data.selectStore || {};
    let url = "";
    let ops = this.options || {};
    switch(type){
      case "chooseStore":
        url = `/pages/micro_mall/selfGet/self_get_set?select_store_id=${selectStore.id || 0}&store_name=${selectStore.name || ''}&type=selectByGoods&pId=${ops.pId}`
        break;
    }
    if(url){
      wx.navigateTo({
        url: url,
      })
    }
  },
  getChooseStore(){
    let store_data = app.StorageH.get("store_data");
    if(store_data){
      let select_store = store_data.select_store || {};
      store_data.id = select_store.id;
      store_data.name = select_store.name;
    }
    this.setData({
      selectStore: store_data
    })
  },
  receiveGift(){
    let selectStore = this.data.selectStore || {};
    let that = this;
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setTitle("");
    if(!selectStore.id){
      this.pageDialog.setCentent("赠品仅支持门店自提,请先选择门店");
      this.pageDialog.setTwoBtn(
        {
          name: "返回",
          tap: ()=>{
            that.pageDialog.dismiss()
          }
        },
        {
          name: "选择门店",
          style: "color: #F04F05;",
          tap:()=>{
            that.getLink(null, "chooseStore")
            that.pageDialog.dismiss();
          }
        }
      ).show();
    } else {
      receiveOrderGift.call(this, selectStore);
    }
  },
}))
function getExchangeDetail(){
  let options = this.options || {};
  if(!options.exchangeId) return;
  return app.UserApi.getExchangeDetail({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      exchangeId: options.exchangeId
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    if(e.code == 1){
      let data = e.data || {};
      this.setData({
        receiveDetail: data || {}
      })
      return Promise.resolve(e);
    }else{
      return Promise.reject(e);
    }
  })
}
//
function receiveOrderGift(selectStore){
  let options = this.options || {};
  if(!options.activityId || !options.exchangeId) return;
  selectStore = selectStore || this.data.selectStore;
  return app.UserApi.exchangeOrderGift({
    data:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      activityId: options.activityId,
      exchangeId: options.exchangeId,
      storeId: selectStore.id,
      consignee: selectStore.contact,
      mobilePhone: selectStore.mob_phone
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    if(e.code == 1){
      let that = this;
      this.pageDialog.setCentent(["领取成功", "请尽快前往门店领取噢！"]);
      this.pageDialog.setTwoBtn(
        {
          name: "返回",
          tap: ()=>{
            that.pageDialog.dismiss()
          }
        },
        {
          name: "立即查看",
          style: "color: #F04F05;",
          tap:()=>{
            wx.redirectTo({
              url: '/pages/micro_mall/order/order_info?order_id=' + e.data,
            })
            that.pageDialog.dismiss();
          }
        }
      ).show();
      return Promise.resolve(e);
    }else{
      app.SMH.showToast({
        title: e.msg
      })
      return Promise.reject(e);
    }
  })
}