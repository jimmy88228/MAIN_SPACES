// pages/micro_mall/buy/buy.js
import WxApi from "../../../../common/support/tools/wx-api-promise.js"
let app = getApp();
let firstLoad = true;
Page(app.BP({
    data: {
        brand_info: {},
        isIphoneX: app.SIH.isIphoneX,
        //商品列表
        goods_list: [],
        //优惠券
        coupon_data: {},

        //现金券
        canUseCashCoupon: false,
        cashCoupon_data: {
            error: "",
            useCashCoupon: [],
            useCashCouponIds: "",
        },
        cashCoupon_input: "",

        //余额使用
        use_balance: false,
        //积分使用
        use_integral: false,
        integral_data: {},
        integral_deduct: 0.00,
        //促销优惠
        giftCard_list: [], //拥有的促销优惠
        use_giftCards: [], //选择的促销优惠
        use_condition_ids: "",
        
        /**/
        pay_data: {},

        //使用储值卡
        use_prepaid: false,
        prepaid_data:{},
        //验证
        validate_data: {},
        //地址信息
        address_data: {},
        //支付方式
        pay_mode: {},
        //备注信息
        font_num: 0,
        remarks_val: '',
        show_remarks_val: true,
        remarks_focus: false,
        remarks_h: 0,
        /**/
        sys_config: {},
        user_recharge: 0,
        is_user_recharge: 0,
        /**
         * 配送方式
         */
        sys_shipping_way: "",
        tem_shipping_id: 1,
        shipping: {
            shipping_way_id: 1, //1 快递 OR 2 自提 
            contact: "",
            mob_phone: "",
            store_id: 0
        },
        shipping_show: false,
        shipping_opacity: false,
        filter: false,
        identityNumber: '',
        identityName: '',
        marskValue:false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.options = options;
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
        let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        let checkPng = this.data.brand_info.icon_url + "micro_mall/check.png";
        this.setData({
            rightbutton: rightbutton,
            return_img: return_img,
            return_active: return_active,
            server_close: server_close,
            checkPng: checkPng
        })
        this.initParam();
        loadPayMode.call(this);
        
    },
    onHide(){
    },
    onUnload() {
      app.StorageH.remove("userChoiceData");
      app.StorageH.remove("select_store");
      app.StorageH.remove("store_data");
    },
    onShow: function() {   
        app.sysTemConfig("disable_cash_bonus").then(data => {
            if (data.Value == "0") {
                this.setData({
                    canUseCashCoupon: true
                })
            }
        })
        //门店自提配置
        app.sysTemConfig("shipping_config").then(data => {
            this.setData({
                sys_shipping_way: data.Value || "1",
                tem_shipping_id: data.Value == 2 ? "2" : "1"
            })
        })
        //erp积分
        app.sysTemConfig("is_erp_point").then(data => {
            this.is_erp_point = data.Value
        })
        listen.call(this);
        // this.getCheckOut();
    }, 
    /**
     * 初始化数据
     */
    getCheckOut: function() {
        let shipping = this.data.shipping || {};
        let store_data = app.StorageH.get('store_data') || {};
        let select_store = store_data.select_store || {};
        let userChoiceData = app.StorageH.get('userChoiceData') || {};
        let selectAddr = userChoiceData.selectAddr || {};
        let rec_str = this.options.rec_str;
        let use_integral = this.data.use_integral;
        //设置请求参数
        this.reqData.IsUseStore = select_store.id ? 1 : 0;
        this.reqData.recIds = rec_str;
        this.reqData.bonusId = userChoiceData.use_coupon ? userChoiceData.use_coupon.bonus_id : '';
        this.reqData.IsUsePoint = use_integral ? 1 : 0;
        this.reqData.store_id = select_store.id || 0;
        if (shipping.shipping_way_id == "1" && selectAddr.address_id){
          this.reqData.address_id = selectAddr.address_id
          app.StorageH.remove("store_data");
        } else if (shipping.shipping_way_id == "2" && select_store.id){
          this.reqData.address_id = select_store.id
          delete userChoiceData.selectAddr;
          app.StorageH.set('userChoiceData', userChoiceData);
        }
        this.reqData.userToken = app.LM.userToken;
        //结算数据
        return app.BuyApi.postJieSuanListByStore({
            data: this.reqData,
            other: {
                isShowLoad: true
            }
        }).then(e => {
            if (e.code == "1") {
                let data = e.data;
                this.assignData(data);
                return Promise.resolve(e);
            }
            return Promise.reject();
        }).finally(() => {
          if (this.data.loadPage) {
            this.setData({
              loadPage: false
            })
          }
        })
    },
    /**
     * 选择更新数据状态
     */
    assignData: function(return_data) {
        //验证
        let validateEntity = return_data.validateEntity || {
            code: 0,
            msg: "1001 异常"
        };
        if (validateEntity.code != 1) {
            wx.showModal({
                title: '提示',
                content: validateEntity.msg,
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        wx.navigateBack();
                    }
                }
            })
        }
        let userChoiceData = app.StorageH.get('userChoiceData') || {};
        
        
        //促销优惠
        let use_giftCards = this.data.use_giftCards;
        let giftCard_list = return_data.listgiftEntity;
        let use_condition_ids = this.data.use_condition_ids;
        if (use_giftCards.length == 0) {
          // let j = 0;
          for (let i in giftCard_list) {
            // let use_default = false;
            // if (j == 0) {
            //   use_default = true;
            //   use_condition_ids = giftCard_list[0].condition_id;
            // }
            // use_default = true;
            use_condition_ids = use_condition_ids ? use_condition_ids + "," + giftCard_list[i].condition_id : giftCard_list[i].condition_id;
            use_giftCards.push({
              use_default: true
            })
            // j++;
          }
        }
        // //储值卡
        // var prepaid_list = return_data.prepaidcard ? return_data.prepaidcard : '';
        // var prepaid_state = this.data.prepaid_state;
        // for (var j in prepaid_list) {
        //     prepaid_state.list_use_prepaid.push({
        //         use_default: false
        //     })
        // }
        //选择地址
        let address_data = return_data.payEntity;
        let shipping = this.data.shipping || {};
        let store_data = app.StorageH.get('store_data') || {};
        let select_store = store_data.select_store;
        console.log(store_data,"store_data");
        if (userChoiceData.selectAddr){
          if (validateEntity.isEnableSeltGet != "1"){
            address_data = userChoiceData.selectAddr;
            address_data.districtAddress = address_data.province_str + address_data.city_str + address_data.district_str + address_data.address
          }
        }else{
          if (select_store && select_store.id) {//门店自提
            shipping.shipping_way_id = 2;
            shipping.contact = store_data.contact;
            shipping.mob_phone = store_data.mob_phone;
            shipping.store_id = store_data.select_store ? store_data.select_store.id : '';
            address_data.name = store_data.select_store.name;
            address_data.consignee = store_data.contact;
            address_data.mobile = store_data.mob_phone;
            address_data.address = store_data.select_store.address;
            address_data.address_id = store_data.select_store.id;
            address_data.districtAddress = address_data.address;
          } else {
            if (validateEntity.isEnableSeltGet == "1"){
              address_data = {}
              shipping.shipping_way_id = 2;
            }else{
              shipping.shipping_way_id = 1;
            }
            shipping.contact = '';
            shipping.mob_phone = '';
            shipping.store_id = '';
          }
        }
        this.reqData.consignee = address_data.consignee;
        this.reqData.mobile = address_data.mobile;
        // this.reqData.store_id = shipping.store_id || 0;
        // this.reqData.address_id = address_data.address_id;
        //缓存收货时间
        if (userChoiceData.goods_receipt_time) {
            return_data.payEntity.receTimeId = userChoiceData.goods_receipt_time.id || 1;
            return_data.payEntity.receTimeName = userChoiceData.goods_receipt_time.rectime || "不限收货时间";
        }
        let pay_mode = {};
        let pay_type = app.StorageH.get("pay_type") || {};
        if (pay_type) {
            pay_mode.pay_id = pay_type.pay_id;
            pay_mode.pay_name = pay_type.pay_name;
        }
        //使用优惠券
        if (userChoiceData.use_coupon) {
            if (return_data.couponEntity) {
                return_data.couponEntity.use_coupon = userChoiceData.use_coupon;
            }
        }
        //积分
        let exchangeRate_money = 0;
        if (return_data.pointEntity) {
            let pointEntity = return_data.pointEntity;
            let allowPoint = parseFloat(pointEntity.allowPoint);
            let exchangeRate = parseFloat(pointEntity.exchangeRate);
            exchangeRate_money = parseFloat(allowPoint * exchangeRate).toFixed(2);
            return_data.pointEntity.exchangeRate_money = exchangeRate_money;
        }
        
        this.setData({
            mwinCartInfo: return_data.mwinCartInfo,
            shipping: shipping,
            tem_shipping_id: shipping.shipping_way_id,
            goods_list: return_data.arrBuyCarEntity,
            coupon_data: return_data.couponEntity,
            giftCard_list: giftCard_list,
            use_giftCards: use_giftCards,
            pay_data: return_data.payEntity,
            address_data: address_data,
            integral_data: return_data.pointEntity,
            // prepaid_card: return_data.prepaid_card_entity,
            prepaid_data: return_data.stored_value_entity || {},
            // prepaid_list: prepaid_list,
            // prepaid_state: prepaid_state,
            validate_data: return_data.validateEntity,
            pay_mode: pay_mode,
            user_recharge: return_data.user_recharge || {},
            use_condition_ids: use_condition_ids,
        })
        // this.identityCheck = this.data.goods_list.some((item) => {
        //     // console.log('存在', item)
        //     return item.sale_kind == 1
        // })
       
        if(!this.firstCheck){
            this.firstCheck = true;
            this.data.goods_list.forEach((item) => {
                if (item.sale_kind == 1) {
                    this.identityCheck = true
                } else {
                    this.normalGoods = true
                }
            })
            getCrossOrderUserInfo.call(this)
        }
        if (this.identityCheck) {
            this.setData({
                showIdentity: true
            })
        }
    },
    /**
     * 使用现金券
     */
    cashTicketInputBlur: function(e) {
        var val = e.detail.value;
        this.setData({
            cashCoupon_input: val
        })
    },
    //使用现金券
    useCashTicket: function() {
        let iserror = false;
        //没有输入现金券
        let cashCoupon_input = this.data.cashCoupon_input;
        if (!cashCoupon_input) {
            return;
        }
        //是否已选择
        let cashCoupon_data = this.data.cashCoupon_data;
        let useCashCoupon = cashCoupon_data.useCashCoupon;
        for (let i in useCashCoupon) {
            if (useCashCoupon[i].couponCode == cashCoupon_input) {
                cashCoupon_data.error = "该现金券已选择";
                this.setData({
                    cashCoupon_data: cashCoupon_data
                })
                return;
            }
        }
        return app.UserApi.getBalanceCheckCoupon({
            params: {
                couponCode: cashCoupon_input,
                brandCode: app.Conf.BRAND_CODE
            },
            other: {
                isShowLoad: true
            }
        }).then(e => {
            let msg = e.msg;
            let pay_data = this.data.pay_data;
            let cashCoupon_data = this.data.cashCoupon_data;
            if (e.code == "1") {
                let data = e.data;
                cashCoupon_data.error = "";
                useCashCoupon.push(data);
                var useCashCouponIds = cashCoupon_data.useCashCouponIds;
                var useCouponsMoney = parseFloat(pay_data.useCouponsMoney);
                for (var j in useCashCoupon) {
                    //总价
                    useCouponsMoney += parseFloat(useCashCoupon[j].couponMoney);
                    if (useCashCouponIds) {
                        useCashCouponIds += "," + useCashCoupon[j].couponId;
                    } else {
                        useCashCouponIds = useCashCoupon[j].couponId;
                    }
                }
                pay_data.useCouponsMoney = useCouponsMoney;
                cashCoupon_data.useCashCouponIds = useCashCouponIds;

                this.setData({
                    cashCoupon_data: cashCoupon_data,
                    pay_data: pay_data
                })

                //执行更新
                this.reqData.cashcouponIds = useCashCouponIds;
                this.getCheckOut();
                return Promise.resolve(e);
            } else {
                cashCoupon_data.error = msg;
                app.SMH.showToast({
                    "title": msg
                })
                this.setData({
                    cashCoupon_data: cashCoupon_data
                })
                iserror = true;
            }
            return Promise.reject();
        })
    },
    /**
     * 删除使用的现金券
     */
    delUseCashCoupon: function(e) {
        var coupon_id = e.currentTarget.dataset.coupon_id;
        var cashCoupon_data = this.data.cashCoupon_data;
        var pay_data = this.data.pay_data;
        var useCashCoupon = cashCoupon_data.useCashCoupon;
        var useCouponsMoney = 0;
        var useCashCouponIds = "";
        for (var i in useCashCoupon) {
            if (useCashCoupon[i].couponId == coupon_id) {
                useCashCoupon.splice(i, 1);
            } else {
                useCouponsMoney += parseFloat(useCashCoupon[i].couponMoney);
                if (useCashCouponIds) {
                    useCashCouponIds += "," + useCashCoupon[i].couponId;
                } else {
                    useCashCouponIds = useCashCoupon[i].couponId;
                }
            }
        }
        cashCoupon_data.error = "";
        cashCoupon_data.useCashCoupon = useCashCoupon;
        cashCoupon_data.useCashCouponIds = useCashCouponIds;
        pay_data.useCouponsMoney = useCouponsMoney;
        this.setData({
            cashCoupon_data: cashCoupon_data,
            pay_data: pay_data
        })

        //执行更新
        this.reqData.cash_coupon_ids = useCashCouponIds;
    },
    /**
     * 使用促销优惠
     */
    // defaultUserGiftCard() {
    //     var giftCard_list = this.data.giftCard_list;
    //     var use_giftCards = this.data.use_giftCards;
    //     if (giftCard_list.length == 0 || !giftCard_list[0].condition_id) return;
    //     var use_condition_ids = giftCard_list[0].condition_id;
    //     use_giftCards[0].use_default = true;
    //     this.setData({
    //         use_giftCards: use_giftCards,
    //         use_condition_ids: use_condition_ids
    //     })
    //     //执行更新
    //     this.reqData.isUsePromote = 1;
    // },
    useGiftCard: function(e) {
        let dataset = e.currentTarget.dataset || {};
        let condition_id = dataset.condition_id;
        let index = dataset.index;
        let use_condition_ids = this.data.use_condition_ids;
        let use_giftCards = this.data.use_giftCards;
        let giftCard_list = this.data.giftCard_list;
        let selectState = !use_giftCards[index].use_default;
        let cIds = "";
        for (let i in giftCard_list) {
          use_giftCards[i].use_default = selectState;
          cIds = cIds ? cIds + "," + giftCard_list[i].condition_id : giftCard_list[i].condition_id;
          // if (giftCard_list[i].condition_id == condition_id) {
          //   if (use_giftCards[i].use_default) {
          //     use_giftCards[i].use_default = false;
          //     use_condition_ids = "";
          //   } else {
          //     use_giftCards[i].use_default = true
          //     use_condition_ids = condition_id;
          //   }
          // } else {
          //   use_giftCards[i].use_default = false;
          // }
        }
        this.setData({
          use_giftCards: use_giftCards,
          use_condition_ids: selectState ? cIds : ""
        })

        //执行更新
        this.reqData.isUsePromote = selectState ? 1 : 0;
        if (use_condition_ids) {
          let userChoiceData = app.StorageH.get("userChoiceData") || {};
          delete userChoiceData.use_coupon;
          app.StorageH.set("userChoiceData", userChoiceData);
        }
        this.getCheckOut();
    },
    /**
     * 优惠券跳转
     */
    jumpToCoupon() {
        var coupon_data = this.data.coupon_data;
        if (parseInt(coupon_data.canUseCouponNum) == 0) return;
        var bonus_ids = coupon_data.bonus_ids;
        wx.navigateTo({
            url: '/pages/micro_mall/plugins/presale/presale_buy_bonus?bonus_ids=' + bonus_ids,
        })
    },
    /**
     * 使用积分
     */
    UseIntegral: function() {
        let integral_data = this.data.integral_data;
        let allowPoint = integral_data.allowPoint;
        let exchangeRate = integral_data.exchangeRate;
        let use_integral = this.data.use_integral;
        let integral_deduct;
        integral_deduct = (allowPoint * exchangeRate).toFixed(2);
        if (use_integral) {
            use_integral = false;
            this.reqData.points = "";
            this.reqData.IsUsePoint = 0;
        } else {
            use_integral = true;
            if (this.is_erp_point) { //使用erp积分
                this.reqData.points = integral_data.totalPoints;
            } else {
                this.reqData.points = 0;
            }
            this.reqData.IsUsePoint = 1;
        }
        this.setData({
            use_integral: use_integral,
            integral_deduct: integral_deduct
        })
        //执行更新
        this.getCheckOut();
    },
    /**
     *使用默认储值卡 
     */
    UsePrepaid:function(){
      let use_prepaid = this.data.use_prepaid;
      if (use_prepaid){
        this.reqData.Is_Use_Storedvalue = 0
      }else{
        this.reqData.Is_Use_Storedvalue = 1
      }
      this.setData({
        use_prepaid: !use_prepaid
      })
      //执行更新
      this.getCheckOut();
    },
    UseDefaultPrepaid: function() {},
    /**
     * 储值卡列表切换
     */
    switchSelectPrepaid: function() {
        var prepaid_state = this.data.prepaid_state;
        prepaid_state.show_prepaid_list = !prepaid_state.show_prepaid_list;
        this.setData({
            prepaid_state: prepaid_state
        })
    },
    /**
     *  选择 / 不使用储值卡 
     */
    selectPrepaid: function(e) {},
    /**
     * 使用余额
     */
    UseBalance: function() {
        var use_balance = this.data.use_balance;
        if (use_balance) {
            use_balance = false;
            this.reqData.IsUseBalance = 0;
        } else {
            use_balance = true;
            this.reqData.IsUseBalance = 1;
        }
        this.setData({
            use_balance: use_balance
        })
        //执行更新
        this.getCheckOut();
    },
    /**
     * 使用充值卡
     */
    UseRecharge: function() {
        var is_user_recharge = this.data.is_user_recharge;
        if (is_user_recharge) {
            is_user_recharge = false;
            this.reqData.IsUseRecharge = 0;
        } else {
            is_user_recharge = true;
            this.reqData.IsUseRecharge = 1;
        }
        this.setData({
            is_user_recharge: is_user_recharge
        })
        //执行更新
    },
    /**
     * 备注数量监控
     */
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
    /*
     * 提交订单
     */
    order_createOrder: function() {
        if (this.clickDisable) return;
        let params = {};
        let address_data = this.data.address_data || {};
        params.address_data = address_data;
        params.pay_data = this.data.pay_data; //收货时间
        params.pay_mode = this.payMode[0] || this.data.pay_mode; //支付方式
        params.cashCoupon_data = this.data.cashCoupon_data; //现金券
        params.use_condition_ids = this.data.use_condition_ids; //使用促销
        params.Is_Use_Storedvalue = this.data.use_prepaid || false,
        // params.prepaid_state = this.data.prepaid_state;
        params.prepaid_data = this.data.prepaid_data || {};
        params.coupon_data = this.data.coupon_data;
        params.userChoiceData = app.StorageH.get('userChoiceData') || {};
        params.remarks_val = this.data.remarks_val;
        params.IsUseRecharge = this.data.is_user_recharge;
        params.shipping = this.data.shipping;
        params.user_recharge = this.data.user_recharge;
        params.integral_data = this.data.integral_data;
        params.use_integral = this.data.use_integral;
        params.use_balance = this.data.use_balance;
        this.params = params;
        let tip = "";
        if (!params.address_data.address_id || params.address_data.address_id == 0) {
            tip = "请填写收货地址信息";
        } 
        else if (this.identityCheck && this.data.identityName !== '' && this.data.identityName != address_data.consignee) {
            tip = "因清关需要，身份证姓名需与收货人姓名一致";
            this.checkAll = false;
            this.setData({
                checkAll: this.checkAll
            })
        }
        else if (!this.handleIdentitySubmit()){
          return;
        }
       
        // else if (!pay_data.receTimeId || pay_data.receTimeId == 0) {
        //     tip = "请选择收货时间";
        // } 
        // else if (!pay_mode.pay_id || pay_mode.pay_id == 0) {
        //     tip = "请选择支付方式";
        // }
        if (tip) {
            app.SMH.showToast({
                "title": tip
            })
            return;
        } 
        if (this.identityCheck) {
            addNewOrderInfo.call(this, params, true)

            // if (!this.checkAll) {
            //     this.setData({
            //         filter: true
            //     })
            // } else {
            //     addNewOrderInfo.call(this, params, true)
            // }
        } else {
            addNewOrderInfo.call(this, params)
        }
    },

    /**
     * 初始化参数
     */
    initParam() {
        this.reqData = {
            "recIds": "",
            "bonusId": "",
            "IsUsePoint": 0,
            "IsUseBalance": 0,
            "IsUseStore": 0,
            "store_id": 0,
            "address_id": 0,
            "isUsePromote": 1,
            "consignee": "",
            "mobile": "",
            "Is_Use_Storedvalue":0,
            "cashcouponIds": "",
            "brandCode": app.Conf.BRAND_CODE,
            "userToken": app.LM.userToken
        };
        //
        app.StorageH.remove("store_data");
    },
    changeShipping(e) {
        let shipping = this.data.shipping;
        var shippingtype = e.currentTarget.dataset.shippingtype;
        shipping.shipping_way_id = shippingtype || 1;
        this.setData({
            shipping: shipping
        })
        this.confirmChangeShipping();
    },
    confirmChangeShipping() {
        var shipping = this.data.shipping;
        if (shipping.shipping_way_id == 1) { //快速配送
            wx.navigateTo({
                url: '/pages/micro_mall/address/address_list',
            })
        } else { //门店自提
          checkSelectStore.call(this,function(res){
            let pay_data = this.data.pay_data || {};
            let store_data = app.StorageH.get("store_data") || {};
            store_data.contact = pay_data.consignee;
            store_data.mob_phone = pay_data.mobile;
            app.StorageH.set("store_data", store_data);
            wx.navigateTo({
              url: '/pages/micro_mall/selfGet/self_get_set',
            })
          })
           
        }
    },
    handleIdentity(e) {
        // this.checkAll = false;
        this.setData({
            filter: !this.data.filter
        })
    },
    getIdentity(e) {
        let type = e.currentTarget.dataset.type || '';
        this.setData({
            [type]: e.detail.value
        })
    },
    handleIdentitySubmit(e) {
        // let reg = /^[\u4e00-\u9fa5]+$/;
        let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        // console.log('提交:', this.data.identityName, this.data.identityNumber, this.data.identityNumber.length);
        if (!this.identityCheck) return true;
        if (!this.data.identityName && !this.data.identityNumber) { 
            app.SMH.showToast({
                title: '请填写身份证信息'
            })
            return false;
        }
        if (!this.data.identityName) { //|| !reg.test(this.data.identityName)
            app.SMH.showToast({
                title: '请输入身份证姓名'
            })
            return false;
        }
        if (!this.data.identityNumber || !regIdNo.test(this.data.identityNumber)) {
            app.SMH.showToast({
                title: '请输入正确的身份证号码'
            })
            return false;
        }
        this.checkAll = true;
        this.setData({
            filter: false,
            checkAll:this.checkAll
        })
        return true;
    },
    _noFn() {},
}))

