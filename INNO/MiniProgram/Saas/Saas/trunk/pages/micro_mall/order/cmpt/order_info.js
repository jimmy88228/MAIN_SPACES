import WxApi from '../../../../common/helper/wx-api-helper.js'
import MyDate from '../../../../common/support/utils/date-util.js';
import PayH from '../../../../common/helper/handle/payHandle.js';
import appUtils from '../../../../common/support/utils/utils';
import {
  CountDown
} from "../../../../common/manager/timer-manager.js";
import {
  barcode
} from "../../../../common/utils/codeCanvas/index.js"
import {getOrderInfoParams} from "../utils/index"
// import Polling from '../../../../common/helper/polling.js'
const app = getApp();
Component(app.BTAB({
  options:{
    addGlobalClass: true,
  },
  properties:{
    fromType:{
      type:String,
      value:"normal"
    }
  },
  data: {
    brand_info: app.globalData.brand_info,
    order_id: 0,
    order_info: {},
    sub_order: false,
    showCancelAll: false, 
    order_cancel_reason: {}, 
    btn_follow_must_show: 0,
    show_pay_load: false,
    close_pay: false,
    /*倒计时*/
    count_down: {
      day: 0,
      hour: 0,
      min: 0,
      sec: 0
    },
    show_br: false,
    sys_config: {},
    batch_active:false,
    batch_select_info:{},
    fold_show:false,
    fold_anim:false,
    batch_select_all:false,
    dialogSlotContent: "", // 对话框启用插槽
    cardInfo:{
      title:"订单详情",
      showCard: true
    },
    outsideComponents: { // 该页面的最外层容器的组件对象-解决层级问题用
      agreementPop: {confirmIsGetInfoBtn: true},
      getCouponsPop: {},
      contactStaffGuide: {}
    },
    isLogin:app.LM.isLogin
  },
  attached(){
    this.hideBatch =true;
    this.sub_order_list = [];
    this.gift_list = [];
    this.first_time_topay = 0;
    this.order_cancel_reason_list = [];  
  },
  methods:{
    _onLoad: function (options) {
      console.log('组件 onLoad',options) 
      let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
      let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
      let shipping_msg = this.data.brand_info.default_icon_url + "shipping_msg.png";
      let shipping_location = this.data.brand_info.default_icon_url + "shipping_location.png";
      let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
      let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
      this.options = options;
      let order_id = options.order_id;
      let order_sn = options.order_sn;
      let first_time_topay = options.first_time_topay;
      this.setData({
        isShow:true,
        order_sn,
        order_id,
        server_close,
        shipping_msg,
        shipping_location,
        rightbutton,
        return_active,
        return_img
      })
      if (first_time_topay) {
        this.first_time_topay = first_time_topay;
      }
      this._checkUserLogin();
      // checkForPay.call(this);
    }, 
    _onShow: function () {
      let order_id = this.data.order_id;
      preApiHandler.call(this).then(res=>{
        getOrderInfo.call(this, order_id);
      })
      getCancelReasion.call(this);
      checkModifyAddress.call(this);
      app.sysTemConfig("open_single_goods_cancel").then(data=>{
        this.setData({
          openSingleCancel: data.Value == "1" ? true : false
        })
      }) 
    },
    _onReady() {
      let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
      this.setData({
        bg_color: bg_color
      })
      if (this.first_time_topay) {
        this.bg = this.bg || this.selectComponent("#bg");
        this.bg.show();
      }
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
    _onHide: function () { 
      stopCountDown.call(this)
    },
    _onUnload: function () { 
      clearFnc.call(this);
      stopCountDown.call(this);
      // Polling.stopPolling();
    },
    _onPullDownRefresh() {
      this.PullDownRefresh = true;
      getOrderInfo.call(this, this.data.order_id);
    }, 
    /**
     *去评价 
     */
    toComment: function () {
      var order_id = this.data.order_id;
      wx.navigateTo({
        url: '/pages/micro_mall/comment/mobile_order_comment/mobile_order_comment?order_id=' + order_id,
      })
    },
    /**
     * 确定收货
     */
    confirmOrder: function () {
      var that = this;
      wx.showModal({
        title: '确认收货',
        content: '是否已经收到货了',
        success: function (info) {
          if (info.confirm) {
            let order_id = that.data.order_id;
            return app.BuyApi.confirmGetGoods({
              data: {
                orderId: order_id,
                userToken: app.LM.userToken,
                brandCode: app.Conf.BRAND_CODE
              },
              other: {
                isShowLoad: true
              }
            }).then(e => {
              if (e.code == "1") {
                getOrderInfo.call(that)
                return Promise.resolve(e);
              }
              app.SMH.showToast({
                "title": e.msg
              })
              return Promise.reject();
            })
          }
        }
      })
  
    },
    /**
     * 去支付
     */
    toPay: function () { 
      let order_info = this.data.order_info || {};
      if (order_info.is_valet_order == '1' && order_info.district == 0) {
        app.SMH.showToast({title: "请先填写收货地址再支付"})
        return
      }
      this._checkUserLogin().then(isLogin=>{
        if(!isLogin){
          return
        }
        if(this.properties.fromType == 'for_pay'){
          this.toPayReq();
        }else{
          appUtils.throttle(()=>{
            this.toPayReq();
          })();
        }
      });
    },
    toPayReq() { 
      let orderInfo = this.data.order_info||{},allOrderEntity=this.allOrderEntity||{};
      let buyType = (allOrderEntity.orderEntity && allOrderEntity.orderEntity.order_type== 9 && "manual_order") || this.options.buyType || "order"; // 手工订单order_type == 9;
      if(this.isLoading) return;
      this.isLoading = true;
      let order_id = this.data.order_id||0;
      let platform_src = this.allOrderEntity && this.allOrderEntity.orderEntity && this.allOrderEntity.orderEntity.platform_src ||"";
      WxApi.showLoading()
        return PayH.UnifiedorderByOrderId({type:buyType,order_id,orderInfo,isCheckInventory:true,platform_src}).then(e => {
        console.log(e,'支付结果');
        this.setData({
          btn_follow_must_show: 1,
          show_pay_load: true
        })
        setAdsPop.call(this);
        getOrderPayStatus.call(this);
      }).catch(e=>{
        console.log(e,'支付结果');
      }).finally(()=>{
        this.isLoading = false;
        WxApi.hideLoading()
      })
    },
    /**
     * 取消订单
     */
    cancelOrder: function (e) {
      console.log('cancelOrder',e)
      if(app.Conf.LiveType == 'channels' && this.data.order_info.platform_src === "MINISHOP"){
        this.cancelOrderUnavailable();
        return
      }
      console.log('cancelOrder',e)
      let dataset = e.currentTarget.dataset;
      let type = dataset.type || '';
      let recId = dataset.recId || 0;
      let cancel_reson_sel_id = parseInt(e.detail.value);
      if (!isNaN(cancel_reson_sel_id)) {
        if (type == 'good') {
          this.opType = dataset.opType || 0;
        } else {
          this.opType = dataset.opType || 1;
        }
        let cancel_reason_id = this.order_cancel_reason_list[cancel_reson_sel_id].id;
        let cancleActionStatus = this.data.order_info.cancleActionStatus;
        let order_id = this.data.order_id;
        let api = 'cancelOrApplyCancelOrder';
        let data = {
          "orderId": parseInt(order_id || 0),
          "opType": this.opType,
        };
        if (type == 'good') {
          api = 'cancelOneGood';
          data['recId'] = recId || 0;
          data['cancelReasonId'] = cancel_reason_id;
        } else {
          data['cancel_reason_id'] = cancel_reason_id;
        }
        return app.RunApi.go('post', 'BuyApi', api, data).then(res => {
          if (res.code == "1") {
            // console.log('操作成功', res);
            app.SMH.showToast({
              "title": "操作完成"
            })
            getOrderInfo.call(this);
            return Promise.resolve(e);
          }
          app.SMH.showToast({
            "title": res.msg || '订单状态异常'
          })
          return Promise.reject();
        }).catch(res => {
          app.SMH.showToast({
            "title": res.msg || '订单状态异常'
          })
          return Promise.reject();
        })
      }
    },
    revokeCancel(){
      return WxApi.showModal({
        title:"提示",
        content:"确定要撤销取消吗"
      }).then((res)=>{
        if(res.confirm){
          let allOrderEntity = this.allOrderEntity||{};
          let params = {
            orderId:this.data.order_id || 0,
            orderSn:allOrderEntity.orderEntity && allOrderEntity.orderEntity.order_sn || "",
            refundId:0, //整单
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userToken,
          }
          return updateOrderAction(params).then(res=>{
            let title = "撤销失败";
            if(res.code == 1 && res.data == 1){
              title = "撤销成功";
            }
            app.SMH.showToast({
              title,
              duration: 2500
            })
            this._onShow();
            return res;
          })
        }
      })
    },
    jump_order: function (e) {
      let dataset = e.currentTarget.dataset || {};
      let invoiceNo = dataset.invoiceNo;
      wx.navigateTo({
        url: '/pages/micro_mall/shipping_info/shipping_info?invoiceNo=' + invoiceNo + '&orderId=' + this.data.order_id,
      })
    },
    jump_detail: function (e) {
      if(this.data.batch_active){
        return
      }
      let dataset = e.currentTarget.dataset||{};
      const id = e.currentTarget.dataset.id;
      const colorId = e.currentTarget.dataset.colorId || 0;
      if (colorId) {
        wx.navigateTo({
          url: `/pages/micro_mall/goods/goods_info?goods_id=${id}&color_id=${colorId}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/micro_mall/goods/goods_info?goods_id=${id}`,
        })
      }
    },
    jumpReturn(e) {
      if(app.Conf.LiveType == 'channels' && this.data.order_info.platform_src == 'MINISHOP'){
        this.cancelOrderUnavailable();
        return
      }
      let dataset = e.currentTarget.dataset || {};
      let that = this;
      if(this.data.earlyApplyRefund){
        earlyApplyRefund.call(this,dataset);
        return
      }
      if (this.isShowContactTip){
        if (dataset.url && !that.isJumpIng) {
          that.isJumpIng = true;
          wx.navigateTo({
            url: dataset.url,
            complete() {
              batch_status_manager.call(that,"init");
              that.isJumpIng = false
            }
          })
          that.pageDialog.dismiss();
        }
        return;
      }
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("");
      this.pageDialog.setCentent(["为了更快处理你的售后申请" , "建议先联系客服哦"]);
      this.pageDialog.setTwoBtn(
        {
          name: "联系客服",
          openType:"contact",
          tap: function () {
            that.pageDialog.dismiss();
          }
        },
        {
          name: "继续申请",
          tap: function () {
            if (dataset.url && !that.isJumpIng) {
              that.isJumpIng = true;
              wx.navigateTo({
                url: dataset.url,
                complete() {
                  batch_status_manager.call(that,"init")
                  that.isJumpIng = false
                }
              })
              that.pageDialog.dismiss();
            }
          }
        }
      ).show();
      this.isShowContactTip = true;
  
    },
    onTurnBack: function (e) {
      wx.switchTab({
        url: '/pages/micro_mall/index/index',
      })
    },
    handle_br(e) {
      let dataset = e.currentTarget.dataset || {};
      let code = dataset.code || '';
      let that = this;
      barcode('br_code', code, 660, 200);
      clearTimeout(that.cancelId);
      this.setData({
        barcodeCard: code || '',
        show_br: !that.data.show_br,
      });
      let _timer1 = setTimeout(() => {
        clearTimeout(_timer1);
        that.setData({
          showBrStyle: "opacity:1;"
        });
      }, 100)
      let _timer2 = setTimeout(() => {
        clearTimeout(_timer2);
        that.setData({
          delay_br: true
        });
      }, 400)
    },
    _noFn() { },
    cancel_br() {
      let that = this;
      that.setData({
        showBrStyle: "opacity:0;",
        delay_br: false
      });
      clearTimeout(that.cancelId);
      that.cancelId = setTimeout(() => {
        clearTimeout(that.cancelId);
        that.setData({
          show_br: false,
        })
      }, 300);
    },
    copy(e){
      appUtils.throttle(()=>{
        let dataset = e.currentTarget.dataset||{};
        let value = dataset.value ||"";
        wx.setClipboardData({
          data: value
        })
      })(); 
    },
    onReturnMsgTap() { // 点击"售后服务"块，自动点击 "取消" 或 "售后"
      const hadCancelBtn = this.data.returnMsg.cancelNumber > 0 && this.data.single_cancel_btn == '1';
      const hadReturnBtn = this.data.returnMsg.returnNumber > 0;
      if (hadCancelBtn && !hadReturnBtn) {
        let dataset = {
          exType: "money",
          sn: this.data.order_info.order_sn,
          type: "return_cancel",
        }
        this.onTap({currentTarget: {dataset}})
      } else if (hadReturnBtn && !hadCancelBtn) {
        let dataset = {
          exType: "goods",
          sn: this.data.order_info.order_sn,
          type: "return_return",
        }
        this.onTap({currentTarget: {dataset}})
      }
    },
    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type || "";
      // let order_id = dataset.order_id || "";
      if (type =="modify_address"){
        if (this.temp_shipping_status == 3){
          app.SMH.showToast({
            title: "订单已经开始配货，请联系客服修改地址",
            duration:2500
          })
          return
        }
        getOrderInfo.call(this, this.data.order_id).then(res=>{
          if(res.code=='1'){
            let data = res.data||{};
            if (data.orderEntity && data.orderEntity.shipping_status == 3){
              app.SMH.showToast({
                title:"订单已经开始配货，请联系客服修改地址",
                duration: 2500
              })
              return  
            }
          }
          this.jumpModify = true;
          wx.navigateTo({
            url: `/pages/micro_mall/address/address_list?type=${type}`,
          })
        });
      } else if (type == "oneMoreOrder") {
        let params = {
          orderId: this.data.order_id,
          clientSessionId: app.LgMg.channel && app.LgMg.channel.clientSessionId,
          visitLogId: app.LgMg.pageLog && app.LgMg.pageLog.logId
        };
        return app.RunApi.go('post', 'BuyApi', 'oneMoreOrder', params).then(res => {
          if (res.code != -1) {
            let data = res.data || [];
            let sucArr = [];
            let failArr = [];
            let recIds = [];
            data.forEach(item => {
              if (item.code == 1) {
                sucArr.push(item);
                recIds.push(item.recId);
              } else if (item.code == -1) {
                failArr.push(item)
              }
            })
            recIds = recIds.join(',');
            let storage = {
              recIds,
              sucArr,
              failArr,
              update: true
            }
            console.log('oneMoreOrder', recIds, sucArr, failArr);
            app.StorageH.set('One_More_Order', storage);
            wx.switchTab({
              url: `/pages/micro_mall/shopping/shopping_cart`,
            })
          } else { 
            this.setData({
              failText: res && res.msg || "订单中的商品都已卖完咯"
            }) 
            this.tips_window = this.tips_window || this.selectComponent('#tips_window');
            this.tips_window.show();
          } 
        }).catch(e=>{
          app.SMH.showToast({
            title: e && e.msg || "订单商品异常"
          })
        })
      } else if (type =='shipping'){ 
        wx.navigateTo({
          url: '/pages/micro_mall/shipping_info/shipping_info' + '?orderId=' + this.data.order_id,
        })
      }else if(type == 'batch_apply'){
        if(this.data.batch_active){
          let _e = {currentTarget:{dataset:{type:'batch_confirm'}}};
          this.onTap(_e);
          return
        };
        this.setData({
          batch_active:true
        })
        // updateBtnContainer.call(this);
      }else if(type == 'batch_confirm'){ 
        if(this.batch_confirm_lock)return
        this.batch_confirm_lock = true;
        let order_info = this.data.order_info||{};
        let order_detail_list = this.data.order_detail_list||[];
        let productId = [],goodsId=[],rec_id=[],goodsIdObj={};
        let b_s_data= this.data.batch_select_info || {};
        for(let i in b_s_data){ //查找当前选中的商品
          if(b_s_data[i] && order_detail_list[i].return_goods_number != order_detail_list[i].goods_num && order_detail_list[i].goodsType != '99'){  //筛选申请数量是否满足
            productId.push(order_detail_list[i].productId);
            goodsIdObj[order_detail_list[i].goodsId] = order_detail_list[i].goodsId;
            rec_id.push(order_detail_list[i].rec_id);
            console.log(productId,rec_id,goodsIdObj)
          } 
        }
        productId = encodeURIComponent(productId.length>0?productId.join(','):'');
        rec_id = encodeURIComponent(rec_id.length>0?rec_id.join(','):'');
        for(let id in goodsIdObj){
          goodsId.push(id);
        }
        goodsId = encodeURIComponent(goodsId.length>0?goodsId.join(','):'');
        let bool = productId && rec_id && goodsId;
        if(!bool){
          app.SMH.showToast({
            title:"至少选择一个商品"
          })
          this.batch_confirm_lock = false;
          return
        }
        let url = `/pages/micro_mall/order/apply_return?order_id=${order_info.order_id}&valet=${order_info.is_valet_order}&is_user=${order_info.is_order_user}&product_id=${productId}&goods_id=${goodsId}&rec_id=${rec_id}`;
        console.log('批量跳转',url)
        let _e = {
          currentTarget:{dataset:{url}}
        }
        setTimeout(()=>{
          this.batch_confirm_lock = false;
        },1000)
        this.jumpReturn(_e);
      }else if(type == "batch_toggle" && this.data.batch_active){
        let item = this.data.order_detail_list[dataset.index]||{};
        if(item.goodsType!='99'){
          batchSelectFnc.call(this,dataset);
        }
      }else if(type == 'fold_btn_toggle'){
        fold_btn_toggle.call(this);
      }else if(type == 'batch_select_all'){
        batch_status_manager.call(this,type);
      }else if(type=='issue_invoice'){
        let type = "ONLINE";
        let order_info = this.data.order_info||{};
        let price = ( Number(order_info.order_amount || 0) + Number(order_info.offline_surplus||0) - Number(order_info.shipping_fee||0)); 
        price = parseFloat(price.toFixed(2));
        wx.navigateTo({
          url: `/pages/micro_mall/invoice/issue_manager/issue_manager?type=invoice&order_type=${type}&sn=${order_info.order_sn||""}&price=${price}`,
        })
      }else if(type=='detail_invoice'){
        let order_info = this.data.order_info||{};
        wx.navigateTo({
          url: `/pages/micro_mall/invoice/invoice_detail/detail?id=${this.data.electricEntity&&this.data.electricEntity.taskId||0}&sn=${order_info.order_sn||""}&price=${order_info.order_amount}`,
        })
      }else if(type == 'return_cancel' || type == 'return_return'){
        let orderType = 'order_exchange';
        let exType = dataset.exType || "";
        let sn = dataset.sn||"";
        wx.navigateTo({
          url: `/pages/micro_mall/order/order_list?orderType=${orderType}&exType=${exType}&sn=${sn}`,
        })
       }
    },
    extendReceive(){
      extendReceiveConfirm.call(this);
    }, 
    cancelOrderUnavailable(){ // 视频号 取消订单 或 申请售后 会拦截，迟点可能会去掉
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("温馨提示");
      this.pageDialog.setCentent("");
      this.pageDialog.setTouchCancel(false);
      this.pageDialog.setSingleBtn(
        {
          name: "确定",
          tap: () => {
            this.pageDialog.dismiss()
          }
        }
      )
      this.pageDialog.setAfterDismiss(() => {wx.nextTick(() => {this.setData({dialogSlotContent: ""})})});
      this.setData({dialogSlotContent: "cancelOrder"}, () => {this.pageDialog.show()})
    }, 
    handleModifyPrice(e = {currentTarget: {dataset: {}}}, needValicate) {
      app.getOnceSysConfig('close_staff_change_price_sms_check').then(res=>{
        let isclose_sms_check = res.Value||0;
        let item = e.currentTarget.dataset.item;
        let isModifiedTotalPrice = !item; // 调整总价格 点击事件没有绑定item
        this.captchaPop = this.captchaPop || this.selectComponent("#captchaPop");
        this.renewPricePop = this.renewPricePop || this.selectComponent("#renewPricePop");
        let order_info = this.data.order_info || {};
        let {canChangePrice, minChangePrice, maxChangePrice, rec_id = 0, order_id} = isModifiedTotalPrice ? order_info : item;
        order_id = order_id || order_info.order_id;
        if (canChangePrice) { // 可以调整价格
          if (this.renewPricePop) { // 找到组件
            // this.captchaPop.valificate(needValicate === "needValicate")
            console.log('isclose_sms_check',isclose_sms_check)
            captchaValificate.call(this,needValicate,isclose_sms_check)
            .then(() => {
              return this.renewPricePop.showAndConfirm({
                isModifiedTotalPrice, // 是否调整总价
                orderId: order_id, // 订单id
                recId: isModifiedTotalPrice ? 0 : rec_id, // 要调整的商品id
                minChangePrice, // 最小能调整价格
                maxChangePrice, // 最大能调整价格
              })
            })
            .then(price => { // 调整价格成功后
              app.SMH.showToast({title: "调整成功"})
              getOrderInfo.call(this); //刷新下
            })
            .catch(err => {
              console.log("err",err)
              if (err === "expired") {
                
                setTimeout(() => {wx.nextTick(() => {this.handleModifyPrice(e, "needValicate")})}, 500)
                return 
              }
              err && app.SMH.showToast({title: err})
            })
          } 
          else { // 找不到组件
            app.SMH.showToast({title: "调起调整价格弹窗失败"})
          }
        } 
        else { // 不能调整价格
          app.SMH.showToast({title: "没有调整价格权限"})
        }
      })
    },
  },
}))
//
function getOrderInfo() {
  let order_id = this.data.order_id || 0;
  let order_sn = this.data.order_sn || "";
  if (!order_id||(app.Conf.LiveType == 'channels' && !order_id && !order_sn)) {
    app.SMH.showToast({
      "title": "无效订单ID"
    })
    return
  };
  let _params = {};
  app.Conf.LiveType == 'channels' && (_params.orderSn = order_sn);
  return app.BuyApi.getALLOrderEntity({
    params: {
      orderId: order_id,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken,
      ...getOrderInfoParams({order_id}),
      ..._params
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      this.allOrderEntity=data;
      if (this.PullDownRefresh) {
        wx.stopPullDownRefresh();
        this.PullDownRefresh = false;
      }
      let order_info = data.orderEntity;
      let electricEntity = data.electricEntity||"";
      let sub_order_list = data.subOrderList || [];
      let gift_list = data.orderPromoteGiftList || [];
      let sub_order = data.sub_order ? data.sub_order : "";
      let isOrderCancell = !!(data.isOrderCancell == 1);
      let orderDetailList = data.orderDetailList || [];
      checkStoreOrder.call(this,order_info);
      checkBtnStatus.call(this,order_info,orderDetailList); 
      batchInfoInit.call(this,orderDetailList);
      //
      if (order_info && (order_info.orderStatus == '待付款' && MyDate.parse(order_info.auto_cancel_date) > MyDate.parse(order_info.curr_date))) {
        this.setData({
          showTimeOut: true
        })
        startCountDown.call(this, order_info.curr_date, order_info.auto_cancel_date)
      } else if (order_info && (order_info.orderStatus == '待付款')) {
        this.setData({
          showTimeOut:false,
          endOrder: true
        })
      } else if (order_info.invoice_no) {
        order_info.show_invoice_no = order_info.invoice_no.split('#');
      }
      //检测支付
      if (order_info.order_status_Id == '1' && order_info.paystatus_Id == '0' && (order_info.pay_code == 'wxpay' || order_info.pay_code == 'wxin') && this.first_time_topay > 0 && this.data.showTimeOut) {
        this.toPay();
      }else if(this.first_time_topay > 0 && !this.checkedAdsPop && order_info.order_status_Id == '1'){
        this.checkedAdsPop = true;
        setAdsPop.call(this);
      }
      //
      if (order_info.auto_confirm_goods_time){
        order_info.auto_confirm_goods_time = MyDate.format(MyDate.parse(order_info.auto_confirm_goods_time), "yyyy-MM-dd HH:mm")
      }
      //计算查看物流
      let rec_time_format = order_info.rec_time_format || "";
      let nowDate = MyDate.parse(MyDate.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
      let rec_time = MyDate.parse(rec_time_format);
      let space_time = nowDate - rec_time;
      let space_day = Math.floor(space_time / (60 * 60 * 24 * 1000)) || 0;
      let show_invoice_btn = space_day > 30 ? false : true;
      this.sub_order_list = sub_order_list;
      this.gift_list = gift_list;
      this.temp_shipping_status = order_info.shipping_status || 0; 
      app.Conf.LiveType == 'channels' && order_info.order_id && (this.options.order_id = order_info.order_id || order_id); // 这里可能改了options的order_id，留意一下
      this.setData({
        order_id: order_info.order_id || order_id,
        order_info: order_info,
        sub_order: sub_order,
        show_invoice_btn: show_invoice_btn,
        order_detail_list: orderDetailList,
        // gift_list: gift_list,
        show_pay_load: false,
        electricEntity,
        isOrderCancell
      })
      this.first_time_topay = 0;
      asyncGetConfig.call(this);  //读按钮的系统配置
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })
}

//获取原因
function getCancelReasion() {
  return app.BuyApi.getOrderCancelReasonList({
    params: {
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || [];
      let order_cancel_reason = [];
      // let order_cancel_reason_list = data;
      for (let i in data) {
        let cancel_reason = data[i].reason;
        order_cancel_reason.push(cancel_reason);
      }
      this.order_cancel_reason_list = data;
      this.setData({
        // order_cancel_reason_list: order_cancel_reason_list,
        order_cancel_reason: order_cancel_reason,
      })
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
//检测订单支付转态
function getOrderPayStatus() {
  let options = this.options;
  return app.BuyApi.getOrderPayStatus({
    params: {
      userToken: app.LM.userToken,
      orderId: options.order_id,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      if (e.data == 2) {
        getOrderInfo.call(this);
      } else if (e.data == 0) {
        let _timer = setTimeout(function () {
          clearTimeout(_timer);
          getOrderPayStatus.call(this);
        }.bind(this), 3000);
      }
      return Promise.resolve(e);
    }
    return Promise.reject();
  }).catch(error => {
    let _timer3 = setTimeout(function () {
      clearTimeout(_timer3);
      getOrderInfo.call(this);
    }.bind(this), 6000);
  });
}


//倒计时
function startCountDown(startTime, endTime) {
  if (!this.countDown) {
    stopCountDown.call(this);
    this.countDown = new CountDown(MyDate.parse(startTime));
  }
  this.countDown.setTarget(MyDate.parse(endTime));
  setTime.call(this, this.countDown);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        stopCountDown.call(this);
        this._onShow();
      }
      setTime.call(this, e);
    });
  }
}

function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
  }
}

