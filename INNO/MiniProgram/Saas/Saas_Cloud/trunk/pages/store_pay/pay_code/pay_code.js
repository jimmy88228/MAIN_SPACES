import {
  qrcode_custom,
  barcode_custom
} from "../../../common/utils/codeCanvas/index.js"
import WxApi from '../../../common/helper/wx-api-helper.js'
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  }, 
  data: {
    code_data: {
      qr_pay_code: ''
    },
    showCodeType: "qrcode",
    show_pay_pop: '',
    orderInfo: {},
    rule: {},
    //优惠券
    bonus_info: {},
    select_bonus: {
      type_money: 0,
    },
    //积分
    pointInfo: {},
    usePoint: false,
    //余额
    balanceInfo: {
      canUsebalance: 0,
      account_balance: 0
    },
    useBalance: false,
    //储值卡
    prepaidInfo: {},
    usePrepaid: false,
    //支付
    paymentList: {},
    payId: 0,
    payCode: "" // alipay = 1 支付宝支付, wapay = 2 微信支付, mallcash = 3 商城收银, shopcash = 4 店铺现金, cashpay = 5 现金支付
  },
  attached() {
    this.beforeInfo = {
      payment_id: 0, 
      storeId: '',  
      payment_status: 0,
    };
    this.check_timer = null;
    // this.refresh_time = 0;
    this.check_time = 3000;
    let applet_logo = this.data.brand_info.logo_path + "micro_mall/applet_logo.png";
    this.setData({
      applet_logo: applet_logo || ''
    })
  },   
  methods: { 
    onShowFn() {
      _onShowFn.call(this);
    },
    onHideFn(){ 
      console.log('onHide')
      unListen.call(this);
    },
    onUnloadFn() {
      console.log('onUnloadFn');
      this.onUnloaded = true;
      unListen.call(this);
      app.StorageH.remove("userChoiceData");
    },  
    refreshCode() {
      this._throttle('refreshCode');
      unListen.call(this);
      getPayCode.call(this);
    },
    showPayInfo() {
      this.setData({
        show_pay_pop: "isshow"
      })
    },
    closePayInfo() {
      this.setData({
        show_pay_pop: 'ishide'
      })
      this.refreshCode(); 
    },
    /**
     * 使用积分
     */
    usePoint: function() {
      if (this.clicking) return;
      let usePoint = this.data.usePoint;
      this.setData({
        usePoint: !usePoint
      });
      getJiesuan.call(this);
    },
    /**使用余额 */
    useBalanceHandle() {
      if (this.clicking) return;
      let useBalance = this.data.useBalance;
      if (useBalance) {
        useBalance = false;
      } else {
        useBalance = true;
      }
      this.setData({
        useBalance: useBalance
      });
      getJiesuan.call(this);
    },
    /**
     * 使用储值卡
     */
    usePrepaid: function() {
      if (this.clicking) return;
      let usePrepaid = this.data.usePrepaid;
      this.setData({
        usePrepaid: !usePrepaid
      })
      getJiesuan.call(this);

    },
    /**
     * 选择优惠券
     */
    selectBouns: function() {
      if (this.clicking) return;
      let bonus_info = this.data.bonus_info || {}
      if (parseInt(bonus_info.canUseCouponNum) > 0) {
        let userChoiceData = app.StorageH.get("userChoiceData") || {};
        let use_bonus = userChoiceData.use_coupon || {};
        let select_bonus = this.data.select_bonus || {};
        if (select_bonus.bonus_id == use_bonus.bonus_id) {
          return;
        }
        this.setData({
          select_bonus: use_bonus
        })
        getJiesuan.call(this);
      }
    },
    /**
     * 选择支付方式
     */
    selectPayMode: function(e) {
      if (this.clicking) return;
      let payId = e.currentTarget.dataset.payId;
      let payCode = e.currentTarget.dataset.payCode;
      this.setData({
        payId: payId,
        payCode: payCode
      });
      getJiesuan.call(this);
    },
    confirmToPay: function() {
      updateOrderInfo.call(this);
    },
    joinWxActivity(){
      joinWxCouponActivity.call(this);
    },
    switchCode(){
      this.setData({showCodeType: this.data.showCodeType === "barcode" ? "qrcode" : "barcode"})
    },
    noFn(){}
  },
}))


function _onShowFn() {
  if (!(this.data.show_pay_pop == "isshow")) {
    this.refreshCode();
  } else {
    //是否选择优惠券
    this.selectBouns();
  }
}

function unListen() {
  // this.refresh_time = 0;
  clearTimeout(this.check_timer);
  this.check_timer = null;
}


