// pages/store_pay/pay_code/qr_code.js
import {
    qrcode,
    barcode
} from "../../../utils/goComplete/index.js"
import WxApi from '../../../helper/wx-api-helper.js';
import Polling from '../../../helper/polling.js';
import PayH from '../../../helper/handle/payHandle.js';

const app = getApp();
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        code_data: {
            qr_pay_code: ''
        },
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
    },
    beforeInfo: {
      payment_id: 0,
      // pay_id: 0, //
      // offline_sn: '', //
      // bonus_id: '',
      // user_point: 0,
      // is_user_balance: 0,
      // is_user_point: 0,
      // prepaid_cardid: '',
      storeId: '', //
      // prepaid_card_money: 0,
      payment_status: 0,
    },
    refresh_timer:null,
    check_timer: null,
    refresh_time: 60000,
    check_time: 3000,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        getPayCode.call(this);
    },
    onShow: function() {
        if(!this.data.show_pay_pop){
          getPayCode.call(this);
        }else{
          //是否选择优惠券
          this.selectBouns();
        }
    },
    onHide: function() {
        clearInterval(this.check_timer);
        clearInterval(this.refresh_timer);
    },
    onUnload: function() {
        clearInterval(this.check_timer);
        clearInterval(this.refresh_timer);
        Polling.stopPolling();
    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    refreshCode: function() {
        getPayCode.call(this);
    },
    /**
     * 支付弹框动画
     */
    showPayInfo: function(is_show = false) {
        this.setData({
            show_pay_pop: "isshow"
        })
    },
    closePayInfo: function() {
        this.setData({
            show_pay_pop: 'ishide'
        })
        getPayCode.call(this);
        this.check_timer = setInterval( ()=> {
            getOfflineOrderInfo.call(this);
        }, this.check_time);
    },

    /**
     * 选择更新支付信息
     */
    updatePayInfo: function(func) {
        getJiesuan.call(this);
    },

    /**
     * 使用积分
     */
    usePoint: function() {
        if(this.clicking) return;
        let usePoint = this.data.usePoint;
        this.setData({
            usePoint: !usePoint
        });
        getJiesuan.call(this);
    },
    /**使用余额 */
    useBalanceHandle() {
        if(this.clicking) return;
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
        if(this.clicking) return;
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
        if(this.clicking) return;
        let bonus_info = this.data.bonus_info || {}
        if(parseInt(bonus_info.canUseCouponNum) > 0){
          let userChoiceData = app.StorageH.get("userChoiceData") || {};
          let use_bonus = userChoiceData.use_coupon || {};
          let select_bonus = this.data.select_bonus || {};
          if (select_bonus.bonus_id == use_bonus.bonus_id) {
            return;
          }
          this.setData({
            select_bonus: use_bonus
          })
          console.log(this.data.select_bonus,"select_bonus");
          getJiesuan.call(this);
        }
    },
    /**
     * 选择支付方式
     */
    selectPayMode: function(e) {
        if(this.clicking) return;
        let payId = e.currentTarget.dataset.payId;
        this.setData({
          payId: payId
        });
        getJiesuan.call(this);
    },
    confirmToPay: function() {
        updateOrderInfo.call(this);
    },
}))
//获取二维码
function getPayCode() {
    var that = this;
    return app.SmktPayApi.getPayCode({
        params: {
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userToken
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            var qr_pay_code = e.data;
            var code_data = {
                qr_pay_code: qr_pay_code
            }
            this.setData({
                code_data: code_data
            });
            qrcode('payCode', qr_pay_code, 450, 450);
            barcode('barCanvas', qr_pay_code, 500, 150);
            clearInterval(this.refresh_timer);
            clearInterval(this.check_timer);
            this.refresh_timer = setInterval(function() {
                getPayCode.call(that);
            }, this.refresh_time);
            this.check_timer = setInterval(function() {
                getOfflineOrderInfo.call(that);
            }, this.check_time);
            return Promise.resolve(data);
        }
        return Promise.reject();
    })
}
//获取扫码状态
function getOfflineOrderInfo() {
    let qr_pay_code = this.data.code_data.qr_pay_code;
    return app.SmktPayApi.getOfflineOrderInfo({
        params: {
            pay_barcode: qr_pay_code,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userToken
        },
        other:{
          isShowLoad: false
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data || {};
            let payment_id = data.payment_id;
            if (payment_id) {
                wx.showLoading({
                    "title": "获取支付信息..."
                });
                this.beforeInfo.payment_status = data.payment_status;
                this.beforeInfo.storeId = data.store_id;
                this.beforeInfo.payment_id = data.payment_id;
                //停止刷新二维码
                clearInterval(this.refresh_timer);
                clearInterval(this.check_timer);
                if (data.payment_status) {
                    wx.redirectTo({
                        url: '/pages/store_pay/pay_result/pay_result?payment_id=' + data.payment_id,
                    });
                    return;
                }
                getJiesuan.call(this);
            }
            return Promise.resolve();
        }
        return Promise.reject();
    })
}

