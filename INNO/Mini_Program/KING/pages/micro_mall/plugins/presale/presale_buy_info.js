// pages/micro_mall/presale/presale_buy_info.js
import WxApi from '../../../../helper/wx-api-helper.js';
import MyDate from '../../../../support/utils/date-util.js';
import "../../../../helper/expands/date-expand.js";
var app = getApp();
Page(app.BP({
    data: {
        brand_info: {},
        goods_info: {},
        order_info: {
            order_id: 0
        },
        isFocus: false,
        sys_info: {},
        title_list: {
            firstTitle: '阶段一 待支付',
            secondeTitle: '阶段一 已完成'
        },
        title_list2: {
            firstTitle: '阶段二',
            secondeTitle: '阶段二 已完成'
        },
        validate_mobile: false,
        mobile_number: '',
        user_mobile_number: '',
        address_info: {},
        remarks_val: '',
        orderStatusArr: ['未确定', '已确定', '已取消', '已完成', '库存不足'],
        isAgree: false,
        showAll: true,
        toShow: true,
        msg_pop_animate: false,
        showProtocal: true,
        // 对付cover-view的bug,组件若有更新，需要修改
        isAdd: false,
        isAdd2: false,
        isAdd3: false,
        used_point: false,
        currentCoupon: {},
        detailPage: false,
        lockUsed: false,
    },
    order_id: 0,
    product_id: 0,
    activity_id: 0,
    product_number: 0,
    completePay:{},
    onLoad: function(options) {
        this.setData({
          lockUsed: false
        })
        console.log('options', options);
        // test.call(this) 
        this.options = options;
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        let rule_img = this.data.brand_info.icon_url + "micro_mall/rule.png";
        let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
        let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        let shipping_location = this.data.brand_info.default_icon_url + "shipping_location.png";

        let that = this;
        this.isDetails = options.isDetails != 'undefined' ? options.isDetails : 0;
        // this.order_id = options.order_id || 0;
        this.req_api_name = 'getPresaleDepositSettlementPage';
        if (this.options.order_id > 0) {
            console.log('存在order_id');
            // this.req_api_name = 'presaleOrderDetailUsePointCoupon';
            this.req_api_name = 'getPresaleOrderDetail';
            this.setData({
                detailPage: true
            })
        }
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
          bg_color: bg_color
        })
        this.activityGoodsId = options.activityGoodsId ? options.activityGoodsId : 0;
        this.activityId = options.activityId ? options.activityId : 0;
        this.goodsNumber = options.goodsNumber ? options.goodsNumber : 0;
        this.related_order_id = options.related_order_id ? options.related_order_id : 0;
        this.setData({
            rightbutton: rightbutton,
            server_close: server_close,
            related_order_id: this.related_order_id,
            rule_img: rule_img,
            return_img: return_img,
            return_active: return_active,
            bg_color,
            shipping_location
        });
        if (this.options.order_id == 0) {
            // 结算
            wx.setNavigationBarTitle({
                title: '预售活动-定金结算'
            });
        } else if (this.options.order_id != 0 && this.isDetails == 0) {
            // 尾款
            wx.setNavigationBarTitle({
                title: '预售活动-尾款结算'
            });
        } else {
            // 详情
            wx.setNavigationBarTitle({
                title: '预售详情'
            });
        }
        this.loading = false;
    },
    onShow() {
        initCoupon.call(this)
        this.getInitData();
    },
    onReady: function() {},
    onUnload() {
        this.setData({
            showAll: true
        });
        this.completePay = {};
        app.StorageH.remove("userChoiceData");
    },
    getInitData: function() {
        console.log('数据onshow', this);
        let order_id = this.options.order_id || this.preOrderId;
        if(this.completePay[order_id]){
            return;
        }
        let that = this;
        let reqData;
        if (this.req_api_name == 'getPresaleDepositSettlementPage') {
            reqData = {
                userToken: app.LM.userToken,
                activityGoodsId: this.activityGoodsId,
                activityId: this.activityId,
                goodsNumber: this.goodsNumber,
                brandCode: app.Conf.BRAND_CODE,
                bonusId: this.data.currentCoupon.use_coupon ? this.data.currentCoupon.use_coupon.bonus_id : 0,
                isUsedPoint: this.data.used_point ? 1 : 0,
            }
        } else if (this.options.order_id > 0 && (this.req_api_name == 'getPresaleOrderDetail')) {
            reqData = {
                userToken: app.LM.userToken,
                preOrderId: this.options.order_id,
                brandCode: app.Conf.BRAND_CODE,
                bonusId: this.data.currentCoupon.use_coupon ? this.data.currentCoupon.use_coupon.bonus_id : 0,
                isUsedPoint: this.data.used_point ? 1 : 0,
            }
        }
        apiFn.call(that, reqData).then(info => {
            let goods_info = { ...info.data.goodsEntity
            };
            let order_info = { ...info.data.infoEntity
            };
            let assistEntity = { ...info.data.assistEntity
            }
            if (!this.bounsidsAll) {
                let tmepArr = assistEntity && [].concat(assistEntity.bounsids) || [];
                this.bounsidsAll = tmepArr.join(',')
            }
            order_info['order_amount'] = (order_info.depositAmount + order_info.tailAmount).toFixed(2);
            order_info['order_status'] = that.data.orderStatusArr[order_info.orderStatus];
            order_info['date_status'] = MyDate.parse(order_info.tailPayBeginTime) <= new Date().getTime();

            if (this.req_api_name == 'getPresaleDepositSettlementPage') {
                order_info['totalDiscount'] = (order_info.diKouBonusMoney + order_info.diKouPointAmount).toFixed(2) || 0;
            } else if (this.req_api_name == 'getPresaleOrderDetail') {
                order_info['totalDiscount'] = order_info.YouHuiAmount || 0;
                order_info['totalPaid'] = (order_info.pay_deposit_amount + order_info.pay_tail_amount).toFixed(2) || 0;
                // order_info['totalDiscount'] = (order_info.YouHuiAmount + order_info.discountAmount).toFixed(2)|| 0;
            }
            let timeArr = ['tailPayBeginTime', 'tailPayEndTime', 'last_pay_time'];
            for (let item in timeArr) {
                if (order_info.hasOwnProperty(timeArr[item])) {
                    order_info[timeArr[item]] = new Date(String(order_info[timeArr[item]]).replace(/\-/gmi, "/")).format('M月dd日 hh:mm');
                }
            }
            // let n_t = new Date();
            // order_info.deliveryDate = (MyDate.parse(order_info.estimateDeliveryDate||"") - n_t.getTime())/1000/60/60/24;
            // order_info.deliveryDate = order_info.deliveryDate >= 3 ? parseInt(order_info.deliveryDate) : 3;            
            order_info.deliveryDate = MyDate.format(MyDate.parse(order_info.estimateDeliveryDate||""),'M月dd日 hh:mm');
            that.orderStatus = order_info.orderStatus || 0;
            that.setData({
                orderStatus: that.orderStatus
            });
            order_info['order_id'] = that.options.order_id;
            that.isCanPay = order_info.isCanPay;
            let address_info = {};
            let pre_default_address_info = app.StorageH.get('userChoiceData').selectAddr || {
                address_id: 0
            };
            if (pre_default_address_info.address_id) {
                pre_default_address_info['districtAddress'] = pre_default_address_info.province_str + pre_default_address_info.city_str + pre_default_address_info.district_str + pre_default_address_info.address;
                address_info = pre_default_address_info;
            } else {
                order_info['address_id'] = order_info['addressId'];
                address_info = order_info;
            }
            this.setData({
                goods_info: goods_info,
                order_info: order_info,
                showButton: true,
                assistEntity: assistEntity,
                address_info: address_info,
                showAll: false
            });
            console.log('order_info', this.data.order_info)
            console.log('assistEntity', this.data.assistEntity)
            // checkShipping.call(this,order_info);//jimmy
            let _timer = setTimeout(() => {
                clearTimeout(_timer);
                const query = wx.createSelectorQuery();
                query.select('#reduce').boundingClientRect();
                query.exec(function(res) {
                    if (res[0] != null && !that.data.isAdd) {
                        console.log("进入渲染");
                        that.setData({
                            realWidth: res[0].width + 10,
                            isAdd: true
                        });
                    }
                });
                const queryTip = wx.createSelectorQuery();
                queryTip.select('.special_tip').boundingClientRect();
                queryTip.exec(function(res) {
                    if (res[0] != null && !that.data.isAdd2) {
                        that.setData({
                            realWidth2: res[0].width + 10,
                            isAdd2: true
                        });
                    }
                });
                const queryPay = wx.createSelectorQuery();
                queryPay.select('#pay').boundingClientRect();
                queryPay.exec(function(res) {
                    if (res[0] != null && !that.data.isAdd3) {
                        that.setData({
                            realWidth3: res[0].width + 10,
                            isAdd3: true
                        });
                    }
                });
            }, 100);
        }).finally(() => {
            this.isLoadingIntegral = false;
        }).catch(e => {
            app.SMH.showToast({
                title: e&&e.msg || '订单异常'
            })
        });
    },
    clearMobileInput: function() {
        if (this.data.lockUsed) {
            app.SMH.showToast({
                title: '订单处于待支付，不可修改'
            })
            return
        }
        this.setData({
            mobile_number: ''
        })
    },
    validateMobileNumber: function(e) {
        var mobile_number = e.detail.value;
        var validate_mobile = false;
        // if ((/^1[3456789]\d{9}$/.test(mobile_number))) {
        //     validate_mobile = true;
        // }
        this.setData({
            mobile_number: mobile_number,
            // validate_mobile: validate_mobile
        })
    },
    handle_input(e){
        let value = e.detail.value || "";
        let dataset = e.currentTarget.dataset||{};
        let key = dataset.key||"";
        if(!key)return;
        this.setData({
            [`${key}`]:value
        })
    },

    // getPhoneNumber: function(e) {
    //     console.log(e)
    //     var that = this;
    //     if (this.data.user_mobile_number) {
    //         this.setData({
    //             mobile_number: this.data.user_mobile_number
    //         })
    //         return;
    //     }
    //     app.getUserMobileNumber(e, function(mobile_number) {
    //         that.setData({
    //             user_mobile_number: mobile_number,
    //             mobile_number: mobile_number
    //         })
    //         var e = {
    //             detail: {
    //                 value: mobile_number
    //             }
    //         }
    //         that.validateMobileNumber(e);
    //     });
    // },
    toAddressList: function() {
        if (this.data.lockUsed) {
            app.SMH.showToast({
                title: '订单处于待支付，不可修改'
            })
            return
        }
        var activity_id = this.data.activity_id;
        var product_id = this.data.product_id;
        var product_number = this.data.product_number;
        wx.navigateTo({
            url: '/pages/micro_mall/address/address_list'
        });
    },
    createOrder: function() {
        let address_info = this.data.address_info;
        let validate_mobile = this.data.validate_mobile;
        let that = this;
        if (that.preOrderId) {
            console.log('直接调起pay', that.preOrderId)
            this.toPay();
            return
        }
        let bounusId = this.data.currentCoupon.use_coupon ? this.data.currentCoupon.use_coupon.bonus_id : 0;
        let reqData = {
            userToken: app.LM.userToken,
            activityId: this.activityId,
            activityGoodsId: this.activityGoodsId,
            goodsNumber: this.goodsNumber,
            addressId: address_info.address_id,
            remark: this.data.remarks_val,
            notifyMobile: this.data.mobile_number || "",
            brandCode: app.Conf.BRAND_CODE,
            isUsePoint: this.data.used_point ? 1 : 0,
            bonusId: bounusId || 0,
            platformSrc: '',
            clientSessionId: app.LgMg.channel &&  app.LgMg.channel.clientSessionId || '',
        }
        app.PreSaleApi.postAddPresaleOrder({
            data: reqData,
            other: {
                isShowLoad: true
            }
        }).then(res => {
            console.log('新建订单:', res)
            if (res.code == 1) {
                that.preOrderId = res.data.preOrderId || '';
                if (that.preOrderId) {
                    this.setData({
                      lockUsed: true
                    })
                    if (((that.data.order_info.presaleActivityType != 1 && that.data.order_info.needPayAmount == 0) || (that.data.order_info.presaleActivityType == 1 && that.data.order_info.needPayAmount == 0))) {
                        console.log('尾款0', that.orderStatus, that.preOrderId, that.isDetails, that.activityId, that.activityGoodsId, that.goodsNumber);
                        navigateToFn.call(that);
                        return
                    }
                    // console.log('调起支付', that.orderStatus, that.order_id, that.isDetails, that.activityId, that.activityGoodsId, that.goodsNumber);
                    this.toPay();
                } else {
                    app.SMH.showToast({
                        title: res.msg || '订单异常'
                    })
                }
                
            }else{
              app.SMH.showToast({
                title: res.msg || '订单异常'
              })
            }


        })
    },
    checkFn(e) {
        let order_info = this.data.order_info || {};
        if (order_info.isCanPay == 0) {
            return
        }
        let dataset = e.currentTarget.dataset || {};
        let type = dataset.check || '';
        if (type && type == 'createOrder') {
            let checkReturn = infoCheckFn.call(this);
            if (!checkReturn) return
        }
        let that = this;
        if ( order_info.activity_type != 1) {
            let assistEntity = this.data.assistEntity;
            let currentCoupon = this.data.currentCoupon;
            let bonus_id = this.data.currentCoupon.use_coupon && this.data.currentCoupon.use_coupon.bonus_id || '';
            console.log(type, assistEntity, currentCoupon, bonus_id)
            this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
            this.pageDialog.setTitle("提示");
            this.pageDialog.setCentent("订单提交后将不可修改，确认提交?");
            this.pageDialog.setTouchCancel(false);
            this.pageDialog.setTwoBtn({
                name: "取消",
            }, {
                name: "确定",
                tap: function() {
                    if (type && type == 'createOrder') {
                        that.createOrder();
                        that.pageDialog.dismiss();
                    } else if (type && type == 'toPay') {

                            let checkUseDisc = checkUseDiscount.call(that);
                            if (checkUseDisc && (order_info.is_allow_coupon == 1 ||  order_info.is_allow_point == 1)) {
                                let reqData = {
                                  userToken: app.LM.userToken,
                                  preOrderId: that.options.order_id,
                                  brandCode: app.Conf.BRAND_CODE,
                                  bonusId: that.data.currentCoupon.use_coupon ? that.data.currentCoupon.use_coupon.bonus_id : 0,
                                  isUsedPoint: that.data.used_point ? 1 : 0,
                                }
                                apiFn.call(that, reqData, true).then(res => {
                                    if (res.code == 1) {
                                        if (res.data == 1) {
                                            console.log('尾款为0');
                                            navigateToFn.call(that)
                                            return
                                        } else {
                                            that.toPay();
                                        }
                                    } else {
                                        app.SMH.showToast({
                                            title: res.msg || '订单异常'
                                        })
                                    }
                                }).catch(res => {
                                    app.SMH.showToast({
                                        title: res.msg || '订单异常'
                                    })
                                })
                            } else {
                                that.toPay();
                            }

                        that.pageDialog.dismiss();
                    } else {
                        console.log('无对应type');
                        that.pageDialog.dismiss();
                    }
                }
            })
            this.pageDialog.show();
        } else {
            if (type && type == 'createOrder') {
                that.createOrder();
            } else if (type && type == 'toPay') {
                console.log('直接调起支付')
                that.toPay();
            }
        }
    },
    getRemarkVal: function(e) {
        var remarks_val = e.detail.value;
        this.setData({
            remarks_val: remarks_val
        })
    },
    toAgree() {
        this.setData({
            isAgree: !this.data.isAgree
        });
    },
    gotoRelateOrderInfo() {
        let related_order_id = this.related_order_id;
        wx.navigateTo({
            url: '../../order/order_info?order_id=' + related_order_id,
        })
    },
    toPay() {
        if (!this.loading) {

            this.loading = true;
            let order_info = this.data.order_info || {};
            if (order_info.isCanPay) {
                if (this.options.order_id && order_info.activity_type != 1) {
                  logThePresaleDetail.call(this).then(res=>{
                    // php调支付信息
                    this.handlePay(order_info);
                  });
                }else{
                  this.handlePay(order_info);
                } 
            }
        }
    },
    handlePay(order_info){
        let that = this; 
        let order_id = this.options.order_id || this.preOrderId;
        let pay_type = this.options.order_id && order_info.activity_type != 1 ? 'presale2' : 'presale';
        return app.PayApi.getAppletPrepayId({
          params: {
            order_id: order_id,
            pay_type: pay_type
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
              if (e.errMsg.indexOf('ok') != -1) {
                this.completePay[order_id] = true;
                navigateToFn.call(that);
              }else{
                this.getInitData();
              }
              return e
            }).finally(() => {
              console.log("finally");
              that.loading = false;
            }).catch(e => {
              console.log('catch取消');
              that.loading = false;
              this.getInitData();
            })
          } else {
            this.loading = false;
            app.SMH.showToast({
              title: e.msg || '订单异常'
            })
          }
        }).catch(e => {
          this.loading = false;
          app.SMH.showToast({
            title: e.msg || '订单异常'
          })
        })
    },
    changeStatus() {
        this.setData({
            toShow: !this.data.toShow,
            isFocus: !this.data.isFocus
        })
    },
    switchStylePop: function(e) {
        if (!this.data.show_msg_pop) {
            this.setData({
                show_msg_pop: !this.data.show_msg_pop,
                msg_pop_animate: !this.data.msg_pop_animate,
                showProtocal: !this.data.showProtocal

            })
        } else {
            this.setData({
                msg_pop_animate: !this.data.msg_pop_animate,
                showProtocal: !this.data.showProtocal
            });
            let _timer = setTimeout(() => {
                clearTimeout(_timer);
                this.setData({
                    show_msg_pop: !this.data.show_msg_pop
                })
            }, 350)
        }
    },
    showMsgPop(e) {
        this.switchStylePop(e, true);
    },
    //优惠券
    jumpToCoupon() {
        let assistEntity = this.data.assistEntity || {};
        if (assistEntity.bounsids.length <= 0) {
            return
        }
        let order_info = this.data.order_info || {};
        if (order_info.is_allow_coupon != 1) {
            app.SMH.showToast({
                title: '订单处于待支付，不可修改'
            })
            return
        }
        this.bounsidsAll = this.bounsidsAll || 0;
        this.setData({
            used_point: false
        })
        wx.navigateTo({
            url: '/pages/micro_mall/plugins/presale/presale_buy_bonus?bonus_ids=' + this.bounsidsAll,
        })
    },

    /**
     * 使用积分
     */
    useIntegral: function() {
      let assistEntity = this.data.assistEntity || {};
        if (assistEntity.canusepoint <= 0) {
          return
        }
        let order_info = this.data.order_info || {};
        if (order_info.is_allow_point != 1) {
            app.SMH.showToast({
                title: '订单处于待支付，不可修改'
            })
            return
        }
        if (!this.isLoadingIntegral) {
            this.setData({
                used_point: !this.data.used_point
            })
            this.isLoadingIntegral = true;
            this.getInitData();
        }
    },
    copy(){
      if (this.isLoadingBtn) return
      isLoadingBtn.call(this);
      wx.setClipboardData({
        data: this.data.order_info.presaleOrderSn || ""
      })
    }
}))


