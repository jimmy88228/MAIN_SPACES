// pages/micro_mall/collageGroup/collage_buy_detail.js
import WxApi from '../../../common/helper/wx-api-helper.js'
import PayH from '../../../common/helper/handle/payHandle.js'
import Polling from '../../../common/helper/polling.js'
import WxSub from '../../../common/helper/handle/wxSubscribe';

var app = getApp();
Page(app.BP({ 
    data: {
        select_addr: {
            address_id: 0, //
        },
        isIphoneX:app.SIH.isIphoneX,
        user_activity_id: 0,
        captain_id: 0,
        goods_info: {},
        order_info: {},
        order_remark: "",
        show_remarks_val: true,
        remarks_focus: false,
        sys_info: {},
    },
    options: {},
    is_pay_retrun: false, //拼团成功支付回调时，返回不触发更新页面
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.options = options;
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        this.setData({
            rightbutton: rightbutton
        })
        getTpls.call(this);
    },
    onShow: function() {
        if (!this.is_pay_retrun) {
            let options = this.options;
            this.getBuyDetails(options);
        }
    }, 
    onHide: function() {

    }, 
    onUnload: function() {
        Polling.stopPolling();
    }, 
    getBuyDetails(options) {
        var that = this;

        //获取地址
        let userChoiceData = app.StorageH.get("userChoiceData") || {}
        var select_addr = userChoiceData.selectAddr || this.data.select_addr;
        if (select_addr) {
            that.selectedAddress(select_addr);
        }

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
        wx.navigateTo({
            url: '../address/address_list',
        })
    },
    /**
     * 提交订单
     */
    submitOrder() {
        if(this.isLoading)return;
        this.isLoading = true;
        try{
            return collageGroupAddOrder.call(this).then(AddOrderInfo=>{
                return getTpls.call(this).then(()=>{
                    let tplsList = this.tplsList||[];
                    console.log('订阅 getTpls',tplsList)
                    if(!this.subscribeBool && tplsList && tplsList.length>0){
                        this.subscribeBool = true;
                        return WxSub.wxSubscribeHelp({tplsList,bool:false,type:"COLLAGE",info:{}}).then(res=>{
                            console.log('订阅 then',res)
                            if(res){
                                app.SMH.showToast({
                                    title:"订阅完成"
                                })
                                setSubscribe.call(this,res);
                                setTimeout(() => {
                                    this.getPay(AddOrderInfo); 
                                }, 800);   
                            }else{
                                this.getPay(AddOrderInfo); 
                            }
                        })
                    }else{
                        this.getPay(AddOrderInfo); 
                    }
                })
            });
        }catch(e){
            collageGroupAddOrder.call(this).then(AddOrderInfo=>{
                this.getPay(AddOrderInfo);
            })
        }
    },

    /**
     * 去支付
     */
    getPay: function(order = {}) {
        let order_id = order.user_log_id || 0;
        let order_sn = order.logSn || "";
        if(!order_id) return;
        if(order.order_amount == 0){
          let activityId = this.options.activityId || 0;
          this.is_pay_retrun = true;
          wx.navigateTo({
            url: 'my_collage_detail?activity_id=' + activityId + '&user_activity_id=' + order.user_activity_id + '&captain_id=' + order.user_id,
          })
          return;
        }
        return PayH.UnifiedorderByOrderId("pin",order_id)
        .then(e => {
            if (e.code == "1") {
                let pay_info = e.data;
                WxApi.requestPayment({
                    'timeStamp': pay_info.timeStamp + '',
                    'nonceStr': pay_info.nonceStr,
                    'package': pay_info.package,
                    'signType': pay_info.signType,
                    'paySign': pay_info.sign,
                }).then(e => {
                    this.orderSync = this.orderSync || this.selectComponent("#orderSync"); 
                    this.dialog = this.dialog || this.selectComponent("#pageDialog");
                    let extra = {
                        orderSync:this.orderSync,
                        dialog:this.dialog,
                        type:"",
                    }
                    Polling.setPolling(()=>getPayStatus.call(this,order_id),()=>pollingSucc.call(this),()=>pollingFail.call(this),"",extra); 
                    this.is_pay_retrun = true;
                    // getOrderPayStatus.call(this, order_id);
                })
            }
        })
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
    }
}))
//下单
function collageGroupAddOrder() {
    if(this.addOrderInfo){ //缓存订单
        this.isLoading = false;
        return Promise.resolve(this.addOrderInfo)
    };
    let order_info = this.data.order_info;
    let goods_info = this.data.goods_info;
    let order_remark = this.data.order_remark;
    let reqUrl = 'collageGroupAddOrder';
    let warn = "";
    if(!order_info.address_id || order_info.address_id == 0){
      warn = "请完善收货人信息后再支付"
    }
    if(warn){
      app.SMH.showToast({
        title: warn
      })
      this.isLoading = false;
      return Promise.reject();
    }
    return app.CollageApi[reqUrl]({
        data: {
            activityId: order_info.activity_id,
            userActivityId: order_info.user_activity_id,
            addressId: order_info.address_id || 0,
            remark: order_remark,
            goodsId: goods_info.goods_id,
            productId: goods_info.product_id,
            productNum: goods_info.number,
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            clientSessionId: app.LgMg.channel &&  app.LgMg.channel.clientSessionId || '',
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data || {};  
            this.addOrderInfo = data||{}; 
            return Promise.resolve(data);
        }
        return Promise.reject();
    }).finally(()=>{
        this.isLoading = false;
    })
}