function getOrderStatus(is_topay = false) {
    let beforeInfo = this.beforeInfo || {};
    let payment_id = beforeInfo.payment_id;
    if(!payment_id) return Promise.resolve({});
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
            if (pay_status == 1) {
                app.StorageH.set("use_bonus", "");
                app.StorageH.set("usePrepaids", "");
                wx.redirectTo({
                    url: '../pay_result/pay_result?payment_id=' + payment_id,
                })
            }
            if (is_topay) {
                toPay.call(this);
            }
            return Promise.resolve(e);
        }
        return Promise.resolve(e);
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
            IsUseBalance: this.data.useBalance ? 1: 0,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userToken
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let payId = this.data.payId; 
            let data = e.data || {};
            let pay_info = data.pay_info;
            let bonus_info = data.bonusEntity;
            this.data.select_bonus.type_money = bonus_info.canUseCouponMoney;
            let orderInfo = data.orderinfoEntity;
            let paymentList = data.payList;
            if (!payId) {
                payId = paymentList[0].pay_id;
            }
            //设置请求参数
            beforeInfo.payment_status = orderInfo.payment_status;
            beforeInfo.payment_id = orderInfo.payment_id;
            beforeInfo.storeId = data.post_store_id;
            this.beforeInfo = beforeInfo || {};
            //
            let balanceInfo = data.balanceEntity || {};
            if (!(balanceInfo.canUsebalance && parseFloat(balanceInfo.canUsebalance) > 0)){
              this.setData({
                useBalance: false
              })
            }
            let pointInfo = data.userPointEntity || {};
            if (!(pointInfo.allowPoint && parseFloat(pointInfo.allowPoint) > 0)){
              this.setData({
                usePoint: false
              })
            }
            let prepaidInfo = data.storedValueEntity || {};
            if (!(prepaidInfo.canUseStoredValue && parseFloat(prepaidInfo.canUseStoredValue) > 0)){
              this.setData({
                usePrepaid: false
              })
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
                balanceInfo: balanceInfo,
                // select_bonus: this.data.select_bonus
            })
            //支付信息弹框动画
            this.showPayInfo(true);
            return Promise.resolve();
        }
        return Promise.reject();
    }).finally(() => {
      this.clicking = false;
    })
}

function updateOrderInfo() { //更新订单信息
    let beforeInfo = this.beforeInfo || {};
    let payment_id = beforeInfo.payment_id || 0;
    if(!payment_id) return;
    let select_bonus = this.data.select_bonus || {};
    return app.SmktPayApi.updateOfflineOrderInfoByPayInfo({
        data: {
            paymentId: payment_id,
            pay_id: this.data.payId,
            bonusId: select_bonus.bonus_id || 0,//this.beforeInfo.bonus_id,
            IsUsePoint: this.data.usePoint ? 1 : 0, //使用的积分吧？
            prepaidCardIds: "",
            isUseStoredValue: this.data.usePrepaid ? 1 : 0,
            IsUseBalance: this.data.useBalance ? 1: 0, //使用的余额
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userToken
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;

            if (this.data.payId == 3 || this.data.payId == 4) {
                wx.redirectTo({
                    url: '../pay_result/pay_result?payment_id=' + payment_id,
                })
            } else {
                if (data > 0) {
                    getOrderStatus.call(this, 'toPay');
                } else {
                    wx.redirectTo({
                        url: '../pay_result/pay_result?payment_id=' + payment_id,
                    })
                }

            }
            //toPay.call(this);
            return Promise.resolve();
        }
    })
}

function toPay() {
   let beforeInfo = this.beforeInfo || {};
    // return app.PayApi.getAppletPrepayId({
    // // return app.PayApi.getAppletPrepayId({
    //     params: {
    //         order_id: beforeInfo.payment_id,
    //         pay_type: "sp"
    //     },
    //     other: {
    //         isShowLoad: true
    //     }
    // })
    return PayH.UnifiedorderByOrderId("sp",beforeInfo.payment_id).then(e => {
        if (e.code == "1") {
            let pay_info = e.data;
            WxApi.requestPayment({
                'timeStamp': pay_info.timeStamp + '',
                'nonceStr': pay_info.nonceStr,
                'package': pay_info.package,
                'signType': pay_info.signType,
                'paySign': pay_info.sign,

            }).then(e => {
                if (e.errMsg.indexOf('ok') != -1) {
                    // getOrderStatus.call(this);
                    poolingFnc.call(this);
                }
                // getOrderStatus.call(this);
            })
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
    let beforeInfo = this.beforeInfo || {};
    let payment_id = beforeInfo.payment_id;
    console.log('payment_id jimmy',payment_id)
    wx.setStorageSync("use_bonus", "");
    wx.setStorageSync("usePrepaids", "");
    wx.redirectTo({
        url: '../pay_result/pay_result?payment_id=' + payment_id,
    })
}

function pollingFail(){
    let beforeInfo = this.beforeInfo || {};
    let payment_id = beforeInfo.payment_id;
    console.log('payment_id jimmy',payment_id)
    wx.redirectTo({
        url: '../pay_result/pay_result?payment_id=' + payment_id,
    })
}