//获取二维码
function getPayCode() {
  return app.SmktPayApi.getPayCode({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other:{
      isShowLoad:true
    }
  }).then(e => {
    if(this.onUnloaded){
      unListen.call(this);
      return Promise.reject();
    }
    if (e.code == "1") { 
      let qr_pay_code = e.data || "";
      console.log(qr_pay_code)
      let code_data = {qr_pay_code};
      this.qr_pay_code = qr_pay_code;
      this.setData({
        code_data
      });
      qr_pay_code && qrcode_custom('payCode', qr_pay_code, 450, 450,this); //二维码
      qr_pay_code && barcode_custom('barCanvas', qr_pay_code, 500, 150,this); //条形码
      unListen.call(this);
      getOfflineOrderInfo.call(this);
      return e
    }
    return Promise.reject();
  })
}
//获取扫码状态
function getOfflineOrderInfo() {
  return app.SmktPayApi.getOfflineOrderInfo({
    params: {
      pay_barcode: this.qr_pay_code,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: false
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      let payment_id = data.payment_id;
      if(this.onUnloaded){
        unListen.call(this);
        return e
      }else if (payment_id) {
        //停止刷新二维码
        unListen.call(this);
        wx.showLoading({
          "title": "获取支付信息..."
        });
        this.beforeInfo.payment_status = data.payment_status;
        this.beforeInfo.storeId = data.store_id;
        this.beforeInfo.payment_id = data.payment_id;
        if (data.payment_status) { 
          jump.call(this, data.payment_id, 'result');
          return;
        }
        app.StorageH.remove("userChoiceData");
        getJiesuan.call(this);
      }else{
        // if(this.refresh_time >= 20){
        //   this.refreshCode();
        //   return e
        // }
        // this.refresh_time += 1;

        unListen.call(this);
        this.check_timer = setTimeout(() => {
          unListen.call(this);
          getOfflineOrderInfo.call(this);
        }, this.check_time);
      }
      return e
    }
    return Promise.reject();
  }).catch(e=>{
    console.log('catch',e)
    this.refreshCode();
    return e;
  })
}

function getOrderStatus(is_topay = false) {
  let beforeInfo = this.beforeInfo || {};
  let payment_id = beforeInfo.payment_id;
  if (!payment_id) return;
  return app.SmktPayApi.getOrderStatus({
    params: {
      paymentId: payment_id,
      brandCode: app.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let pay_status = e.data; 
      jump.call(this, payment_id)
      return Promise.resolve();
    }
    return Promise.reject();
  })
}

function getJiesuan() {
  let beforeInfo = this.beforeInfo || {};
  let select_bonus = this.data.select_bonus || {};
  this.clicking = true;
  return app.SmktPayApi.postOfflineJieSuanList({
    data: {
      paymentId: beforeInfo.payment_id,
      bonusId: select_bonus.bonus_id || 0,//beforeInfo.bonus_id,
      IsUsePoint: this.data.usePoint ? 1 : 0,
      prepaidCardIds: "",
      isUseStoredValue: this.data.usePrepaid ? 1 : 0,
      storeId: beforeInfo.storeId,
      IsUseBalance: this.data.useBalance ? 1 : 0,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let payId = this.data.payId;
      let payCode = this.data.payCode;
      let data = e.data || {};
      let bonus_info = data.bonusEntity;
      this.data.select_bonus.type_money = bonus_info.canUseCouponMoney;
      let orderInfo = data.orderinfoEntity;
      orderInfo.all_amount = (parseFloat(orderInfo.order_amount || 0) + parseFloat(orderInfo.discount_amount || 0)).toFixed(2);
      let paymentList = data.payList;
      if (!payId) {
        payId = paymentList[0].pay_id;
        payCode = paymentList[0].pay_code;
      }
      //设置请求参数
      beforeInfo.payment_status = orderInfo.payment_status;
      beforeInfo.payment_id = orderInfo.payment_id;
      beforeInfo.storeId = data.post_store_id;
      this.beforeInfo = beforeInfo || {};
      //
      let balanceInfo = data.balanceEntity || {};
      if (!(balanceInfo.canUsebalance && parseFloat(balanceInfo.canUsebalance) > 0)) {
        this.setData({
          useBalance: false
        })
      }
      let pointInfo = data.userPointEntity || {};
      if (!(pointInfo.allowPoint && parseFloat(pointInfo.allowPoint) > 0)) {
        this.setData({
          usePoint: false
        })
      }
      let prepaidInfo = data.storedValueEntity || {};
      if (!(prepaidInfo.canUseStoredValue && parseFloat(prepaidInfo.canUseStoredValue) > 0)) {
        this.setData({
          usePrepaid: false
        })
      }
      let couponActivity = data.couponActivity || {};
      if(couponActivity.couponAmount > 0 && parseFloat(orderInfo.jieSuanOrderAmount) >= parseFloat(couponActivity.transactionMinimum) && couponActivity.isJoin){
        orderInfo.preAdmount = (parseFloat(orderInfo.jieSuanOrderAmount) - parseFloat(couponActivity.couponAmount)).toFixed(2);
        // orderInfo.preAdmount = orderInfo.preAdmount > 0 ? orderInfo.preAdmount.toFixed(2) : 0;
      }
      //
      this.setData({
        bonus_info: bonus_info || {},
        orderInfo: orderInfo || {},
        rule: data.preferentialEntity || {},
        pointInfo: pointInfo,
        prepaidInfo: prepaidInfo,
        paymentList: paymentList,
        payId: payId,
        payCode: payCode,
        balanceInfo: balanceInfo,
        couponActivity: data.couponActivity
        // select_bonus: this.data.select_bonus
      })
      //支付信息弹框动画
      this.showPayInfo();
      return e
    }
    return Promise.reject();
  }).finally(() => {
    this.clicking = false;
  })
}

