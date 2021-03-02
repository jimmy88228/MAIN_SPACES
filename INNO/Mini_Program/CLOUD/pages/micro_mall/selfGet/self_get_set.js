// pages/micro_mall/selfGet/self_get_set.js
const app = getApp(); 
Page(app.BP({
  data: {
    brand_info:{},
    contact:"",
    mob_phone:"",
    select_store:{
      id:0,
      key_word:""
    }
  },
  onLoad(options){
      this.options = options||{};
      let loc_f = options && options.loc_f; 
      let select_store = this.data.select_store || {};
      select_store.id = options.select_store_id || 0;
      select_store.name = options.store_name || "";
      this.setData({
          loc_f: loc_f || 0,
          select_store: select_store
      });
  },
  onShow: function () {
    this.loadInitData();
  },
  onReady(){
    let that = this;
    let showModalMsg = this.options && this.options.showModalMsg || false;
    let loc_f = this.options && this.options.loc_f || false;
    if (showModalMsg==1 || loc_f==1) {
      that.loc_checked = true;
      that.pageDialog = that.pageDialog || that.selectComponent("#pageDialog");

      that.pageDialog.setTitle("无法精准定位");
      that.pageDialog.setTouchCancel(false);
      that.pageDialog.setCentent("建议下次允许小程序定位功能，确保手机开启定位后重新尝试");
      that.pageDialog.setSingleBtn({
        name: "确认",
        tap: function () {
          that.pageDialog.dismiss(); 
        }
      });
      that.pageDialog.show();
    }
  },
  onHide(){
    this.isbindWxAddrBack = false;
  },
  onUnload(){
    this.isbindWxAddrBack = false;
  },
  loadInitData(){
    
    //再次更改门店信息，获取上次信息
    let store_data = app.StorageH.get("store_data") || {};
    if (store_data.select_store && store_data.mob_phone && !this.isbindWxAddrBack){
      this.setData({
        contact: store_data.contact,
        mob_phone: store_data.mob_phone,
        select_store: store_data.select_store || {}
      })
    }
    //选择门店列表返回
    let select_store = app.StorageH.get("select_store");
    if (select_store) {
      this.setData({
        select_store: select_store || {}
      })
    }
  },
  onInputSync(e){
      this.setData({
        [e.target.dataset.key]: e.detail.value
      });
  },
  submitStore(){
    let contact = this.data.contact;
    let mob_phone = this.data.mob_phone;
    let select_store = this.data.select_store;
    // let mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    let mobileReg = /(^\d{2,4}-\d{7,8}$)|(^\d{11}$)/;
  
    let warn = "";
    if (!contact){
      warn = "收货人不能为空!";
    } else if (!mob_phone) {
      warn = "手机号码不能为空!";
    } else if (!(mobileReg.test(mob_phone))){
      warn = "请输入正确的手机号码！";
    }else if (!select_store.id) {
      warn = "请选择取货门店!";
    }
    if(warn){
      app.SMH.showToast({
        "title": warn
      })
      return;
    }
    //清除缓存
    app.StorageH.set("select_store", "");
    //
    var store_data = {
      contact: contact,
      mob_phone: mob_phone,
      select_store: select_store
    }
    app.StorageH.set("store_data", store_data);
    app.SMH.showToast({
      "title": "选择成功"
    });
    let _timer = setTimeout(function(){
      clearTimeout(_timer);
      wx.navigateBack();
    },500)
    
  },
  getWeixinAddress(){
    var that = this;
    wx.chooseAddress({
      success(res){
        bindWxAddress.call(that, res).then(e => {
          that.isbindWxAddrBack = true;
          let store_data = app.StorageH.get("store_data") || {};
          store_data.contact = res.userName;
          store_data.mob_phone = res.telNumber;
          app.StorageH.set("store_data", store_data);
          that.setData({
            contact: res.userName,
            mob_phone: res.telNumber
          })
        });
      }
    })
  },
}))
//对接微信和接口地址
function bindWxAddress(address) {
  return app.UserApi.bindWxAddress({
    data: {
      "userName": address.userName,
      "telNumber": address.telNumber,
      "provinceName": address.provinceName,
      "cityName": address.cityName,
      "countyName": address.countyName,
      "detailInfo": address.detailInfo,
      "postalCode": address.postalCode,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      if (e.data == 1) {
        return Promise.resolve(e);
      }
      app.SMH.showToast({
        "title": e.msg || "操作失败"
      })
    }
    return Promise.reject(e);
  })
}