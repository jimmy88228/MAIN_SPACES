// pages/micro_mall/collageGroup/collage_buy_detail.js
import WxApi from '../../../common/helper/wx-api-helper.js'
import PayH from '../../../common/helper/handle/payHandle.js'
import Polling from '../../../common/helper/polling.js'
import WxSub from '../../../common/helper/handle/wxSubscribe';

var app = getApp();
Page(app.BP({
    data: {
        selectAddr: {
            address_id: 0, //
        },
        isIphoneX: app.SIH.isIphoneX,
        user_activity_id: 0,
        captain_id: 0,
        goods_info: {},
        order_info: {},
        shipping: { // 配送方式
           way_id: 0, //2 快递 OR 1 自提 
           contact: "",
           mob_phone: "",
           store_id: 0,
           store_name: "",
        },
        order_remark: "",
        show_remarks_val: true,
        remarks_focus: false,
        sys_info: {},
    },
    options: {},
    is_pay_retrun: false, //拼团成功支付回调时，返回不触发更新页面
    onLoad: function (options) {
        this.options = options;
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        this.setData({
            rightbutton: rightbutton,
            return_active: return_active,
            "shipping.way_id": (options.store_id && options.store_id != 0) ? 1 : 2,
            "shipping.store_id": options.store_id,
        })
        getTpls.call(this);
        app.StorageH.remove("store_data");
    },
    onReady: function() {
        app.sysTemConfig("instore_order_change_staff").then(data => {
            if(data.Value){
              this.setData({
                is_can_change_staff: data.Value
              })
            }
        })
    },
    onShow: function () {
        if (!this.is_pay_retrun) {
            let options = this.options;
            this.getBuyDetails(options);
        }
    },
    onHide: function () {

    },
    onUnload: function () {
        Polling.stopPolling();
        app.StorageH.remove("userChoiceData");
        app.StorageH.remove("store_data");
    },
    getBuyDetails(options) {
        var that = this;

        getCollageGroupSettlementList.call(this);
        return;

    },
    remarksInput(e) {
        if (e.currentTarget) {
            var key = e.currentTarget.dataset.key;
        }
        this.setData({
            [key]: e.detail.value
        })
    },
    selectedAddress(data) {
        var order_info = this.data.order_info;
        order_info.address = data.address;
        order_info.address_id = data.address_id;
        order_info.consignee = data.consignee;
        order_info.mobile = data.mobile;
        order_info.city = data.city;
        order_info.country = data.country;
        order_info.district = data.district;
        order_info.province = data.province;
        order_info.districtAddress = data.province_str + data.city_str + data.district_str + data.address;
        this.setData({
            order_info: order_info
        })
    },
    toAddressList() {
        let shipping = this.data.shipping;
        if (shipping.way_id == 2) { //快递配送
            wx.navigateTo({
                url: '../address/address_list',
            })
        } else { // 门店自提
            console.log('进入自提');
            wx.navigateTo({
                url: `/pages/micro_mall/selfGet/self_get_set?loc_f=${0}&showModalMsg=${false}&recIds=${this.options.rec_str || '0'}&select_store_id=${shipping.store_id}&store_name=${shipping.store_name}&staff_name=${shipping.staffName || ''}&staff_id=${shipping.staffId||0}`,
            })
        }
    },
    /**
     * 提交订单
     */
    submitOrder() {
        if (this.isLoading) return;
        this.isLoading = true;
        try {
            return collageGroupAddOrder.call(this).then(AddOrderInfo => {
                return getTpls.call(this).then(() => {
                    let tplsList = this.tplsList || [];
                    console.log('订阅 getTpls', tplsList)
                    if (!this.subscribeBool && tplsList && tplsList.length > 0) {
                        this.subscribeBool = true;
                        return WxSub.wxSubscribeHelp({
                            tplsList,
                            bool: false,
                            type: "COLLAGE",
                            info: {}
                        }).then(res => {
                            console.log('订阅 then', res)
                            if (res) {
                                app.SMH.showToast({
                                    title: "订阅完成"
                                })
                                setSubscribe.call(this, res);
                                setTimeout(() => {
                                   return this.getPay(AddOrderInfo);
                                }, 800);
                            } else {
                                return this.getPay(AddOrderInfo);
                            }
                        })
                    } else {
                        return this.getPay(AddOrderInfo);
                    }
                })
            })
        } catch (e) {
            collageGroupAddOrder.call(this).then(AddOrderInfo => {
                return this.getPay(AddOrderInfo);
            })
        }
    },

    /**
     * 去支付
     */
    getPay: function (order = {}) {
        let order_id = order.user_log_id || 0;
        let order_sn = order.logSn || "";
        if (!order_id) return;
        if (order.order_amount == 0) {
            let activityId = this.options.activityId || 0;
            this.is_pay_retrun = true;
            wx.navigateTo({
                url: 'my_collage_detail?activity_id=' + activityId + '&user_activity_id=' + order.user_activity_id + '&captain_id=' + order.user_id,
            })
            return;
        }
        return PayH.UnifiedorderByOrderId({type:"pin",order_id,orderInfo:getPaymentOrderinfo(this)})
            .then(e => {
                this.orderSync = this.orderSync || this.selectComponent("#orderSync");
                this.dialog = this.dialog || this.selectComponent("#pageDialog");
                let extra = {
                    orderSync: this.orderSync,
                    dialog: this.dialog,
                    type: "",
                }
                Polling.setPolling(() => getPayStatus.call(this, order_id), () => pollingSucc.call(this), () => pollingFail.call(this), "", extra);
                this.is_pay_retrun = true;
            }).finally(()=>{
                let timer = setTimeout(()=>{
                    this.isLoading = false;
                    clearTimeout(timer);
                    timer = null;
                }, 500);
            })
    },
    //切换textarea
    ShowRemarksVal: function () {
        var show_remarks_val = this.data.show_remarks_val;
        var remarks_focus = this.data.remarks_focus;
        show_remarks_val = !show_remarks_val;
        remarks_focus = !remarks_focus;
        this.setData({
            show_remarks_val: show_remarks_val,
            remarks_focus: remarks_focus
        })
    }
}))
//下单
function collageGroupAddOrder() {
    if (this.addOrderInfo) { //缓存订单
        return Promise.resolve(this.addOrderInfo)
    };
    let {order_info, goods_info, order_remark, shipping} = this.data;
    let {store_id, consignee, mobile, staff_id, way_id, contact} = shipping;
    let reqUrl = 'collageGroupAddOrder';
    let warn = "";
    if (way_id == 2 && (!order_info.address_id || order_info.address_id == 0)) warn = "请填写收货地址信息";
    else if (way_id == 1 && (!contact || !mobile)) warn = "请完善收货门店信息";
    if (warn) {
        app.SMH.showToast({
            title: warn
        })
        this.isLoading = false;
        return Promise.reject();
    } 
    let _params = {};
    if(app.Conf.LiveType == 'channels'){
      _params.order_source = app.PH && app.PH.isfromSceneChannel("VIDEOLIVE") ? 1 : 0;
    }
    return app.CollageApi[reqUrl]({
        data: {
            activityId: order_info.activity_id,
            userActivityId: order_info.user_activity_id,
            addressId: store_id && store_id != 0 ? 0 : (order_info.address_id || 0),
            remark: order_remark,
            goodsId: goods_info.goods_id,
            productId: goods_info.product_id,
            productNum: goods_info.number,
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            clientSessionId: app.LgMg.channel && app.LgMg.channel.clientSessionId || '',
            isStore: store_id && store_id != 0 ? 1 : 0,
            storeId: store_id || 0,
            consignee: consignee || "",
            mobile: mobile || "",
            staffId: staff_id || 0,
            ..._params,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data || {};
            this.addOrderInfo = data || {};
            return Promise.resolve(data);
        } else {
            app.SMH.showToast({
                title: e.msg || "下单失败"
            })
            return Promise.reject();
        }
    }).finally(() => {
        this.isLoading = false
    })
}

