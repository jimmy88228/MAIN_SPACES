// pages/micro_mall/buy/buy.js
// import WxApi from "../../../common/support/tools/wx-api-promise.js"
import LgMg from "../../../common/manager/log-manager";
import StrH from "../../../common/support/utils/string-util"
import MyDate from '../../../common/support/utils/date-util.js';
import wxSubscribe from "../../../common/helper/handle/wxSubscribe";
let app = getApp();
const ValetSmsType = {
  'asset':0,
  'pay':1
}
Page(app.BP({
  data: {
    promAssistH: 0, // 凑单助手弹窗高度
    brand_info: {},
    //商品列表
    cartList: [],
    //优惠券
    couponData: {},
    //现金券
    canUseCashCoupon: false,
    cashCouponData: {
      error: "",
      useCashCoupon: [],
      useCashCouponIds: "",
    },
    cashCoupon_input: "",
    //余额使用
    use_balance: false,
    //积分使用
    use_integral: false,
    integralData: {},
    integral_deduct: 0.00,
    //促销优惠
    promoteList: [], //拥有的促销优惠
    isUsePromote: 1,
    // use_condition_ids: "",
    //全场促销
    secPromoteList: [],
    isUseSecPromote: 0,
    //
    orderInfo: {},
    //使用储值卡
    use_prepaid: false,
    prepaidData: {},
    //验证
    // validate_data: {},
    //地址信息
    // address_data: {},
    //支付方式
    // pay_mode: {},
    //备注信息
    font_num: 0,
    remarks_val: '',
    show_remarks_val: true,
    remarks_focus: false,
    remarks_h: 0,
    /**/
    user_recharge: 0,
    is_user_recharge: 0,
    /**
     * 配送方式
     */
    shipping: {
      way_id: 0, //2 快递 OR 1 自提 
      contact: "",
      mob_phone: "",
      store_id: 0,
      store_name: "",
    },
    shippingInfo: {},
    filter: false,
    identityNumber: '',
    identityName: '',
    marskValue: false,
    valetConf:{}, 
    isUseRedpack: 0, 
    chooseDiscountGoods: [],
  },
  subConfig: {
    type: 'ORDER',
    label: 'BUY'
  },
  // redpackInfo:{
  //   use: 0
  // },
  // isUseRedpack: 0,
  storesForAOpen: false,
  onLoad: function (options) {
    this.options = options;
    let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
    let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
    let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
    let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let checkPng = this.data.brand_info.icon_url + "micro_mall/check.png";
    this.setData({
      rightbutton: rightbutton,
      return_img: return_img,
      return_active: return_active,
      server_close: server_close,
      checkPng: checkPng,
      options: options,
      "shippingInfo.isStore": (options.store_id && options.store_id != 0) ? 1 : 0,
    })
    initParam.call(this, false);
    loadPayMode.call(this);
    this.initConf();
  },
  onUnload() {
    // app.EB.unListen('storesForA', this.storesForAId);
    // clearTimeout(this.checkTimeOutLocation);
    // clearTimeout(this.checkTimeOutLock);
    app.StorageH.remove("userChoiceData");
    app.StorageH.remove("select_store");
    app.StorageH.remove("store_data");
    //
    backPageStatus.call(this);
  },
  onHide() {
    this.jumpAlready = true;
    // resetLoading.call(this);
    // app.EB.unListen('storesForA', this.storesForAId);
    // clearTimeout(this.checkTimeOutLocation);
    // clearTimeout(this.checkTimeOutLock);
  },
  onShow: function () {
    this.jumpAlready = false;
    if (this.reqData.recIds) {
      this.getCheckOut();
    } else {
      app.SMH.showToast({
        "title": "非法购物车"
      })
    }
  },
  recoverReqData(){
    this.assignData(this._lastReturnData,'');
    setTimeout(() => {
      this.getCheckOut('',true);
    }, 800);
  },
  getCheckOut: function (type,isRecover) { //增加type类型，判断用户操作优惠类型
    let storeData = app.StorageH.get('store_data') || {};
    let userChoiceData = app.StorageH.get('userChoiceData') || {};
    let use_integral = this.data.use_integral;
    let use_balance = this.data.use_balance;
    let use_prepaid = this.data.use_prepaid;
    //设置请求参数
    this.reqData.isUseSurplus = use_balance ? 1 : 0;
    this.reqData.isUseOfflineSurplus = use_prepaid ? 1 : 0;
    this.reqData.isUseIntegral = use_integral ? 1 : 0;
    this.reqData.isUseRedpack = this.data.isUseRedpack;
    this.reqData.discountBuyGoods = this.data.chooseDiscountGoods.map(item=>({
      activityProductId:item.activityProductId||0,
      number:item.number||0
    }))||[]; 
    type != "valet" && initReqShippingInfo.call(this, storeData, userChoiceData);
    initReqBonus.call(this, userChoiceData.use_coupon);
    console.log('reqData:', JSON.parse(JSON.stringify(this.reqData)))
    this.checkingOut = true;
    //结算数据
    return app.CL_BuyApi.checkout({
      data: this.reqData,
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == "1") {
        let data = e.data;
        this.assignData(data, type);
        return Promise.resolve(e);
      } else if(e.code == 0){ // 可返回数据 异常
        this.assignData(data, type);
        app.SMH.showToast({
          title: e.msg,
          duration:3000,
        })
        return Promise.resolve(e);
      }else{
        app.SMH.showToast({
          title: e.msg,
          duration:3000,
        })
        !isRecover && this.recoverReqData();
      }
      return Promise.reject();
    }).finally(() => {
      this.checkingOut = false
    })
  },
  /**
   * 选择更新数据状态
   */
  assignData: function (returnData, type) {
    this._lastReturnData = JSON.parse(JSON.stringify(returnData || {}));
    let userChoiceData = app.StorageH.get('userChoiceData') || {};
    let storeData = app.StorageH.get('store_data') || {};
    let redpackInfo = redpackHandleByReq.call(this, returnData.redpackInfo);
    let promotionInfo = promoteHandleByReq.call(this, returnData.promotionInfo);
    let valetOrderInfo = returnData.valetOrderInfo || {};
    let couponData = {
      ...this.data.couponData,
      ...returnData.bonusInfo
    }
    this.setData({
      cartList: returnData.cartList,
      couponData: couponData,
      giftList: promotionInfo.giftList,
      promoteList: promotionInfo.promoteList,
      secPromoteList: promotionInfo.secPromoteList,
      shippingInfo: returnData.shippingInfo || {},
      orderInfo: returnData.orderInfo,
      checkoutDiscount: returnData.checkoutDiscount,
      integralData: returnData.integralInfo,
      surplusData: returnData.surplusInfo,
      prepaidData: returnData.storedValueInfo || {},
      validate_data: returnData.validateEntity,
      signOrderActivityReward: returnData.signOrderActivityReward || {},
      valetOrderInfo: valetOrderInfo,
      surplusInfo: returnData.surplusInfo || {},
      redpackInfo
    })
    console.log("redpackInfo-----", this.data.redpackInfo);
    initReqShippingInfo.call(this, storeData, userChoiceData);
    cartsHandleByReq.call(this, returnData.cartList);
    checkDisplayNextPromotion.call(this, returnData.nextPromotionInfo);
    //初始化全场促销操作
    autoSetSecPromote.call(this, promotionInfo.secPromoteList, type)
    //存在用户操作
    if (hasOtherOperate.call(this)){
      if (hasOtherOperate.call(this, "coupon") && returnData.bonusInfo && returnData.bonusInfo.bonusDiscount == 0){
        initUserOperate.call(this,"coupon");
      }
      if(hasOtherOperate.call(this, "integral") && returnData.integralInfo && returnData.integralInfo.isUseIntegral == 0){
        initUserOperate.call(this,"integral");
      }
      if(hasOtherOperate.call(this, "prepaid") && returnData.storedValueInfo && returnData.storedValueInfo.isUseStoredValue == 0){
        initUserOperate.call(this,"prepaid");
      }
      if(hasOtherOperate.call(this, "giftCard") && returnData.promotionInfo && returnData.promotionInfo.isUsePromote == 0){
        initUserOperate.call(this,"giftCard");
      }
      if(hasOtherOperate.call(this, "redpack") && redpackInfo && redpackInfo.isUseRedpack == 0){
        initUserOperate.call(this,"redpack");
      }
    }

  },
  //使用现金券
  cashTicketInputBlur: function (e) {
    this._throttle('cashTicketInputBlur')
    var val = e.detail.value;
    this.setData({
      cashCoupon_input: val
    })
  },
  cashCouponScan() {
    this._throttle('cashCouponScan')
    let that = this;
    wx.scanCode({
      success(res) {
        let result = res.result;
        that.setData({
          cashCoupon_input: result || ""
        })
      }
    })
  },
  beforeUseCachTicket() {
    this.useCashTicket();
  },
  //使用现金券
  useCashTicket: function () {
    this._throttle('useCashTicket')
    let iserror = false;
    //没有输入现金券
    let cashCoupon_input = this.data.cashCoupon_input;
    if (!cashCoupon_input) {
      return;
    }
    //是否已选择
    let cashCouponData = this.data.cashCouponData;
    let useCashCoupon = cashCouponData.useCashCoupon;
    for (let i = 0; i < useCashCoupon.length; i++) {
      if (useCashCoupon[i].couponCode == cashCoupon_input) {
        cashCouponData.error = "该现金券已选择";
        this.setData({
          cashCouponData: cashCouponData
        })
        return;
      }
    }
    return app.UserApi.getBalanceCheckCoupon({
      params: {
        couponCode: cashCoupon_input,
        brandCode: app.Conf.BRAND_CODE
      },
      other: {
        isShowLoad: true
      }
    }).then(e => {
      let msg = e.msg;
      let orderInfo = this.data.orderInfo;
      let cashCouponData = this.data.cashCouponData;
      if (e.code == "1") {
        let data = e.data;
        cashCouponData.error = "";
        useCashCoupon.push(data);
        let useCashCouponIds = cashCouponData.useCashCouponIds;
        let useCouponsMoney = parseFloat(orderInfo.useCouponsMoney);
        for (let j = 0; j < useCashCoupon.length; j++) {
          //总价
          useCouponsMoney += parseFloat(useCashCoupon[j].couponMoney);
          if (useCashCouponIds) {
            useCashCouponIds += "," + useCashCoupon[j].couponId;
          } else {
            useCashCouponIds = useCashCoupon[j].couponId;
          }
        }
        orderInfo.useCouponsMoney = useCouponsMoney;
        cashCouponData.useCashCouponIds = useCashCouponIds;
        this.setData({
          cashCouponData: cashCouponData,
          orderInfo: orderInfo
        })

        //执行更新
        this.reqData.cashCouponList = useCashCouponIds;
        this.getCheckOut("cashCoupon");
        return Promise.resolve(e);
      } else {
        cashCouponData.error = msg;
        app.SMH.showToast({
          "title": msg
        })
        this.setData({
          cashCouponData: cashCouponData
        })
        iserror = true;
      }
      return Promise.reject();
    })
  },
  //删除使用的现金券
  delUseCashCoupon: function (e) {
    let coupon_id = e.currentTarget.dataset.coupon_id;
    let cashCouponData = this.data.cashCouponData;
    let orderInfo = this.data.orderInfo;
    let useCashCoupon = cashCouponData.useCashCoupon;
    let useCouponsMoney = 0;
    let useCashCouponIds = "";
    for (let i = 0; i < useCashCoupon.length; i++) {
      if (useCashCoupon[i].couponId == coupon_id) {
        useCashCoupon.splice(i, 1);
      } else {
        useCouponsMoney += parseFloat(useCashCoupon[i].couponMoney);
        if (useCashCouponIds) {
          useCashCouponIds += "," + useCashCoupon[i].couponId;
        } else {
          useCashCouponIds = useCashCoupon[i].couponId;
        }
      }
    }
    cashCouponData.error = "";
    cashCouponData.useCashCoupon = useCashCoupon;
    cashCouponData.useCashCouponIds = useCashCouponIds;
    orderInfo.useCouponsMoney = useCouponsMoney;
    this.setData({
      cashCouponData: cashCouponData,
      orderInfo: orderInfo
    })

    //执行更新
    this.reqData.cashCouponList = useCashCouponIds;
    this.getCheckOut("cashCoupon");
  },
  useGiftCard: function (e) {
    this._throttle('useGiftCard')
    if (this.checkingOut) return
    let isUsePromote = this.data.isUsePromote || 0;
    isUsePromote = isUsePromote == 1 ? 0 : 1;
    if(isUsePromote == 0){//取消
      this.useGiftCardHandle(isUsePromote);
      return;
    }
    let hasOther = hasOtherOperate.call(this, "cashCoupon,coupon",true);
    if (!hasOther) {
      this.useGiftCardHandle(isUsePromote);
      return;
    }
    let that = this;
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setTitle("温馨提示");
    this.pageDialog.setTouchCancel(false);
    this.pageDialog.setCentent("勾选促销活动后请重新选择可用优惠券，是否继续！");
    this.pageDialog.setTwoBtn(
      {
        name: "取消",
        tap: function () {
          that.pageDialog.dismiss();
        }
      },
      {
        name: "确认勾选",
        tap: function () {
          initUserOperate.call(that,"secPromote,giftCard",false);
          that.useGiftCardHandle(isUsePromote)
          that.pageDialog.dismiss();
        }
      }
    )
    this.pageDialog.show();
  },
  useGiftCardHandle(isUsePromote){
    this.setData({
      isUsePromote: isUsePromote
    })
    //执行更新
    this.reqData.isUsePromote = isUsePromote;
    this.getCheckOut("promote");
  },
  useSecPromote() {
    this._throttle('useSecPromote')
    let isUseSecPromote = this.data.isUseSecPromote || 0;
    this.setData({
      isUseSecPromote: isUseSecPromote == 1 ? 0 : 1
    })
    this.reqData.isUseSecPromote = this.data.isUseSecPromote
    this.getCheckOut("secPromote");
  },
  //优惠券跳转
  jumpToCoupon() {
    this._throttle('jumpToCoupon')
    let couponData = this.data.couponData || {};
    if (parseInt(couponData.usableBonusCount) <= 0) return;
    this.ToCoupon(); 
  },
  onTapRed(){
    this._throttle('onTapRed')
    this.redPopup = this.redPopup || this.selectComponent('#redPopup');
    this.redPopup.setTouchCancel(false);
    this.redPopup.show();
  },
  ToCoupon() {
    // let couponData = this.data.couponData || {};
    // let bonusIds = [];
    // let use_coupon = couponData.use_coupon;
    // if (use_coupon) {
    //   if (use_coupon instanceof Array) {
    //     for (let i = 0; i < use_coupon.length; i++) {
    //       bonusIds = bonusIds ? bonusIds + "," + use_coupon[i].bonus_id : use_coupon[i].bonus_id;
    //     }
    //   } else {
    //     bonusIds = use_coupon.bonus_id;
    //   }
    // }
    let couponOption = {
      isUseIntegral: this.reqData.isUseIntegral,
      cashCouponList: this.reqData.cashCouponList,
      isUseOfflineSurplus: this.reqData.isUseOfflineSurplus,
      isUsePromote: this.reqData.isUsePromote,
      isUseSecPromote: this.reqData.isUseSecPromote,
      bonusIds: this.reqData.bonusIds,
      recIds: this.reqData.recIds,
      addressId: this.reqData.addressId,
      isUseRedpack:this.reqData.isUseRedpack
    } 
    let data = {
      couponOption
    }
    if(this.valetInfo && this.valetInfo.shareCode){
      data.couponOption ? data.couponOption.customShareCode = this.valetInfo.shareCode : data.couponOption = {customShareCode: this.valetInfo.shareCode}
    }
    this.chooseCoupon = this.chooseCoupon || this.selectComponent("#chooseCoupon");
    this.chooseCoupon.initData(data);
  },
  chooseCouponCallback(){
    console.log("初始化");
    //执行更新
    this.getCheckOut("coupon");
  },
  //使用积分
  UseIntegral: function () {
    this._throttle('UseIntegral')
    let integralData = this.data.integralData;
    let allowPoint = integralData.allowPoint;
    let exchangeRate = integralData.exchangeRate;
    let use_integral = this.data.use_integral;
    let integral_deduct;
    integral_deduct = (allowPoint * exchangeRate).toFixed(2);
    if (use_integral) {
      use_integral = false;
      this.reqData.points = "";
      this.reqData.isUseIntegral = 0;
    } else {
      use_integral = true;
      if (this.data.is_erp_point) { //使用erp积分
        this.reqData.points = integralData.totalPoints;
      } else {
        this.reqData.points = 0;
      }
      this.reqData.isUseIntegral = 1;
    }
    this.setData({
      use_integral: use_integral,
      integral_deduct: integral_deduct
    })
    //执行更新
    this.getCheckOut("integral");
  },
  //使用默认储值卡 
  UsePrepaid: function () {
    this._throttle('UsePrepaid')
    let use_prepaid = this.data.use_prepaid;
    if (use_prepaid) {
      this.reqData.isUseOfflineSurplus = 0
    } else {
      this.reqData.isUseOfflineSurplus = 1
    }
    this.setData({
      use_prepaid: !use_prepaid
    })
    //执行更新
    this.getCheckOut("prepaid");
  },
  UseDefaultPrepaid: function () { },
  // 储值卡列表切换
  switchSelectPrepaid: function () {
    var prepaid_state = this.data.prepaid_state;
    prepaid_state.show_prepaid_list = !prepaid_state.show_prepaid_list;
    this.setData({
      prepaid_state: prepaid_state
    })
  },
  //选择 / 不使用储值卡 
  selectPrepaid: function (e) { },
  // 使用余额
  UseBalance: function () {
    this._throttle('UseBalance')
    var use_balance = this.data.use_balance;
    if (use_balance) {
      use_balance = false;
      this.reqData.isUseSurplus = 0;
    } else {
      use_balance = true;
      this.reqData.isUseSurplus = 1;
    }
    this.setData({
      use_balance: use_balance
    })
    //执行更新
    this.getCheckOut("balance");
  },
  //使用充值卡
  UseRecharge: function () {
    this._throttle('UseRecharge')
    var is_user_recharge = this.data.is_user_recharge;
    if (is_user_recharge) {
      is_user_recharge = false;
      this.reqData.IsUseRecharge = 0;
    } else {
      is_user_recharge = true;
      this.reqData.IsUseRecharge = 1;
    }
    this.setData({
      is_user_recharge: is_user_recharge
    })
    //执行更新
  },
  /**
   * 备注数量监控
   */
  //切换textarea
  ShowRemarksVal: function () {
    var show_remarks_val = this.data.show_remarks_val;
    var remarks_focus = this.data.remarks_focus;
    show_remarks_val = !show_remarks_val;
    remarks_focus = !remarks_focus;
    this.setData({
      show_remarks_val: show_remarks_val,
      remarks_focus: remarks_focus
    })
  },
  remarksInput: function (e) {
    let font_num = e.detail.cursor;
    let remarks_val = e.detail.value;
    remarks_val = StrH.safeFilter(remarks_val,"remarks");
    this.setData({
      font_num: font_num,
      remarks_val: remarks_val
    })
  },
  savePromAssistH(e) {
    this.setData({promAssistH: e.detail || 0})
  },
  /*
   * 提交订单
   */
  order_createOrder: function () {
    if (this.clickDisable) return;
    let that = this;
    if (this.checking && (this.checking == true)) {
      return
    }
    let shippingInfo = this.data.shippingInfo || {};
    let paymentList = this.data.paymentList || [];
    let valetOrderInfo = this.data.valetOrderInfo || {};
    let tip = "",callBack=null,cbTime = 1000; 
    if (shippingInfo.isStore && (!shippingInfo.consignee || !shippingInfo.mobilePhone)){
        tip = "请完善收货门店信息";
    } else if (!shippingInfo.isStore && !shippingInfo.addressId){
        tip = "请填写收货地址信息";
    } else if (this.identityCheck && this.data.identityName !== '' && this.data.identityName != shippingInfo.consignee) {
      tip = "因清关需要，身份证姓名需与收货人姓名一致";
      this.checkAll = false;
      this.setData({
        checkAll: this.checkAll
      })
    }else if(paymentList[this.data.cur_pay_index] && paymentList[this.data.cur_pay_index].pay_code == 'cashpay' && !valetOrderInfo.isUseCashPayChecked){
      tip = "请进行现金支付的验证";
      cbTime = 800;
      callBack = ()=>{
        this.selectPay({currentTarget:{dataset:{index:this.data.cur_pay_index}}})
      };
    }else if (!this.handleIdentitySubmit()) {
      return;
    }
    if (tip) {
      app.SMH.showToast({
        "title": tip
      })
      return;
    } 
    if(beforeNewOrderCheck.call(this)){
      checkGiftGoods.call(this, this.reqData.isUsePromote, this.reqData.isUseSecPromote, function (isForGetGiftInventory){
        addNewOrderInfo.call(that, that.identityCheck, isForGetGiftInventory)
      })
    } 
  },
  confirmChangeShipping() {
    this._throttle('confirmChangeShipping')
    // let that = this;
    // let shipping = this.data.shipping;
    let shippingInfo = this.data.shippingInfo || {};
    let {shareCode, userToken: userKey} = this.valetInfo || {}
    
    if(shippingInfo.isStore){
      if (shareCode || userKey) {
        wx.navigateTo({
          url: `/pages/micro_mall/selfGet/self_get_set?shareCode=${shareCode || ''}&userKey=${userKey}&select_store_id=${shippingInfo.store_id}&store_name=${shippingInfo.storeName}`,
        })
        return;
      }
      wx.navigateTo({
        url: `/pages/micro_mall/selfGet/self_get_set?recIds=${this.options.rec_str || '0'}&select_store_id=${shippingInfo.store_id}&store_name=${shippingInfo.storeName}`,
      })
    } else {
      if (shareCode || userKey) {
        wx.navigateTo({
          url: '/pages/micro_mall/address/address_list?shareCode=' + shareCode + `&userKey=${userKey}`,
        })
        return;
      }
      wx.navigateTo({
        url: '/pages/micro_mall/address/address_list',
      })
    }
    // if (shipping.way_id == 2) { //快速配送
    //   if (this.valetInfo && this.valetInfo.userToken) {
    //     wx.navigateTo({
    //       url: '/pages/micro_mall/address/address_list?userToken=' + this.valetInfo.userToken,
    //     })
    //     return;
    //   }
    //   wx.navigateTo({
    //     url: '/pages/micro_mall/address/address_list',
    //   })
    // } else { //门店自提 
    //   if (that.isLoadgingAuth) {
    //     return;
    //   };
    //   console.log('进入自提');
    //   that.loc_fail = false;
    //   that.showModalMsg = false;
    //   checkSelectStore.call(this, function (res) {
    //     app.EB.unListen('storesForA', this.storesForAId);
    //     let orderInfo = this.data.orderInfo || {};
    //     let store_data = app.StorageH.get("store_data") || {};
    //     store_data.contact = orderInfo.consignee;
    //     store_data.mob_phone = orderInfo.mobile;
    //     app.StorageH.set("store_data", store_data);
    //     let loc_f = that.loc_fail ? 1 : 0;
    //     let showModalMsg = that.showModalMsg ? 1 : 0;
    //     if (this.valetInfo && this.valetInfo.userToken) {
    //       wx.navigateTo({
    //         url: `/pages/micro_mall/selfGet/self_get_set?loc_f=${loc_f}&showModalMsg=${showModalMsg}&userToken=${this.valetInfo.userToken || ''}&recIds=${this.valetInfo.recIds || '0'}&select_store_id=${shipping.store_id}&store_name=${shipping.store_name}`,
    //       })
    //       return;
    //     }
    //     wx.navigateTo({
    //       url: `/pages/micro_mall/selfGet/self_get_set?loc_f=${loc_f}&showModalMsg=${showModalMsg}&recIds=${this.options.rec_str || '0'}&select_store_id=${shipping.store_id}&store_name=${shipping.store_name}`,
    //     })
    //   })
    // }
  },
  handleIdentity(e) {
    // this.checkAll = false;
    this.setData({
      filter: !this.data.filter
    })
  },
  getIdentity(e) {
    let type = e.currentTarget.dataset.type || '';
    this.setData({
      [type]: e.detail.value
    })
  },
  handleIdentitySubmit(e) {
    let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!this.identityCheck) return true;
    if (!this.data.identityName && !this.data.identityNumber) {
      app.SMH.showToast({
        title: '请填写身份证信息'
      })
      return false;
    }
    if (!this.data.identityName) { //|| !reg.test(this.data.identityName)
      app.SMH.showToast({
        title: '请输入身份证姓名'
      })
      return false;
    }
    if (!this.data.identityNumber || !regIdNo.test(this.data.identityNumber)) {
      app.SMH.showToast({
        title: '请输入正确的身份证号码'
      })
      return false;
    }
    this.checkAll = true;
    this.setData({
      filter: false,
      checkAll: this.checkAll
    })
    return true;
  },
  //代客购
  getvaletinfo(e) {
    let detail = e.detail || {};
    this.valetInfo = detail;
    initUserOperate.call(this);
    this.reqData.recIds = detail.recIds;
    this.reqData.customShareCode = detail.shareCode;
    this.getCheckOut("valet");
    this.setData({
      valetInfo: detail,
      // isCheckValetOrder: false
    })
  },
  checkValetUse(){
    let valetOrderInfo = this.data.valetOrderInfo || {};
    this.ValetModule = this.ValetModule || this.selectComponent("#ValetModule");
    if (valetOrderInfo.needSms && valetOrderInfo.isSmsChecked == 0){
      this.ValetModule.valetPhoneSms(this.valetInfo, valetOrderInfo.nextSendSeconds,ValetSmsType['asset']);
    }
  },
  checkValetOrder(e){
    console.log("检测完毕", e);
    let detail = e.detail || {};
    if(detail.type == 1 && detail.isCheck){
      let paymentList = this.data.paymentList||[];
      let index = this.data.cur_pay_index;
      this.reqData.paymentId = paymentList[index] && paymentList[index].pay_id || 0;
    }
    this.getCheckOut();
  },
  handleUse(e){
    let detail = e.detail||false;
    // let redpackInfo = this.redpackInfo||{};
    // redpackInfo.use = detail?1:0;
    this.setData({
      isUseRedpack: detail ? 1 : 0
    })
    this.getCheckOut("redpack");
  },
  selectPay(e){
    console.log('selectPay',e);
    let dataset = e.currentTarget.dataset||{};
    let index = dataset.index||0;
    let paymentList = this.data.paymentList||[];
    let valetOrderInfo = this.data.valetOrderInfo||{};
    this.setData({
      cur_pay_index:index
    })
    if(paymentList[index].pay_code == 'cashpay'){
      console.log('现金支付');
      if(valetOrderInfo.canUseCashPay == 1 && valetOrderInfo.isUseCashPayChecked == 1){
        this.reqData.paymentId = paymentList[index] && paymentList[index].pay_id || 0;
      }else if (valetOrderInfo.canUseCashPay == 1){
        this.ValetModule = this.ValetModule || this.selectComponent("#ValetModule");
        console.log('this.ValetModule',this.ValetModule)
        this.ValetModule.valetPhonePaySms(this.valetInfo, valetOrderInfo.useCashPayNexSmsSeconds,ValetSmsType['pay']);
      }
    }else{
      this.reqData.paymentId = paymentList[index] && paymentList[index].pay_id || 0;
    }
  },
  initConf(){
    return this.trimConfigs(['disable_cash_bonus','is_erp_point','close_order_remark']).then(list=>{  
      let _setData={};
      list && list.forEach(item=>{
        let key = item.Key||"";
        if(key == 'disable_cash_bonus'){
          _setData.canUseCashCoupon = !!(item.Value == "0");
        }else if(key == 'is_erp_point'){
          _setData.is_erp_point = item.Value||0;
        }else if(key == 'close_order_remark'){
          _setData.isShowRemark = !!(item.Value != 1);
        }
      })
      this.setData({..._setData})
      return list
    })
  }
}))

