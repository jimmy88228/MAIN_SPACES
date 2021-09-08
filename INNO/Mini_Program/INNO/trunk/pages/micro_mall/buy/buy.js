// pages/micro_mall/buy/buy.js
import WxApi from "../../../common/helper/wx-api-helper.js"
import LocationM from "../../../common/helper/location-manager.js";
import LgMg from "../../../common/manager/log-manager";
import StrH from "../../../common/support/utils/string-util"
import MyDate from '../../../common/support/utils/date-util.js';

let app = getApp();
const ValetSmsType = {
  'asset':0,
  'pay':1
}
Page(app.BP({
  data: {
    brand_info: {},
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
    // use_giftCards: [], //选择的促销优惠
    isUsePromote: 0,
    // use_condition_ids: "",
    //全场促销
    sec_promote: [],
    isUseSecPromote: 0,
    //
    pay_data: {},
    //使用储值卡
    use_prepaid: false,
    prepaid_data: {},
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
    shipping: {
      way_id: 0, //2 快递 OR 1 自提 
      contact: "",
      mob_phone: "",
      store_id: 0,
      store_name: "",
    },
    filter: false,
    identityNumber: '',
    identityName: '',
    marskValue: false,
    valetConf:{}, 
    cur_pay_index:0,
    //超值购
    chooseDiscountGoods: [],
    needSignOrderActivityGoods:{},
  },
  redpackInfo:{
    use: 0
  },
  storesForAOpen: false,
  isFirst: true,
  observers:{},
  onLoad: function (options) {

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
      checkPng: checkPng,
      options: options,
      "shipping.way_id": (options.store_id && options.store_id != 0) ? 1 : 2,
      "shipping.store_id": options.store_id,
    })
    initParam.call(this, false);
    loadPayMode.call(this);
  },
  onUnload() {
    app.EB.unListen('LoginStateChange', this.loginId);
    app.EB.unListen('storesForA', this.storesForAId);
    clearTimeout(this.checkTimeOutLocation);
    clearTimeout(this.checkTimeOutLock);
    app.StorageH.remove("userChoiceData");
    app.StorageH.remove("select_store");
    app.StorageH.remove("store_data");
    //
    backPageStatus.call(this);
  },
  onHide() {
    this.jumpAlready = true;
    app.EB.unListen('storesForA', this.storesForAId);
    resetLoading.call(this);
    clearTimeout(this.checkTimeOutLocation);
    clearTimeout(this.checkTimeOutLock);
  },
  onShow: function () {
    this.jumpAlready = false;
    app.sysTemConfig("disable_cash_bonus").then(data => {
      if (data.Value == "0") {
        this.setData({
          canUseCashCoupon: true
        })
      }
    })
    //erp积分
    app.sysTemConfig("is_erp_point").then(data => {
      this.is_erp_point = data.Value
    })
    checkStoresForAFn.call(this);
    if (this.reqData.recIds) {
      if(this.pageState != "onBack"){
        app.sysTemConfig("is_erp_coupon").then(data=>{
          if(data.Value == 1){
            getUserErpCoupon.call(this).finally(()=>{
              this.getCheckOut();
            })
          } else {
            this.getCheckOut();
          }
        })
      } else {
        this.getCheckOut();
      }
    } else {
      app.SMH.showToast({
        "title": "非法购物车"
      })
    }

  },
  onReady(){
    app.sysTemConfig("close_order_remark").then(data => {
      if(data.Value != this.data.isShowRemark){
        this.setData({
          isShowRemark: data.Value
        })
      }
    })
    app.sysTemConfig("instore_order_change_staff").then(data => {
      if(data.Value){
        this.setData({
          is_can_change_staff: data.Value
        })
      }
    })
  },
  /**
   * 初始化数据
   */
  getCheckOut: function (type) {
    //增加type类型，判断用户操作优惠类型
    let shipping = this.data.shipping || {};
    let store_data = app.StorageH.get('store_data') || {};
    let select_store = store_data.select_store || {};
    let userChoiceData = app.StorageH.get('userChoiceData') || {};
    let selectAddr = userChoiceData.selectAddr || {};
    // let rec_str = userChoiceData.rec_str || this.options.rec_str;
    let use_integral = this.data.use_integral;
    let use_balance = this.data.use_balance;
    let use_prepaid = this.data.use_prepaid;
    //设置请求参数
    this.reqData.IsUseStore = shipping.store_id && shipping.store_id != 0 ? 1 : 0;
    this.reqData.IsUseBalance = use_balance ? 1 : 0;
    this.reqData.Is_Use_Storedvalue = use_prepaid ? 1 : 0;
    let bonusId = "";
    if (userChoiceData.use_coupon && userChoiceData.use_coupon.length > 0) {
      for (let i = 0; i < userChoiceData.use_coupon.length; i++) {
        if (userChoiceData.use_coupon[i].bonus_id) {
          bonusId = bonusId ? bonusId + "," + userChoiceData.use_coupon[i].bonus_id : userChoiceData.use_coupon[i].bonus_id
        }
      }
    }
    let info = app.StorageH.get('store_data') || {};
    this.reqData.staffId = this.curStaffId = info.staff_id || this.curStaffId || 0;
    this.reqData.bonusId = bonusId;
    this.reqData.IsUsePoint = use_integral ? 1 : 0;
    this.reqData.store_id = shipping.store_id || 0;
    this.reqData.isSelRedpack = this.redpackInfo.use || 0;
    if (shipping.way_id == "1" && select_store.id || (this.options.store_id && this.options.store_id != 0)) {
      this.reqData.addressId = select_store.id || this.options.store_id || 0;
      this.reqData.consignee = store_data.contact || "";
      this.reqData.mobile = store_data.mob_phone || "";
      shipping.contact = store_data.contact || "";
      shipping.mobile = store_data.mob_phone || "";
      delete userChoiceData.selectAddr;
      app.StorageH.set('userChoiceData', userChoiceData);
    } else if (shipping.way_id == "2") {
      if (selectAddr.address_id) {
        this.reqData.addressId = selectAddr.address_id;
        store_data && app.StorageH.remove("store_data");
      } else {
        this.reqData.addressId = 0;
      }
      this.reqData.consignee = "";
      this.reqData.mobile = "";
      shipping.contact = "";
      shipping.mobile = "";
    }
    this.reqData.discountBuyGoods = this.data.chooseDiscountGoods || []
    this.reqData.needSignOrderActivityGoods = 1;
    //结算数据
    return app.BuyApi.postJieSuanListByStore({
      data: this.reqData,
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == "1") {
        this.isFirst = false;
        this.reqData.isFirst = 0;
        let data = e.data;
        this.assignData(data, type);
        return Promise.resolve(e);
      }
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("温馨提示");
      this.pageDialog.setTouchCancel(false);
      this.pageDialog.setCentent(e.msg);
      this.pageDialog.setSingleBtn(
        {
          name: "确定",
          tap: function () {
            wx.navigateBack();
          }
        }
      )
      wx.nextTick(() => {
        this.pageDialog.show();
      })
      return Promise.reject();
    })
  },
  /**
   * 选择更新数据状态
   */
  assignData: function (return_data, type) {
    //验证
    let validateEntity = return_data.validateEntity || {
      code: 0,
      msg: "1001 异常"
    };
    if (validateEntity.code != 1) {
      if (validateEntity.code == 0){
        
      }else{
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle("温馨提示");
        this.pageDialog.setTouchCancel(false);
        this.pageDialog.setCentent(validateEntity.msg);
        this.pageDialog.setSingleBtn(
          {
            name: "确定",
            tap: function () {
              wx.navigateBack();
            }
          }
        )
        wx.nextTick(() => {
          this.pageDialog.show();
        })
      }
    }
    let userChoiceData = app.StorageH.get('userChoiceData') || {};
    let shippingWay = return_data.shippingWay || {};
    let redpackList = return_data.redpackList || [];
    let redpackSumary = return_data.redpackSumary || {};
    let valetOrderInfo = return_data.valetOrderInfo || {};
    let listgiftEntity = return_data.listgiftEntity || [];
    let promoteGiftGoods = return_data.listPromoteGiftGoods;
    let signOrderActivityReward = return_data.signOrderActivityReward||{};
    //促销优惠
    let use_giftCards = this.data.use_giftCards || [];
    let isUsePromote = this.data.isUsePromote || 0;
    let giftCard_list = [], sec_promote = [];
    this.curStaffId = shippingWay.staffId || 0;
    for (let i = 0; i < listgiftEntity.length; i++) {
      //全场促销
      if (listgiftEntity[i].rule_type == 1) {
        sec_promote.push(listgiftEntity[i]);
      } else {
        giftCard_list.push(listgiftEntity[i]);
      }
    }
    if (this.reqData.isUsePromote == 1 && giftCard_list.length > 0) {
      isUsePromote = 1;
    } else {
      isUsePromote = 0;
      this.reqData.isUsePromote = 0;
    }

    //选择地址
    let address_data = return_data.payEntity;
    let shipping = this.data.shipping || {};
    let store_data = app.StorageH.get('store_data') || {};
    let select_store = store_data.select_store;
    if (shipping.way_id == "2") {
      if (userChoiceData.selectAddr){
        address_data = userChoiceData.selectAddr;
        address_data.districtAddress = address_data.province_str + address_data.city_str + address_data.district_str + address_data.address
      }
    } else if (shipping.way_id == "1") {
      if (select_store && select_store.id || shippingWay.shippingStoreId) {
        select_store = select_store || {}
        shipping.contact = store_data.contact || "";
        shipping.mob_phone = store_data.mob_phone || "";
        shipping.store_id = select_store.id || shippingWay.shippingStoreId || '';
        shipping.store_name = select_store.name || shippingWay.shippingName || '';
        address_data.name = select_store.name || shippingWay.shippingName || '';
        address_data.consignee = store_data.contact || "";
        address_data.mobile = store_data.mob_phone || "";
        address_data.address = select_store.address || "";
        address_data.address_id = select_store.id || shippingWay.shippingStoreId || '';
        address_data.districtAddress = address_data.address || "";
      }
    } else {
      shipping.contact = '';
      shipping.mob_phone = '';
      shipping.store_id = 0;
      shipping.store_name = '';
    }
    shipping.way_id = shippingWay.shippingStoreId && shippingWay.shippingStoreId != 0 ? 1 : 2;
    this.reqData.consignee = address_data.consignee || "";
    this.reqData.mobile = address_data.mobile || "";
    //缓存收货时间
    if (userChoiceData.goods_receipt_time) {
      return_data.payEntity.receTimeId = userChoiceData.goods_receipt_time.id || 1;
      return_data.payEntity.receTimeName = userChoiceData.goods_receipt_time.rectime || "不限收货时间";
    }
    // let pay_mode = {};
    // let pay_type = app.StorageH.get("pay_type") || {};
    // if (pay_type) {
    //   pay_mode.pay_id = pay_type.pay_id;
    //   pay_mode.pay_name = pay_type.pay_name;
    // }
    //使用优惠券
    if (userChoiceData.use_coupon || return_data.useBonusList.length) {
      if (return_data.couponEntity) {
        return_data.couponEntity.use_coupon = userChoiceData.use_coupon || return_data.useBonusList;
      }
      if(!userChoiceData.use_coupon){
        userChoiceData.use_coupon = return_data.useBonusList;
        let bonusId = "";
        for(let i = 0; i < return_data.useBonusList.length; i++){
          let bonusItem = return_data.useBonusList[i];
          bonusId = bonusId ? bonusId + "," + bonusItem.bonus_id : bonusItem.bonus_id
        }
        this.reqData.bonusId = bonusId;
        app.StorageH.set('userChoiceData', userChoiceData)
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
      if(return_data.pointEntity.allowPoint && return_data.pointEntity.sel_point){
        this.setData({
          use_integral: 1
        })
        this.reqData.IsUsePoint = 1;
      }
    }
    let redpackInfo = this.redpackInfo||{};
    //红包
    if(redpackSumary.allow_redpack==1){
      redpackInfo.use = redpackSumary.sel_redpack || 0;
      if(redpackSumary.allow_use_redpack > 0 && redpackList.length>0){
        for(let i=0,len=redpackList.length;i<len;i++){
          dateFormat.call(this,redpackList[i]);
        }
      }
    }else{
      redpackSumary.sel_redpack = 0;
      redpackInfo.use = 0;
    }
    // this.pay_mode = pay_mode || {};
    this.setData({
      shipping: shipping,
      goods_list: return_data.arrBuyCarEntity,
      coupon_data: return_data.couponEntity,
      giftCard_list: giftCard_list,
      sec_promote: sec_promote,
      use_giftCards: use_giftCards,
      pay_data: return_data.payEntity,
      address_data: address_data,
      integral_data: return_data.pointEntity,
      prepaid_data: return_data.stored_value_entity || {},
      validate_data: return_data.validateEntity,
      user_recharge: return_data.user_recharge || {},
      shippingWay: return_data.shippingWay || {},
      valetOrderInfo: valetOrderInfo,
      // use_condition_ids: use_condition_ids,
      promoteGiftGoods,
      isUsePromote: isUsePromote,
      redpackList,
      redpackSumary,
      signOrderActivityReward
      // redpackInfo
    })
    if (!this.firstCheck) {
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
    //初始化用户操作
    autoSetSecPromote.call(this, sec_promote, type)
    //存在用户操作
    if (hasOtherOperate.call(this)){
      if (hasOtherOperate.call(this, "coupon") && return_data.couponEntity && return_data.couponEntity.canUseCouponNum == 0){
        initUserOperate.call(this,"coupon");
      }
      if(hasOtherOperate.call(this, "integral") && return_data.pointEntity && return_data.pointEntity.allowPoint == 0){
        initUserOperate.call(this,"integral");
      } else if(return_data.pointEntity.sel_point){
        this.setData({
          use_integral: 1
        })
        this.reqData.IsUsePoint = 1;
      }
      if(hasOtherOperate.call(this, "prepaid") && return_data.stored_value_entity && return_data.stored_value_entity.canuse_storedvalue == 0){
        initUserOperate.call(this,"prepaid");
      }
      if(hasOtherOperate.call(this, "giftCard") && giftCard_list.length == 0){
        initUserOperate.call(this,"giftCard");
      }
    }

  },
  /**
   * 使用现金券
   */
  cashTicketInputBlur: function (e) {
    var val = e.detail.value;
    this.setData({
      cashCoupon_input: val
    })
  },
  cashCouponScan() {
    let that = this;
    wx.scanCode({
      success(res) {
        console.log(res, "buy  ====")
        let result = res.result;
        that.setData({
          cashCoupon_input: result || ""
        })
      }
    })
  },
  beforeUseCachTicket() {
    this.useCashTicket();
  },
  //使用现金券
  useCashTicket: function () {
    let iserror = false;
    //没有输入现金券
    let cashCoupon_input = this.data.cashCoupon_input;
    if (!cashCoupon_input) {
      return;
    }
    //是否已选择
    let cashCoupon_data = this.data.cashCoupon_data;
    let useCashCoupon = cashCoupon_data.useCashCoupon;
    for (let i = 0; i < useCashCoupon.length; i++) {
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
        let useCashCouponIds = cashCoupon_data.useCashCouponIds;
        let useCouponsMoney = parseFloat(pay_data.useCouponsMoney);
        for (let j = 0; j < useCashCoupon.length; j++) {
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
  delUseCashCoupon: function (e) {
    let coupon_id = e.currentTarget.dataset.coupon_id;
    let cashCoupon_data = this.data.cashCoupon_data;
    let pay_data = this.data.pay_data;
    let useCashCoupon = cashCoupon_data.useCashCoupon;
    let useCouponsMoney = 0;
    let useCashCouponIds = "";
    for (let i = 0; i < useCashCoupon.length; i++) {
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
    this.reqData.cashcouponIds = useCashCouponIds;
    this.getCheckOut();
  },
  useGiftCard: function (e) {
    let isUsePromote = this.data.isUsePromote || 0;
    isUsePromote = isUsePromote == 1 ? 0 : 1;
    if(isUsePromote == 0){//取消
      this.useGiftCardHandle(isUsePromote);
      return;
    }
    let hasOther = hasOtherOperate.call(this, "cashCoupon,coupon",true);
    console.log("其他",hasOther);
    if (!hasOther) {
      this.useGiftCardHandle(isUsePromote);
      return;
    }
    let that = this;
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setTitle("温馨提示");
    this.pageDialog.setTouchCancel(false);
    this.pageDialog.setCentent("勾选促销活动后请重新选择可用优惠券，是否继续！");
    this.pageDialog.setTwoBtn(
      {
        name: "取消",
        tap: function () {
          that.pageDialog.dismiss();
        }
      },
      {
        name: "确认勾选",
        tap: function () {
          initUserOperate.call(that,"secPromote,giftCard",false);
          that.useGiftCardHandle(isUsePromote)
          that.pageDialog.dismiss();
        }
      }
    )
    this.pageDialog.show();
  },
  useGiftCardHandle(isUsePromote){
    this.setData({
      isUsePromote: isUsePromote
    })
    //执行更新
    this.reqData.isUsePromote = isUsePromote;
    this.getCheckOut();
  },
  useSecPromote() {
    let isUseSecPromote = this.data.isUseSecPromote || 0;
    this.setData({
      isUseSecPromote: isUseSecPromote == 1 ? 0 : 1
    })
    this.reqData.isUseSecPromote = this.data.isUseSecPromote
    this.getCheckOut("secPromote");
  },
  /**
   * 优惠券跳转
   */
  jumpToCoupon() {
    let coupon_data = this.data.coupon_data || {};
    if (parseInt(coupon_data.canUseCouponNum) == 0) return;
    // let result = hasOtherOperate.call(this,"coupon,secPromote,giftCard",false);//检测是否存在其他操作
    let that = this;
    this.ToCoupon(); 
  },
  onTapRed(){
    if(this.lockTime)return;
    throttle.call(this);
    this.redPopup = this.redPopup || this.selectComponent('#redPopup');
    this.redPopup.setTouchCancel(false);
    this.redPopup.show();
  },
  ToCoupon() {
    let coupon_data = this.data.coupon_data || {};
    let bonus_ids = "";
    let use_coupon = coupon_data.use_coupon;
    if (use_coupon) {
      if (use_coupon instanceof Array) {
        for (let i = 0; i < use_coupon.length; i++) {
          bonus_ids = bonus_ids ? bonus_ids + "," + use_coupon[i].bonus_id : use_coupon[i].bonus_id;
        }
      } else {
        bonus_ids = use_coupon.bonus_id;
      }
    }
    let address_data = this.data.address_data || {};
    let couponOption = {
      isUsePoint: this.reqData.IsUsePoint,
      isUseRedpack: this.reqData.isSelRedpack,
      cashCouponIds: this.reqData.cashcouponIds,
      isUsePromote: this.reqData.isUsePromote,
      bonusId: bonus_ids,
      recIds: this.reqData.recIds,
      IsUseStoreAddr: this.reqData.IsUseStore,
      addressId: address_data.address_id,
    } 
    let data = {
      couponOption
    }
    if(this.valetInfo && this.valetInfo.userToken){
      data.userToken = this.valetInfo.userToken
    }
    this.chooseCoupon = this.chooseCoupon || this.selectComponent("#chooseCoupon");
    this.chooseCoupon.initData(data);
  },
  chooseCouponCallback(){
    console.log("初始化");
    //执行更新
    this.getCheckOut();
  },
  /**
   * 使用积分
   */
  UseIntegral: function () {
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
      if(integral_data.point_count_limit){
        let that = this;
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle("温馨提示");
        this.pageDialog.setTouchCancel(false);
        this.pageDialog.setCentent("积分使用：每隔" + integral_data.point_use_hour_limit + "小时可使用积分抵扣"+ integral_data.point_use_count_limit + "次");
        this.pageDialog.setSingleBtn(
          {
            name: "确定",
            tap: function () {
              that.pageDialog.dismiss();
            }
          }
        )
        wx.nextTick(() => {
          this.pageDialog.show();
        })
        return;
      }
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
  UsePrepaid: function () {
    let use_prepaid = this.data.use_prepaid;
    
    if (use_prepaid) {
      this.reqData.Is_Use_Storedvalue = 0
    } else {
      this.reqData.Is_Use_Storedvalue = 1
    }
    this.setData({
      use_prepaid: !use_prepaid
    })
    //执行更新
    this.getCheckOut();
  },
  UseDefaultPrepaid: function () { },
  /**
   * 储值卡列表切换
   */
  switchSelectPrepaid: function () {
    var prepaid_state = this.data.prepaid_state;
    prepaid_state.show_prepaid_list = !prepaid_state.show_prepaid_list;
    this.setData({
      prepaid_state: prepaid_state
    })
  },
  /**
   *  选择 / 不使用储值卡 
   */
  selectPrepaid: function (e) { },
  /**
   * 使用余额
   */
  UseBalance: function () {
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
  UseRecharge: function () {
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
  ShowRemarksVal: function () {
    var show_remarks_val = this.data.show_remarks_val;
    var remarks_focus = this.data.remarks_focus;
    show_remarks_val = !show_remarks_val;
    remarks_focus = !remarks_focus;
    this.setData({
      show_remarks_val: show_remarks_val,
      remarks_focus: remarks_focus
    })
  },
  remarksInput: function (e) {
    let font_num = e.detail.cursor;
    let remarks_val = e.detail.value;
    remarks_val = StrH.safeFilter(remarks_val,"remarks");
    this.setData({
      font_num: font_num,
      remarks_val: remarks_val
    })
  },
  /*
   * 提交订单
   */
  order_createOrder: function () {
    if (this.clickDisable) return;
    let that = this;
    if (this.checking && (this.checking == true)) {
      return
    }
    if (this.isLoading_storesForA) {
      return;
    }
    let params = {};
    let address_data = this.data.address_data || {};
    let paymentList = this.data.paymentList || [];
    let valetOrderInfo = this.data.valetOrderInfo || {};
    params.address_data = address_data;
    params.pay_data = this.data.pay_data; //收货时间
    params.pay_mode = paymentList[this.data.cur_pay_index]||{}; //支付方式
    // params.pay_mode = this.payMode[0] || this.pay_mode; //支付方式
    params.cashCoupon_data = this.data.cashCoupon_data; //现金券
    params.isUsePromote = this.data.isUsePromote || 0; //使用促销
    params.isUseSecPromote = this.data.isUseSecPromote || 0;
    params.Is_Use_Storedvalue = this.data.use_prepaid || false,
    params.prepaid_data = this.data.prepaid_data || {};
    params.coupon_data = this.data.coupon_data;
    params.userChoiceData = app.StorageH.get('userChoiceData') || {};
    params.remarks_val = this.data.remarks_val;
    params.IsUseRecharge = this.data.is_user_recharge;
    params.shipping = this.data.shipping || {};
    params.user_recharge = this.data.user_recharge;
    params.integral_data = this.data.integral_data;
    params.use_integral = this.data.use_integral;
    params.use_balance = this.data.use_balance;

    params.isUseLocation = this.isUseLocation || 0;
    params.lat = this.latitude || 0;
    params.lon = this.longitude || 0;
    params.staffId = this.curStaffId || 0;

    this.params = params;
    let tip = "",callBack=null,cbTime = 1000; 
    if (params.shipping.way_id == 2 && (!params.address_data.address_id || params.address_data.address_id == 0)){
        tip = "请填写收货地址信息";
    } else if (params.shipping.way_id == 1 && (!params.shipping.contact || !params.shipping.mobile)){
        tip = "请完善收货门店信息";
    } else if (this.identityCheck && this.data.identityName !== '' && this.data.identityName != address_data.consignee) {
      tip = "因清关需要，身份证姓名需与收货人姓名一致";
      this.checkAll = false;
      this.setData({
        checkAll: this.checkAll
      })
    } else if(paymentList[this.data.cur_pay_index] && paymentList[this.data.cur_pay_index].pay_code == 'cashpay' && !valetOrderInfo.isUseCashPayChecked){
      tip = "请进行现金支付的验证";
      cbTime = 800;
      callBack = ()=>{
        this.selectPay({currentTarget:{dataset:{index:this.data.cur_pay_index}}})
      };
    }else if (!this.handleIdentitySubmit()) {
      return;
    }
    if (tip) {
      app.SMH.showToast({
        "title": tip
      });
      setTimeout(()=>{
        callBack && typeof(callBack) == 'function' && callBack();
      },1200)
      return;
    }
    // addNewOrderInfo.call(that, params, that.identityCheck)
    checkGiftGoods.call(this, params.isUsePromote, params.isUseSecPromote, function (isForGetGiftInventory){
      addNewOrderInfo.call(that, params, that.identityCheck, isForGetGiftInventory)
    })
    
  },
  confirmChangeShipping() {
    let that = this;
    let shipping = this.data.shipping;
    if (shipping.way_id == 2) { //快速配送
      if (this.valetInfo && this.valetInfo.userToken) {
        wx.navigateTo({
          url: '/pages/micro_mall/address/address_list?userToken=' + this.valetInfo.userToken,
        })
        return;
      }
      wx.navigateTo({
        url: '/pages/micro_mall/address/address_list',
      })
    } else { //门店自提 
      if (that.isLoadgingAuth) {
        return;
      };
      console.log('进入自提');
      that.loc_fail = false;
      that.showModalMsg = false;
      checkSelectStore.call(this, function (res) {
        app.EB.unListen('storesForA', this.storesForAId);
        let pay_data = this.data.pay_data || {};
        let store_data = app.StorageH.get("store_data") || {};
        store_data.contact = pay_data.consignee;
        store_data.mob_phone = pay_data.mobile;
        app.StorageH.set("store_data", store_data);
        let loc_f = that.loc_fail ? 1 : 0;
        let showModalMsg = that.showModalMsg ? 1 : 0;
        let shippingWay = this.data.shippingWay||{};
        if (this.valetInfo && this.valetInfo.userToken) {
          wx.navigateTo({
            url: `/pages/micro_mall/selfGet/self_get_set?loc_f=${loc_f}&showModalMsg=${showModalMsg}&userToken=${this.valetInfo.userToken || ''}&recIds=${this.valetInfo.recIds || '0'}&select_store_id=${shipping.store_id}&store_name=${shipping.store_name}&staff_name=${shippingWay.staffName||""}&staff_id=${shippingWay.staffId}`,
          })
          return;
        }
        wx.navigateTo({
          url: `/pages/micro_mall/selfGet/self_get_set?loc_f=${loc_f}&showModalMsg=${showModalMsg}&recIds=${this.options.rec_str || '0'}&select_store_id=${shipping.store_id}&store_name=${shipping.store_name}&staff_name=${shippingWay.staffName||""}&staff_id=${shippingWay.staffId||0}`,
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
      checkAll: this.checkAll
    })
    return true;
  },
  _noFn() { },
  //代客购
  getvaletinfo(e) {
    let detail = e.detail || {};
    this.valetInfo = detail;
    initUserOperate.call(this);
    if (detail.userToken) {
      this.reqData.userToken = detail.userToken;
      this.reqData.recIds = detail.recIds;
      this.reqData.fromUserToken = app.LM.userToken;
    } else {
      this.reqData.userToken = app.LM.userToken;
      this.reqData.recIds = this.options.rec_str;
      this.reqData.fromUserToken = "";
    }
    this.getCheckOut();
    this.setData({
      valetInfo: detail,
      // isCheckValetOrder: false
    })
  },
  checkValetUse(){
    let valetOrderInfo = this.data.valetOrderInfo || {};
    this.ValetModule = this.ValetModule || this.selectComponent("#ValetModule");
    if (valetOrderInfo.needSms && valetOrderInfo.isSmsChecked == 0){
      this.ValetModule.valetPhoneSms(this.valetInfo, valetOrderInfo.nextSendSeconds,ValetSmsType['asset']);
    }
  },
  checkValetOrder(e){
    console.log("检测完毕", e);
    let detail = e.detail || {};
    if(detail.type == 1 && detail.isCheck){
      let paymentList = this.data.paymentList||[];
      let index = this.data.cur_pay_index;
      this.reqData.paymentId = paymentList[index] && paymentList[index].pay_id || 0;
    }
    //为了确保，代客单停留时间超过接口过期时间
    // this.setData({
    //   isCheckValetOrder: detail.isCheck || false
    // })
    this.getCheckOut();
  },
  handleUse(e){
    console.log(e);
    let detail = e.detail||false;
    let redpackInfo = this.redpackInfo||{};
    redpackInfo.use = detail?1:0;
    this.getCheckOut();
  },
  selectPay(e){
    console.log('selectPay',e);
    let dataset = e.currentTarget.dataset||{};
    let index = dataset.index||0;
    let paymentList = this.data.paymentList||[];
    let valetOrderInfo = this.data.valetOrderInfo||{};
    this.setData({
      cur_pay_index:index
    })
    if(paymentList[index].pay_code == 'cashpay'){
      console.log('现金支付');
      if(valetOrderInfo.canUseCashPay == 1 && valetOrderInfo.isUseCashPayChecked == 1){
        this.reqData.paymentId = paymentList[index] && paymentList[index].pay_id || 0;
      }else if (valetOrderInfo.canUseCashPay == 1){
        this.ValetModule = this.ValetModule || this.selectComponent("#ValetModule");
        console.log('this.ValetModule',this.ValetModule)
        this.ValetModule.valetPhonePaySms(this.valetInfo, valetOrderInfo.useCashPayNexSmsSeconds,ValetSmsType['pay']);
      }
    }else{
      this.reqData.paymentId = paymentList[index] && paymentList[index].pay_id || 0;
    }
  }
}))

function loadPayMode() {
  if(this.data.paymentList&&this.data.paymentList.length>0){
    return Promise.resolve();
  }
  return app.BrandApi.getPaymentList({
    params: {
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    const arr = res.data || [];
    if (res.code == 1) {
      let cur_pay_index = 0;
      for(let i = 0,len=arr.length;i<len;i++){
        if(arr[i].pay_code == 'wxpay'){
          cur_pay_index = i;
          break;
        }
      }
      this.setData({
        paymentList:arr,
        cur_pay_index,
      })
      // this.payMode = temp.filter(item => {
      //   if (item.pay_code == 'wxpay') {
      //     return item
      //   }
      // })
    }
  })
}
/**
     * 初始化参数
     */
function initParam(isClear = false, clearPromote,clearSecPromote = false) {
  let valetInfo = this.valetInfo || {};
  let recIds = valetInfo.recIds || this.options.rec_str || "";
  this.reqData = {
    "recIds": "",
    "bonusId": "",
    "IsUsePoint": 0,
    "IsUseBalance": 0,
    "IsUseStore": 0,
    "store_id": 0,
    "addressId": 0,
    "isUsePromote": 1,
    "consignee": "",
    "mobile": "",
    "Is_Use_Storedvalue": 0,
    "cashcouponIds": "",
    "brandCode": app.Conf.BRAND_CODE,
    "userToken": valetInfo.userToken || app.LM.userToken,
    "fromUserToken": valetInfo.userToken ? app.LM.userToken : "",
    "isUseSecPromote": clearSecPromote ? 0 : 1,
    "isSelRedpack" : 0,
    "paymentId":0,
    "isFirst": this.isFirst ? 1 : 0
  };
  if (!isClear) {
    this.reqData.recIds = recIds;
  }
  if(clearPromote){
    this.reqData.isUsePromote = 0;
  }
  app.StorageH.remove("store_data");
}
//初始化用户操作
function initUserOperate(type = "",isInit = true) {
  let userChoiceData = app.StorageH.get('userChoiceData') || {};
  let key, data;
  /**
   * type 操作的优惠项，
   * inInit true为初始化，false为忽略初始化
  */
  //初始化单个操作
  if(type){
    if((type.indexOf("coupon") != -1 && isInit) || type.indexOf("coupon") == -1 && !isInit){
      let coupon_data = this.data.coupon_data || {};
      delete userChoiceData.use_coupon;
      delete coupon_data.use_coupon;
      app.StorageH.set("userChoiceData", userChoiceData);
      key = "coupon_data";
      data = coupon_data;
      this.reqData.bonusId = "";
    }else if((type.indexOf("cashCoupon") != -1 && isInit) || type.indexOf("cashCoupon") == -1 && !isInit){
      let cashCoupon_data = this.data.cashCoupon_data;
      cashCoupon_data.useCashCouponIds = "";
      key = "cashCoupon_data";
      data = cashCoupon_data;
      this.reqData.cashcouponIds = "";
    }else if((type.indexOf("giftCard") != -1 && isInit) || type.indexOf("giftCard") == -1 && !isInit){
      key = "isUsePromote";
      data = 0;
      this.reqData.isUsePromote = 0;
    }else if((type.indexOf("secPromote") != -1 && isInit) || type.indexOf("secPromote") == -1 && !isInit){
      key = "isUseSecPromote";
      data = 0
      this.reqData.isUseSecPromote = 0;
    }else if((type.indexOf("integral") != -1 && isInit) || type.indexOf("integral") == -1 && !isInit){
      key = "use_integral";
      data = 0
      this.reqData.IsUsePoint = 0;
    }else if((type.indexOf("prepaid") != -1 && isInit) || type.indexOf("prepaid") == -1 && !isInit){
      key = "use_prepaid";
      data = 0
      this.reqData.Is_Use_Storedvalue = 0;
    }
    if (key) {
      this.setData({
        [key]: data == null || typeof (data) == "undefined" ? {} : data
      })
    }
  }else{
    //初始化全部操作
    let coupon_data = this.data.coupon_data || {};
    let cashCoupon_data = this.data.cashCoupon_data;
    let giftCard_list = this.data.giftCard_list || [];
    let sec_promote = this.data.sec_promote || [];
    let isUsePromote = this.data.isUsePromote;
    delete userChoiceData.use_coupon;
    delete coupon_data.use_coupon;
    cashCoupon_data.useCashCouponIds = "";
    app.StorageH.set("userChoiceData", userChoiceData);
    this.setData({
      use_balance: false,
      use_integral: false,
      use_prepaid: false,
      is_user_recharge: false,
      coupon_data: coupon_data,
      cashCoupon_data: cashCoupon_data,
      isUseSecPromote: sec_promote.length > 0 ? 1 : 0,
      isUsePromote: giftCard_list.length > 0 && isUsePromote ? 1 : 0,
    })
    initParam.call(this, null, !this.data.isUsePromote, this.data.isUseSecPromote);
  }
}
//检测存在其他操作
function hasOtherOperate(type = "", isReturn = true) {
  /**
   * type  特殊项
   * isReturn  true 返回特殊项的结果, false 排除特殊项的结果
   * 
  */
  let cashCoupon_data = this.data.cashCoupon_data || {};
  let use_balance = this.data.use_balance;
  let use_integral = this.data.use_integral;
  let use_prepaid = this.data.use_prepaid;
  let is_user_recharge = this.data.is_user_recharge;
  let coupon_data = this.data.coupon_data || {};
  let isUseSecPromote = this.data.isUseSecPromote || 0
  let isUsePromote = this.data.isUsePromote || 0;
  if (type && isReturn){//单个选项是否勾选
    if(type.indexOf("coupon") != -1){
      return coupon_data.use_coupon && coupon_data.use_coupon.length > 0;
    }
    if(type.indexOf("cashCoupon") != -1){
      return cashCoupon_data.useCashCouponIds;
    }
    if(type.indexOf("giftCard") != -1){
      return isUsePromote;
    }
    if(type.indexOf("secPromote") != -1){
      return isUseSecPromote;
    }
    if(type.indexOf("integral") != -1){
      return use_integral;
    }
    if(type.indexOf("prepaid") != -1){
      return use_prepaid
    }
    if(type.indexOf("recharge") != -1){
      return is_user_recharge
    }
    if(type.indexOf("balance") != -1){
      return use_balance
    }
    return false;
    // switch (type) {
    //   case "coupon":
    //     return coupon_data.use_coupon && coupon_data.use_coupon.length > 0;
    //     break;
    //   case "cashCoupon":
    //     return cashCoupon_data.useCashCouponIds;
    //     break;
    //   case "giftCard":
    //     return isUsePromote;
    //     break;
    //   case "secPromote":
    //     return isUseSecPromote;
    //     break;
    //   case "integral":
    //     return use_integral;
    //     break;
    //   case "prepaid":
    //     return use_prepaid
    //     break;
    //   case "recharge":
    //     return is_user_recharge
    //     break;
    //   case "balance":
    //     return use_balance
    //     break;
    //   default:
    //     return false
    // }
  }
  //检测全部
  if (cashCoupon_data.useCashCouponIds && type.indexOf("cashCoupon") == -1) {
    return true;
  } else if (use_balance  && type.indexOf("balance") == -1) {
    return true
  } else if (use_integral && type.indexOf("integral") == -1) {
    return true
  } else if (use_prepaid && type.indexOf("prepaid") == -1) {
    return true
  } else if (is_user_recharge && type.indexOf("recharge") == -1) {
    return true
  } else if (coupon_data.use_coupon && coupon_data.use_coupon.length > 0 && type.indexOf("coupon") == -1) {
    return true
  } else if (isUseSecPromote == 1 && type.indexOf("secPromote") == -1) {
    return true
  } else if(isUsePromote == 1 && type.indexOf("giftCard") == -1){
    return true
  }else{
    return false
  }
}
function addNewOrderInfo(params, identity = false, isForGetGiftInventory) {
  this.clickDisable = true;
  goPay.call(this, params, identity, isForGetGiftInventory);
}

function goPay(params, identity, isForGetGiftInventory) {
  let shipping = params.shipping || {};
  let redpackSumary = this.data.redpackSumary||{};
  let obj = {
    "userToken": app.LM.userToken,
    "addressId": shipping.store_id && shipping.store_id != 0 ? shipping.store_id : parseInt(params.address_data.address_id),
    "paymentId": parseInt(params.pay_mode.pay_id),
    "besttimeId": parseInt(params.pay_data.receTimeId) || 1,
    "changeValue": params.use_integral ? params.integral_data.allowPoint : 0,
    "rec_ids": this.options.rec_str,
    "isStore": shipping.store_id && shipping.store_id != 0 ? 1 : 0,
    "bonusId": params.coupon_data.use_coupon ? this.reqData.bonusId : "",
    "surplus": params.use_balance ? params.pay_data.canUsebalance : 0,
    "postscript": params.remarks_val,
    "isUsePromote": params.isUsePromote || 0,
    "isUseSecPromote": params.isUseSecPromote || 0,
    "consignee": params.address_data.consignee || params.shipping.contact,
    "mobile": params.address_data.mobile || params.shipping.mobile,
    "cashcoupon_ids": params.cashCoupon_data.useCashCouponIds,
    "Is_Use_Storedvalue": params.Is_Use_Storedvalue ? 1 : 0,
    "is_use_point": params.use_integral ? 1 : 0,
    "offline_surplus": params.Is_Use_Storedvalue ? params.prepaid_data.canuse_storedvalue : 0,
    "brandCode": app.Conf.BRAND_CODE,
    "storeId": shipping.store_id && shipping.store_id || 0,
    "isUseLocation": params.isUseLocation || 0,
    "lat": params.lat || 0,
    "lon": params.lon || 0,
    "fromUserToken": "",
    "isForGetGiftInventory": isForGetGiftInventory || 0,
    "clientSessionId": LgMg.channel && LgMg.channel.clientSessionId || "",
    "isSelRedpack":redpackSumary.sel_redpack?1:0, //
    "staffId":params.staffId || 0,
    "discountBuyGoods": this.data.chooseDiscountGoods || [],
    "needSignOrderActivityGoods": getSignSelect(this,'isSelect')
  }
  if (identity) {
    obj.idCardName = this.data.identityName;
    obj.idCardNo = this.data.identityNumber;
  }
  //代客购
  if (this.valetInfo && this.valetInfo.userToken) {
    obj.userToken = this.valetInfo.userToken;
    obj.rec_ids = this.valetInfo.recIds;
    obj.fromUserToken = app.LM.userToken;
    obj.lat = 0;
    obj.lon = 0;
  }
  console.log('addNewOrderInfo',obj);
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
        var userChoiceData = app.StorageH.get('userChoiceData') || {};
        delete userChoiceData.goods_receipt_time;
        delete userChoiceData.pay_receipt_time;
        delete userChoiceData.use_coupon;
        delete userChoiceData.selectAddr;
        delete userChoiceData.rec_str;
        let that = this;
        app.StorageH.set('userChoiceData', userChoiceData);
        app.StorageH.set('store_data', '');
        if (identity && this.normalGoods) {
          this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
          this.pageDialog.setTitle("温馨提示");
          this.pageDialog.setTouchCancel(false);
          this.pageDialog.setCentent("因该订单涉及不同仓库发货，将会拆分多个订单发出。请留意查收快递信息！");
          this.pageDialog.setSingleBtn({
            name: "确认",
            tap: function () {
              that.isBuyBack = false;
              wx.redirectTo({
                url: '../order/order_info?first_time_topay=1&order_id=' + data.OrderId,
              })
            }
          })
          this.clickDisable = false;
          this.pageDialog.show();
        } else {
          that.isBuyBack = false;
          wx.redirectTo({
            url: '../order/order_info?first_time_topay=1&order_id=' + data.OrderId,
          })
        }
        initParam.call(this, true);
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
  }).finally(()=>{
    app.StorageH.remove('CART_DEFAULT_SELECT');
  })
}
//跨境购
function getCrossOrderUserInfo() {
  app.UserApi.getCrossOrderUserInfo({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      let identityObj = res.data || {};
      if (res.data && res.data.identityName && res.data.identityNo) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
      this.setData({
        identityName: identityObj.identityName || '',
        identityNumber: identityObj.identityNo || '',
        checkAll: this.checkAll
      })
    }

  })
}
// 拉取erp优惠券
function getUserErpCoupon(){
  return app.UserApi.getUserErpCoupon({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: false
    }
  })
}

//自提过程 检测
function getCurrLoation(callBack, failReturnBack) {
  let that = this;
  that.isLoadgingAuth = true;
  let failBackFn = function () {
    console.log('failBackFn回调');
    that.loc_fail = true;
    that.loc_checked = true;
    let reqParams = {
      latitude: -1,
      longitude: -1,
    }
    typeof callBack == "function" && callBack.call(that, reqParams);
    return
  }

  let successBackFn = function () {
    WxApi.getLocation({
      type: 'gcj02',
    }).then(res => {
      if (!that.loc_checked && !that.jumpAlready) {
        that.loc_checked = true;
        console.log('没超时，正常callBack');
        typeof callBack == "function" && callBack.call(that, res);
        return
      }
      if (that.loc_checked && !that.jumpAlready) {
        console.log('已超时，能成功定位 ，但当作定位失败处理');
        that.loc_checked = false;
      }
    }).catch(error => {
      if (!that.loc_checked && !that.jumpAlready) {
        console.log('未超时，未开启手机定位 catch')
        that.loc_checked = true;
        that.showModalMsg = true;
        let reqParams = {
          latitude: -1,
          longitude: -1,
        }
        typeof callBack == "function" && callBack.call(that, reqParams);
        return
      }
      if (that.loc_checked && !that.jumpAlready) {
        console.log('已超时，未开启手机定位 catch');
        that.loc_checked = false;
      }
    });

    that.checkTimeOutLocation = setTimeout(() => {
      if (that.loc_checked) {
        console.log('没超时，正常流程');
      } else {
        console.log('超时3s!!');
        that.loc_fail = true;
        that.loc_checked = true;
        that.showModalMsg = true;
        let reqParams = {
          latitude: -1,
          longitude: -1,
        }
        typeof callBack == "function" && callBack.call(that, reqParams);
        return
      }
    }, 3500);
  };

  app.AS.checkAuthorize("scope.userLocation", successBackFn, failBackFn);
}


function checkSelectStore(callBack) {
  let reqParams = {
    lat: -1,
    lon: -1,
  }
  getCurrLoation.call(this, function (res) {
    let that = this;
    reqParams.lat = res.latitude;
    reqParams.lon = res.longitude;
    getNearyFn.call(that, that, reqParams, callBack);
  }, callBack)
}


function checkStoresForAFn() {
  let that = this;
  that.isLoading_storesForA = true;
  that.storesForAId = app.EB.listen('storesForA', (res) => {
    app.EB.unListen('storesForA', that.storesForAId);
    if (res && res.storesForAOpen == 1) {
      let data = res && res.data || {};
      reutrnStoresForA.call(that, that, data, true);
    } else {
      // console.log('千面未开启或用户未注册'); 
      reutrnStoresForA.call(that, that, '', false)
    }
  });
  setTimeout(() => {
    that.isLoading_storesForA = false
  }, 2500);
}

function reutrnStoresForA(that, loc_obj = {}, open = false) {
  loc_obj = loc_obj || {};
  console.log('check千店回调:', loc_obj);
  that.storesForAOpen = open || false;
  that.isLoading_storesForA = false;
  that.latitude = loc_obj.lat || 0;
  that.longitude = loc_obj.lon || 0;
  that.isUseLocation = loc_obj.isUseLocation || 0;
}

function getNearyFn(that, reqParams_temp = {}, callBack) {
  that = that || this;
  let options = this.options || {};
  let reqParams = {
    recIds: options.rec_str,
    searchName: "",
    brandCode: app.Conf.BRAND_CODE,
    userToken: app.LM.userToken
  }
  reqParams.lat = reqParams_temp.lat || -1;
  reqParams.lon = reqParams_temp.lon || -1;
  let valetInfo = this.valetInfo || {};
  if (valetInfo.userToken) {
    reqParams.recIds = valetInfo.recIds;
    reqParams.userToken = valetInfo.userToken;
  }
  typeof callBack == "function" && callBack.call(that);
}

function checkGiftGoods(isUsePromote,isUseSecPromote,callBack){
  if (isUsePromote != 1 && isUseSecPromote != 1){
    typeof (callBack) == "function" && callBack(0);
  }else{
    let that = this;
    let promoteGiftGoods = this.data.promoteGiftGoods || [];
    let sellOutTxts = []
    for (let i = 0; i < promoteGiftGoods.length; i++){
      if (promoteGiftGoods[i].gift_status == 0){
        if ((isUsePromote == 1 && promoteGiftGoods[i].rule_type == 0) || (isUseSecPromote == 1 && promoteGiftGoods[i].rule_type == 1)){
          sellOutTxts.push("赠品【" +  promoteGiftGoods[i].goods_name + "】已赠完" );
        }
      }
    }
    if (sellOutTxts.length > 0){
      sellOutTxts.push("是否继续下单？");
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("提示");
      this.pageDialog.setTouchCancel(false);
      this.pageDialog.setCentent(sellOutTxts);
      this.pageDialog.setTwoBtn(
        {
          name: "取消",
          tap: function () {
            that.pageDialog.dismiss();
          }
        },
        {
          name: "确定",
          tap: function () {
            typeof (callBack) == "function" && callBack(1);
            that.pageDialog.dismiss();
          }
        }
      ).show();
    }else{
      typeof (callBack) == "function" && callBack(0);
    }
  }
  
}

function resetLoading() {
  let that = this;
  setTimeout(() => {
    that.loc_checked = false;
  }, 400)
  setTimeout(() => {
    that.isLoadgingAuth = false;
  }, 1000)
}

function backPageStatus() {
  let pages = getCurrentPages();
  let currPage = pages.length > 1 ? pages[pages.length - 2] : null;
  let isBuyBack = typeof (this.isBuyBack) === "undefined" || this.isBuyBack ? true : false;
  if (currPage && currPage.route && currPage.route == "pages/micro_mall/shopping/shopping_cart") {
    currPage.selectComponent("#cartListModule").isBuyBack = isBuyBack;
  }
}

function autoSetSecPromote(sec_promote,operateType){
  //用户操作则不初始化
  if (operateType == "secPromote") return;
  if (!sec_promote.length || sec_promote.length == 0) {
    initUserOperate.call(this,"secPromote");
  } else {
    this.reqData.isUseSecPromote = 1;
    this.setData({
      isUseSecPromote: 1
    })
  }
}

function throttle(time=500) {
  this.lockTime = true;
  this.throttleId = setTimeout(()=>{
    this.lockTime = false;
  },time)
}
 
function dateFormat(item={}) {
  let fromDay = MyDate.format(MyDate.parse(item.from_date), "yyyy.MM.dd");
  let toDay = MyDate.format(MyDate.parse(item.to_date), "yyyy.MM.dd");
  let toTimeHm = MyDate.format(MyDate.parse(item.to_date), "HH:mm");
  if(fromDay == toDay){
    let format = "yyyy.MM.dd HH:mm"
    item.from_date_str = MyDate.format(MyDate.parse(item.from_date), format)
    item.to_date_str = MyDate.format(MyDate.parse(item.to_date), "HH:mm")
  }else{
    let format = toTimeHm == "00:00" ? "MM.dd": "MM.dd HH:mm";
    item.from_date_str = MyDate.format(MyDate.parse(item.from_date), "yyyy.MM.dd")
    item.to_date_str = MyDate.format(MyDate.parse(item.to_date), format)
  }  
}

function getSignSelect(that,key){
  that.signTip = that.signTip || that.selectComponent('#signTip');
  let info = that.signTip && that.signTip.getInfo() || {};
  let result = info;
  key && (result = info[key] || 0);
  return result
}