function initCoupon() {
    if (!this.onloadCheck && app.StorageH.get('userChoiceData')) {
        let userChoiceData = app.StorageH.get("userChoiceData");
        delete userChoiceData.use_coupon;
        app.StorageH.set("userChoiceData", userChoiceData);
        this.onloadCheck = true;
    } else if (!app.StorageH.get('userChoiceData')) {
        app.StorageH.set('userChoiceData', {});
        this.onloadCheck = true;
    }
    var userChoiceData = app.StorageH.get('userChoiceData', userChoiceData);
    if (true || userChoiceData.use_coupon) {
        let discount = userChoiceData.use_coupon && userChoiceData.use_coupon.discount || "";
        if(discount > 0){
          let discountStr = (parseFloat(discount) * 10);
          userChoiceData.use_coupon.discountStr = discountStr;
        }

        this.data.currentCoupon.use_coupon = userChoiceData.use_coupon || '';
    }
    this.setData({
        currentCoupon: this.data.currentCoupon
    })

}

function infoCheckFn() {
    let address_info = this.data.address_info;
    let validate_mobile = this.data.validate_mobile;
    let mobile_number = this.data.mobile_number;
    if (this.orderStatus == 0 && this.data.order_info.presaleActivityType != 1) {
        if (!mobile_number) {
            app.SMH.showToast({
                "title": "请输入正确的通知手机号"
            });
            return false;
        }
    }
    if (!address_info.address_id) {
        app.SMH.showToast({
            "title": "请选择收货地址"
        });
        return false;
    }
    if (this.orderStatus == 0 && this.data.order_info.isAllowReturnDeposit == 0) {
        if (!this.data.isAgree) {
            app.SMH.showToast({
                "title": "请勾选预售协议"
            });
            return false;
        }
    }

    return true
}