function setTime(e) {
  let day = Math.floor((e.value + 60000) / (60 * 60 * 24 * 1000));
  let hour = parseInt((e.value + 60000) % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
  let minutes = parseInt(((e.value + 60000) % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt(((e.value + 60000) % (1000 * 60)) / 1000);
  let count_down = {
    day: day,
    hour: hour,
    min: minutes,
    sec: seconds >= 10 ? seconds : '0' + seconds
  }
  this.setData({
    count_down: count_down
  });
}

function checkForPay() {
  let page = '';
  page = getCurrentPages().pop() || '';
  return app.sysTemConfig('is_close_paid').then(res => {
    console.log('is_close_paid:', res)
    let value = res.Value || 0;
    if (value == 1) {
      console.log('开启了亲密付');
      this.setData({
        close_pay: true
      })
      page.onShareAppMessage = function () {
        console.log('_this', this);
        let order_sn = this.options.order_sn;
        let order_id = this.options.order_id;
        let title = '帮我付款才是真友谊';
        console.log('分享', order_id, 'this:', this);
        return {
          path: `pages/micro_mall/order/for_pay_order?order_sn=${order_sn}&order_id=${order_id}`,
          title: title,
        };
      }
      return Promise.resolve(value);
    }
    return Promise.resolve(); 
  }).catch(e => {
    console.log('catch---', this.data.close_pay, page);
    return Promise.resolve(value);
  })
}

function checkModifyAddress(){
  return app.sysTemConfig('allow_order_modify_address').then(res => {
    let value = res.Value == 1? true:false;
    let bool = false;
    if(value){
      bool = true;
    }
    this.setData({
      modify_address: bool
    });
  }).catch(e=>{
    return Promise.resolve();
  })
}

function preApiHandler(){ 
  let storage = app.StorageH.get("Modify_Address") || {}; 
  let addrInfo = storage.selectAddr || {};
  let id = addrInfo.address_id || 0; 
  if (this.jumpModify && id && this.tempAddressId != id){ //修改地址检测
    let params = {
      orderId: this.data.order_id,
      addressId: id,
    }
    this.tempAddressId = id;
    return app.RunApi.go('post', "BuyApi", "update_OrderAddress", params).then(res => {
      if(res.code==1){
        console.log('更新地址',res);
        app.SMH.showToast({
          title:"修改成功"
        })
        return Promise.resolve();
      }
      return Promise.reject(res)
    }).catch(e=>{
      return  new Promise((rs,rj)=>{
        app.SMH.showToast({
          title: e && e.msg || "修改地址无效",
          duration: 2500
        })
       setTimeout(()=>{
        rs(e);
       },2000)
      })
       
    }).finally(() => {
      this.jumpModify = false;
      wx.removeStorage({
        key: "Modify_Address"
      });
    })
  }else{
    return Promise.resolve();
  }
}

function clearFnc(){
  wx.removeStorage({
    key:"Modify_Address"
  });
}
function extendReceiveConfirm(){
  let order_info = this.data.order_info || {};
  if (!order_info.order_id) return;
  if (order_info.can_extend_receipt == 1 && order_info.extend_receipt_day > 0){
    let that = this;
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setTitle("");
    this.pageDialog.setTouchCancel(false);
    this.pageDialog.setCentent("确认延长" + order_info.extend_receipt_day + "天收货时间？");
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
          extendOrderReceiptTimeReq.call(that, order_info.order_id);
          that.pageDialog.dismiss();
        }
      }
    ).show();
  }
}
function extendOrderReceiptTimeReq(id){
  if(!id) return;
  return app.BuyApi.extendOrderReceiptTime({
    data:{
      userToken: app.LM.userToken,
      brandCode:app.Conf.BRAND_CODE,
      orderId: id
    },
    other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      app.SMH.showToast({
        title:"设置成功"
      })
      let that = this;
      setTimeout(()=>{
        getOrderInfo.call(that);
      },500)
      
    }
  })
}

