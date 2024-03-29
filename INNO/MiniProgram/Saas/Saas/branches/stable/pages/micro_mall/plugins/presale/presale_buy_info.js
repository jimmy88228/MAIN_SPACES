// pages/micro_mall/presale/presale_buy_info.js
import WxApi from '../../../../common/helper/wx-api-helper.js';
import dateUtil from '../../../../common/support/utils/date-util.js';
import PayH from '../../../../common/helper/handle/payHandle.js';
import Polling from '../../../../common/helper/polling.js'
const app = getApp();
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
        subConfig: {
            type: 'PRESALE',
            label: 'BUY'
        }
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
        this.options = options;
        initCoupon.call(this,'init');
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        let rule_img = this.data.brand_info.icon_url + "micro_mall/rule.png";
        let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
        let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        let shipping_location = this.data.brand_info.default_icon_url + "shipping_location.png"; 
        this.isDetails = options.isDetails != 'undefined' ? options.isDetails : 0;
        this.req_api_name = 'getPresaleDepositSettlement';
        if (this.options.order_id > 0) {
            this.req_api_name = 'getPresaleOrderData';
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
    beforeClickTest(){
console.log("beforeClickTest");
    },
    onShow() {
        this.getInitData(); 
    },
    onUnload() {
        this.setData({
            showAll: true
        });
        Polling.stopPolling();
        app.StorageH.remove("userChoiceData");
    },
    getInitData: function() {
        let order_id = this.options.order_id || this.preOrderId;
        let order_info = this.data.order_info||{};
        if(this.completePay[order_id]){
            return;
        }
        let that = this;
        let reqData;
        if (!order_id || (order_id && order_info.presaleActivityType != 1 && this.req_api_name == 'getPresaleDepositSettlement')) {
            this.req_api_name = 'getPresaleDepositSettlement';
            reqData = {
                userToken: app.LM.userToken,
                activityGoodsId: this.activityGoodsId,
                activityId: this.activityId,
                goodsNumber: this.goodsNumber,
                brandCode: app.Conf.BRAND_CODE,
                bonusIds: getBonusIds(this.data.currentCoupon,this.is_lock),
                isUsedPoint: this.data.used_point ? 1 : 0,
            }
        } else if(order_id){
            this.req_api_name = 'getPresaleOrderData';
            reqData = {
                userToken: app.LM.userToken,
                preOrderId: order_id,
                brandCode: app.Conf.BRAND_CODE,
                bonusIds: getBonusIds(this.data.currentCoupon,this.is_lock),
                isUsedPoint: this.data.used_point ? 1 : 0,
            }
        } else {
            return Promise.reject();
        }
        return apiFn.call(that, reqData).then(info => {
            let goods_info = { ...info.data.goodsEntity
            };
            let order_info = { ...info.data.infoEntity
            };
            let assistEntity = { ...info.data.assistEntity
            }
            this.is_lock = this.is_lock || order_info.is_lock || 0;
            if (!this.bounsidsAll) {
                let tmepArr = assistEntity && [].concat(assistEntity.bounsids) || [];
                this.bounsidsAll = tmepArr.join(',')
            }
            order_info['order_amount'] = (order_info.depositAmount + order_info.tailAmount).toFixed(2);
            order_info['order_status'] = that.data.orderStatusArr[order_info.orderStatus];
            order_info['date_status'] = dateUtil.parse(order_info.tailPayBeginTime) <= new Date().getTime();

            if (this.req_api_name == 'getPresaleDepositSettlement') {
                order_info['totalDiscount'] = (order_info.diKouBonusMoney + order_info.diKouPointAmount).toFixed(2) || 0;
            } else if (this.req_api_name == 'getPresaleOrderData') {
                order_info['totalDiscount'] = order_info.YouHuiAmount || 0;
                order_info['totalPaid'] = (order_info.pay_deposit_amount + order_info.pay_tail_amount).toFixed(2) || 0;
                // order_info['totalDiscount'] = (order_info.YouHuiAmount + order_info.discountAmount).toFixed(2)|| 0;
            }
            let timeArr = ['tailPayBeginTime', 'tailPayEndTime', 'last_pay_time'];
            for (let item in timeArr) {
                if (order_info.hasOwnProperty(timeArr[item])) {
                    order_info[timeArr[item]] = dateUtil.format(dateUtil.parse(order_info[timeArr[item]]),'M月dd日 hh:mm')
                }
            }            
            order_info.deliveryDate = dateUtil.format(dateUtil.parse(order_info.estimateDeliveryDate||""),'M月dd日 hh:mm');
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
                showAll: false,
                is_lock:this.is_lock
            });
            return Promise.resolve(info);
        }).finally(() => {
            this.isLoadingIntegral = false;
        }).catch(e => {
            app.SMH.showToast({
                title: e&&e.msg || '订单异常'
            })
            return Promise.reject(e);
        });
    },
    chooseCouponCallback(e){
        initCoupon.call(this);
        this.getInitData();
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
    toAddressList: function() {
        if (this.data.lockUsed) {
            app.SMH.showToast({
                title: '订单处于待支付，不可修改'
            })
            return
        }
        wx.navigateTo({
            url: '/pages/micro_mall/address/address_list'
        });
    },
    createOrder: function() {
        let address_info = this.data.address_info;
        let that = this;
        if (that.preOrderId) {
            console.log('直接调起pay', that.preOrderId)
            this.toPay();
            return
        }
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
            bonusIds: getBonusIds(this.data.currentCoupon,this.is_lock),
            platformSrc: '',
            clientSessionId: app.LgMg.channel &&  app.LgMg.channel.clientSessionId || '',
        } 
        if(app.Conf.LiveType == 'channels'){
          reqData.order_source = app.PH && app.PH.isfromSceneChannel("VIDEOLIVE") ? 1 : 0;
        }
        app.PreSaleApi.presaleDepositAddOrder({
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
        console.log("checFn", e);
        let order_info = this.data.order_info || {};
        if (order_info.isCanPay == 0 || this.pay_is_lock == 1) {
            return
        }
        let dataset = e.currentTarget.dataset || {};
        let type = dataset.check || '';
        if (type && type == 'createOrder') {
            let checkReturn = infoCheckFn.call(this);
            if (!checkReturn) return
        }
        let that = this;
        if (order_info.activity_type != 1 && this.is_lock != 1) {
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
                                  bonusIds: getBonusIds(that.data.currentCoupon,that.is_lock),
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
                if (this.options.order_id && order_info.activity_type != 1 && this.is_lock != 1) {
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
        let currentCoupon = this.data.currentCoupon || {};
        setLock.call(this,'pay'); 
        return PayH.UnifiedorderByOrderId({type:pay_type,order_id,orderInfo:getPaymentOrderinfo(this)})
        .then(e => { 
            this.completePay[order_id] = true;
            let type = this.options.order_id && this.data.order_info.activity_type != 1 ? "tail":"deposit"
            poolingFnc.call(this,type);
        }).catch(e => {
          this.loading = false;
        }).finally(()=>{
            setLock.call(this,'pay',0);
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
        let currentCoupon = this.data.currentCoupon||{};
        let order_info = this.data.order_info||{};
        let couponOption = {
            activityGoodsId:this.options.activityGoodsId || order_info.activityGoodsId || 0,
            goodsNumber:this.options.goodsNumber || order_info.totalNum || 0,
            activityId:this.options.activityId || order_info.activityId || 0,
            preOrderId:this.options.order_id || this.preOrderId || 0,
            bonusIds:getBonusIds(this.data.currentCoupon,this.is_lock),
        } 
        let params = {
            couponOption
        }
        this.chooseCoupon = this.chooseCoupon || this.selectComponent("#chooseCoupon");
        this.chooseCoupon.initData(params,"presale");
        return
        // let assistEntity = this.data.assistEntity || {};
        // if (assistEntity.bounsids.length <= 0) {
        //     return
        // }
        // let order_info = this.data.order_info || {};
        // if (order_info.is_allow_coupon != 1) {
        //     app.SMH.showToast({
        //         title: '订单处于待支付，不可修改'
        //     })
        //     return
        // }
        // this.bounsidsAll = this.bounsidsAll || 0;
        // this.setData({
        //     used_point: false
        // })
        // wx.navigateTo({
        //     url: '/pages/micro_mall/plugins/presale/presale_buy_bonus?bonus_ids=' + this.bounsidsAll,
        // })
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


function initCoupon(type) {
    if (type == "init") {
        app.StorageH.set('userChoiceData', {});
    }
    if(this.is_lock == 1)return;
    let userChoiceData = app.StorageH.get('userChoiceData', userChoiceData) || {};
    let cp_arr = userChoiceData.use_coupon||[];
    if (cp_arr.length>0) {
        cp_arr.forEach(item=>{
            let discount = item.discount || 0;
            if(discount > 0){
              let discountStr = (parseFloat(discount) * 10);
              item.discountStr = discountStr;
            }
        }) 
    }
    this.setData({
        currentCoupon: userChoiceData
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
        if (this.req_api_name == 'getPresaleOrderData' || this.req_api_name == 'getPresaleDepositSettlement') {
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
        reqData.bonusId = 0;
        return app.PreSaleApi.presaleOrderTailUsePointCoupon({
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
    let bonus_ids = getBonusIds(this.data.currentCoupon,this.is_lock);
    if ((this.data.order_info.is_allow_coupon == 1 || this.data.order_info.is_allow_point == 1) && assistEntity) {
        if (assistEntity.canusepoint > 0 || assistEntity.bounsids.length > 0) {
            if (this.data.used_point || bonus_ids) {
                console.log('使用了！', this.data.used_point ? "积分" : "优惠券", this.data.used_point ? assistEntity.canusepoint : bonus_ids)
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

function getBonusIds(currentCoupon,is_lock=false) {
    if(is_lock)return "";
    let cp_arr = currentCoupon && currentCoupon.use_coupon || [];
    let bonusIds = [];
    cp_arr.forEach(item=>{
        bonusIds.push(item.bonusId);
    });
    let result = bonusIds.join(',') || "";
    return result;
}

function setLock(type,_set=1) {
    if(type=='pay'){
        this.pay_is_lock = _set; 
    }else{
        this.is_lock = _set;
        this.setData({
            is_lock:_set
        })
    }
}

function poolingFnc(type=""){
    this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
    this.dialog = this.dialog || this.selectComponent("#pageDialog");
    let extra = {
        orderSync:this.orderSync,
        dialog:this.dialog,
    }
    Polling.setPolling(()=>getPayStatus.call(this,type),()=>pollingSucc.call(this),()=>pollingFail.call(this),"",extra); 
}

function getPayStatus(type=""){
    return app.PreSaleApi.getPreSalePayStatus({
        params:{
            preOrderId:this.options.order_id || this.preOrderId,
            payKind:type||"deposit",
            brandCode:app.Conf.BRAND_CODE
        }
    }).then(res=>{
        return Promise.resolve(res);
    }).catch(e=>{
        return Promise.resolve(e);
    })
}

function pollingSucc(){
    navigateToFn.call(this);
}

function pollingFail(){
    wx.redirectTo({
        url: '/pages/micro_mall/plugins/presale/presale_order_list',
    })
}
function getPaymentOrderinfo(_this){
    let goods_info = _this.data.goods_info || [];
    let order_info = _this.data.order_info || {};
    let orderDetailList = [];
    orderDetailList.push({
      productId: 1,
      product_sn: goods_info.goodsSn,
      goods_num: goods_info.number,
      market_price: goods_info.marketPrice,
      goodPrice: order_info.needPayAmount,
      goodsId: order_info.activityGoodsId,
      goods_Name: goods_info.goodsName,
      img_url: goods_info.goodsImg
    })
    return {
      orderEntity: {
        order_id: _this.options.order_id || _this.preOrderId,
        order_amount: order_info.needPayAmount
      },
      orderDetailList: orderDetailList
    }
} 