//拼团结算详情
function getCollageGroupSettlementList() {
    var that = this;
    //获取地址
    let userChoiceData = app.StorageH.get("userChoiceData") || {};
    var select_addr = userChoiceData.selectAddr || this.data.select_addr;
    if (select_addr) {
        this.selectedAddress(select_addr);
    }
    return app.CollageApi.getCollageGroupSettlementList({
        params: {
            userToken: app.LM.userToken,
            activityId: this.options.activityId,
            userActivityId: this.options.userActivityId,
            addressId: select_addr.address_id || 0,
            goodsId: this.options.goodsId,
            productId: this.options.productId,
            productNum: this.options.productNum,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            var data = e.data;
            this.setData({
                goods_info: data.goodsEntity,
                order_info: data.infoEntity
            })

            return Promise.resolve(e);
        }
        app.SMH.showToast({
            "title": e.msg || "请求出错"
        })
        let _timer = setTimeout(function(){
          clearTimeout(_timer);
          wx.navigateBack();
        }.bind(this),1000);
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


 
function getPayStatus(order_id){
    return app.CollageApi.getCollageGroupOrderPayStatus({
        params: {
            userToken: app.LM.userToken,
            orderId: order_id,
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
    let order_info = this.data.order_info;
    let addOrderInfo = this.addOrderInfo || {};
    let user_activity_id = addOrderInfo.user_activity_id || 0;
    let captain_id = addOrderInfo.user_id || 0;
    wx.redirectTo({
        url: 'my_collage_detail?activity_id=' + order_info.activity_id + '&user_activity_id=' + user_activity_id + '&captain_id=' + captain_id,
    })
}

function pollingFail(){ 
    wx.redirectTo({
      url: '/pages/micro_mall/collageGroup/my_collage',
    })
}

function getTpls(){
    if(this.tplsList){
        return Promise.resolve(this.tplsList)
    }
    let h = this._gtTpls;
    if(h)return h;
    this._gtTpls = h = WxSub.getTpls("COLLAGE").then(data=>{
        this.tplsList = data || [];
        return Promise.resolve(data)
    }).catch(e=>{
        return Promise.resolve(e)
    }).finally(()=>{
        this._gtTpls && delete this._gtTpls;
    });
    return h;
}

function setSubscribe(detail={}){ //订阅接口传参处理
    let subResult = detail.subResult || {};
    let tplsList = this.tplsList || [];
    let reqList = [];
    for (let i = 0; i < tplsList.length; i++){
      let wxTplId = tplsList[i].wxTplId || "";
      let tplType = tplsList[i].tplType || "";
      let brandTplId = tplsList[i].brandTplId || 0;
      let userLogId = this.addOrderInfo && this.addOrderInfo.user_log_id || 0;
      let state=subResult[wxTplId];
      reqList.push({
        userLogId,
        tplType,
        brandTplId,
        state
      }) 
    }
    WxSub.setSubscribe(reqList, detail.setSub,'COLLAGE');
}