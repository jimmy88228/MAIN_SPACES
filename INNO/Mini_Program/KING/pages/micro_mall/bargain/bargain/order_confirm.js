// pages/micro_mall/bargain/bargain/order_confirm.js
import Utils from "../../../../support/utils/utils";
import WxApi from '../../../../helper/wx-api-helper.js';
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
    addOrder() {
        toPay.call(this, this.orderId);
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
                    infoEntity: Object.assign({}, { ...data.infoEntity}, {
                        totalYouHuiPrice: Number(data.infoEntity.totalYouHuiPrice) ? data.infoEntity.totalYouHuiPrice : 0,
                        shippingFee: Number(data.infoEntity.shippingFee) ? data.infoEntity.shippingFee : 0
                    }),
                    isHidden: false
                });
                if (data.infoEntity.orderId) this.orderId = data.infoEntity.orderId;
                if (this.isFromOrder) {
                    toPay.call(this, this.orderId);
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

function toPay(order_id) {
    return app.PayApi.getAppletPrepayId({
        params: {
            order_id: order_id,
            pay_type: "bargain"
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let pay_info = e.data;
            //微信支付
            WxApi.requestPayment({
                'timeStamp': pay_info.timeStamp + '',
                'nonceStr': pay_info.nonceStr,
                'package': pay_info.package,
                'signType': pay_info.signType,
                'paySign': pay_info.sign
            }).then(e => {
                let userActivityId = this.userActivityId;
                if (e.errMsg.indexOf('ok') != -1) {
                    let _timer = setTimeout(() => {
                        clearTimeout(_timer);
                        wx.redirectTo({
                            url: "/pages/micro_mall/bargain/index/my_bargain"
                        });
                    }, 300);
                }
                return e;
            });
        } else {
            app.SMH.showToast({
                title: e.msg || '支付订单异常'
            })
        }
    }).catch(e => {
        app.SMH.showToast({
            title: e.msg || '订单异常'
        });
    }).finally(() => {
        this.isFromOrder = false;
    });
}

let controlClick = Utils.debounce(fn => {
    fn();
}, 400);