function onShowEvent(related_key){
  if (this.options.scene){
    getBuyCarByMin.call(this, related_key).then(res => {
      this.getCheckOut();
    })
  }else{
    this.getCheckOut()
  }
}
function listen(){
  this._checkUserLogin().finally(()=>{
    if (this.options.scene && !this.options.related_key){
      app.SHP.getParams(["related_key"]).then((params) => {
        this.options = {
          ...this.options,
          ...params
        }
        if (this.options.related_key){
          onShowEvent.call(this, this.options.related_key);
        }
      })
    }else{
      onShowEvent.call(this, this.options.related_key);
    }
  })
  
}

function getBuyCarByMin(related_key){
  if (!app.LM.userToken || !related_key) return Promise.reject();
  if (related_key == this.nextRelatedKey) return Promise.resolve();//息屏不重新加入购物车
  return app.GoodsApi.genterBuyCarByMwin({
    data:{
      "userToken": app.LM.userToken,
      "related_key": related_key || "",
      "brandCode": app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      let status = data.status;
      if (status != 1){
        let warn = "";
        let cartList = data.cartList || [];
        for (let i in cartList){
          if (cartList[i].is_onsale != 1){
            cartList[i].is_invalid = true;
            warn = "商品" + cartList[i].goods_name + "已下架";
            break;
          } else if (cartList[i].status != 1){
            cartList[i].is_invalid = true;
            warn = "商品" + cartList[i].goods_name + "已售罄";
            break;
          }
        }
        this.setData({
          goods_list: cartList,
          isFailBuy: true
        })
        app.SMH.showToast({
          "title": warn || "部分商品失效"
        })
        return Promise.reject();
      }else{
        if (data.recIds){
          this.options.rec_str = data.recIds.join(",");
          let userChoiceData = app.StorageH.get('userChoiceData') || {};
          userChoiceData.rec_str = this.options.rec_str;
          app.StorageH.set('userChoiceData', userChoiceData);
          this.nextRelatedKey = related_key;
          this.setData({
            isFailBuy: false
          })
          return Promise.resolve(res);
        }
        return Promise.reject();
      }
    }else{
      app.SMH.showToast({
        "title": "加入购物车失败"
      })
      return Promise.reject();
    }
  }).finally(() => {
    if (this.data.loadPage) {
      this.setData({
        loadPage: false
      })
    }
  })
}