function earlyApplyRefund(e){
    let that = this;
    let url = e && e.url||"";
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setTitle("申请售后");
    this.pageDialog.setTouchCancel(false);
    this.pageDialog.setCentent("订单将提前转入售后服务");
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
          if(url.indexOf('?')!= -1){
            url = url + `&advance=1`;
          }
          wx.navigateTo({
            url: url,
            complete(){
              batch_status_manager.call(that,"init")
            }
          })
          // if(type == 'batch'){
          //   // let goods_info = e && e.goods_info||{};
          //   let order_info = this.data.order_info||{};
          //   // url = `/pages/micro_mall/order/apply_return?order_id=${order_info.order_id}&product_id=${goods_info.productId}&goods_id=${goods_info.goodsId}&rec_id=${goods_info.rec_id}&valet=${order_info.is_valet_order}&is_user=${order_info.is_order_user}`
          // }else if(url){
          // }
          that.pageDialog.dismiss();
        }
      }
    ).show();
    return
}

function batchSelectFnc(dataset={},type=""){
  dataset = dataset||{};
  let bool = false;
  let index = dataset.index;
  let batch_select_info = this.data.batch_select_info||{};
  batch_select_info[index] = (type=="init"||(!this.data.batch_select_all && type == "batch_select_all"))? true : !!!batch_select_info[index];
  if(batch_select_info[index]){
    bool = true;
    if(!type){
      let len = this.data.order_detail_list && this.data.order_detail_list.length||0;
      let num = 0;
      for(let item in batch_select_info){
        if(batch_select_info[item])num+=1;
      }
      if(len == num){
        this.setData({
          batch_select_all:true
        })
      }
    }
  }else if(!type){
    this.setData({
      batch_select_all:false
    })
  }
  if(type=="init")return bool
  this.setData({
    batch_select_info
  })
  return bool
}