//初始化 地址请求参数
function initReqShippingInfo(storeData, userChoiceData = {}){
  let shippingInfo = this.data.shippingInfo || {};
  if(shippingInfo.isStore){
    let store = storeData.select_store || {};
    if(store.id){
      this.reqData.addressId = 0;
      this.reqData.consignee = storeData.contact || "";
      this.reqData.mobile = storeData.mob_phone || "";
      shippingInfo.consignee = storeData.contact || "";
      shippingInfo.mobilePhone = storeData.mob_phone || "";
      delete userChoiceData.selectAddr;
      app.StorageH.set('userChoiceData', userChoiceData);
    }
  } else {
    let selectAddr = userChoiceData.selectAddr || {};
    if(selectAddr.address_id) {
      this.reqData.addressId = selectAddr.address_id;
      storeData && app.StorageH.remove("store_data");
    } else {
      this.reqData.addressId = shippingInfo.addressId;
    }
    this.reqData.consignee = "";
    this.reqData.mobile = "";
  }
};
//初始化 选择优惠券参数
function initReqBonus(use_coupon){
  console.log('进来use_coupon',use_coupon)
  let bonusIds = [];
  if (use_coupon && use_coupon.length > 0) {
    for (let i = 0; i < use_coupon.length; i++) {
      if (use_coupon[i].bonus_id) {
        bonusIds.push(use_coupon[i].bonus_id);
      }
    }
  }
  this.reqData.bonusIds = bonusIds;
  this.setData({
    "couponData.use_coupon": use_coupon
  })
}
function loadPayMode() {
  if(this.data.paymentList&&this.data.paymentList.length>0){
    return Promise.resolve();
  }
  return app.BrandApi.getPaymentList({
    params: {
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    const arr = res.data || [];
    if (res.code == 1) {
      let cur_pay_index = 0;
      for(let i = 0,len=arr.length;i<len;i++){
        if(arr[i].pay_code == 'wxpay'){
          cur_pay_index = i;
          break;
        }
      }
      this.setData({
        paymentList:arr,
        cur_pay_index,
      })
    }
  })
}
/**
 * 初始化参数
 */
function initParam(isClear = false, clearPromote,clearSecPromote = false) {
  let valetInfo = this.valetInfo || {};
  let recIds = valetInfo.recIds || this.options.rec_str || "";
  recIds = (typeof(recIds) == "string" && recIds.split(",")) || [];
  recIds.map(i=> parseInt(i, 0));
  // console.log("recIds", recIds);
  this.reqData = {
    "recIds": [],
    "bonusIds": [],
    "isUseIntegral": 0,
    "isUseSurplus": 0,
    // "isUseStoreAddr": 0,
    // "store_id": 0,
    "addressId": 0,
    "isUsePromote": this.data.isUsePromote,
    "consignee": "",
    "mobile": "",
    "isUseOfflineSurplus": 0,
    "cashCouponList": [],
    // "brandCode": app.Conf.BRAND_CODE,
    // "userToken": valetInfo.userToken || app.LM.userToken,
    //"fromUserToken": valetInfo.userToken ? app.LM.userToken : "",
    "isUseSecPromote": clearSecPromote ? 0 : 1,
    "isUseRedpack": 0,
  };
  if (!isClear) {
    this.reqData.recIds = recIds;
  }
  if(clearPromote){
    this.reqData.isUsePromote = 0;
  }
  app.StorageH.remove("store_data");
}
//初始化用户操作
function initUserOperate(type = "",isInit = true) {
  let userChoiceData = app.StorageH.get('userChoiceData') || {};
  let key, data;
  /**
   * type 操作的优惠项，
   * inInit true为初始化，false为忽略初始化
  */
  //初始化单个操作
  if(type){
    if((type.indexOf("coupon") != -1 && isInit) || type.indexOf("coupon") == -1 && !isInit){
      let couponData = this.data.couponData || {};
      delete userChoiceData.use_coupon;
      delete couponData.use_coupon;
      app.StorageH.set("userChoiceData", userChoiceData);
      key = "couponData";
      data = couponData;
      this.reqData.bonusIds = [];
    }else if((type.indexOf("cashCoupon") != -1 && isInit) || type.indexOf("cashCoupon") == -1 && !isInit){
      let cashCouponData = this.data.cashCouponData;
      cashCouponData.useCashCouponIds = "";
      key = "cashCouponData";
      data = cashCouponData;
      this.reqData.cashCouponList = "";
    }else if((type.indexOf("giftCard") != -1 && isInit) || type.indexOf("giftCard") == -1 && !isInit){
      key = "isUsePromote";
      data = 0;
      this.reqData.isUsePromote = 0;
    }else if((type.indexOf("secPromote") != -1 && isInit) || type.indexOf("secPromote") == -1 && !isInit){
      key = "isUseSecPromote";
      data = 0
      this.reqData.isUseSecPromote = 0;
    }else if((type.indexOf("integral") != -1 && isInit) || type.indexOf("integral") == -1 && !isInit){
      key = "use_integral";
      data = 0
      this.reqData.isUseIntegral = 0;
    }else if((type.indexOf("prepaid") != -1 && isInit) || type.indexOf("prepaid") == -1 && !isInit){
      key = "use_prepaid";
      data = 0
      this.reqData.isUseOfflineSurplus = 0;
    }else if((type.indexOf("redpack") != -1 && isInit) || type.indexOf("redpack") == -1 && !isInit){
      key = "isUseRedpack";
      data = 0
      this.reqData.isUseRedpack = 0;
    }
    if (key) {
      this.setData({
        [key]: data == null || typeof (data) == "undefined" ? {} : data
      })
    }
  }else{
    //初始化全部操作
    let couponData = this.data.couponData || {};
    let cashCouponData = this.data.cashCouponData;
    let promoteList = this.data.promoteList || [];
    let secPromoteList = this.data.secPromoteList || [];
    let isUsePromote = this.data.isUsePromote;
    let redpackInfo = this.data.redpackInfo;
    delete userChoiceData.use_coupon;
    delete couponData.use_coupon;
    cashCouponData.useCashCouponIds = "";
    app.StorageH.set("userChoiceData", userChoiceData);
    this.setData({
      use_balance: false,
      use_integral: false,
      use_prepaid: false,
      is_user_recharge: false,
      couponData: couponData,
      cashCouponData: cashCouponData,
      isUseSecPromote: secPromoteList.length > 0 ? 1 : 0,
      isUsePromote: promoteList.length > 0 && isUsePromote ? 1 : 0,
      isUseRedpack: redpackInfo.isUseRedpack
    })
    initParam.call(this, null, !this.data.isUsePromote, !this.data.isUseSecPromote);
  }
}
//检测存在其他操作
function hasOtherOperate(type = "", isReturn = true) {
  /**
   * type  特殊项
   * isReturn  true 返回特殊项的结果, false 排除特殊项的结果
  */
  let cashCouponData = this.data.cashCouponData || {};
  let use_balance = this.data.use_balance;
  let use_integral = this.data.use_integral;
  let use_prepaid = this.data.use_prepaid;
  let is_user_recharge = this.data.is_user_recharge;
  let couponData = this.data.couponData || {};
  let isUseSecPromote = this.data.isUseSecPromote || 0
  let isUsePromote = this.data.isUsePromote || 0;
  let isUseRedpack = this.data.isUseRedpack || 0;
  console.log('进来 hasOtherOperate',type,isReturn,couponData)

  if (type && isReturn){//单个选项是否勾选
    if(type.indexOf("coupon") != -1){
      return couponData.use_coupon && couponData.use_coupon.length > 0;
    }
    if(type.indexOf("cashCoupon") != -1){
      return cashCouponData.useCashCouponIds;
    }
    if(type.indexOf("giftCard") != -1){
      return isUsePromote;
    }
    if(type.indexOf("secPromote") != -1){
      return isUseSecPromote;
    }
    if(type.indexOf("integral") != -1){
      return use_integral;
    }
    if(type.indexOf("prepaid") != -1){
      return use_prepaid
    }
    if(type.indexOf("recharge") != -1){
      return is_user_recharge
    }
    if(type.indexOf("balance") != -1){
      return use_balance
    }
    if(type.indexOf("redpack") != -1){
      return isUseRedpack
    }
    return false;
  }
  //检测全部
  console.log('进来 检测存在其他操作')
  if (cashCouponData.useCashCouponIds && type.indexOf("cashCoupon") == -1) {
    console.log('cashCoupon',cashCouponData.useCashCouponIds)
    return true;
  } else if (use_balance  && type.indexOf("balance") == -1) {
    console.log('balance',use_balance) 
    return true
  } else if (use_integral && type.indexOf("integral") == -1) {
    console.log('integral',use_integral)
    return true
  } else if (use_prepaid && type.indexOf("prepaid") == -1) {
    console.log('prepaid',use_prepaid)
    return true
  } else if (is_user_recharge && type.indexOf("recharge") == -1) {
    console.log('recharge',is_user_recharge)
    return true
  } else if (couponData.use_coupon && couponData.use_coupon.length > 0 && type.indexOf("coupon") == -1) {
    console.log('coupon',couponData.use_coupon)
    return true
  } else if (isUseSecPromote == 1 && type.indexOf("secPromote") == -1) {
    console.log('secPromote',isUseSecPromote)
    return true
  } else if(isUsePromote == 1 && type.indexOf("giftCard") == -1){
    console.log('giftCard',isUsePromote)
    return true
  } else if(isUseRedpack == 1 && type.indexOf("redpack") == -1){
    console.log('redpack',isUseRedpack)
    return true
  }else{
    console.log('全部else');
    return false
  }
}
// 初始化请求后 促销规则
function promoteHandleByReq(promotionInfo){
  promotionInfo = promotionInfo || {};
  let ruleList = promotionInfo.ruleList || [];
  let giftList = promotionInfo.giftList || [];
  let promoteList = [], secPromoteList = [];
  for (let i = 0; i < ruleList.length; i++) {
    if (ruleList[i].rule_type == 1 || ruleList[i].ruleType == 1) {//全场促销
      secPromoteList.push(ruleList[i]);
    } else {
      promoteList.push(ruleList[i]);
    }
  }
  return {
    giftList,
    secPromoteList,
    promoteList
  }
}
// 初始化请求后 商品列表
function cartsHandleByReq(cartList){
  cartList = cartList || []
  if (!this.firstCheck) {
    this.firstCheck = true;
    cartList.forEach((item) => {
      if (item.sale_kind == 1) {
        this.identityCheck = true
      } else {
        this.normalGoods = true
      }
    })
    // getCrossOrderUserInfo.call(this)
  }
  if (this.identityCheck) {
    this.setData({
      showIdentity: true
    })
  }
}
// 初始化请求后 红包
function redpackHandleByReq(redpackInfo){
  redpackInfo = redpackInfo || {}
  let redpackList = redpackInfo.redpackList || [];
  if(redpackInfo.allowUseRedpack && redpackList.length > 0){
    for(let i = 0, len = redpackList.length; i < len; i++){
      let item =  redpackList[i];
      let fromDay = MyDate.format(MyDate.parse(item.from_date), "yyyy.MM.dd");
      let toDay = MyDate.format(MyDate.parse(item.to_date), "yyyy.MM.dd");
      let toTimeHm = MyDate.format(MyDate.parse(item.to_date), "HH:mm");
      if(fromDay == toDay){
        let format = "yyyy.MM.dd HH:mm"
        item.from_date_str = MyDate.format(MyDate.parse(item.from_date), format)
        item.to_date_str = MyDate.format(MyDate.parse(item.to_date), "HH:mm")
      }else{
        let format = toTimeHm == "00:00" ? "MM.dd": "MM.dd HH:mm";
        item.from_date_str = MyDate.format(MyDate.parse(item.from_date), "yyyy.MM.dd")
        item.to_date_str = MyDate.format(MyDate.parse(item.to_date), format)
      }  
    }
  }
  return redpackInfo
}
function addNewOrderInfo(identity = false, isForGetGiftInventory) {
  this.clickDisable = true;
  goPay.call(this, identity, isForGetGiftInventory);
}

function goPay(identity, isForGetGiftInventory) {
  // let shipping = params.shipping || {};
  // let redpackSumary = this.data.redpackSumary||{};
  let paymentList = this.data.paymentList || [];
  let obj = {
    // "userToken": app.LM.userToken,
    "addressId": this.reqData.addressId,
    // "paymentId": parseInt(params.pay_mode.pay_id),
    // "besttimeId": parseInt(params.orderInfo.receTimeId) || 1,
    // "changeValue": params.use_integral ? params.integralData.allowPoint : 0,
    "recIds": this.reqData.recIds,//this.options.rec_str,// 代客下单recids未明白
    // "isUseStoreAddr": shipping.store_id && shipping.store_id != 0 ? 1 : 0,
    "bonusIds": this.reqData.bonusIds || [],
    "isUseSurplus": this.reqData.isUseSurplus,
    // "surplus": params.use_balance ? params.orderInfo.canUsebalance : 0,
    "remark": this.data.remarks_val,
    "isUsePromote": this.reqData.isUsePromote || 0,
    "isUseSecPromote": this.reqData.isUseSecPromote || 0,
    "consignee": this.reqData.consignee,
    "mobile": this.reqData.mobile,
    "cashCouponList": this.reqData.cashCouponList,
    "isUseOfflineSurplus": this.reqData.isUseOfflineSurplus,
    "isUseIntegral": this.reqData.isUseIntegral,
    "paymentId": (paymentList[this.data.cur_pay_index] ||{}).pay_id, //支付方式 
    "isIgnoreGiftStock": isForGetGiftInventory || 0,
    "clientSessionId": LgMg.channel && LgMg.channel.clientSessionId || "",
    "isUseRedpack": this.reqData.isUseRedpack, //
    "needSignAward": getSignSelect(this,'isSelect'),
    "staffId": app.PH && (typeof app.PH.paramsJson === "function") && app.PH.paramsJson("storeStaffCode", true) && app.PH.paramsJson("store_staff_id") || 0, // 店员staff_id
    "discountBuyGoods": this.data.chooseDiscountGoods.map(item=>({
      activityProductId:item.activityProductId||0,
      number:item.number||0
    }))||[],
  }
  
  if (identity) {
    obj.idCardName = this.data.identityName;
    obj.idCardNo = this.data.identityNumber;
  }
  //代客购
  if (this.valetInfo) {
    // obj.userToken = this.valetInfo.userToken;
    // obj.rec_ids = this.valetInfo.recIds;
    // obj.fromUserToken = app.LM.userToken;
    obj.recIds = this.valetInfo.recIds;
    obj.customShareCode = this.valetInfo.shareCode;
    obj.lat = 0;
    obj.lon = 0;
  }
  try {if(app.PH.paramsJson('gdt_vid')){obj.clickId = app.PH.paramsJson('gdt_vid');}} catch (error) {}
  console.log("下单参数", obj);
  return app.CL_BuyApi.addOrder({
    data: obj,
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      if (data.orderId && data.orderId != "0") {
        //删除缓存数据
        var userChoiceData = app.StorageH.get('userChoiceData') || {};
        delete userChoiceData.goods_receipt_time;
        delete userChoiceData.pay_receipt_time;
        delete userChoiceData.use_coupon;
        delete userChoiceData.selectAddr;
        delete userChoiceData.rec_str;
        let that = this;
        app.StorageH.set('userChoiceData', userChoiceData);
        app.StorageH.set('store_data', '');
        wxSubscribe.subscribeGlobal({...this.subConfig, relatedId: data.orderId}).finally(() => {
          if (identity && this.normalGoods) {
            this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
            this.pageDialog.setTitle("温馨提示");
            this.pageDialog.setTouchCancel(false);
            this.pageDialog.setCentent("因该订单涉及不同仓库发货，将会拆分多个订单发出。请留意查收快递信息！");
            this.pageDialog.setSingleBtn({
              name: "确认",
              tap: function () {
                that.isBuyBack = false;
                wx.redirectTo({
                  url: '../order/order_info?first_time_topay=1&order_id=' + data.orderId,
                })
              }
            })
            this.clickDisable = false;
            this.pageDialog.show();
          } else {
            that.isBuyBack = false;
            wx.redirectTo({
              url: '../order/order_info?first_time_topay=1&order_id=' + data.orderId,
            })
          }
          initParam.call(this, true);
        })
      } else {
        app.SMH.showToast({
          "title": e.msg || "提交失败"
        })

      }
      this.clickDisable = false
      return Promise.resolve(e);
    } else {
      if (identity) {
        this.checkAll = false;
        this.setData({
          checkAll: this.checkAll
        })
      }
      this.clickDisable = false;
      app.SMH.showToast({
        title: e.msg || '提交失败'
      })
      return Promise.resolve(e);
    }
  }).finally(()=>{
    app.StorageH.remove('CART_DEFAULT_SELECT');
  })
}
//跨境购
// function getCrossOrderUserInfo() {
//   app.UserApi.getCrossOrderUserInfo({
//     params: {
//       userToken: app.LM.userKey,
//       brandCode: app.Conf.BRAND_CODE,
//     },
//     other: {
//       isShowLoad: false
//     }
//   }).then(res => {
//     if (res.code == 1) {
//       let identityObj = res.data || {};
//       if (res.data && res.data.identityName && res.data.identityNo) {
//         this.checkAll = true;
//       } else {
//         this.checkAll = false;
//       }
//       this.setData({
//         identityName: identityObj.identityName || '',
//         identityNumber: identityObj.identityNo || '',
//         checkAll: this.checkAll
//       })
//     }

