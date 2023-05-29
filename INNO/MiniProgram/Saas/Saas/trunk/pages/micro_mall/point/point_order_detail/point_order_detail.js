import WxApi from '../../../../common/helper/wx-api-helper.js'
import PayH from '../../../../common/helper/handle/payHandle.js'
import Polling from '../../../../common/helper/polling.js'
import appUtils from '../../../../common/support/utils/utils.js';
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
        // show_pay_load: false,
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
        getOrderInfo.call(this, order_id);
        getCancelReasion.call(this);
        // if (!this.data.show_pay_load) {
        // }
    },
    onReady(){
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
            bg_color: bg_color
        })
    },
    onUnload: function() {
        Polling.stopPolling();
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
    toPay: function(orderInfo) {
        console.log("触发支付")
        appUtils.throttle(()=>{
            console.log("按钮回调")
            if(this.isLoading) return;
            this.isLoading = true;
            console.log("按钮回调 进入支付请求")
            let order_id = this.options.order_id||0;
            return PayH.UnifiedorderByOrderId({type:"bp",order_id,orderInfo:getPaymentOrderinfo(this)})
            .then(e => {
                this.setData({
                    btn_follow_must_show: 1,
                })
                this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
                this.dialog = this.dialog || this.selectComponent("#pageDialog");
                let extra = {
                    orderSync:this.orderSync,
                    dialog:this.dialog,
                    type:"point",
                }
                Polling.setPolling(()=>getPayStatus.call(this),()=>pollingSucc.call(this),()=>pollingFail.call(this),"",extra); 
            }).finally(()=>{
                this.bg = this.bg || this.selectComponent("#bg");
                this.bg.dismiss(); 
                this.isLoading = false;
            })
        })();
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
              cancelOrderReq.call(that);
            }
          })
        this.pageDialog.show();
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
        appUtils.throttle(()=>{
            wx.setClipboardData({
                data: this.data.order_info.mkOrderSn || ""
            }) 
        })()
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
    return app.PointApi.getPointMkGoodOrderDetail({
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
            if (order_info.order_status == '1' && order_info.pay_status == '0' && this.first_time_topay > 0) {
        //   if (order_info.order_status == '1' && order_info.pay_status == '0' && this.first_time_topay > 0 && (order_info.pay_name == "微信支付"||order_info.pay_name == "现金支付")) {
                this.toPay(order_info);
            }
            this.setData({
                order_id: order_id,
                order_info: order_info,
                order_goods: order_goods,
                store_info,
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
// //检测订单支付转态
// function getOrderPayStatus() {
//     let options = this.options;
//     return app.BuyApi.getOrderPayStatus({
//         params: {
//             userToken: app.LM.userToken,
//             orderId: options.order_id,
//             brandCode: app.Conf.BRAND_CODE
//         },
//         other: {
//             isShowLoad: true
//         }
//     }).then(e => {
//         if (e.code == "1") {
//             if (e.data == 2) {
//                 getOrderInfo.call(this);
//             } else if (e.data == 0) {
//                 let _timer = setTimeout(function() {
//                     clearTimeout(_timer);
//                     getOrderPayStatus.call(this);
//                 }.bind(this), 3000);
//             }
//             return Promise.resolve(e);
//         }
//         return Promise.reject();
//     }).catch(error => {
//         let _timer = setTimeout(function() {
//             clearTimeout(_timer);
//             getOrderInfo.call(this);
//         }.bind(this), 6000);
//     });
// }

function pollingSucc(){
    getOrderInfo.call(this);
}
function pollingFail(){
    wx.redirectTo({
      url: '/pages/micro_mall/point/point_record/point_record',
    })
}
function getPayStatus(){
    let options = this.options;
    let order_info = this.data.order_info||{};
    return app.PointApi.GetMkOrderPayStatus({
        params: {
            orderSn: order_info.mkOrderSn||"",
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(res=>{
        return Promise.resolve(res);
    }).catch(e=>{
        return Promise.resolve(e);
    }) 
}

function getPaymentOrderinfo(_this){
    let goods_info = _this.data.order_goods || [];
    let order_info = _this.data.order_info || {};
    let orderDetailList = [];
    orderDetailList.push({
      productId: 1,
      product_sn: "sku",
      goods_num: goods_info.number,
      market_price: goods_info.market_price,
      goodPrice: goods_info.salesPrice,
      goodsId: 1,
      goods_Name: goods_info.goodsName,
      img_url: goods_info.goodsImg
    })
    return {
      orderEntity: {
        order_id: _this.options.order_id,
        order_amount: order_info.orderAmount
      },
      orderDetailList: orderDetailList
    }
} 