function updateOrderInfo() { //更新订单信息
  let beforeInfo = this.beforeInfo || {};
  let payment_id = beforeInfo.payment_id || 0;
  if (!payment_id) return;
  let select_bonus = this.data.select_bonus || {};
  if(this.isLoading) return;
  this.isLoading = true;
  return app.SmktPayApi.updateOfflineOrderInfoByPayInfo({
    data: {
      paymentId: payment_id,
      pay_id: this.data.payId,
      bonusId: select_bonus.bonus_id || 0,//this.beforeInfo.bonus_id,
      IsUsePoint: this.data.usePoint ? 1 : 0, //使用的积分吧？
      prepaidCardIds: "",
      isUseStoredValue: this.data.usePrepaid ? 1 : 0,
      IsUseBalance: this.data.useBalance ? 1 : 0, //使用的余额
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data; 
      if (this.data.payCode == 'mallcash' || this.data.payCode == 'shopcash') {  //选择门店现金支付 
        jump.call(this, payment_id,'result');
      } else {    //选择微信支付
        if (data > 0) {      
          getOrderStatus.call(this, 'toPay');
        } else {
          jump.call(this, payment_id)
        } 
      }
      return e
    } else {
      if(e.msg){
        app.SMH.showToast({
          title: e.msg
        })
      }
      return Promise.reject();
    }
  }).finally(()=>{
    let timer = setTimeout(()=>{
      this.isLoading = false;
      clearTimeout(timer);
      timer = null;
    },500)
  })
}

function toPay() {
  let beforeInfo = this.beforeInfo || {};
  return app.PayApi.getAppletPrepayId({
    params: {
      order_id: beforeInfo.payment_id,
      pay_type: "sp"
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let pay_info = e.data;
      WxApi.requestPayment({
        'timeStamp': pay_info.timeStamp + '',
        'nonceStr': pay_info.nonceStr,
        'package': pay_info.package,
        'signType': pay_info.signType,
        'paySign': pay_info.sign,

      }).then(e => {
        getOrderStatus.call(this);
      })
    } 
  })
}

function jump(payment_id = 0,type=''){
  app.StorageH.set("use_bonus", "");
  app.StorageH.set("usePrepaids", "");
  let that = this;
  wx.nextTick(()=>{
    that.setData({
      select_bonus: {
        type_money: 0,
      },
      usePoint:false, 
      usePrepaid: false, 
      useBalance: false, 
    })
  })
  if (type =='result'){
    wx.nextTick(() => {
      wx.navigateTo({
        url: '/pages/store_pay/pay_result/pay_result?payment_id=' + payment_id,
      })
    }) 
  }else{
    wx.nextTick(() => {
      wx.navigateTo({
        url: '/pages/store_pay/store_pay_history/history_info?payment_id=' + payment_id,
      })
    })
  }
  setTimeout(()=>{
    this.setData({
      show_pay_pop: 'ishide', 
    })
  },700);
}
function joinWxCouponActivity(){
  if(this.joining) return;
  this.joining = true
  return app.SmktPayApi.joinWxCouponActivity({
    data:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other:{
      isShowLoad: true
    }
  }).then(res=>{
    console.log("joinWxActivity", res);
    if(res.code == 1){
      app.SMH.showToast({
        title: "参与成功"
      })
      getJiesuan.call(this);
    }
  }).finally(()=>{
    this.joining = false;
  })
}