function batchInfoInit(data,reset=false,type=""){
  if(this.batchInfoInited && !reset)return
  this.batchInfoInited = true
  data = data || [];
  let num = 0;
  let len = data.length||0;
  let batch_select_all = this.data.batch_select_all||false;
  data.forEach((item,index)=>{
    let dataset={};
    dataset.index = index;
    let temp = batchSelectFnc.call(this,dataset,type||'init');
    temp && (num+=1);
  })
  if(num == len){
    batch_select_all = true;
  }else{
    batch_select_all = false;
  }
  this.setData({
    batch_select_info:this.data.batch_select_info,
    batch_select_all
  })
}

function batch_status_manager(type=""){
  if(type == 'init' && this.data.batch_active){
    this.setData({
      batch_active:false,
    }) 
    // updateBtnContainer.call(this);
    batchInfoInit.call(this,this.data.order_detail_list,true,type);
  }else if(type == 'batch_select_all' && this.data.batch_active){
    batchInfoInit.call(this,this.data.order_detail_list,true,type);
  }
}

function checkBtnStatus(order_info={},orderDetailList=[]){
  let num = 0;
  let showCancelAll = true;
  // this.returning = false;
  let returnMsg = {
    cancelNumber:0,
    returnNumber:0,
  }
  // let cancelNumber = 0, returnNumber = 0;
  for(let i in orderDetailList){
    if((orderDetailList[i].return_goods_number == orderDetailList[i].goods_num)){
      num+=1;
    };
    if (orderDetailList[i].refund_status && orderDetailList[i].refund_status != '0' && orderDetailList[i].refund_status != '2') {
      console.log('单品取消过');
      showCancelAll = false;
    }
    returnMsg.cancelNumber += Number(orderDetailList[i].cancel_number || 0);
    returnMsg.returnNumber += Number(orderDetailList[i].return_goods_number || 0);
  }
  console.log('returnMsg',returnMsg)
  let sum = orderDetailList && orderDetailList.length;
  let canBatch = num != sum || false;
  let hideBatch = sum == 1 || (num >= (sum-1)) || false;
  if(!this.data.hideBatch && hideBatch){
    batch_status_manager.call(this,"init");
  }
  this.setData({
    canBatch,
    showCancelAll,
    hideBatch,
    returnMsg,
  }) 
}