function apiFn(reqData, check = false) {
    if (!check) {
        if (this.req_api_name == 'getPresaleOrderDetail' || this.req_api_name == 'getPresaleDepositSettlementPage') {
            return app.PreSaleApi[this.req_api_name]({
                params: reqData,
                other: {
                    isShowLoad: true
                }
            }).then(res => {
                if(res.code==1){
                    return Promise.resolve(res);
                }
                return Promise.reject(res)
            })
        }
    } else {
        return app.PreSaleApi.presaleOrderDetailUsePointCoupon({
            data: reqData,
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                return Promise.resolve(res);
            }
            return Promise.reject(res)
        })
    }
}


function navigateToFn() {
    this.setData({
      lockUsed: true
    })
    if (this.orderStatus == 0) {
        wx.redirectTo({
            url: `./presale_buy_info?order_id=${this.preOrderId}&isDetails=0&activityId=${this.activityId}&activityGoodsId=${this.activityGoodsId}&goodsNumber=${this.goodsNumber}`
        });
    } else {
        if (this.isDetails == 1) {
            // 列表进入
            wx.navigateBack({
                delta: 1
            });
        } else {
            wx.redirectTo({
                url: './presale_order_list',
            });
        }
    }
}

function checkUseDiscount() {
    let assistEntity = this.data.assistEntity;
    let currentCoupon = this.data.currentCoupon;
    let bonus_id = this.data.currentCoupon.use_coupon && this.data.currentCoupon.use_coupon.bonus_id || '';
    if ((this.data.order_info.is_allow_coupon == 1 || this.data.order_info.is_allow_point == 1) && assistEntity) {
        if (assistEntity.canusepoint > 0 || assistEntity.bounsids.length > 0) {
            if (this.data.used_point || bonus_id) {
                console.log('使用了！', this.data.used_point ? "积分" : "优惠券", this.data.used_point ? assistEntity.canusepoint : bonus_id)
                return true
            } else {
                console.log('有，但不用')
                return false
            }
        } else {
            console.log('允许使用，但很穷木有')
            return false
        }
    } else {
        console.log('不能用券的场景,直接pay')
        return false
    }
}

