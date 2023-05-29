import PayH from '../../../../common/helper/handle/payHandle.js';
import PH from '../../../../common/helper/handle/paramsHandle';
import Polling from '../../../../common/helper/polling.js';
const app = getApp();
Page(app.BP({
     data: {
          activityInfo: {},
          lvl_info:{},
          sel_lvl_info: {},
          isLogin: false,
          isCreateOrder: 0,
          hasActivity: 2
     },
     onLoad: function (options) {
          console.log("PH", PH);
          this.options = options || {};
     },
     onShow: function () {
          this.initLogin();
          this.getActivityInfo();
     },
     onHide: function () {
          Polling.stopPolling();
     },
     onUnload: function () {
          Polling.stopPolling();
     },
     getActivityInfo: function () {
          let options = this.options || {};
          if(!options.activityId){
               if(this.data.hasActivity){
                    this.setData({
                         hasActivity: 0
                    })
               }
               app.SMH.showToast({
                    title: "无效活动ID"
               })
               return;
          }
          return app.UserApi.get_UserUpgradeActivityInfo({
               params: {
                    activityId: options.activityId,
                    userToken: app.LM.userToken,
                    brandCode: app.Conf.BRAND_CODE
               },
               other: {
                    isShowLoad: true
               }
          }).then(e => {
               if(e.code == 1){
                    let data = e.data || {};
                    let lvl_info = data.optionList;
                    this.setData({
                         activityInfo: data || {},
                         lvl_info: lvl_info,
                         sel_lvl_info: lvl_info[0],
                         hasActivity: 1
                    })
               } else {
                    if(this.data.hasActivity){
                         this.setData({
                              hasActivity: 0
                         })
                    }
                    app.SMH.showToast({
                         title: res.msg || "活动异常"
                    })
               }
          })
     },
     setLvlInfo:function(e){
          let index = e.detail.value;
          let sel_lvl_info = this.data.lvl_info[index];
          this.setData({
               sel_lvl_info: sel_lvl_info
          })
     },
     toBuy(){
          this.initLogin();
          if(this.isActive){
               return;
          }
          this.isActive = true;
          if(!this.data.isCreateOrder){
               this.createOrder().then((orderId)=>{
                    PayH.getUnifiedorderByOrderId({type:"upgrade", orderId}).then((res)=>{
                         console.log("res", res)
                         this.getRequestPayment(res.data);
                    }).catch(()=>{
                         this.isActive = false;
                    })
               })
          } else {
               PayH.getUnifiedorderByOrderId({type:"upgrade", orderId: this.data.isCreateOrder}).then((res)=>{
                    this.getRequestPayment(res.data);
               }).catch(()=>{
                    this.isActive = false;
               })
          }
     },
     createOrder(){
          var sel_lvl_info = this.data.sel_lvl_info;
          let options = this.options || {};
          return app.UserApi.createUserUpgradeOrder({
               data: {
                    activityId: parseInt(options.activityId),
                    optionId:sel_lvl_info.option_id,
                    userToken: app.LM.userToken,
                    brandCode: app.Conf.BRAND_CODE,
                    shareUserToken: PH.paramsJson("fromUser") || ""
               },
               other: {
                    isShowLoad: true
               }
          }).then(e => {
               if(e.code == 1){
                    console.log("e", e);
                    let data = e.data || 0;
                    if(data){
                         this.setData({
                              isCreateOrder: data
                         })
                         return Promise.resolve(data);
                    } 
               }
               return Promise.reject(data);
          }).catch(()=>{
               this.isActive = false;
          })
     },
     getRequestPayment(pay_info){
          pay_info = pay_info || {};
          wx.requestPayment({
               'timeStamp': pay_info.timeStamp + '',
               'nonceStr': pay_info.nonceStr,
               'package': pay_info.package,
               'signType': pay_info.signType,
               'paySign': pay_info.sign,
               'success':(resp)=> {
                    this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
                    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
                    let extra = {
                        orderSync: this.orderSync,
                        dialog: this.pageDialog,
                        type:"",
                    }
                    Polling.setPolling(()=>this.getPayStatus(),()=>{
                         app.LM.reSetSimpleInfo().finally(()=>{
                              setTimeout(()=>{
                                   wx.switchTab({
                                     url: '/pages/micro_mall/user/user',
                                   })
                              },1000);
                         })
                    },()=>{
                         this.setData({
                              "activityInfo.isUpgrade": 1
                         })
                         app.SMH.showToast({
                              title: "同步失败"
                         })
                         setTimeout(()=>{
                              wx.navigateBack({
                                   delta: 1
                              })
                         },1000);
                    },"",extra); 
               },
               'fail'(resp) {
                    app.SMH.showToast({
                      title: '支付失败'
                    })
               },
               complete:()=>{
                    console.log("支付");
                    this.isActive = false;
               }
          })
     },
     getPayStatus(){
          if(!this.data.isCreateOrder) return;
          return app.UserApi.checkUserUpgradeOrderPay({
               data: {
                    orderId: this.data.isCreateOrder
               },
               other: {
                    isShowLoad: true
               }
          })
     },
     getBack(){
          wx.navigateBack({
               fail(){
                    wx.switchTab({
                      url: '/pages/micro_mall/user/user'
                    })
               }
          })
     },
     initLogin(){
          return app.LM.loginAsync().then(()=>{
                 if(this.data.isLogin != app.LM.isLogin){
                      this.setData({
                           isLogin: app.LM.isLogin
                      })
                 }
            })
       }
}))