function loadPayMode() {
    return app.BrandApi.getPaymentList({
        params: {
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: false
        }
    }).then(res => {
        const temp = res.data || [];
        if (res.code == 1) {
            this.payMode = temp.filter(item => {
                if (item.pay_code == 'wxpay') {
                    return item
                }
            })
        }
    })
}


function addNewOrderInfo(params, identity = false) {
    this.clickDisable = true;
    let that = this;
    console.log(params,"params");
    goPay.call(that, params, identity);
}

//
function goPay(params, identity){
    let obj = {};
    obj = {
        "userToken": app.LM.userToken,
        "addressId": params.shipping.store_id ? params.shipping.store_id : parseInt(params.address_data.address_id),
        "paymentId": parseInt(params.pay_mode.pay_id),
        "besttimeId": parseInt(params.pay_data.receTimeId) || 1,
        "changeValue": params.use_integral ? params.integral_data.allowPoint : 0,
        "rec_ids": this.options.rec_str,
        "isStore": params.shipping.store_id ? 1 : 0,
        "bonusId": params.coupon_data.use_coupon ? params.coupon_data.use_coupon.bonus_id : 0,
        "surplus": params.use_balance ? params.pay_data.canUsebalance : 0,
        "postscript": params.remarks_val,
        "condition_ids": params.use_condition_ids,
        "consignee": params.address_data.consignee,
        "mobile": params.address_data.mobile,
        "cashcoupon_ids": params.cashCoupon_data.useCashCouponIds,
        "Is_Use_Storedvalue": params.Is_Use_Storedvalue ? 1 : 0,
        "is_use_point": params.use_integral ? 1 : 0,
        "offline_surplus": params.Is_Use_Storedvalue ? params.prepaid_data.canuse_storedvalue : 0,
        "brandCode": app.Conf.BRAND_CODE,
        "storeId": params.shipping.store_id || 0,
    }
    if(identity){
        obj.idCardName = this.data.identityName;
        obj.idCardNo = this.data.identityNumber; 
    }
    return app.BuyApi.addNewOrderInfo({
        data: obj,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            if (data.OrderId && data.OrderId != "0") {
                //删除缓存数据
                let userChoiceData = app.StorageH.get('userChoiceData') || {};
                delete userChoiceData.goods_receipt_time;
                delete userChoiceData.pay_receipt_time;
                delete userChoiceData.use_coupon;
                delete userChoiceData.selectAddr;
                delete userChoiceData.rec_str;
                app.StorageH.set('userChoiceData', userChoiceData);
                app.StorageH.set('store_data', '');
                if (identity && this.normalGoods){
                    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
                    this.pageDialog.setTitle("温馨提示");
                    this.pageDialog.setTouchCancel(false);
                    this.pageDialog.setCentent("因该订单涉及不同仓库发货，将会拆分多个订单发出。请留意查收快递信息！");
                    this.pageDialog.setSingleBtn({
                        name: "确认",
                        tap: function () {  
                            wx.redirectTo({
                              url: '/pages/micro_mall/order/order_info?first_time_topay=1&order_id=' + data.OrderId,
                            })
                        }
                    })
                    this.clickDisable = false;
                    this.pageDialog.show();
                }else{
                    wx.redirectTo({
                        url: '/pages/micro_mall/order/order_info?first_time_topay=1&order_id=' + data.OrderId,
                    })
                }
                this.initParam();
            } else {
                app.SMH.showToast({
                    "title": e.msg || "提交失败"
                })

            } 
            this.clickDisable = false
            return Promise.resolve(e);
        } else {
            if (identity) {
                this.checkAll = false;
                this.setData({
                    checkAll: this.checkAll
                })
            }
            this.clickDisable = false;
            app.SMH.showToast({
                title: e.msg || '提交失败'
            })
            return Promise.resolve(e);
        }
    })
}