function updateBtnContainer(){
  let order_info = this.data.order_info||{};

  let container = [
    {
      "key":'pay',
      "tap":"toPay",
      "name":"立即支付",
      "status": order_info.orderStatus=='待付款' && (order_info.pay_code=='wxpay' || order_info.pay_code == 'wxin') && !this.data.endOrder && order_info.order_type != 11
    },
    {
      "key":'confirm',
      "tap":"confirmOrder",
      "name":"确认收货",
      "status": (order_info.shipping_status=='1' && (order_info.order_status_Id=='1' || order_info.order_status_Id=='9')) || (order_info.can_confirm_goods == 1)
    },
    {
      "key":'cancel',
      "tap":'cancelOrder',
      "name":"取消订单",
      "status": this.data.showCancelAll && !this.data.sub_order && (order_info.cancleActionStatus==1 && (this.data.close_cancel_btn != 1 || order_info.paystatus_Id == "0")) && (order_info.order_type != 8 || order_info.order_type != 11)
    },
    {
      "key":'cancel_apply',
      "tap":'cancelOrder',
      "name":"申请取消",
      "status": this.data.showCancelAll && !this.data.sub_order && (order_info.cancleActionStatus==2 && this.data.close_apply_cancel_btn != 1) && (order_info.order_type != 8 || order_info.order_type != 11)
    },
    {
      "key":'revoke_cancel',
      "tap":'revokeCancel',
      "name":"撤销申请",
      "status": this.data.isOrderCancell
    }, 
    {
      "key":'comment',
      "tap":'toComment',
      "name":"去评价",
      "status": !((order_info.shipping_status=='1' && (order_info.order_status_Id=='1' || order_info.order_status_Id=='9')) || (order_info.can_confirm_goods == 1)) && order_info.orderStatus=='已完成' && order_info.can_comment === '1' && order_info.order_type != 11
    },
    {
      "key":'pay_for',
      "tap":'',
      "openType":"share",
      "name":"代付",
      "status":!(app.Conf.LiveType == 'channels' && order_info.platform_src == "MINISHOP") && this.data.close_pay && (order_info.orderStatus=='待付款') && (order_info.pay_code=='wxpay' || order_info.pay_code == 'wxin') && !this.data.endOrder && order_info.order_type != 11
    },
    {
      "key":'apply_invoice',
      "tap":'onTap',
      "dataType":"issue_invoice",
      "name":"申请开票",
      "status": this.data.showElectricBtn == 1 && (!this.data.electricEntity || (this.data.electricEntity && this.data.electricEntity.taskId == 0)) && order_info.is_allow_electric == 1 && (order_info.order_amount>0||order_info.offline_surplus!=0) && order_info.order_type != 11,
    },
    {
      "key":'check_invoice',
      "tap":'onTap',
      "dataType":"detail_invoice",
      "name":"查看发票",
      "status":  this.data.showElectricBtn == 1 && this.data.electricEntity && this.data.electricEntity.taskId && order_info.order_type != 11
    },
    {
      "key":'delay_receive',
      "tap":'extendReceive',
      "name":"延长收货",
      "status": order_info.can_extend_receipt == 1 && order_info.extend_receipt_day > 0 && order_info.order_type != 11
    },
    {
      "key":'batch_apply',
      "tap": app.Conf.LiveType == 'channels' && order_info.platform_src === "MINISHOP" ? 'cancelOrderUnavailable' :  'onTap',
      "dataType":"batch_apply",
      "name": "批量售后",
      "status": !this.data.hideBatch && (order_info.shipping_status == '2' || this.data.earlyApplyRefund == '1') && order_info.order_status_Id == '1' && order_info.isallow_tuihuanhuo == '1' && order_info.enable_returns
    },
    // {
    //   "key":'batch_confirm',
    //   "tap":'onTap',
    //   "dataType":"batch_confirm",
    //   "name":"确定申请",
    //   "status": (order_info.shipping_status == '2' || this.data.earlyApplyRefund == '1') && order_info.order_status_Id == '1' && order_info.isallow_tuihuanhuo == '1' && order_info.enable_returns && this.data.batch_active
    // },
    {
      "key":'buy_again',
      "tap":'onTap',
      "dataType":"oneMoreOrder",
      "name":"再次购买",
      "status": order_info.can_one_more_order == 1 && !(order_info.is_valet_order==1 && order_info.is_order_user==0) && order_info.order_type != 11
    },
    {
      "key":'check_shipping',
      "tap":'onTap',
      "dataType":"shipping",
      "name":"查看物流",
      "status": order_info.shipping_status != 0 && order_info.shipping_status != 3 && this.data.show_invoice_btn && (order_info.show_invoice_no && order_info.show_invoice_no.length>0) && !this.isHideLogistics
    },
  ];
  let unfoldNum = 0;
  let unfoldBtnArr = []; //展开
  let foldBtnArr = [];   //折叠
  for(let i=0,len=container.length;i<len;i++){
    if(container[i].status){
      unfoldNum+=1;
      if(unfoldNum<=3){
        unfoldBtnArr.push(container[i]);
      }else{
        foldBtnArr.push(container[i]);
      }  
    }
  }
  
unfoldBtnArr.length<=3 && unfoldBtnArr.push(
  {
    "key":'back',
    "tap":'onTurnBack',
    "name":"返回首页",
    "status": true
  });
  unfoldBtnArr.reverse();
  this.setData({  
    unfoldBtnArr,
    foldBtnArr
  })
  console.log('btnArr',unfoldBtnArr,foldBtnArr)
}

