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
          hasActivity: 2
     },
     onLoad: function (options) {
          console.log("PH", PH);
          this.options = options || {};
     },
     onShow: function () {
          this.initLogin().then(()=>{
               this.getActivityInfo();
          });
     },
     onHide: function () {
          // Polling.stopPolling(); //onHide不用停止
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
          this.initLogin().then(()=>{
               if(this.isActive){
                    return;
               }
               this.isActive = true;
               if(this.isLoading) return;
               this.isLoading = true;
               if(!this.isCreateOrder){
                    this.createOrder().then((order_id)=>{
                        return PayH.UnifiedorderByOrderId({type:"upgrade",payType:"newPay",order_id}).then((res)=>{
                              return this.payCallBack(res);
                         }).catch(()=>{
                              this.isActive = false;
                         })
                    }).finally(()=>{
                         this.isLoading = false;
                    })
               } else {
                    PayH.UnifiedorderByOrderId({type:"upgrade",payType:"newPay",order_id: this.isCreateOrder}).then((res)=>{
                         return this.payCallBack(res);
                    }).finally(()=>{
                         this.isActive = false;
                         this.isLoading = false;
                    })
               }
          });
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
                         this.isCreateOrder = data;
                         console.log('isCreateOrder',this.isCreateOrder)
                         return Promise.resolve(data);
                    } 
               }
               return Promise.reject(data);
          }).catch(()=>{
               this.isActive = false;
               return Promise.reject();
          })
     },
     payCallBack(){
          this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
          this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
          let dialog = this.pageDialog;
          let extra = {
              orderSync: this.orderSync,
              dialog: dialog,
              type:"",
          }
          Polling.setPolling(()=>this.getPayStatus(),()=>{
               app.LM.reSetSimpleInfo().finally(()=>{
                    this.isCreateOrder = 0;
                    this.getActivityInfo();
                    dialog.setTitle("充值成功");
                    dialog.setTouchCancel(false);
                    dialog.setSingleBtn && dialog.setSingleBtn({
                         name: "确认",
                         tap: function () {
                              dialog.dismiss();
                              wx.navigateBack()
                         }
                    });
                    dialog.show && dialog.show();
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
     getPayStatus(){
          console.log('getpaystatus',this.isCreateOrder,this)
          if(!this.isCreateOrder) return;
          return app.UserApi.checkUserUpgradeOrderPay({
               params: {
                    orderId: this.isCreateOrder
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
          return app.LM.loginAsync().then(res=>{
                 if(this.data.isLogin != app.LM.isLogin){
                      this.setData({
                           isLogin: app.LM.isLogin
                      })
                 }
                 return res
            })
       }
}))