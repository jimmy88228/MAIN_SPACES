import WxApi from "../../../common/utils/wxapi/index";
import MyDate from '../../../common/utils/date/index';
import {
  CountDown
} from "../../../common/manager/timer-manager/index";
import PayH from "../../../common/helper/pay-helper/index";
const App = getApp();

const CHANGE_ORDER_STATUS_REF = {
  "待发货": {
    btnText:"设为发货",
    title: "已发货",
    value: 1
  }, //改成1 就是已发货
  "已发货": {
    btnText:"设为待发货",
    title: "待发货",
    value: 0
  }, // 改成0 就是待发货
  "待自提": {
    btnText:"设为已自提",
    title: "已自提",
    value: 2
  }, // 改成2 就是已自提
  "已自提": {
    btnText:"设为待自提",
    title: "待自提",
    value: 0
  }, // 已提货 改成0 待自提
}
Page(App.BP({
  data: {
    addressInfo: {},
    goodsList: [],
    menuInfo: {},
    orderInfo: {},
    storeInfo: {},
    valetInfo: {},
    recordList:[],

    count_down: {
      day: 0,
      hour: 0,
      min: 0,
      sec: 0
    },
    foldBtnActive: false, // 是否打开折叠的按钮组 
    allRecord: false,//是否打开折叠的订单状态
  },
  onLoad(query) {
    this.pageQuery = query;
    this.setData({staff_type:query.staff_type||0,mainColor:App.SH.pageStyleObj['main-color']});
    console.log('App.SH',App.SH)
    this.orderId = Number(query.order_id) || 0;
    this.first_time_topay = Number(query.first_time_topay) || 0;
    this.setView({ 
      payQrCodeRef: { get: () => this.findView("#pay-qrcode") }, 
      changeOrderStatusPopRef: { get: () => this.findView("#change-order-status-pop") }, 
      confirmPopRef: { get: () => this.findView("#confirm-pop") }, 
    })
    // get_OrderCancelReasonList.call(this)
  },
  onShow() {
    getOrderInfo.call(this)
    getOrderStatusRecord.call(this)
  },
  onUnload() {
    this.stopGetOrderPayStatus = true;
    stopCountDown.call(this);
  },
  onHide: function () {
    stopCountDown.call(this)
  },
  handleCopyTap(e) {
    let text = this.getDataset(e, "text");
    WxApi.setClipboardData({data: text})
  },
  handleChangeStatusBtnTap() {
    let orderStatus = this.data.orderInfo.orderStatus || "";
    let {value: shippingStatus, title} = CHANGE_ORDER_STATUS_REF[orderStatus] || {};
    if (!title) {
      App.SMH.showToast({title: `修改订单状态异常, orderStatus: ${orderStatus}`});
      return;
    }
    this.changeOrderStatusPopRef.showModal({
      title: `是否将此订单状态改为【${title}】`,
      formType: title === '已发货' ? "delivery" : ""
    })
    this.changeShippingStatus = shippingStatus;
  },
  handleChangeOrderStatusConfirm(e) {
    console.log("e", e)
    const formData = e.detail || {};
    updateOrderStatus.call(this, formData)
      .then(data => {
        if (data == 1) {
          App.SMH.showToast({title: "修改成功"})
          this.changeOrderStatusPopRef.hideModal();
          getOrderInfo.call(this);
        } else {
          App.SMH.showToast({title: "修改失败"})
        }
      })
  },
  confirmOrder() {
    WxApi.showModal({
      title: '确认收货',
      content: '是否已经收到货了'
    })
      .then(info => {
        if (info.confirm) {
          let orderId = this.orderId;
          this.showLoading();
          return App.Http.QT_BuyApi.receiveOrderGoods({
            data: {
              orderId: orderId,
            }
          })
            .then(e => {
              if (e.code == "1") {
                getOrderInfo.call(this)
                return Promise.resolve(e);
              }
              App.SMH.showToast({
                "title": e.msg
              })
              return Promise.reject();
          })
          .finally(() => {
            this.hideLoading();
          })
        }
      })
  },
  toPay() {
    PayH.UnifiedorderByOrderId("order", this.orderId)
      .then(res => {
        getOrderPayStatus.call(this)
      })
      .catch(err => {
        console.log("toPay err", err);
        App.SMH.showToast({title: err && err.msg || err || "支付失败"});
      })
  },
  toPayByQrCode(){
    return PayH.unifiedCloudShopOrderByCode("order", this.orderId)
      .then(code_url => {
        return this.payQrCodeRef.initData({content: code_url, afterDismiss: () => {this.stopGetOrderPayStatus = true}});
      })
      .then(getOrderPayStatus.bind(this))
      .catch(err => {
        console.log("toPayByQrCode err", err);
        App.SMH.showToast({title: err && err.msg || err || "支付失败"});
      })
  },
  handleMoreBtnTap() {
    this.setData({foldBtnActive: !this.data.foldBtnActive})
  },
  handleMoreRecordTap() {
    this.setData({allRecord: !this.data.allRecord})
  },
  cancelOrder() {
    WxApi.showModal({
      title: "取消订单",
      content: "确定要取消订单吗？",
    })
     .then(info => {
       if (info.confirm) {
         cancelOrder.call(this)
          .then(() => {
            App.SMH.showToast({title:"取消订单成功"});
            getOrderInfo.call(this)
          })
          .catch(err => {
            App.SMH.showToast({title: err});
            console.log("cancelOrder err", err)
          })
       }
     })
  },
  // onShareAppMessage() {
  //   let orderSn = this.pageQuery.order_sn;
  //   let orderId = this.pageQuery.order_id;
  //   let title = '帮我付款才是真友谊';
  //   console.log('分享', orderId, 'this:', this);
  //   return {
  //     path: `pages/micro_mall/order/order_info?order_sn=${orderSn}&order_id=${orderId}`,
  //     title: title,
  //   };
  // },
  backToHome() {
    WxApi.reLaunch({url: "/pages/tabs/index/index"})
  },
  checkApplyReturn(){
    this.confirmPopRef.showModal(()=>{
      this.jumpAction(`/pages/micro_mall/order/order-return/apply/index?order_id=${this.pageQuery.order_id||0}`);
      return Promise.resolve(true)
    })
  },
  applyReason(e){
    let value = parseInt(e.detail.value);
    let {order_cancel_reason} = this.data;
    let reason = order_cancel_reason[value];
    console.log('applyReason',e,reason);
    return this.applyAfterSale(reason);
  },
  applyAfterSale(altersale_reason){ 
    return App.Http.QT_OrderReturnApi.applyAfterSale({
      data:{
        id:0,
        related_order_id:this.pageQuery.order_id,
        altersale_reason, 
        altersale_type:0, //0取消
      }
    })
  },
}))