function asyncGetConfig(){
  let arr = []; 
  let order_info = this.data.order_info||{};
  let p1 = app.sysTemConfig("return_day_limit").then(e => {
    this.setData({
      "order_info.enable_returns": e.Value || 0
    })
    return Promise.resolve();
  })
  arr.push(p1); 
  let p2 = checkForPay.call(this);
  arr.push(p2); 
  if(order_info.shipping_status == '1'){
    let p3 = app.sysTemConfig("apply_after_sales_in_advance").then(e => {
      this.setData({
        earlyApplyRefund: e.Value || 0
      })
    })
    arr.push(p3);
  }else if(this.data.earlyApplyRefund == 1){
    this.setData({
      earlyApplyRefund: 0
    })
  }
  if (order_info.cancleActionStatus == 1){
    let p4 = app.sysTemConfig("is_close_cancel_order_btn").then(e => {
      this.setData({
        close_cancel_btn: e.Value || 0
      })
    })
    arr.push(p4); 
  } else if (order_info.cancleActionStatus == 2){
    let p4 = app.sysTemConfig("is_close_apply_cancel_order_btn").then(e => {
      this.setData({
        close_apply_cancel_btn: e.Value || 0
      })
    })
    arr.push(p4);
  }
  let p5 = app.sysTemConfig("open_single_goods_cancel").then(e => {
    this.setData({
      single_cancel_btn: e.Value || 0
    })
  })
  arr.push(p5);
  let p6 = app.sysTemConfig("activate_electric_kp").then(e=>{
    this.setData({
      showElectricBtn: e.Value||0
    })
  })
  arr.push(p6);

  let p7 = app.sysTemConfig("is_show_logistics").then(e=>{
    this.isHideLogistics = !!(e.Value === 0 || e.Value === '0');
  })
  arr.push(p7);

  let p = new Promise((rs, rj) => {
    return Promise.all(arr).then(res => {
      rs(res);
    }).catch(e=>{
      rj(e);
    });
  });
  return p.finally((res)=>{
    updateBtnContainer.call(this);
    return Promise.resolve();
  }) 
}

