// pages/micro_mall/bargain/bargain/order_confirm.js
import Utils from "../../../../common/support/utils/utils";
import WxApi from '../../../../common/helper/wx-api-helper.js';
import PayH from '../../../../common/helper/handle/payHandle.js'
import Polling from '../../../../common/helper/polling.js'
var app = getApp();
Page(app.BP({
    data: {
        isIphoneX: app.SIH.isIphoneX,
        addressId: 0,
        isHidden: true
    },
    onLoad: function (options) {
        this.userActivityId = options.userActivityId;
        this.isFromOrder = options.isFromOrder;
        this.loading = false;
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        this.setData({
            rightbutton
        });
    },
    onShow: function () {
        loadData.call(this);
    },
    onUnload() {
        Polling.stopPolling();
    },
    addOrder() {
        toPay.call(this, this.orderId, this.data.infoEntity);
    }
}))

function loadData() {
    if (!this.loading) {
        this.loading = true;
        return app.BargainApi.getUserHagglePriceSettlementPage({
            params: {
                userToken: app.LM.userToken,
                brandCode: app.Conf.BRAND_CODE,
                userActivityId: this.userActivityId || 0,
                addressId: 0
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data;
            if (res.code == 1) {
                this.setData({
                    goodsEntity: data.goodsEntity,
                    infoEntity: Object.assign({}, {
                        ...data.infoEntity
                    }, {
                        totalYouHuiPrice: Number(data.infoEntity.totalYouHuiPrice) ? data.infoEntity.totalYouHuiPrice : 0,
                        shippingFee: Number(data.infoEntity.shippingFee) ? data.infoEntity.shippingFee : 0
                    }),
                    isHidden: false
                });
                if (data.infoEntity.orderId) this.orderId = data.infoEntity.orderId;
                if (this.isFromOrder) {
                    toPay.call(this, this.orderId, this.data.infoEntity);
                }
                return Promise.resolve(data);
            } else {
                app.SMH.showToast({
                    "title": res.msg
                });
                return Promise.reject(res);
            }
        }).finally(() => {
            this.loading = false;
        });
    }
}

function toPay(order_id, infoEntity) {
    if (!(infoEntity.totalPrice > 0)) {
        this.isFromOrder = false;
        poolingFnc.call(this);
        return;
    }
    if (this.isLoading) return;
    this.isLoading = true;
 
    return PayH.UnifiedorderByOrderId({type:"bargain",order_id,orderInfo:getPaymentOrderinfo(this)}).then(e => {
        poolingFnc.call(this); //订单同步
    }).finally(() => {
        this.isFromOrder = false;
        let timer = setTimeout(() => {
            this.isLoading = false;
            clearTimeout(timer);
            timer = null;
        })
    });
}
  
function poolingFnc() {
    this.orderSync = this.orderSync || this.selectComponent("#orderSync");
    this.dialog = this.dialog || this.selectComponent("#pageDialog");
    let extra = {
        orderSync: this.orderSync,
        dialog: this.dialog,
    }
    Polling.setPolling(() => getPayStatus.call(this), () => pollingSucc.call(this), () => pollingFail.call(this), "", extra);
}

function pollingSucc() {
    let _timer = setTimeout(() => {
        clearTimeout(_timer);
        loadData.call(this).then(data => {
            if (data.infoEntity && data.infoEntity.payStatus == 1) {
                wx.redirectTo({
                    url: '/pages/micro_mall/bargain/index/my_bargain',
                })
            }
        })
    }, 300);
}

function pollingFail() {
    wx.redirectTo({
        url: '/pages/micro_mall/bargain/index/my_bargain',
    })
}

function getPayStatus() {
    return app.BargainApi.get_HagglePricePayStatus({
        params: {
            orderId: this.orderId,
            brandCode: app.Conf.BRAND_CODE
        }
    }).then(res => {
        console.log('then', res)
        return Promise.resolve(res);
    }).catch(e => {
        console.log('catch', e)
        return Promise.resolve(e);
    })
}

function getPaymentOrderinfo(_this) {
    let goods = _this.data.goodsEntity || [];
    let orderInfos = _this.data.infoEntity || {};
    let orderDetailList = [];
    orderDetailList.push({
        productId: goods.productId,
        product_sn: goods.productSn,
        goods_num: goods.number,
        market_price: goods.marketPrice,
        goodPrice: goods.hagglePrice,
        goodsId: goods.goodsId, 
        goods_Name: goods.goodsName,
        img_url: goods.goodsImg
    })
    return {
        orderEntity: {
            order_id: orderInfos.orderId,
            order_amount: orderInfos.totalPrice
        },
        orderDetailList: orderDetailList
    }
}