function getOrderInfo() {
  let orderId = this.orderId || 0;
  let staffType = this.pageQuery.staff_type || 0;
  if (!orderId) {
    App.SMH.showToast({
      title: "订单Id不存在"
    });
    return;
  }
  this.showLoading();
  return App.Http.QT_BuyApi.getOrderDetail({
      params: {
        orderId,
        staffType
      }
    })
    .then(res => {
      if (res.code == 1) return res.data;
      return Promise.reject(res.msg || "获取订单详情失败")
    })
    .catch(err => {
      console.log("getOrderInfo err", err);
      App.SMH.showToast({
        title: err
      });
      return Promise.reject(err)
    })
    .finally(() => {
      this.hideLoading();
    })
    .then(data => {
      let {addressInfo,goodsList,menuInfo,orderInfo,storeInfo,valetInfo,userInfo} = data;
      let isShowNavMsg = (((orderInfo.orderStatus == '待付款' && this.data.staff_type == 1) || (menuInfo.needPay == 1 || menuInfo.canQrcodePay == 1)) && (orderInfo.serverTime < orderInfo.autoCancelTime)) || orderInfo.autoReceiveTime || false;
      this.setData({addressInfo, goodsList, menuInfo, orderInfo, storeInfo, valetInfo,userInfo,isShowNavMsg})
      return data;
    })
    .then(() => {
      setCountDown.call(this); // 待付款倒计时
      updateBtnContainer.call(this); // 更新可操作按钮
      checkIfNeedCallPayImmediately.call(this); // 检查是否需求立即调起支付
    })
}

