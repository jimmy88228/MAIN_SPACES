import WxApi from '../../../../common/helper/wx-api-helper.js'
const app = getApp();
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        isIphoneX: app.SIH.isIphoneX,
        use_integral: false,
        remarks_val: '',
        show_remarks_val: true,
        remarks_focus: false,
    },
    first: false,
    isLoading: false,
    onLoad: function(options) {
        this.options = options;
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
        let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        this.default = app.globalData.CheckOut || {};
        this.order_detail = app.globalData.order_detail || {};
        this.setData({
            // order_detail : this.order_detail,
            goodsObj: this.order_detail.goodsObj,
            integralInfo: this.order_detail.integralInfo,
            orderInfo: this.order_detail.orderInfo,
            integral_deduct: (this.order_detail.integralInfo.exchangeRate * this.order_detail.integralInfo.allowUsePoint).toFixed(2) || 0,
            rightbutton: rightbutton,
            return_img: return_img,
            return_active: return_active,
            descPrice: (this.order_detail.integralInfo.exchangeRate * this.order_detail.integralInfo.allowUsePoint).toFixed(2)
        });

    },
    onShow() {
        setTimeout(()=>{
            console.log('====',this.data.goodsObj)
        },2500)
        if (this.first) {
            this.addressId = app.globalData.addr_id || (app.StorageH.get('userChoiceData').selectAddr && app.StorageH.get('userChoiceData').selectAddr.address_id) || 0;
            pointMkGoodsCheckout.call(this);
        } else {
            this.first = true;
            let store_data = app.StorageH.get('store_data') || {};
            let consignee = store_data.contact || "";
            let mobile = store_data.mob_phone || ""; 
            let shippingType = this.options.shippingType||2;
            let storeId = this.options.storeId||0;
            this.setData({
                shippingType,
                storeId,
                store_data,
                consignee,
                mobile
            })
        }
    },
    confirmChangeShipping() {
        // var tem_shipping_id = this.data.tem_shipping_id;
        var shipping_show = this.data.shipping_show;
        wx.navigateTo({
            url: "/pages/micro_mall/address/address_list",
        })
        // if (tem_shipping_id == 1) { //快速配送
        //     wx.navigateTo({
        //         url: '../address/address_list',
        //     })
        // } else { //门店自提
        //     wx.navigateTo({
        //         url: '../selfGet/self_get_set',
        //     })
        // }
        if (!shipping_show) return;
        this.shippingAninmate();
    },
    UseIntegral: function() {
        // var integral_data = this.data.integral_data;
        // var allowPoint = integral_data.allowPoint;
        // var exchangeRate = integral_data.exchangeRate;
        // var sys_config = this.data.sys_config;
        let use_integral = this.data.use_integral;
        // let integral_deduct = this.data.integral_deduct || (this.order_detail.integralInfo.exchangeRate * this.order_detail.integralInfo.allowUsePoint).toFixed(2) || 0;
        use_integral = !use_integral;
        this.setData({
            use_integral: use_integral,
            // integral_deduct: integral_deduct
        })
        //执行更新
        pointMkGoodsCheckout.call(this)
    },
    //切换textarea
    ShowRemarksVal: function() {
        var show_remarks_val = this.data.show_remarks_val;
        var remarks_focus = this.data.remarks_focus;
        show_remarks_val = !show_remarks_val;
        remarks_focus = !remarks_focus;
        this.setData({
            show_remarks_val: show_remarks_val,
            remarks_focus: remarks_focus
        })
    },
    remarksInput: function(e) {
        var font_num = e.detail.cursor;
        var remarks_val = e.detail.value;
        this.setData({
            font_num: font_num,
            remarks_val: remarks_val
        })
    },
    order_createOrder: function(e) {
        let store_data = app.StorageH.get('store_data') || {};
        let consignee = store_data.contact || "";
        let mobile = store_data.mob_phone || "";
        if (this.data.shippingType !=1 && (!this.data.orderInfo.addressId || this.data.orderInfo.addressId == '0')) {
            wx.showModal({
                title: '温馨提示',
                content: '请先选择地址',
                showCancel: false
            })
        } else if(this.data.shippingType==1 && !consignee && !mobile){
            wx.showModal({
                title: '温馨提示',
                content: '请先填写收货人信息',
                showCancel: false
            })
        } else {
            if (!this.isLoading) {
                this.isLoading = true;
                return app.PointApi.PointMkGoodAddOrder({
                    data: {
                        mkGoodsId: this.default.mkGoodsId,
                        goodsId: this.default.goodsId,
                        productId: this.default.productId,
                        "number": this.default.number,
                        addressId: this.addressId || app.globalData.addr_id || (app.StorageH.get('userChoiceData').selectAddr && app.StorageH.get('userChoiceData').selectAddr.address_id) || 0,
                        isUsePoint: this.data.use_integral ? 1 : 0,
                        userToken: app.LM._userToken,
                        brandCode: app.Conf.BRAND_CODE,
                        remark: this.data.remarks_val || '',
                        clientSessionId: app.LgMg.channel &&  app.LgMg.channel.clientSessionId || '',
                        //jimmy3
                        shippingType:this.options.shippingType,
                        storeId:this.options.storeId,
                        consignee,
                        mobile
                    },
                    other: {
                        isShowLoad: true
                    }
                }).then(res => {
                    if (res.code == 1) {
                        this.order_id = res.data.order_id || '';
                        this.order_sn = res.data.order_sn || '';
                        // if ((res.data && res.data.orderAmount) > 0) {
                        //     if (this.order_id) {
                        //         toPay.call(this)
                        //     } else {
                        //         this.isLoading = false;
                        //         wx.showModal({
                        //             title: '提示',
                        //             content: '订单号异常',
                        //         })
                        //     }

                        // } else {//最终价格0元
                        //     wx.redirectTo({
                        //         url: '../point_record/point_record',
                        //     })
                        //     this.isLoading = false;
                        // }
                      //修改版
                      if (this.order_id){
                        wx.redirectTo({
                          url: '/pages/micro_mall/point/point_order_detail/point_order_detail?first_time_topay=1&order_id=' + this.order_id +'&order_sn=' + this.order_sn,
                        })
                      }
                    } else {
                        this.isLoading = false;
                        app.SMH.showToast({
                            title: res.msg
                        })
                    }
                })
            }
        }
    },
    jump(e){
        let dataset = e.currentTarget.dataset || {};
        let type = dataset.type || '';
        if(type=='selfGet'){
          let store_data = this.data.store_data||{}; 
          wx.navigateTo({
            url: `/pages/micro_mall/selfGet/self_get_set?loc_f=${0}&showModalMsg=${0}&recIds=${0}&select_store_id=${this.options.storeId}&store_name=${store_data.contact}`,
          })
        }
      },
}))