// function lockOrderFn() {
//     if (this.data.order_info.is_lock == 0) {
//         console.log('尾款单，没锁过，调接口')
//         return app.PreSaleApi.lockPreOrderByPay({
//             data: {
//                 userToken: app.LM.userToken,
//                 brandCode: app.Conf.BRAND_CODE,
//                 preOrderId: this.order_id || 0,
//             },
//             other: {
//                 isShowLoad: false
//             }
//         }).then(res => {
//             if (res.code == 1) {
//                 if (res.data == 1) {
//                     // this.loading = false;
//                     return Promise.resolve(res);
//                 }
//                 return Promise.reject(res)
//             }
//             return Promise.reject(res)
//         }).catch(e => {
//             // this.loading = false;
//         })
//     } else {
//         console.log('已经锁过了');
//         return Promise.resolve();
//     }
// }

function logThePresaleDetail(){
  if (!this.options.order_id){
    return Promise.reject({});
  }
  return app.PreSaleApi.logThePresaleDetail({
    data:{
      userToken: app.LM.userToken,
      preOrderId: this.options.order_id || 0,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(res=>{
    if(res.code == "1"){
      return Promise.resolve();
    }
    return Promise.reject(res);
  })
}


function isLoadingBtn(time = 350) {
  this.isLoadingBtn = true;
  this.isLoadingBtnId = setTimeout(() => {
    this.isLoadingBtn = false
  }, time)
}

// function checkShipping(order_info={}){
//     order_info = order_info||{};
//     if(order_info.isCanShipping == 1){
//         this.setData({
//             isCanShipping 
//         })
//     } 
// }