//   })
// }

// //自提过程 检测
// function getCurrLoation(callBack, failReturnBack) {
//   let that = this;
//   that.isLoadgingAuth = true;
//   let failBackFn = function () {
//     console.log('failBackFn回调');
//     that.loc_fail = true;
//     that.loc_checked = true;
//     let reqParams = {
//       latitude: -1,
//       longitude: -1,
//     }
//     typeof callBack == "function" && callBack.call(that, reqParams);
//     return
//   }

//   let successBackFn = function () {
//     WxApi.getLocation({
//       type: 'gcj02',
//     }).then(res => {
//       if (!that.loc_checked && !that.jumpAlready) {
//         that.loc_checked = true;
//         console.log('没超时，正常callBack');
//         typeof callBack == "function" && callBack.call(that, res);
//         return
//       }
//       if (that.loc_checked && !that.jumpAlready) {
//         console.log('已超时，能成功定位 ，但当作定位失败处理');
//         that.loc_checked = false;
//       }
//     }).catch(error => {
//       if (!that.loc_checked && !that.jumpAlready) {
//         console.log('未超时，未开启手机定位 catch')
//         that.loc_checked = true;
//         that.showModalMsg = true;
//         let reqParams = {
//           latitude: -1,
//           longitude: -1,
//         }
//         typeof callBack == "function" && callBack.call(that, reqParams);
//         return
//       }
//       if (that.loc_checked && !that.jumpAlready) {
//         console.log('已超时，未开启手机定位 catch');
//         that.loc_checked = false;
//       }
//     });