//拼团结算详情
function getCollageGroupSettlementList() {
    let params = {
        userToken: app.LM.userToken,
        activityId: this.options.activityId,
        userActivityId: this.options.userActivityId,
        isStore: 0,
        storeId: 0,
        addressId: 0, // 收货地址Id
        goodsId: this.options.goodsId,
        productId: this.options.productId,
        productNum: this.options.productNum,
        brandCode: app.Conf.BRAND_CODE
    }
    //获取地址
    let shipping = this.data.shipping || {};
    let store_data = app.StorageH.get('store_data') || {};
    if (!store_data.contact) {
        store_data = {
          contact: "自提会员",
          mob_phone: (app.LM.userInfo && app.LM.userInfo.mobilePhone) || (app.StorageH.get('USER_INFOS') && app.StorageH.get('USER_INFOS').mobilePhone) || "",
          select_store: app.StorageH.get('select_store') || {}
        }
        app.StorageH.set('store_data', store_data)
    }
    let select_store = store_data.select_store || {};
    let userChoiceData = app.StorageH.get("userChoiceData") || {};
    let selectAddr = userChoiceData.selectAddr || this.data.selectAddr || {};
    if (shipping.way_id == "1" && select_store.id || (this.options.store_id && this.options.store_id != 0)) {
        params.isStore = 1;
        params.storeId = select_store.id || this.options.store_id || 0;
        params.consignee = store_data.contact || "";
        params.mobile = store_data.mob_phone || "";
        params.staffId = store_data && store_data.staff_id || 0
        shipping.contact = store_data.contact || "";
        shipping.mobile = store_data.mob_phone || "";
        shipping.store_name = store_data.select_store && store_data.select_store.name || "";
        shipping.staffId = store_data && store_data.staff_id || 0
        shipping.staffName = store_data && store_data.staff_name || ""
        delete userChoiceData.selectAddr;
        app.StorageH.set('userChoiceData', userChoiceData);
    } else if (shipping.way_id == "2") {
        if (selectAddr.address_id) {
          params.addressId = selectAddr.address_id;
          store_data && app.StorageH.remove("store_data");
        } else {
          params.addressId = 0;
        }
    }
    return app.CollageApi.getCollageGroupSettlementList({
        params,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            var data = e.data;
            this.setData({
                goods_info: data.goodsEntity,
                order_info: data.infoEntity,
                shipping: shipping
            })

            return Promise.resolve(e);
        }
        app.SMH.showToast({
            "title": e.msg || "请求出错"
        })
        let _timer = setTimeout(function () {
            clearTimeout(_timer);
            wx.navigateBack();
        }.bind(this), 1000);
        return Promise.reject(e);
    })

}
//检测订单支付转态
/*function getOrderPayStatus(order_id) {
    return app.CollageApi.getCollageGroupOrderPayStatus({
        params: {
            userToken: app.LM.userToken,
            orderId: order_id,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            if (e.data == 1) {
                let order_info = this.data.order_info;
                let user_activity_id = this.data.user_activity_id;
                let captain_id = this.data.captain_id;
                wx.redirectTo({
                    url: 'my_collage_detail?activity_id=' + order_info.activity_id + '&user_activity_id=' + user_activity_id + '&captain_id=' + captain_id,
                })
            } else {

            }
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}*/