function fold_btn_toggle(){
  let bool = this.data.fold_show;
  let animTime = 320;
  if(!bool){
    if(this.lockFold)return
    this.lockFold = true;
    this.setData({
      fold_show:true
    });
    let time = 100;
    let lockTime = time + animTime;
    setTimeout(()=>{
      this.setData({
        fold_anim:true
      })
    },time)
    setTimeout(() => {
      this.lockFold = false;
    }, lockTime);
  }else{
    if(this.lockFold)return
    this.lockFold = true;
    this.setData({
      fold_anim:false
    })
    setTimeout(()=>{
      this.setData({
        fold_show:false
      });
      this.lockFold = false;
    },animTime) 
  }
}


 
function getPayStatus(){
  let options = this.options;
  return app.BuyApi.getOrderPayStatus({
    params: {
      userToken: app.LM.userToken,
      orderId: options.order_id,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(res=>{
      console.log('then',res);
      return Promise.resolve(res);
  }).catch(e=>{
      console.log('catch',e)
      return Promise.resolve(e);
  }) 
}


function pollingSucc(){
  getOrderInfo.call(this);
}

function pollingFail(){ 
  wx.redirectTo({
    url: '/pages/micro_mall/order/order_list',
  })
} 

function checkStoreOrder(info){
  if(!info)return;
  if(info.isInstore == 1){
    if((info.shipping_status == 1 || info.shipping_status == 4) && info.order_sn.indexOf('DPO') == '-1'){
      info.orderStatus = '待提货';
    }
    if(info.is_out_of_stock == 1){
      info.orderStatus = '缺货中';
    }
  }
  return;
}

function setAdsPop(){
  setTimeout(() => {
    this.setData({
      adsPop:{
        isIndex:4,
        page_id:0,
      }
    })
  }, 500);
}

function updateOrderAction(params){
  return app.BuyApi.Update_Order_action({
    params 
  })
}

function captchaValificate(needValicate,isclose_sms_check){
  if(isclose_sms_check == 1 || !this.captchaPop){
    return Promise.resolve();
  }
  return this.captchaPop.valificate(needValicate === "needValicate");
}