//     that.checkTimeOutLocation = setTimeout(() => {
//       if (that.loc_checked) {
//         console.log('没超时，正常流程');
//       } else {
//         console.log('超时3s!!');
//         that.loc_fail = true;
//         that.loc_checked = true;
//         that.showModalMsg = true;
//         let reqParams = {
//           latitude: -1,
//           longitude: -1,
//         }
//         typeof callBack == "function" && callBack.call(that, reqParams);
//         return
//       }
//     }, 3000);
//   };

//   app.AS.checkAuthorize("scope.userLocation", successBackFn, failBackFn);
// }


// function checkSelectStore(callBack) {
//   let reqParams = {
//     lat: -1,
//     lon: -1,
//     // sType: 1 //0 附近店铺 ，1店铺自提
//   }
//   getCurrLoation.call(this, function (res) {
//     let that = this;
//     reqParams.lat = res.latitude;
//     reqParams.lon = res.longitude;
//     getNearyFn.call(that, that, reqParams, callBack);
//   }, callBack)
// }


// function checkStoresForAFn() {
//   let that = this;
//   that.isLoading_storesForA = true;
//   that.storesForAId = app.EB.listen('storesForA', (res) => {
//     app.EB.unListen('storesForA', that.storesForAId);
//     if (res && res.storesForAOpen == 1) {
//       let data = res && res.data || {};
//       reutrnStoresForA.call(that, that, data, true);
//     } else {
//       // console.log('千面未开启或用户未注册'); 
//       reutrnStoresForA.call(that, that, '', false)
//     }
//   });
// }