function pointMkGoodsCheckout() {
    let store_data = app.StorageH.get('store_data') || {};
    let consignee = store_data.contact || "";
    let mobile = store_data.mob_phone || ""; 
    return app.PointApi.pointMkGoodsCheckout({
        data: {
            mkGoodsId: this.default.mkGoodsId,
            goodsId: this.default.goodsId,
            productId: this.default.productId,
            "number": this.default.number,
            addressId: this.addressId || app.globalData.addr_id || (app.StorageH.get('userChoiceData').selectAddr && app.StorageH.get('userChoiceData').selectAddr.address_id) || 0,
            isUsePoint: this.data.use_integral ? 1 : 0,
            userToken: app.LM._userToken,
            brandCode: app.Conf.BRAND_CODE,
            shippingType:this.options.shippingType||2,
            storeId:this.options.storeId||0,
            consignee:consignee,
            mobile:mobile,
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            console.log('jimmy haha')
            const data = res.data;
            // let shippingType = this.options.shippingType||2;
            // let storeId = this.options.storeId||0;
            // console.log('jimmy,',shippingType,storeId)
            this.setData({
                integralInfo: data.integralInfo,
                orderInfo: data.orderInfo,
                store_data,
                consignee,
                mobile,
                // order_detail : this.order_detail,
                // goodsObj: data.goodsObj,
                // integral_deduct: data.orderInfo.integralMoney,
                //     integral_deduct: (data.integralInfo.exchangeRate * data.integralInfo.allowUsePoint).toFixed(2) || 0,
            });
        }
        // console.log('更新数据:', res);
    })
}

function toPay() {
    return app.PayApi.getAppletPrepayId({
        params: {
            order_id: this.order_id || String(this.order_id),
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
                console.log('requestPayment', e); 
                if (e.errMsg.indexOf('ok') != -1) {
                    wx.redirectTo({
                        url: '../point_record/point_record',
                    })
                }
                return e
            }).finally(() => {
                this.isLoading = false;
            })
        } else {
            this.isLoading = false;
        }
    })
}