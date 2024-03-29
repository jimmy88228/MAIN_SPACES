// pages/micro_mall/order/for_pay_order.js

import WxApi from '../../../common/support/tools/wx-api-promise.js'
import MyDate from '../../../common/support/utils/date-util.js';
import {
    CountDown
} from "../../../common/manager/timer-manager.js";
import {
    barcode
} from "../../../common/helper/utils/goComplete/index.js"
import Polling from '../../../common/helper/polling.js'
import PayH from '../../../common/helper/handle/payHandle.js';
var app = getApp();
Page(app.BP({

    data: {
        brand_info: app.globalData.brand_info,
        order_id: 0,
        order_info: {},
        sub_order: false,
        sub_order_list: [],
        order_cancel_reason_list: [],
        order_cancel_reason: {},
        gift_list: [],
        btn_follow_must_show: 0,
        // show_pay_load: false,
        isLogin: app.LM.isLogin,
        /*倒计时*/
        count_down: {
            day: 0,
            hour: 0,
            min: 0,
            sec: 0
        },
        show_br: false,
    },
    first_time_topay: 0,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        console.log(options)
        this.options = options;
        var order_id = options.order_id;
        var first_time_topay = options.first_time_topay;
        this.setData({
            order_id: order_id,
            server_close: server_close,
        })
        if (first_time_topay) {
            this.first_time_topay = first_time_topay;
            this.bg = this.bg || this.selectComponent("#bg");
            this.bg.show();
            console.log("加蒙版")
        }
        this.initConf();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this._checkUserLogin();
        let order_id = this.data.order_id;
        getOrderInfo.call(this, order_id);
        getCancelReasion.call(this);
        // if (!this.data.show_pay_load) {
        // }
    },
    onReady() {
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
            bg_color: bg_color
        })
    },
    onHide: function () {
        stopCountDown.call(this)
    },
    onUnload: function () {
        stopCountDown.call(this);
        Polling.stopPolling();
    },
    onPullDownRefresh() {
        this.PullDownRefresh = true;
        // this.orderInfoInit(this.data.order_id);
        getOrderInfo.call(this, this.data.order_id);
    },
    /**
     *去评价 
     */
    toComment: function () {
        var order_id = this.data.order_id;
        wx.navigateTo({
            url: '../comment/mobile_order_comment/mobile_order_comment?order_id=' + order_id,
        })
    },
    orderInfoInit: function (order_id) {
        //   var that = this;
        //   var act = 'order_getOrderInfo';
        //   var data = { 'order_id': order_id };
        //   getOrderInfo.call(this,order_id);
        //   app.wxReq('', act, data, function (info) {
        //     if (that.PullDownRefresh){
        //      wx.stopPullDownRefresh();
        //       that.PullDownRefresh = false;
        //    }
        //    if (info.order_info.length == 0) return;
        //     var order_cancel_reason = [];
        //     var order_cancel_reason_list = info.order_cancel_reason_list;
        //     for (var i in order_cancel_reason_list) {
        //       var cancel_reason = order_cancel_reason_list[i]._reason;
        //       order_cancel_reason.push(cancel_reason);
        //     }
        //     var sys_config = info.system_config;
        //     var order_info = info.order_info.orderEntity;
        //     var sub_order_list = info.order_info.sub_order_list;
        //     var gift_list = info.order_info.orderPromoteGiftList;
        //     var sub_order = info.order_info.sub_order ? info.order_info.sub_order : "";
        //     //倒计时
        //     var intDiff = order_info.intDiff;
        //     time.TimeDown(intDiff,function (date, surplus_time, init_time) {
        //            if (surplus_time <= 0 && init_time > 0){
        //                   that.orderInfoInit(order_id);
        //            }
        //            that.setData({
        //                   count_down: date
        //            })
        //     })
        //     if (order_info.orderStatus == '待付款' && (order_info.pay_code == 'wxpay' || order_info.pay_code == 'wxin') && that.first_time_topay>0){
        //             that.toPay();
        //     }
        //     that.setData({
        //       order_id: order_id,
        //       order_info: order_info,
        //       sub_order: sub_order,
        //       sub_order_list: sub_order_list,
        //       order_cancel_reason_list: order_cancel_reason_list,
        //       order_cancel_reason: order_cancel_reason,
        //       gift_list: gift_list,
        //       sys_config: sys_config,
        //     })
        //     that.first_time_topay = 0;
        //   });
        // },
        // onTurnBack:function(){
        //   wx.switchTab({
        //     url: '../index/index',
        //   }) 

    },
    /**
     * 确定收货
     */
    confirmOrder: function () {
        var that = this;
        wx.showModal({
            title: '确认收货',
            content: '是否已经收到货了',
            success: function (info) {
                if (info.confirm) {
                    let order_id = that.data.order_id;
                    // var act = 'order_confirmOrder';
                    // var data = {
                    //   'order_id': order_id
                    // };
                    return app.BuyApi.confirmGetGoods({
                        data: {
                            orderId: order_id,
                        },
                        other: {
                            isShowLoad: true
                        }
                    }).then(e => {
                        if (e.code == "1") {
                            getOrderInfo.call(that)
                            return Promise.resolve(e);
                        }
                        return Promise.reject();
                    })
                    // app.wxReq('', act, data, function (info) {
                    //   if (info.error > 0) {
                    //     wx.showToast({
                    //       title: info.message,
                    //       image: '/images/micro_mall/cn/err_tip_icon.png'
                    //     })
                    //   } else {
                    //     that.orderInfoInit(order_id);
                    //   }
                    // });
                }
            }
        })

    },
    /**
      * 去支付
      */
    toPay: function () {
        // return app.LM.getUserSimpleInfo(app.LM.userToken).then(res => {
        //     if (res.uId) {
        //         this.toPayReq(res.uId);
        //     }
        // })
        this.toPayReq();
    },
    toPayReq() {
        // let order_id = this.data.order_id;
        // return app.PayApi.getAppletPrepayId({
        //     params: {
        //         order_id: order_id,
        //         pay_type: "",
        //         user_id: userId
        //     },
        //     other: {
        //         isShowLoad: true
        //     }
        // })
        return PayH.UnifiedorderByOrderId("order",this.data.order_id).then(e => {
            if (e.code == "1") {
                let pay_info = e.data;
                WxApi.requestPayment({
                    'timeStamp': pay_info.timeStamp + '',
                    'nonceStr': pay_info.nonceStr,
                    'package': pay_info.package,
                    'signType': pay_info.signType,
                    'paySign': pay_info.sign,
                }).then(e => {
                    this.setData({
                        btn_follow_must_show: 1,
                        // show_pay_load: true
                    })
                    this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
                    this.dialog = this.dialog || this.selectComponent("#pageDialog");
                    let extra = {
                        orderSync:this.orderSync,
                        dialog:this.dialog,
                        type:"mall",
                    }
                    Polling.setPolling(()=>getPayStatus.call(this),()=>pollingSucc.call(this),()=>pollingFail.call(this),"",extra); 
                    // getOrderPayStatus.call(this);
                })
                this.bg = this.bg || this.selectComponent("#bg");
                this.bg.dismiss();

            }
        })
    },
    
    /**
     * 取消订单
     */
    cancelOrder: function (e) {
        let dataset = e.currentTarget.dataset;
        if (dataset.opType) {
            this.opType = dataset.opType || 1;
        }
        let cancel_reson_sel_id = parseInt(e.detail.value);
        if (!isNaN(cancel_reson_sel_id)) {
            let cancel_reason_id = this.data.order_cancel_reason_list[cancel_reson_sel_id].id;
            let cancleActionStatus = this.data.order_info.cancleActionStatus;
            let order_id = this.data.order_id;
            return app.CL_BuyApi.cancelOrApplyCancelOrder({
                data: {
                    "orderId": order_id,
                    "cancel_reason_id": cancel_reason_id,
                    "opType": this.opType,
                },
                other: {}
            }).then(e => {
                if (e.code == "1") {
                    app.SMH.showToast({
                        "title": this.opType == "1" ? "取消成功" : "申请成功"
                    })
                    getOrderInfo.call(this);
                    return Promise.resolve(e);
                }
                return Promise.reject();
            })
        }
    },
    jump_order: function (e) {
        let dataset = e.currentTarget.dataset || {};
        let invoiceNo = dataset.invoiceNo;
        console.log('invoiceNo', invoiceNo)
        wx.navigateTo({
            url: '/pages/micro_mall/shipping_info/shipping_info?invoiceNo=' + invoiceNo + '&orderId=' + this.data.order_id,
        })
    },
    jump_detail: function (e) {
        const id = e.currentTarget.dataset.id;
        const colorId = e.currentTarget.dataset.colorId || 0;
        if (colorId) {
            wx.navigateTo({
                url: `/pages/micro_mall/goods/goods_info?goods_id=${id}&color_id=${colorId}`,
            })
        } else {
            wx.navigateTo({
                url: `/pages/micro_mall/goods/goods_info?goods_id=${id}`,
            })
        }
    },
    onTurnBack: function (e) {
        wx.switchTab({
            url: '/pages/micro_mall/index/index',
        })
    },
    handle_br(e) {
        let dataset = e.currentTarget.dataset || {};
        let code = dataset.code || '';
        let that = this;
        barcode('br_code', code, 660, 200);
        clearTimeout(that.cancelId);
        this.setData({
            barcodeCard: code || '',
            show_br: !that.data.show_br,
        });
        let _timer1 = setTimeout(() => {
            clearTimeout(_timer1);
            that.setData({
                showBrStyle: "opacity:1;"
            });
        }, 100)
        let _timer2 = setTimeout(() => {
            clearTimeout(_timer2);
            that.setData({
                delay_br: true
            });
        }, 400)
    },
    _noFn() { },
    cancel_br() {
        let that = this;
        that.setData({
            showBrStyle: "opacity:0;",
            delay_br: false
        });
        clearTimeout(that.cancelId);
        that.cancelId = setTimeout(() => {
            clearTimeout(that.cancelId);
            that.setData({
                show_br: false,
            })
        }, 300);
    },
    initConf(){  
      return this.trimConfigs(['return_day_limit','close_order_remark']).then(list=>{
        let _setData={};
        list&&list.forEach(item=>{
          if(item.Key == 'return_day_limit'){
            _setData.enable_returns = item.Value||0;
          }else if(item.Key == 'close_order_remark'){
            _setData.isShowRemark = !!(item.Value != 1);
          }
        })
        this.setData({..._setData});
        return list
      })
    }
}))
//
function getOrderInfo() {
    let order_id = this.data.order_id || 0;
    if (!order_id) {
        app.SMH.showToast({
            "title": "无效订单ID"
        })
        return
    };
    return app.BuyApi.getALLOrderEntity({
        params: {
            orderId: order_id,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            if (this.PullDownRefresh) {
                wx.stopPullDownRefresh();
                this.PullDownRefresh = false;
            }
            let order_info = data.orderEntity;
            let sub_order_list = data.subOrderList || [];
            let gift_list = data.orderPromoteGiftList;
            let sub_order = data.sub_order ? data.sub_order : "";
            let orderDetailList = data.orderDetailList;
            // order_info.auto_cancel_date = '2019-03-27 15:24:30'
            if (order_info && (order_info.orderStatus == '待付款' && MyDate.parse(order_info.auto_cancel_date) > MyDate.parse(order_info.curr_date))) {
                this.setData({
                    showTimeOut: true
                })
                startCountDown.call(this, order_info.curr_date, order_info.auto_cancel_date)
            } else if (order_info && (order_info.orderStatus == '待付款')) {
                this.setData({
                    endOrder: true
                })
            } else if (order_info && (order_info.orderStatus == '待收货') && order_info.invoice_no) {
                order_info.show_invoice_no = order_info.invoice_no.split('#');
            }
            if (order_info.order_status_Id == '1' && order_info.paystatus_Id == '0' && (order_info.pay_code == 'wxpay' || order_info.pay_code == 'wxin') && this.first_time_topay > 0) {
                this.toPay();
            }

            this.setData({
                order_id: order_id,
                order_info: order_info,
                sub_order: sub_order,
                sub_order_list: sub_order_list,
                order_detail_list: orderDetailList,
                gift_list: gift_list,
                // show_pay_load: false,
            })
            this.first_time_topay = 0;
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    })
}
 
//获取原因
function getCancelReasion() {
    return app.CL_BuyApi.getOrderCancelReasonList({
        params: {
            // brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            let order_cancel_reason = [];
            let order_cancel_reason_list = data;
            for (let i in order_cancel_reason_list) {
                let cancel_reason = order_cancel_reason_list[i].reason;
                order_cancel_reason.push(cancel_reason);
            }
            this.setData({
                order_cancel_reason_list: order_cancel_reason_list,
                order_cancel_reason: order_cancel_reason,
            })
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}
//检测订单支付转态
function getOrderPayStatus() {
    let options = this.options;
    return app.CL_BuyApi.checkOrderPay({
        params: {
            orderId: options.order_id,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            if (e.data == 2) {
                getOrderInfo.call(this);
            } else if (e.data == 0) {
                let _timer = setTimeout(function () {
                    clearTimeout(_timer);
                    getOrderPayStatus.call(this);
                }.bind(this), 3000);
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
                wx.navigateBack({
                    delta: 1
                })
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
 
function getPayStatus(){
    let options = this.options;
    return app.CL_BuyApi.checkOrderPay({
      params: {
        orderId: options.order_id,
      },
      other: {
        isShowLoad: true
      }
    }).then(res=>{
        console.log('then',res);
        return Promise.resolve(res);
    }).catch(e=>{
        console.log('catch',e)
        return Promise.resolve(e);
    }) 
  }
  
  
  function pollingSucc(){
    getOrderInfo.call(this);
  }
  
  function pollingFail(){ 
    wx.redirectTo({
      url: '/pages/micro_mall/order/assist_guest',
    })
  } 