// function reutrnStoresForA(that, loc_obj = {}, open = false) {
//   loc_obj = loc_obj || {};
//   console.log('check千店回调:', loc_obj);
//   that.storesForAOpen = open || false;
//   that.isLoading_storesForA = false;
//   that.latitude = loc_obj.lat || 0;
//   that.longitude = loc_obj.lon || 0;
//   that.isUseLocation = loc_obj.isUseLocation || 0;
// }

// function getNearyFn(that, reqParams_temp = {}, callBack) {
//   that = that || this;
//   let options = this.options || {};
//   let reqParams = {
//     recIds: options.rec_str,
//     searchName: "",
//     brandCode: app.Conf.BRAND_CODE,
//     userToken: app.LM.userToken
//   }
//   reqParams.lat = reqParams_temp.lat || -1;
//   reqParams.lon = reqParams_temp.lon || -1;
//   let valetInfo = this.valetInfo || {};
//   if (valetInfo.userToken) {
//     reqParams.recIds = valetInfo.recIds;
//     reqParams.userToken = valetInfo.userToken;
//   }
//   typeof callBack == "function" && callBack.call(that);
// }

function checkGiftGoods(isUsePromote,isUseSecPromote,callBack){
  if (isUsePromote != 1 && isUseSecPromote != 1){
    typeof (callBack) == "function" && callBack(0);
  }else{
    let that = this;
    // let giftList = this.data.giftList || [];
    let promoteList = [];
    isUsePromote == 1 && (promoteList = promoteList.concat(this.data.promoteList || []));
    isUseSecPromote == 1 && (promoteList = promoteList.concat(this.data.secPromoteList || []));
    let sellOutTxts = []
    promoteList.forEach(promotion => {
      let giftList = promotion && promotion.giftList || [];
      for (let i = 0; i < giftList.length; i++){
        let giftListItem = giftList[i] || {};
        let giftGoodsList = giftListItem.giftGoodsList || [];
        for(let j = 0,len = giftGoodsList.length;j<len;j++){
          let item = giftGoodsList[j] || {};
          if(item.giftStatus == 0){
            // sellOutTxts.push("赠品【" +  giftList[i].goodsName + "】已赠完" );
            sellOutTxts.push("赠品【" +  item.goodsName + "】已赠完" );
          }
        }
      }
    })
    if (sellOutTxts.length > 0){
      sellOutTxts.push("是否继续下单？");
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("提示");
      this.pageDialog.setTouchCancel(false);
      this.pageDialog.setCentent(sellOutTxts);
      this.pageDialog.setTwoBtn(
        {
          name: "取消",
          tap: function () {
            that.pageDialog.dismiss();
          }
        },
        {
          name: "确定",
          tap: function () {
            typeof (callBack) == "function" && callBack(1);
            that.pageDialog.dismiss();
          }
        }
      ).show();
    }else{
      typeof (callBack) == "function" && callBack(0);
    }
  }
  
}