function getPayStatus(order_id) {
    return app.CollageApi.getCollageGroupOrderPayStatus({
        params: {
            userToken: app.LM.userToken,
            orderId: order_id,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        console.log('then', res);
        return Promise.resolve(res);
    }).catch(e => {
        console.log('catch', e)
        return Promise.resolve(e);
    })
}


function pollingSucc() {
    let order_info = this.data.order_info;
    let addOrderInfo = this.addOrderInfo || {};
    let user_activity_id = addOrderInfo.user_activity_id || 0;
    let captain_id = addOrderInfo.user_id || 0;
    wx.redirectTo({
        url: 'my_collage_detail?activity_id=' + order_info.activity_id + '&user_activity_id=' + user_activity_id + '&captain_id=' + captain_id,
    })
}

function pollingFail() {
    wx.redirectTo({
        url: '/pages/micro_mall/collageGroup/my_collage',
    })
}

function getTpls() {
    if (this.tplsList) {
        return Promise.resolve(this.tplsList)
    }
    let h = this._gtTpls;
    if (h) return h;
    this._gtTpls = h = WxSub.getTpls("COLLAGE").then(data => {
        this.tplsList = data || [];
        return Promise.resolve(data)
    }).catch(e => {
        return Promise.resolve(e)
    }).finally(() => {
        this._gtTpls && delete this._gtTpls;
    });
    return h;
}

function setSubscribe(detail = {}) { //订阅接口传参处理
    let subResult = detail.subResult || {};
    let tplsList = this.tplsList || [];
    let reqList = [];
    for (let i = 0; i < tplsList.length; i++) {
        let wxTplId = tplsList[i].wxTplId || "";
        let tplType = tplsList[i].tplType || "";
        let brandTplId = tplsList[i].brandTplId || 0;
        let userLogId = this.addOrderInfo && this.addOrderInfo.user_log_id || 0;
        let state = subResult[wxTplId];
        reqList.push({
            userLogId,
            tplType,
            brandTplId,
            state
        })
    }
    WxSub.setSubscribe(reqList, detail.setSub, 'COLLAGE');
}

function getPaymentOrderinfo(_this){ 
    let goods_info = _this.data.goods_info || {};
    let order_info = _this.data.order_info || {};
    let addOrderInfo = _this.addOrderInfo ||{};
    let order_id = addOrderInfo.user_log_id||0;
    let orderDetailList = [];
    orderDetailList.push({
      productId: goods_info.product_id,
      product_sn: goods_info.product_sn,
      goods_num: goods_info.number,
      market_price: goods_info.market_price,
      goodPrice: goods_info.goods_price,
      goodsId: goods_info.goods_id,
      goods_Name: goods_info.goods_name,
      img_url: goods_info.goods_img
    })
    return {
      orderEntity: {
        order_id: order_id,
        order_amount: order_info.totalprice
      },
      orderDetailList: orderDetailList
    }
}