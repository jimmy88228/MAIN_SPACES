// pages/micro_mall/order/order_exchange_info.js
var app = getApp();
let regTrim = /^[A-Za-z0-9]*$/;
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
        csSetShow.call(this)
    },
    onUnload(){
        checkShipping("remove");
    },
    onShow() {
        checkShipping.call(this);
        getTuiHuanHuoDetailList.call(this, this.options);
        app.sysTemConfig("sys_settings_store_return_address").then(e => {
            this.setData({
                sys_return_address: e.Value
            })
        })
    },
    onReady: function() {
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
                app.sysTemConfig("sys_settings_store_return_address").then(e => {
                    this.setData({
                        sys_return_address: e.Value
                    })
                })
                return Promise.resolve(e);
            }
            return Promise.reject();
        }) 
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
}))
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