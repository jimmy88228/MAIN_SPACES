// order_info.js
import time from '../../../../utils/timeDownOrderInfo.js'
import WxApi from '../../../../helper/wx-api-helper.js'
var app = getApp();
Page(app.BP({

    data: {
        brand_info: {},
        order_info: {},
        sub_order: false,
        sub_order_list: [],
        order_cancel_reason_list: [],
        order_cancel_reason: {},
        gift_list: [],
        btn_follow_must_show: 0,
        show_pay_load: false,
        /*倒计时*/
        count_down: {
            day: 0,
            hour: 0,
            min: 0,
            sec: 0
        },
        sys_config: {}
    },
    first_time_topay: 0,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //
        this.options = options;
        let first_time_topay = options.first_time_topay;
        app.sysTemConfig().then(sysConf =>{
          this.setData({
            sys_config: sysConf
          })
        })
        if (first_time_topay) {
            this.first_time_topay = first_time_topay;
            this.bg = this.bg || this.selectComponent("#bg");
            this.bg.show();
        }
    },
 
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let order_id = this.options.order_id;
        if (!this.data.show_pay_load) {
            getOrderInfo.call(this, order_id);
            getCancelReasion.call(this);
        }
    },
    onReady(){
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
            bg_color: bg_color
        })
    },
    onHide: function() {
        time.destroy();
    },
    onUnload: function() {
        time.destroy();
    },
    onPullDownRefresh() {
        this.PullDownRefresh = true;
        getOrderInfo.call(this, this.options.order_id);
    },
    /**
     *去评价 
     */
    toComment: function() {
        wx.navigateTo({
            url: '../comment/mobile_order_comment/mobile_order_comment?order_id=' + this.options.order_id,
        })
    },
    /**
     * 确定收货
     */
    confirmOrder: function() {
        let that = this;
        wx.showModal({
            title: '确认收货',
            content: '是否已经收到货了',
            success: function(info) {
                if (info.confirm) {
                    let order_id = that.options.order_id;
                    return app.BuyApi.confirmGetGoods({
                        data: {
                            orderId: order_id,
                            userToken: app.LM.userToken,
                            brandCode: app.Conf.BRAND_CODE
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
                }
            }
        })

    },
    /**
     * 去支付
     */
    toPay: function() {
        let that = this;
        return app.PayApi.getAppletPrepayId({
            params: {
                order_id: this.options.order_id,
                pay_type: "bp"
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
                    this.setData({
                        btn_follow_must_show: 1,
                        show_pay_load: true
                    })
                    getOrderPayStatus.call(this);
                })
                this.bg = this.bg || this.selectComponent("#bg");
                this.bg.dismiss();

            }

        })
    },
    /**
     * 取消订单
     */
    cancelOrder: function(e) {
        let that = this;
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle("确定取消订单吗？");
        this.pageDialog.setTwoBtn({
          name: "返回",
        }, {
            name: "取消订单",
            tap: function () {
              // exchangeBonus.call(that, mkBonusId);
              cancelOrderReq.call(that);
            }
          })
        this.pageDialog.show();
        // let cancel_reson_sel_id = parseInt(e.detail.value);
        // if (!isNaN(cancel_reson_sel_id)) {
        //     let cancel_reason_id = this.data.order_cancel_reason_list[cancel_reson_sel_id].id;
        //     let cancleActionStatus = this.data.order_info.cancleActionStatus;
        //     let order_id = this.data.order_id;
        //     return app.PointApi.cancelPointMkGoodOrder({
        //         data: {
        //             "orderId": order_id,
        //             "userToken": app.LM.userToken,
        //             "cancel_reason_id": cancel_reason_id,
        //             "opType": this.opType,
        //             "brandCode": app.Conf.BRAND_CODE
        //         },
        //         other: {}
        //     }).then(e => {
        //         if (e.code == "1") {
        //             app.SMH.showToast({
        //               "title": this.opType == "1" ? "取消成功": "申请成功"
        //             })
        //             getOrderInfo.call(this);
        //             return Promise.resolve(e);
        //         }
        //         return Promise.reject();
        //     })
        // }
    },
    jump_order: function(e) {
        let dataset = e.currentTarget.dataset;
        let invoiceNo = dataset.invoiceNo;
        wx.navigateTo({
          url: '/pages/micro_mall/shipping_info/shipping_info?invoiceNo=' + invoiceNo + '&orderId=' + this.options.order_id,
        })
    },
    jump_detail:function(e){
        const id = e.currentTarget.dataset.id; 
        if(id){
          wx.navigateTo({
            url: `/pages/micro_mall/goods/goods_info?goods_id=${id}`,
          })
        }
        
    },
    onTurnBack:function(e){
        wx.switchTab({
            url: '/pages/micro_mall/index/index',
        }) 
    },
    copy(){
      if (this.isLoadingBtn) return
      isLoadingBtn.call(this);
      wx.setClipboardData({
        data: this.data.order_info.mkOrderSn || ""
      })
    }
}))
//
function getOrderInfo() {
    let order_id = this.options.order_id || 0;
    if(!order_id) {
      app.SMH.showToast({
        "title":"无效订单ID"
      })
      return
    };
    return app.PointApi.getPointMkGoodOrderDetail({ //jimmy4
        params: {
            mkOrderId: order_id,
            brandCode: app.Conf.BRAND_CODE,
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
            let order_info = data.orderInfo;
            let store_info = data.storeInfo;
            let order_goods = data.orderGoods;
            // let sub_order_list = data.subOrderList || [];
            // let gift_list = data.orderPromoteGiftList;
            // let sub_order = data.sub_order ? data.sub_order : "";
            // let orderDetailList = data.orderDetailList;
            //倒计时
            // let intDiff = order_info.intDiff || 0;
            // time.TimeDown(intDiff, function(date, surplus_time, init_time) {
            //     if (surplus_time <= 0 && init_time > 0) {
            //         getOrderInfo.call(this);
            //     }
            //     this.setData({
            //         count_down: date
            //     })
            // })
          if (order_info.order_status == '1' && order_info.pay_status == '0' && this.first_time_topay > 0 && order_info.pay_name == "微信支付") {
                this.toPay();
            }

            this.setData({
                order_id: order_id,
                order_info: order_info,
                order_goods: order_goods,
                store_info,
                // sub_order: sub_order,
                // sub_order_list: sub_order_list,
                // order_detail_list: orderDetailList,
                // gift_list: gift_list,
                show_pay_load: false,
            })
            this.first_time_topay = 0;
            app.sysTemConfig("return_day_limit").then(e => {
                order_info.enable_returns = e.Value || 0
                this.setData({
                    order_info: order_info
                })
            })
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    })
}
// function getStoreOrderInfo() {
//     return app.BuyApi.getStoreOrderDetail({
//         params: {
//             orderSn: this.options.order_sn,
//             brandCode: app.Conf.BRAND_CODE,
//         },
//         other: {
//             isShowLoad: true
//         }
//     }).then(e => {
//         if (e.code == "1") {
//             let data = e.data;
//             if (this.PullDownRefresh) {
//                 wx.stopPullDownRefresh();
//                 this.PullDownRefresh = false;
//             }
//             // var sys_config = info.system_config;
//             let order_info = data.orderEntity;
//             let sub_order_list = data.subOrderList || [];
//             let gift_list = data.orderPromoteGiftList;
//             let sub_order = data.sub_order ? data.sub_order : "";
//             let orderDetailList = data.orderDetailList;
//             //倒计时
//             let intDiff = order_info.intDiff || 0;
//             time.TimeDown(intDiff, function (date, surplus_time, init_time) {
//                 if (surplus_time <= 0 && init_time > 0) {
//                     getOrderInfo.call(this);
//                 }
//                 this.setData({
//                     count_down: date
//                 })
//             })
//             if (order_info.order_status_Id == '1' && order_info.paystatus_Id == '0' && (order_info.pay_code == 'wxpay' || order_info.pay_code == 'wxin') && this.first_time_topay > 0) {
//                 this.toPay();
//             }

//             this.setData({
//                 order_id: order_id,
//                 order_info: order_info,
//                 sub_order: sub_order,
//                 sub_order_list: sub_order_list,
//                 order_detail_list: orderDetailList,
//                 gift_list: gift_list,
//                 show_pay_load: false,
//             })
//             this.first_time_topay = 0;
//             app.sysTemConfig("return_day_limit").then(e => {
//                 order_info.enable_returns = e.Value || 0
//                 this.setData({
//                     order_info: order_info
//                 })
//             })
//             console.log('=============', order_info)
//             return Promise.resolve(e);
//         }
//         return Promise.reject(e);
//     })
// }
//获取原因
function getCancelReasion() {
    return app.BuyApi.getOrderCancelReasonList({
        params: {
            brandCode: app.Conf.BRAND_CODE
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
function cancelOrderReq(){
  let order_id = this.options.order_id;
  return app.PointApi.cancelPointMkGoodOrder({
    data: {
      "mkOrderId": order_id,
      "brandCode": app.Conf.BRAND_CODE
    },
    other: {}
  }).then(e => {
    if (e.code == "1") {
      let msg = "";
      if(e.data == 1){
        msg = "取消成功";
        getOrderInfo.call(this);
      }else{
        msg = "取消失败";
      }
      app.SMH.showToast({
        "title": msg
      })
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.dismiss();
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
//检测订单支付转态
function getOrderPayStatus() {
    let options = this.options;
    return app.BuyApi.getOrderPayStatus({
        params: {
            userToken: app.LM.userToken,
            orderId: options.order_id,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            if (e.data == 2) {
                getOrderInfo.call(this);
            } else if (e.data == 0) {
                let _timer = setTimeout(function() {
                    clearTimeout(_timer);
                    getOrderPayStatus.call(this);
                }.bind(this), 3000);
            }
            return Promise.resolve(e);
        }
        return Promise.reject();
    }).catch(error => {
        let _timer = setTimeout(function() {
            clearTimeout(_timer);
            getOrderInfo.call(this);
        }.bind(this), 6000);
    });
}


function isLoadingBtn(time = 350) {
  this.isLoadingBtn = true;
  this.isLoadingBtnId = setTimeout(() => {
    this.isLoadingBtn = false
  }, time)
}