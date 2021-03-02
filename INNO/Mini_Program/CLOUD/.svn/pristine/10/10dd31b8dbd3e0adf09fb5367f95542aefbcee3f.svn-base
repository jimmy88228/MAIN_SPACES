// pages/micro_mall/sk/orders-sk/order-status.js
import WxApi from "../../../../helper/wx-api-helper.js"
import MyDate from '../../../../support/utils/date-util.js';
import PayH from '../../../../helper/handle/payHandle.js'
import {
  CountDown
} from "../../../../helper/manager/timer-manager.js";
import GetStatus from '../help/getStatus.js'
import polling from '../help/polling.js'

const app = getApp();
Page(app.BP({
  data: {
    ac_conf: app.Conf.style.n_sk_color,
    // invalidMsg: "订单已失效",
    // type:'detail'
  },
  onLoad: function (options) {
    this.options = options;
    if(options.type){
      wx.setNavigationBarTitle({
        title: options.type
      })
    }
    let brand_info = this.data.brand_info;
    let sk_success = brand_info.icon_url + "micro_mall/sec_kill/sk_success.png";
    let sk_fail = brand_info.icon_url + "micro_mall/sec_kill/sk_fail.png";
    this.setData({
      sk_success,
      sk_fail,
      // type: options.type || ''
    })
    this.page = getCurrentPages();
    // console.log("status页", options);
  },
  onShow: function () { 
    getOrderInfos.call(this).then(res=>{
      // console.log('金额:', this.orderInfos.orderFactPrice);
      if (this.options.first == 1 && !this.payShowed && this.orderInfos.orderFactPrice!=0) {
        this.payShowed = true;
        toPay.call(this);
      }
    });
  },
  onHide: function () {
    stopCountDown.call(this)
  },
  onUnload: function () {
    stopCountDown.call(this)
  }, 
  payAgain() {
    if (this.orderInfos.orderFactPrice!=0){
      toPay.call(this);
    }
  },
  jump(e){
    let dataset = e.currentTarget.dataset || {};
    let url = dataset.url || '';
    let type = dataset.type || '';
    let order_id = dataset.order_id || 0;
    let out_order_id = dataset.out_order_id || 0;
    if(type=='detail'){
      if (!out_order_id){
        app.SMH.showToast({
          title: "订单号同步中"
        })
        return
      }
      wx.navigateTo({
        url: `${url}?order_id=${out_order_id}`,
      })
    }
  }

}))


function getOrderInfos() {
  let params = {
    orderId: this.options.order_id,
  }
  let extra = {
    diy: true
  }
  return app.RunApi.go('SecKillApi', 'getOrderInfos', params).then(res => {
    // console.log('getOrderInfos', res);
    if (res.code == '1') {
      let data = res.data || {};
      let serverTime = data.serverTime || '';
      let address = data.address || {};
      let goods = data.goods || {};
      let orderInfos = data.orderInfos || {};
      let storeInfo = data.storeInfo || {};
      this.orderInfos = orderInfos;
      let state = orderInfos.state || '';
      let failReason = {};
      if (state == 1){
        setDownTime.call(this, state , MyDate.parse(serverTime), MyDate.parse(orderInfos.cancelTime));
      } else if (state == 3){
        failReason = GetStatus.getFailReason(orderInfos.failReason);
      } else if (state == 4 || state == 5){
        failReason = GetStatus.getOrderStatus(state);
      }
      console.log('storeInfo', storeInfo)
      this.setData({
        address,
        goods,
        orderInfos,
        failReason,
        storeInfo,
        showBtn:true,
      });
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    app.SMH.showToast({
      title:e && e.msg || "订单异常"
    })
  }).finally(()=>{
    this.setData({
      showPage: true
    })
  })
} 

function toPay() {
  unifiedorder.call(this);
}

function unifiedorder() {
  if (this.lock)return
  lock.call(this,true);
  return PayH.UnifiedorderByOrderId("seckill",this.options.order_id)
  .then(res=>{
    console.log('支付',res);
    if (res.code == "1") {
      let pay_info = res.data;
      WxApi.requestPayment({
        'timeStamp': pay_info.timeStamp + '',
        'nonceStr': pay_info.nonceStr,
        'package': pay_info.package,
        'signType': pay_info.signType,
        'paySign': pay_info.paySign,
      }).then(res => {
        this.setData({
          isPayed:true
        })
        this.orderSyncShowed = true;
        this.orderSync = this.orderSync || this.selectComponent("#orderSync");
        this.orderSync.show();
        // console.log('原生支付then', res);
        console.log('开始轮询');
        polling(() => {
          return getPayStatus.call(this);
        })().then(res => {
          this.orderSyncShowed = false;
          this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
          this.orderSync.dismiss(); 
          stopCountDown.call(this);
          console.log('轮询结束', res);
          getOrderInfos.call(this);
          if (res && res.data == 1) {
            // console.log('支付成功'); 
          } else {
            jumpBack.call(this);
          }
        }).catch(e=>{
          this.orderSyncShowed = false;
          stopCountDown.call(this);
          this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
          this.orderSync.dismiss(); 
        })
      }).catch(res => {
        console.log('catch支付回调', res); 
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    app.SMH.showToast({
      title: e.msg || "订单信息异常"
    })
  }).finally(()=>{
    setTimeout(()=>{
      lock.call(this, false);
    },500)
  })
}

function getPayStatus(){
  let params={
    orderId: this.options.order_id,
  };
  let extra={diy:true};
  console.log('轮询中');
  return app.RunApi.go('SecKillApi','getPayStatus',params,extra).then(res=>{
    return Promise.resolve(res);
  })
}


function setDownTime(state=0,startTime = '', endTime = '') {
  // console.log('开始 结束时间', startTime, endTime)
  if (!startTime && !endTime) return
  if (!this.countDown) {
    stopCountDown.call(this);
    this.countDown = new CountDown(startTime);
  }
  this.countDown.setTarget(endTime);
  setTime.call(this, this.countDown);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        if(this.orderSyncShowed){
          this.orderSync && this.orderSync.dismiss && this.orderSync.dismiss(); //倒计时结束+未付款
        }
        stopCountDown.call(this);
        getOrderInfos.call(this);
      }
      setTime.call(this, e);
    });
  }
}

function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
  }
}

function setTime(e) {
  let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
  this.setData({
    time: e.format(day > 0 ? "dd天 HH:mm:ss" : "HH:mm:ss")
  });
} 

function jumpBack(){
  this.dialog = this.dialog || this.selectComponent("#dialog");
  this.dialog.setTitle("提示");
  this.dialog.setTouchCancel(false);
  this.dialog.setCentent("订单正在审核中，请稍后查看订单状态");
  this.dialog.show();
  let that = this;
  this.dialog.setSingleBtn({
    name: "确认",
    tap: function () {
      wx.redirectTo({
        url: '/pages/micro_mall/sk/orders-sk/order-list',
      })
    }
  });
}

function lock(bool=false){
  this.lock = bool;
}

function setPollingShow(_bool=false){
  // let bool = _bool || false;
  // this.setData({
  //   pollingShow: bool
  // })
}