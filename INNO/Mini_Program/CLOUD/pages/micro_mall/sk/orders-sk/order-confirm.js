// pages/micro_mall/sk/orders-sk/order-confirm.js
const app = getApp();
Page(app.BP({
  data: {
    ac_conf: app.Conf.style.n_sk_color,
    storeId:0,
    store_data:{},
  }, 
  reqData:{},
  onLoad: function (options) {
    let brand_info = this.data.brand_info;
    let sk_address = brand_info.icon_url + "micro_mall/sec_kill/sk_address.png";
    let rightbutton = brand_info.icon_url + "micro_mall/rightbutton.png";
    this.setData({
      isLogin:app.LM.isLogin,
      rightbutton,
      sk_address
    })
  },  
  onShow: function () {
    checkCoupon.call(this);
    getPayInfos.call(this);
  }, 
  onHide: function () {

  }, 
  onUnload: function () {
    app.StorageH.remove("userChoiceData");
  },   
  buy(){
    let akId = this.options.akId;
    if (!akId || this.isLoading) return
    let userAddressId = this.userAddressId || (this.data.orderInfo.userAddress && this.data.orderInfo.userAddress.userAddressId) || 0
    if (this.data.shippingType == 2 && !userAddressId) {
      app.SMH.showToast({
        title: "请选择地址"
      })
      return;
    }
    let store_data = this.data.store_data||{};
    if (this.data.shippingType == 1 && (!store_data.contact || !store_data.mob_phone)){
      app.SMH.showToast({
        title: "请填写收货人信息"
      })
      return;
    }
    addOrder.call(this).then(res=>{
      wx.redirectTo({
        url: `/pages/micro_mall/sk/orders-sk/order-status?order_id=${this.orderId}&first=${1}&type=订单详情`,
      })
    }).catch(e=>{
      app.SMH.showToast({
        title:e.msg||"订单异常"
      })
    }); 
  },
  jump(e){
    let dataset = e.currentTarget.dataset || {};
    let type = dataset.type || '';
    if (type =='adr'){
      wx.navigateTo({
        url: '/pages/micro_mall/address/address_list',
      })
    }else if(type=='selfGet'){
      let orderInfo = this.data.orderInfo||{};
      let storeInfo = orderInfo.storeInfo || {};
      wx.navigateTo({
        url: `/pages/micro_mall/selfGet/self_get_set?loc_f=${0}&showModalMsg=${0}&recIds=${0}&select_store_id=${storeInfo.storeId}&store_name=${storeInfo.storeName}`,
      })
    }
  },
  onTap(e){
    let dataset = e.currentTarget.dataset||{};
    let type=  dataset.type||"";
    if(type=="couponClick"){
      let storeInfo = this.data.orderInfo.storeInfo || {};    
      let couponOption = {
        shippingType: this.data.shippingType||2, 
        storeId: storeInfo.storeId||0,  
        userAddressId : this.userAddressId || (this.data.orderInfo.userAddress && this.data.orderInfo.userAddress.userAddressId) || 0,
        akId : this.options.akId||0,

      }
      console.log('couponOptioncouponOption',couponOption)
      couponOption = JSON.stringify(couponOption);
      let url = '/pages/micro_mall/sk/orders-sk/order-coupon/order-coupon?couponOption=' + couponOption;
      wx.navigateTo({
        url: url,
      })
    }
  }
}))


function getPayInfos() {
  let akId = this.options.akId;
  let shippingType = this.options.shippingType||2;
  let storeId = this.options.storeId||0;
  let consignee = "";
  let mobile = ""; 
  let userAddressId =  0;
  let store_data = {};
  let bonusId = this.reqData.bonusId || 0;
  if (shippingType == 1 && (storeId && storeId!=0)){
    store_data = app.StorageH.get('store_data') || {};
    consignee = store_data.contact;
    mobile = store_data.mob_phone; 
  }else{
    let userChoiceData = app.StorageH.get('userChoiceData') || {};
    let selectAddr = userChoiceData.selectAddr || {};
    userAddressId = selectAddr.address_id || 0;
  }
  this.setData({
    shippingType,
    storeId,
    store_data,
  })
  this.userAddressId = userAddressId;
  let params = {
    akId,
    userAddressId,
    shippingType,
    storeId,
    consignee,
    mobile,
    bonusId,
  }; 
  console.log('开始调接口',this.reqData.bonusId)
  return app.RunApi.go('SecKillApi', 'getPayInfos', params).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      let orderInfo = data;
      orderInfo.orderExpireSpanTrans = parseInt(60 * parseFloat(orderInfo.orderExpireSpan));
      // orderInfo.orderExpireSpanTrans = orderInfo.orderExpireSpan;
      this.setData({
        orderInfo
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e => {
    console.log('catch', e)
    app.SMH.showToast({
      title:e && e.msg || "订单异常"
    })
    return Promise.reject(e);
  }).finally(()=>{
    this.setData({
      showPage:true
    })
  })
}


function addOrder() {
  let akId = this.options.akId;
  let userAddressId = this.userAddressId || (this.data.orderInfo.userAddress && this.data.orderInfo.userAddress.userAddressId) || 0;
  let store_data = this.data.store_data||{};
  let storeInfo = this.data.orderInfo.storeInfo || {};
  let shippingType = store_data.shippingType||2; 
  this.isLoading = true;
  let params = {
    akId,
    userAddressId,
    shippingType: this.data.shippingType||2,
    consignee: store_data.contact||"",
    mobile: store_data.mob_phone||"",
    storeId: storeInfo.storeId||0,
    bonusId : this.reqData && this.reqData.bonusId || "",
    clientSessionId: app.LgMg.channel &&  app.LgMg.channel.clientSessionId || '',
  }
  // console.log('生成订单', params);
  return app.RunApi.go('post', 'SecKillApi', 'addOrder', params).then(res => {
    if (res.code == '1') {
      this.orderId = res.data.orderId || 0;
      // console.log('生成订单成功', this.orderId,res);
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e => {
    console.log('catch', e)
    return Promise.reject(e);
  }).finally(()=>{
    this.isLoading = false;
  })
}

function checkCoupon(){
  let bonusId = "";
  let userChoiceData = app.StorageH.get('userChoiceData') || {};
  let couponList = userChoiceData.use_coupon||[];
  if (couponList && couponList.length > 0) {
    for (let i = 0; i < couponList.length; i++) {
      if (couponList[i].bonus_id) {
        bonusId = bonusId ? bonusId + "," + couponList[i].bonus_id : couponList[i].bonus_id
      }
    }
  }
  this.reqData.bonusId = bonusId;
  console.log('赋值',this.reqData.bonusId)
  this.setData({
    couponList:couponList||[],
  })
}