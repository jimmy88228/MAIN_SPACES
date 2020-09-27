// pages/micro_mall/order/order_exchange_info.js
var app = getApp();
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
        }
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
        }
        wx.setNavigationBarTitle({
            title: text + '订单详情'
        })
        this.setData({
            "cardInfo.title": text + '订单详情',
            "cardInfo.showCard": true
        })
        csSetShow.call(this)
        // this.loadData(options);
    },
    onShow() {
        getTuiHuanHuoDetailList.call(this, this.options);
        app.sysTemConfig("sys_settings_store_return_address").then(e => {
            this.setData({
                sys_return_address: e.Value
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 
     */
    loadData: function(options) {
        // var that = this;
        // var order_sn = options.order_sn;
        // var reqData={
        //   order_sn: order_sn
        // }
        // app.wxReq("","order_getOrderExchangeInfo",reqData,function(info){
        //   var data = info.data;
        //   var sys_config = info.system_config;
        //   var exchage_info = data.exchage_info;
        //   var return_order = data.return_order;
        //   that.setData({
        //     exchage_info: exchage_info,
        //     return_order: return_order,
        //     sys_config: sys_config
        //   })
        // })
    },
    /**
     * 同步输入值
     */
    changeVal: function(e) {
        var dataset = e.currentTarget.dataset;
        var key = dataset.key;
        var val = e.detail.value;
        this.setData({
            [key]: val
        })
    },
    /**
     * 
     */
    saveOrderNum: function() {
        let that = this;
        // var exchage_info = this.data.exchage_info;
        let shipping_num = this.data.shipping_num;
        if (!shipping_num) {
            app.SMH.showToast({
                title: '请输入物流单号',
            })
            return;
        }
        let options = this.options;
        return app.BuyApi.updateReturnOrderShippingNo({
            data: {
                "returnId": options.return_id,
                "userToken": app.LM.userToken,
                "brandCode": app.Conf.BRAND_CODE,
                "shippingNo": shipping_num
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
                app.sysTemConfig("sys_settings_store_return_address").then(e => {
                    this.setData({
                        sys_return_address: e.Value
                    })
                })
                return Promise.resolve(e);
            }
            return Promise.reject();
        })
        // app.wxReq("", "order_setReturnOrderNumber", reqData,function(info){
        //   if(info.error == 0){
        //     wx.showToast({
        //       title: "保存成功",
        //     });
        //     setTimeOut(function(){
        //       that.loadData(that.options);
        //     },500);
        //   }
        // })
    },
    back: function(e) {
        wx.switchTab({
            url: '/pages/micro_mall/index/index',
        })
        // wx.navigateBack({
        //     delta: 1
        // })
    }
}))
//
function getTuiHuanHuoDetailList(options = {}) {
    return app.BuyApi.getTuiHuanHuoDetailList({
        params: {
            returnId: options.return_id,
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
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
    })
}

function csSetShow() {
    if (app.Conf.brandConf && app.Conf.brandConf.showContact) {
        let cs = this.selectComponent('#csId');
        cs.setShow();
    }
}