function updateOrderStatus(formData) {
  return App.Http.QT_BuyApi.updateOrderStatus({
    data: {
      orderId: this.orderId,
      shippingStatus: this.changeShippingStatus,
      shippingId: formData.shippingId || 0,
      shippingName: formData.shippingName || "",
      invoiceNo: formData.invoiceNo || ""
    }
  })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res.msg || "修改订单状态失败")
    })
    .catch(err => {
      console.log(err);
      App.SMH.showToast({title: err});
      return Promise.reject(err);
    })
}

function cancelOrder() {
  return App.Http.QT_BuyApi.cancelOrder({
    data: {
      orderId: this.orderId
    }
  })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res.msg || "取消订单失败")
    })
}

function checkIfNeedCallPayImmediately() {
  let {menuInfo, valetInfo = {}} = this.data || {};
  if (menuInfo.needPay && this.first_time_topay > 0) {
    this.first_time_topay = 0;
    (valetInfo.isValetOrder == 1 && valetInfo.isOrderUser != 1 && menuInfo.canQrcodePay == 1) ? this.toPayByQrCode() : this.toPay();
  }
}

function setCountDown() {
  let {menuInfo, orderInfo} = this.data;
  if (((this.pageQuery.staff_type == 1 && orderInfo.orderStatus == '待付款') || (menuInfo.needPay || menuInfo.canQrcodePay)) && MyDate.parse(orderInfo.autoCancelTime) > MyDate.parse(orderInfo.serverTime)) {
    this.setData({
      showTimeOut: true
    })
    startCountDown.call(this, orderInfo.serverTime, orderInfo.autoCancelTime)
  } else {
    stopCountDown.call(this)
  }
}

