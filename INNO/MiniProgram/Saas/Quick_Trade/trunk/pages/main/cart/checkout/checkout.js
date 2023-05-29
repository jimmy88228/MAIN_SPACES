import WxApi from "../../../../common/utils/wxapi/index";
const App = getApp();
Page(App.BP({
  data: {
    paymentList: [], // 支付方式列表
    remark: "", // 备注
    checkoutData: {
      activityProductId: 0, // 活动条码ID
      goodsNumber: 1, // 购买数量
      shippingWay: 1, // 配送方式, // 0快递配送, // 1店铺自提
      addressId: 0, // 地址ID, // 快递配送时有效
      consignee: "", // 店铺自提时的收货人
      mobile: "", // 店铺自提时的联 系电话
      customShareCode: "", // 代客下单的目标会员shareCode
      paymentId: 0, // 支付方式ID
    },

    storeStaffInfo: {}, // 店员信息(如果该会员是店员才有, 默认{})
    valetInfo: {}, // 代客下单

    cartList: [], // 商品列表
    orderInfo: {}, // 订单信息
    shippingInfo: {}, // 快递信息
  },

  onLoad(query) {
    this.pageQuery = query;
    this.setData({
      storeStaffInfo: App.LM.storeInfo
    });
    this.setView({
      ValetModuleRef:{get:()=>this.findView('#ValetModule')}
    })
    initCheckoutData.call(this);
  },

  onShow() {
    if (this.userIsNavigatedToChooseAddress && App.StorageH.get("userChoiceData")) {
      let userChoiceData = App.StorageH.get("userChoiceData") || {};
      let selectAddr = userChoiceData.selectAddr || {};
      if (selectAddr.address_id) this.setData({"checkoutData.addressId": selectAddr.address_id});
      App.StorageH.remove("userChoiceData");
      this.userIsNavigatedToChooseAddress = 0;
    } else if (this.userIsNavigatedToChooseStore && App.StorageH.get("store_data")) {
      let store_data = App.StorageH.get("store_data") || {};
      let {consignee, mobilePhone: mobile} = store_data;
      this.setData({
        'checkoutData.consignee': consignee || "自提会员",
        'checkoutData.mobile': mobile || ""
      });
      App.StorageH.remove("store_data");
      this.userIsNavigatedToChooseStore = 0;
    }
    initCheckoutData.call(this)
      .then(() => this.checkout())
  },
  handleValetRadioTap() {
    this.ValetModuleRef.changeValet();
  },
  getvaletinfo(e){
    const valetInfo = e.detail || {};
    this.setData({
      'checkoutData.customShareCode': valetInfo.shareCode || "",
      'checkoutData.addressId': 0,
      'checkoutData.consignee': valetInfo.realName || "自提会员",
      'checkoutData.mobile': valetInfo.mobilePhone || "",
      valetInfo
    })
    this.checkout();
  },
  handleShippingWayRadioChange(e) {
    let shippingWay = e.detail.value || 1;
    if (shippingWay === this.data.checkoutData.shippingWay) return;
    this.setData({'checkoutData.shippingWay': Number(shippingWay)}, () => this.checkout())
  },

  handleDeliveryAddressTap() {
    this.userIsNavigatedToChooseAddress = 1;
    if (this.data.checkoutData.customShareCode) { // 是代客下单
      let valetInfo = this.data.valetInfo || {};
      WxApi.navigateTo({url: `/pages/main/address/address-list/index?userToken=${valetInfo.userToken}`})
    } else {
      WxApi.navigateTo({url: "/pages/main/address/address-list/index"})
    }
  },

  handleRemarkInput(e) {
    const value = e.detail.value || "";
    this.setData({
      remark: value
    })
  },

  handleStoreTap() {
    let {consignee, mobilePhone, storeName} = this.data.shippingInfo;
    this.userIsNavigatedToChooseStore = 1;
    WxApi.navigateTo({url: `/pages/main/address/self-get/index?consignee=${consignee}&mobilePhone=${mobilePhone}&storeName=${storeName}`})
  },

  checkout() {
    this.showLoading();
    return App.Http.QT_BuyApi.checkout({
      data: this.data.checkoutData
    })
      .then(res => {
        if (res.code == 1) {
          return res.data || {}
        }
        return Promise.reject(res.msg || "结算异常")
      })
      .then(data => {
        const {cartList, orderInfo, shippingInfo} = data;
        let {isStore: shippingWay, addressId = 0, consignee = "", mobilePhone = ""} = shippingInfo || {};
        if (shippingWay === 0) { // 快递配送
          this.setData({'checkoutData.addressId': addressId})
        } else { // 门店自提
          this.setData({
            'checkoutData.consignee': consignee,
            'checkoutData.mobile': mobilePhone,
          })
        }
        this.setData({cartList,orderInfo, shippingInfo})
      })
      .catch(err => {
        WxApi.showModal({
          title: "温馨提示",
          content: err,
          showCancel: false
        })
          .then(() => {
            WxApi.navigateBack({delta: 1})
          })
      })
      .finally(() => {
        this.hideLoading();
      })
  },

  validate() {
    let {shippingWay, addressId, consignee, mobile} = this.data.checkoutData;
    if (shippingWay === 0 && addressId == 0) return "请选择收货地址";
    else if (shippingWay === 1 && !consignee) return "请输入联系人";
    else if (shippingWay === 1 && !mobile) return "请输入手机号码";
    return "" 
  },

  handleTakeOrderBtnTap() {
    let validateError = this.validate();
    if (validateError) {
      App.SMH.showToast({title: validateError});
      return 
    }
    let key = this._throttleApi('handleTakeOrderBtnTap');
    return addOrderRequest.call(this)
      .then(data => {
        WxApi.redirectTo({url: `/${App.Conf.navConfig.ORDER_DETAIL}?order_id=${data.orderId}&first_time_topay=1`})
        return data;
      }).finally(()=>{
        this._throttleApi('handleTakeOrderBtnTap','release',key);
      })
  },
}))