function resetLoading() {
  let that = this;
  setTimeout(() => {
    that.loc_checked = false;
  }, 400)
  setTimeout(() => {
    that.isLoadgingAuth = false;
  }, 1000)
}

function backPageStatus() {
  let pages = getCurrentPages();
  let currPage = pages.length > 1 ? pages[pages.length - 2] : null;
  let isBuyBack = typeof (this.isBuyBack) === "undefined" || this.isBuyBack ? true : false;
  if (currPage && currPage.route && currPage.route == "pages/micro_mall/shopping/shopping_cart") {
    currPage.selectComponent("#cartListModule").isBuyBack = isBuyBack;
  }
}

function autoSetSecPromote(secPromoteList,operateType){
  //用户操作则不初始化
  if (operateType) return;
  if (!secPromoteList.length || secPromoteList.length == 0) {
    initUserOperate.call(this,"secPromote");
  } else {
    if(!this.reqData.isUseSecPromote)return
    this.reqData.isUseSecPromote = 1;
    this.setData({
      isUseSecPromote: 1
    })
  }
}

function checkDisplayNextPromotion(data = {}){
  this.promoteAssistance = this.promoteAssistance || this.selectComponent("#promoteAssistance");
  this.promoteAssistance && this.promoteAssistance.loadData({...data})
}
 
