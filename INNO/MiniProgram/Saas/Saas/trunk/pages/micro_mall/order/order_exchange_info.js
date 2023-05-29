// pages/micro_mall/order/order_exchange_info.js
var app = getApp();
let regTrim = /^[A-Za-z0-9]*$/;
import WxApi from '../../../common/helper/wx-api-helper.js'
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        // brand_info: app.globalData.brand_info,
        return_order: "",
        exchage_info: {},
        //
        shipping_num: "",
        sys_return_address: "",
        sys_config: {},
        cardInfo:{
            title:""
        },
        isOrderCancell:false,
        dialogSlotContent: ""
    },
    options: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.options = options;
        let text = '退货';
        if (options.type =='swop_tab'){
            text = '换货';
        }else if(options.type == 'refund_money_tab'){
            text = '退款'
        }
        wx.setNavigationBarTitle({
            title: text + '订单详情'
        })
        this.setData({
            "cardInfo.title": text + '订单详情',
            "cardInfo.showCard": true,
            pageType:options.type||""
        })
        app.sysTemConfig("sys_settings_store_return_address").then(e => {
            this.setData({
                sys_return_address: e.Value
            })
        })
        csSetShow.call(this)
    },
    onUnload(){
        checkShipping("remove");
    },
    onShow() {
        checkShipping.call(this);
        getTuiHuanHuoDetailList.call(this, this.options);
    },
    onReady: function() {
    },
    onPullDownRefresh() {
        getTuiHuanHuoDetailList.call(this, this.options);    
    },
    loadData: function(options) {},
    changeVal: function(e) {
        var dataset = e.currentTarget.dataset;
        var key = dataset.key;
        var val = e.detail.value;
        let data = this.data[key];
        if(regTrim.test(val)){
            data = val;
        }
        this.setData({
            [key]: data
        })
    },
    saveOrderNum: function() {
        if (app.Conf.LiveType == 'channels' && this.data.return_order && this.data.return_order.platform_src == 'MINISHOP'){
          return this.modifyOrderUnavailable() // 视频号退货单不让改东西
        }
        let shipping_num = this.data.shipping_num;
        let shipping_Company = this.data.shipping_Company;
        let options = this.options;
        let err = "";
        if (!shipping_num) {
            err = "请输入物流单号"; 
        }else if(!shipping_Company || !shipping_Company.shippingId){
            err = "请选择快递公司"; 
        }
        if(err){
            app.SMH.showToast({
                title: err,
            });
            return
        }
        return app.BuyApi.updateReturnOrderShippingNo({
            data: {
                "returnId": options.return_id,
                "userToken": app.LM.userToken,
                "brandCode": app.Conf.BRAND_CODE,
                "shippingNo": shipping_num,
                "shippingId":shipping_Company.shippingId
            },
            other: {
                isShowLoad: true
            }
        }).then(e => {
            if (e.code == "1") {
                app.SMH.showToast({
                    title: "保存成功",
                });
                getTuiHuanHuoDetailList.call(this, this.options);
                return Promise.resolve(e);
            }
            return Promise.reject();
        }) 
    }, 
    modifyOrderUnavailable(){ // 视频号 取消订单 或 申请售后 会拦截，迟点可能会去掉
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle("温馨提示");
      this.pageDialog.setCentent("");
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
    back: function(e) {
        wx.switchTab({
            url: '/pages/micro_mall/index/index',
        })
    },
    onTap(e){
        let dataset = e.currentTarget.dataset||{};
        let type = dataset.type||"";
        if(type == "find"){
            wx.navigateTo({
              url: '/pages/micro_mall/order/shipping_list/shipping_list',
            })
        }
    },
    copy(e){
        if(this.isLoadingBtn)return
        isLoadingBtn.call(this);
        let dataset = e.currentTarget.dataset||{};
        let value = dataset.value ||"";
        wx.setClipboardData({
            data: value
            // data: this.data.order_info.order_sn || ""
        })
    }, 
    
  revokeCancel(){
    return WxApi.showModal({
      title:"提示",
      content:"确定要撤销取消吗"
    }).then((res)=>{
      if(res.confirm){
        let {return_order={}} = this.data;
        let params = {
          orderId:return_order.orderId||0,
          orderSn:return_order.relateOrderNo || "",
          refundId:this.options.return_id||0, //整单
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
          wx.navigateBack();
          return res;
        })
      }
    })
  },
}))
function isLoadingBtn(time=350){
    this.isLoadingBtn = true;
    this.isLoadingBtnId = setTimeout(()=>{
      this.isLoadingBtn = false
    },time)
  }
  
//
function getTuiHuanHuoDetailList(options = {}) {
    let url = options.type == 'refund_money_tab' ? 'getOrderRefundDetail':'getTuiHuanHuoDetailList';
    let params = {};
    (options.type == 'refund_money_tab') ? (params.refundId = options.return_id) : (params.returnId=options.return_id);
    return app.RunApi.go('BuyApi',url,params).then(e => {
        if (e.code == "1") {
            let data = e.data;
            // let exchage_info = data.exchage_info;
            let return_order = data;
            if (return_order.exchangeInfo && return_order.exchangeInfo.goods_attr && (typeof return_order.exchangeInfo.goods_attr == 'string')) {
                console.log('return_order.exchangeInfo', return_order.exchangeInfo)
                let arr = return_order.exchangeInfo.goods_attr.split(' ');
                console.log('arr', arr)
                this.setData({
                    ex_color: arr[0],
                    ex_size: arr[1] || ''
                })
            }
            console.log(return_order.statusName, return_order)
            this.setData({
                // exchage_info: exchage_info,
                return_order: return_order,
            })
            return Promise.resolve(e)
        }
        return Promise.reject();
    }).finally(()=>{
        wx.stopPullDownRefresh();
    })
}

function csSetShow() {
    if (app.Conf.brandConf && app.Conf.brandConf.showContact) {
        let cs = this.selectComponent('#csId');
        cs.setShow();
    }
}

function checkShipping(type) {
    if(type == 'remove'){
        app.StorageH.remove('Shipping_Company');
    }else{
        let shipping_Company = app.StorageH.get('Shipping_Company') || {};
        this.setData({
            shipping_Company
        })
    }
}

function updateOrderAction(params){
  return app.BuyApi.Update_Order_action({
    params 
  })
}