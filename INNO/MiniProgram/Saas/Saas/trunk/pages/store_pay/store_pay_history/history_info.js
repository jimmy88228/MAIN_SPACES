// pages/store_pay/pay_result/pay_success.js
import WxApi from '../../../common/helper/wx-api-helper.js'
import PayH from '../../../common/helper/handle/payHandle.js';
import Polling from '../../../common/helper/polling.js';
import appUtils from '../../../common/support/utils/utils';

var app = getApp();
Page(app.BP({ 
  data: {
    pay_info: {},
  },
  options: {}, 
  onLoad: function(options) {
    this.options = options ;
    let applet_logo = this.data.brand_info.logo_path + "micro_mall/applet_logo.png";
    this.setData({
      applet_logo: applet_logo || ''
    })
    this.loadPayData(options);
  }, 
  onUnload(){
    Polling.stopPolling();
  },
  loadPayData: function(options) { 
    getOrderInfo.call(this);
  },
  getAward: function() {
    appUtils.throttle(postOfflineOrderRewardRelease.bind(this), 3000)();
  },
  toPay: function(e) {
    appUtils.throttle(toPay.bind(this),3000)()
  },
  cancel: function() {
    clickCancel.call(this)
  },
  showSnCode(e){
    let dataset = e.currentTarget.dataset || {};
    this.codeModule = this.codeModule || this.selectComponent("#codeModule");
    this.codeModule && this.codeModule.showCode(dataset.code);
  }
}))

function getOrderInfo() {
  var payment_id = this.options.payment_id ? this.options.payment_id : 0;
  if (!payment_id) {
    return Promise.resolve({});
  }
  return app.SmktPayApi.getOfflineOrderInfo_Entity({
    params: {
      paymentId: payment_id,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      var data = e.data;
      data.you_pay_amount = (data.payment_mode == 3 || data.payment_mode == 4) ? data.pending_amount : data.payment_amount;
      data.prepaidcard_attach_value = data.prepaidcard_attach_value ;
      data.prepaidcard_value = data.prepaidcard_value;
      data.offline_surplus = data.offline_surplus ;
      data.coupon_money = data.coupon_money;
      data.integral_money = data.integral_money;
      data.balance = data.balance ;
      // data.reality_amount = parseFloat(parseFloat(data.offline_surplus) + parseFloat(data.you_pay_amount)).toFixed(2);
      data.reality_amount = parseFloat(data.you_pay_amount).toFixed(2);
      data.prepaidcard_discount_str = data.prepaidcard_value + data.prepaidcard_attach_value;
      data.all_amount = (parseFloat(data.order_amount || 0) + parseFloat(data.discount_amount || 0)).toFixed(2);
      data.wxDiscount = (parseFloat(data.wechat_coupon_amount || 0) + parseFloat(data.wechat_nocash_coupon_amount || 0)).toFixed(2)
      this.setData({
        pay_info: data
      }) 
      if (data.payment_status == 0 && (data.pay_code != 'mallcash' &&  data.pay_code != 'shopcash')) {
        toPay.call(this);
      }
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })

}



function toPay() {
  let payment_id = this.options.payment_id || '';
  if (!payment_id) return; 
  return PayH.UnifiedorderByOrderId({type:"sp",order_id:payment_id})
  .then(e => { 
    poolingFnc.call(this);
  })
}

function clickCancel() {
  let _this = this;
  this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
  this.pageDialog.setTitle("提示");
  this.pageDialog.setCentent("确定要取消该订单吗");
  this.pageDialog.setTwoBtn({
    name: "取消",
  }, {
    name: "确定",
    tap: function() {
      cancel.call(_this);
    }
  })
  _this.pageDialog.show();

}


function cancel() {
  let params = {
    paymentId: this.options.payment_id || 0
  };
  let _this = this;
  return app.RunApi.go('POST', 'SmktPayApi', 'cancelOfflineOrder', params).then(res => {
    if (res.code == '1') {
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("提示");   
      this.pageDialog.setTouchCancel(false);
      this.pageDialog.setCentent("取消订单成功"); 
      _this.pageDialog.setSingleBtn({
        name: "确认",
        tap: function () {
          _this.pageDialog.dismiss();
          _this.loadPayData(_this.options);
        }
      });
      this.pageDialog.show();
    }else{
      app.SMH.showToast({
        title:res.msg||'操作异常'
      })
      _this.pageDialog.dismiss();
    }
  })
}

function postOfflineOrderRewardRelease() {
  let {offline_sn: offlineSn, store_id: storeId} = this.data.pay_info || {};
  return app.RunApi.go('POST','SmktPayApi','postOfflineOrderRewardRelease',{offlineSn, storeId}).then(res=>{
    console.log('postOfflineOrderRewardRelease?',res);
    if(res.code=='1' && res.data != null){
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("提示");
      this.pageDialog.setTouchCancel(false);
      this.pageDialog.setCentent("领取成功，可前往个人中心查看"); 
      this.pageDialog.setSingleBtn({
        name: "好的",
        tap: () => {
          this.pageDialog.dismiss();
        }
      });
      this.pageDialog.show();
    } else {
      return app.SMH.showToast({ title: res.msg || "领取异常"})
    }
  })
}

function poolingFnc(type=""){
  this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
  this.dialog = this.dialog || this.selectComponent("#pageDialog");
  let extra = {
      orderSync:this.orderSync,
      dialog:this.dialog,
  }
  Polling.setPolling(()=>getOrderStatus.call(this),()=>pollingSucc.call(this),()=>pollingFail.call(this),"",extra); 
}


function pollingSucc(){
  getOrderInfo.call(this);
}

function pollingFail(){
  wx.navigateBack({
    delta:-1
  })
}


function getOrderStatus(is_topay = false) {
  var payment_id = this.options.payment_id ? this.options.payment_id : 0;
  if (!payment_id) {
    return Promise.resolve({});
  }
  return app.SmktPayApi.getOrderStatus({
      params: {
          paymentId: payment_id,
          brandCode: app.Conf.BRAND_CODE,
      },
      other: {
          isShowLoad: true
      }
  })
}