//倒计时
function startCountDown(startTime, endTime) {
  if (!this.countDown) {
    stopCountDown.call(this);
    this.countDown = new CountDown(MyDate.parse(startTime));
  }
  this.countDown.setTarget(MyDate.parse(endTime));
  setTime.call(this, this.countDown);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        stopCountDown.call(this);
        getOrderInfo.call(this);
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
  let day = Math.floor((e.value + 60000) / (60 * 60 * 24 * 1000));
  let hour = parseInt((e.value + 60000) % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
  let minutes = parseInt(((e.value + 60000) % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt(((e.value + 60000) % (1000 * 60)) / 1000);
  let count_down = {
    day: day,
    hour: hour,
    min: minutes,
    sec: seconds >= 10 ? seconds : '0' + seconds
  }
  this.setData({
    count_down: count_down
  });
}

function updateBtnContainer(){
  let menuInfo = this.data.menuInfo || {};
  let orderInfo = this.data.orderInfo || {};
  let container = [
    {
      "key":'pay',
      "tap":"toPay",
      "name":"立即支付",
      "className": "primary",
      "status": menuInfo.needPay == 1 
    },
    {
      "key":'confirm',
      "tap":"confirmOrder",
      "name":"确认收货",
      "className": "primary",
      "status": menuInfo.canReceive == 1
    },
    {
      "key":'cancel',
      "tap":'cancelOrder',
      "name":"取消订单",
      "status": menuInfo.canCancel == 1 && menuInfo.isApplyCancel != 1
    },
    {
      "key":'cancel_apply',
      "tap":'cancelOrder',
      "name":"申请取消",
      "status": menuInfo.canCancel == 1 && menuInfo.isApplyCancel == 1
    },
    // {
    //   "key":'comment',
    //   "tap":'toComment',
    //   "name":"去评价",
    //   "status": menuInfo.canComment == 1
    // },
    {
      "key":'updateOrder',
      "tap":'handleChangeStatusBtnTap',
      "name":orderInfo.orderStatus && CHANGE_ORDER_STATUS_REF[orderInfo.orderStatus] && CHANGE_ORDER_STATUS_REF[orderInfo.orderStatus].btnText || "",
      "className": "primary",
      "status": menuInfo.canUpdateOrderStatus == 1
    },
    {
      "key":'back',
      "tap":'backToHome',
      "name":"返回首页",
      "status": !(menuInfo.needPay)
    },
    {
      "key":'pay_qrcode',
      "tap":'toPayByQrCode',
      "name":"代付码",
      "status": (menuInfo.canQrcodePay) && orderInfo.orderStatus == '待付款'
    },

    // {
    //   "key":'return_cancel',
    //   "tap":'',
    //   "name":"申请售后C",
    //   "status": true
    // },
    // {
    //   "key":'return_return',
    //   "tap":'checkApplyReturn',
    //   "name":"申请售后R",
    //   "status": true
    // },

    // {
    //   "key":'pay_for',
    //   "tap":'',
    //   "openType":"share",
    //   "name":"代付",
    //   "status": menuInfo.canSharePay == 1
    // },
    // {
    //   "key":'delay_receive',
    //   "tap":'extendReceive',
    //   "name":"延长收货",
    //   "status": menuInfo.extendReceiptDay > 0
    // },
    // {
    //   "key":'check_shipping',
    //   "tap":'onTap',
    //   "dataType":"shipping",
    //   "name":"查看物流",
    //   "status": menuInfo.canCheckShipping == 1
    // },
  ];
  let unfoldNum = 0;
  let unfoldBtnArr = []; //展开
  let foldBtnArr = [];   //折叠
  for(let i=0,len=container.length;i<len;i++){
    if(container[i].status){
      unfoldNum+=1;
      if(unfoldNum<=3){
        unfoldBtnArr.push(container[i]);
      }else{
        foldBtnArr.push(container[i]);
      }
    }
  }
  unfoldBtnArr.length>0 && unfoldBtnArr.reverse();
  this.setData({  
    unfoldBtnArr,
    foldBtnArr
  })
  console.log('btnArr',unfoldBtnArr,foldBtnArr)
}

//检测订单支付转态
function getOrderPayStatus() {
  this.showLoading();
  return App.Http.QT_BuyApi.checkOrderPay({
    params: {
      orderId: this.orderId
    }
  })
  .then(e => {
    if (e.code == "1") {
      if (e.data == 1) {
        this.hideLoading();
        this.payQrCodeRef && this.payQrCodeRef.dismiss();
        getOrderInfo.call(this);
      } else if (e.data == 0) {
        console.log('this.stopGetOrderPayStatus',this.stopGetOrderPayStatus,e,this.getOrderPayStatusTimer)
        if (this.stopGetOrderPayStatus){
          this.stopGetOrderPayStatus = false;
          return Promise.reject();
        } else {
          return new Promise(() => {
            let _timer = setTimeout(function () {
              clearTimeout(_timer);
              return getOrderPayStatus.call(this);
            }.bind(this), 3000);
          })
        }
      }
      return Promise.resolve(e);
    }
    return Promise.reject();
  }).catch(error => {
    let _timer3 = setTimeout(function () {
      clearTimeout(_timer3);
      getOrderInfo.call(this);
    }.bind(this), 6000);
  });
}

function getOrderStatusRecord(){
  return App.Http.QT_BuyApi.getOrderStatusRecord({
    params: {
      orderId: this.orderId
    }
  })
  .then(e => {
    if(e.code){
      this.setData({
        recordList:e.data
      })
    }
  })
}


//获取原因
function get_OrderCancelReasonList() {
  return App.Http.QT_OrderReturnApi.get_OrderCancelReasonList({
    params: {},
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || []; 
      this.setData({
        order_cancel_reason: data.map(item=>(item.reason||"")),
      })
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })
}