function initCheckoutData() {
  if (this.initCheckoutDataH) return this.initCheckoutDataH;
  return this.initCheckoutDataH = Promise.all([getPaymentList(), ])
    .then(resArr => {
      let [getPaymentListResult = {}, ] = resArr;
      const {paymentList, paymentId} = getPaymentListResult;
      this.setData({
        paymentList,
        'checkoutData.activityProductId': Number(this.pageQuery.activity_product_id) || 0,
        'checkoutData.goodsNumber': Number(this.pageQuery.goods_number) || 1,
        'checkoutData.shippingWay': Number(this.pageQuery.shippingWay) || 0,
        'checkoutData.paymentId': paymentId,
        'checkoutData.consignee': App.LM.userInfo.realName || "自提会员",
        'checkoutData.mobile': App.LM.userInfo.mobilePhone || "",
      })
    })
}

function getPaymentList() {
  return App.Http.UserApi.getPaymentList({
    params: {
      brandCode: App.Conf.BRAND_CODE
    }
  }).then(res => {
    if (res.code == 1) {
      let paymentList = res.data || [];
      let curPaymentId = 0;
      for(let i = 0,len=paymentList.length;i<len;i++){
        if(paymentList[i].pay_code == 'wxpay'){
          curPaymentId = paymentList[i].pay_id;
          break;
        }
      }
      return {paymentList, paymentId: curPaymentId};
    }
  })
}

function addOrderRequest() {
  let {shippingInfo, checkoutData, remark} = this.data;
  let addOrderData = {
    activityProductId: Number(this.pageQuery.activity_product_id) || 0,
    goodsNumber: Number(this.pageQuery.goods_number) || 1,
    shippingWay: shippingInfo.isStore ? 1 : 0,
    addressId: shippingInfo.isStore ? 0 : shippingInfo.addressId,
    consignee: shippingInfo.isStore ? shippingInfo.consignee : "",
    mobile: shippingInfo.isStore ? shippingInfo.mobilePhone : "",
    customShareCode: checkoutData.customShareCode || "",
    paymentId: checkoutData.paymentId,
    clientSessionId: "",
    remark
  }
  this.showLoading();
  return App.Http.QT_BuyApi.addOrder({
    data: addOrderData
  })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res)
    })
    .finally(() => {this.hideLoading();})
}