function dateFormat(item={}) {
  let fromDay = MyDate.format(MyDate.parse(item.from_date), "yyyy.MM.dd");
  let toDay = MyDate.format(MyDate.parse(item.to_date), "yyyy.MM.dd");
  let toTimeHm = MyDate.format(MyDate.parse(item.to_date), "HH:mm");
  if(fromDay == toDay){
    let format = "yyyy.MM.dd HH:mm"
    item.from_date_str = MyDate.format(MyDate.parse(item.from_date), format)
    item.to_date_str = MyDate.format(MyDate.parse(item.to_date), "HH:mm")
  }else{
    let format = toTimeHm == "00:00" ? "MM.dd": "MM.dd HH:mm";
    item.from_date_str = MyDate.format(MyDate.parse(item.from_date), "yyyy.MM.dd")
    item.to_date_str = MyDate.format(MyDate.parse(item.to_date), format)
  }  
}

function getSignSelect(that,key){
  that.signTip = that.signTip || that.selectComponent('#signTip');
  let info = that.signTip && that.signTip.getInfo() || {};
  let result = info;
  key && (result = info[key] || 0);
  return result
}

function beforeNewOrderCheck(){
  let verify = true;
  let list = this.data.cartList||[]; 
  let needCheckIsTimeout = list.some(item=>{
    if(item.goodsType == '10'){
      return true;
    }
  })
  if(needCheckIsTimeout){
    let checkIsTimeout = app.StorageH.checkIsTimeout({key:'packageGoodsNewOrder',type:"get"});
    if(checkIsTimeout){
      let that = this;
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("温馨提示");
      this.pageDialog.setTouchCancel(false);
      this.pageDialog.setCentent("套餐搭配商品若产生售后，只支持整单退款，不支持单件退款");
      this.pageDialog.setSingleBtn(
        {
          name: "确定",
          tap: function () {
            app.StorageH.checkIsTimeout({key:'packageGoodsNewOrder',type:"set",value:true,t:24*60});
            that.pageDialog.dismiss();
            that.order_createOrder();//再调一次
          }
        }
      )
      this.pageDialog.show();
      verify = false;
      return verify
    }
  }
  return verify
}