//
function getCrossOrderUserInfo(){
    app.UserApi.getCrossOrderUserInfo({
        params:{
            userToken: app.LM.userToken,
            brandCode:app.Conf.BRAND_CODE,
        },other:{isShowLoad:false}
    }).then(res=>{
        if(res.code==1){
            let identityObj = res.data || {};
            if (res.data && res.data.identityName && res.data.identityNo){
                this.checkAll = true;
            }else{
                this.checkAll = false;
            }
            this.setData({
                identityName: identityObj.identityName || '',
                identityNumber: identityObj.identityNo || '',
                checkAll:this.checkAll
            })
        }
         
    })
}

//获取定位
function getCurrLoation(callBack) {
  let that = this;
  app.AS.checkAuthorize("scope.userLocation",function(){
    WxApi.getLocation({
      type: 'gcj02',
    }).then(res => {
      typeof callBack == "function" && callBack.call(that,res);
    }).catch(error => {
      that.pageDialog = that.pageDialog || that.selectComponent("#pageDialog");
      that.pageDialog.setTitle("");
      that.pageDialog.setTouchCancel(false);
      that.pageDialog.setCentent("地址定位失败！请开启定位或微信位置权限");
      that.pageDialog.setSingleBtn("确定")
      that.pageDialog.show();
    })
  })
  
}
//检测店铺
function checkSelectStore(callBack) {
  if (!this.options.rec_str) return;
  let reqParams = {
    recIds: this.options.rec_str,
    searchName: "",
    lat: 0,
    lon: 0,
    brandCode: app.Conf.BRAND_CODE,
    userToken: app.LM.userToken,
    // sType: 1 //0 附近店铺 ，1店铺自提
  }
  getCurrLoation.call(this,function(res){
    let that = this;
    reqParams.lat = res.latitude;
    reqParams.lon = res.longitude;
    app.UserApi['getNearyByInStoreListWithInventory']({
      params: reqParams,
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == 1) {
        if (e.data instanceof Array && e.data.length > 0) {
          typeof callBack == "function" && callBack.call(that,e);
          return;
        }
      }
      app.SMH.showToast({
        "title": "该订单商品没有可选店铺！"
      })
      let validate_data = this.data.validate_data || {};
      if (validate_data.isEnableSeltGet != "1") {
        let shipping = this.data.shipping || {};
        shipping.shipping_way_id = 1;
        this.setData({
          shipping: shipping,
        })
      }
    })
  })
}