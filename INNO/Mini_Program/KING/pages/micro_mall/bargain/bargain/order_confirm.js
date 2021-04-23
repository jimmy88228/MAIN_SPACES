// pages/micro_mall/bargain/bargain/order_confirm.js
import Utils from "../../../../support/utils/utils";
import WxApi from '../../../../helper/wx-api-helper.js';
import PayH from '../../../../helper/handle/payHandle.js'
import Polling from '../../../../helper/polling.js'
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
    onUnload(){
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
                    infoEntity: Object.assign({}, { ...data.infoEntity}, {
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
    // return app.PayApi.getAppletPrepayId({
    //     params: {
    //         order_id: order_id,
    //         pay_type: "bargain"
    //     },
    //     other: {
    //         isShowLoad: true
    //     }
    // })
    if(!(infoEntity.totalPrice > 0)){
        this.isFromOrder = false;
        poolingFnc.call(this);
        return;
    }
    return PayH.UnifiedorderByOrderId("bargain",order_id)
    .then(e => {
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
                    poolingFnc.call(this); 
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



function poolingFnc(){ 
    this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
    this.dialog = this.dialog || this.selectComponent("#pageDialog");
    let extra = {
        orderSync:this.orderSync,
        dialog:this.dialog,
    }
    Polling.setPolling(()=>getPayStatus.call(this),()=>pollingSucc.call(this),()=>pollingFail.call(this),"",extra); 
}

function pollingSucc(){
    let _timer = setTimeout(() => {
        clearTimeout(_timer);
        loadData.call(this).then(data=>{
            if (data.infoEntity && data.infoEntity.payStatus == 1){
                wx.redirectTo({
                    url: '/pages/micro_mall/bargain/index/my_bargain',
                })
            }
        })
    }, 300);
}

function pollingFail(){
     wx.redirectTo({
        url: '/pages/micro_mall/bargain/index/my_bargain',
    })
}
 
function getPayStatus(){
    return app.BargainApi.get_HagglePricePayStatus({
        params:{
            orderId:this.orderId, 
            brandCode:app.Conf.BRAND_CODE
        }
    }).then(res=>{
        console.log('then',res)
        return Promise.resolve(res);
    }).catch(e=>{
        console.log('catch',e)
        return Promise.resolve(e);
    })
}