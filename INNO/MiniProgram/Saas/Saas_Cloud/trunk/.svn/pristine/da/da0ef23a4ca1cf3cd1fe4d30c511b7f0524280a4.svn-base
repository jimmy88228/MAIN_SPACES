var app = getApp();
var timer = null;
var orderTypeTit = "";
var next_act = "order_info";
Page(app.BP({
    data: {
        tabNum0: "mobile_tab",
        tabNum1: "return_tab",
        clickTabId: "mobile_tab",
        mobileList: [],
        storeList: [],
        brand_info: app.globalData.brand_info,
        options: {},
        count: 3,
        isEmptyMobile: false,
        isEmptyStore: false,
        order_text: "订单号",
        btn_text: "订单详情",
        allwaysVal: false
    },
    mobilePage: 0,
    orderType: 0,
    storePage: 0,
    mobileOrderMore: true,
    storeOrderMore: true,
    onLoad: function(options) {
        //显示店铺订单数据
        var order_type = options.orderType;
        console.log("订单", options);
        var clickTabId = this.data.clickTabId;
        var tabNum1 = this.data.tabNum1;
        var tabNum0 = this.data.tabNum0;
        let empty_order = this.data.brand_info.icon_url + "micro_mall/order/empty_order.png";
        let empty_url = this.data.brand_info.icon_url + "micro_mall/default.jpg";
        if (order_type == 'order_exchange') {
            clickTabId = tabNum1
        } else {
            clickTabId = tabNum0
        }
        let l_bg_color = app.getColor(this.data.brand_info.style.bg_color, 49, 121, 97, 1);
        this.setData({
            options: options,
            clickTabId: clickTabId,
            empty_order: empty_order,
            empty_url: empty_url,
            l_bg_color: 'background:' + l_bg_color + ';'
        })

    },
    onReady: function() {},
    onShow: function() {
       this.onShowFnc();
    },
    onShowFnc(){
        if (this.data.clickTabId === this.data.tabNum1) {
            //退单
            this.mobilePage = 0;
            this.orderType = 4;
            this.data.mobileList = [];
            this.setData({
                isEmptyMobile: false,
                order_text: "退单号",
                btn_text: "退单详情"
            })
            this.loadMobileData();
        } else {
            //手机订单
            this.data.mobileList = [];
            this.setData({
                isEmptyMobile: false,
            }) 
            this.mobilePage = 0;
            this.loadMobileData();
        }
    },
    onReachBottom: function() {
        var that = this;
        var clickTabId = this.data.clickTabId;
        var tabNum0 = this.data.tabNum0;
        var tabNum1 = this.data.tabNum1;
        if (!that.mobileOrderMore) {
            return
        }
        timer = setTimeout(function() {
              clearTimeout(timer);
              if (clickTabId == tabNum0) { 
                  this.orderType = 0;
              } else if (clickTabId == tabNum1) { 
                  this.orderType = 4;
              }
            that.loadMobileData();
        }, 500);

    },
    /**
     * 设置请求数据
     */
    setReqData: function() {
        var clickTabId = this.data.clickTabId;
        var tabNum0 = this.data.tabNum0;
        var tabNum1 = this.data.tabNum1;
        var options = this.data.options;
        var reqData;
        // var orderType = options.orderType;

        // switch (orderType) {
        //   case 'wait_to_pay':
        //     this.orderType = 1;
        //     orderTypeTit = "待付款";
        //     next_act = "order_info";
        //     break;
        //   case 'wait_to_shipping':
        //     this.orderType = 2;
        //     orderTypeTit = "待发货";
        //     next_act = "order_info";
        //     break;
        //   case 'wait_to_receiving':
        //     this.orderType = 3;
        //     orderTypeTit = "待收货";
        //     next_act = "order_info";
        //     break;
        //   case 'order_exchange':
        //     this.orderType = 4;
        //     orderTypeTit = "退换货";
        //     next_act = "order_exchange_info";
        //     break;
        //   case 'all':
        //     this.orderType = 0;
        //     orderTypeTit = "";
        //     next_act = "order_info";
        //   default:
        //     this.orderType = 0;
        //     orderTypeTit = "";
        //     next_act = "order_info";
        // }
        // //设置title 
        // wx.setNavigationBarTitle({
        //   title: orderTypeTit + "订单列表",
        // })
        return reqData;
    },
    /**
     * 手机订单请求
     */
    loadMobileData: function() {
        var that = this;
        var reqData = this.setReqData();
        getMobileOrderList.call(this);
        return;
    },
    /**
     * 店铺订单请求
     */
    loadReturnOrder: function() {
        var that = this;
        var reqData = this.setReqData();
        // getReturnOrderList.call(this);

    },
    onTabClick: function(e) {
        var clickTabId = this.data.clickTabId;
        var tab_id = e.currentTarget.id; 
        this.setData({
            clickTabId: tab_id,
        });

        if (tab_id === 'return_tab') {
            this.mobilePage = 0;
            this.orderType = 4;
            this.data.mobileList = [];
            this.setData({
                isEmptyMobile:false,
                mobileList: [],
                order_text: "退单号",
                btn_text: "退单详情"
            })
            this.loadMobileData();
            // this.loadReturnOrder();
        } else if (tab_id === 'mobile_tab') {
            this.mobilePage = 0;
            this.orderType = 0;
            this.data.mobileList = [];
            this.setData({
                isEmptyMobile: false,
                mobileList: [],
                order_text: "订单号",
                btn_text: "订单详情"
            })
            this.loadMobileData();
        }
        this.setData({
            orderType:this.orderType
        })
    },
    onPageJump: function(e) {
        var dataset = e.currentTarget.dataset || {};
        var order_id = dataset.order_id || '';
        var order_sn = dataset.order_sn || '';
        var return_id = dataset.return_id || '';
        var type = dataset.type || '';
        var return_sn = dataset.return_sn || '';
        var return_id = dataset.return_id || '';
        var parent_order_sn = dataset.parent_order_sn || '';
        var sign = dataset.sign || '';
        // if(type == 'return'){
        //     wx.navigateTo({
        //         url: `/pages/micro_mall/order/order_exchange_info?return_id=${return_id}&return_sn=${return_sn}`
        //     })
        //     return
        // }
        if (this.data.clickTabId === this.data.tabNum0) {
            //退换货
            if (next_act == "order_exchange_info") {
                wx.navigateTo({
                    url: next_act + '?order_sn=' + order_sn + '&return_id=' + return_id
                })
            } else { //其他类型订单
                var link_order_sn = "";
                if (parent_order_sn) {
                    link_order_sn = parent_order_sn;
                } else {
                    link_order_sn = order_sn;
                }
                wx.navigateTo({
                    url: next_act + '?order_sn=' + link_order_sn + '&order_id=' + order_id  
                })
            }
        }  
        else {
                wx.navigateTo({
                    url: `/pages/micro_mall/order/order_exchange_info?return_id=${return_id}&return_sn=${return_sn}&type=refund_goods_tab`
                })
                return
        }

    },

    jumpToComment: function(e) {
        if (this.data.clickTabId === this.data.tabNum0) {
            var order_id = e.currentTarget.dataset.order_id;
            wx.navigateTo({
                url: `../comment/mobile_order_comment/mobile_order_comment?order_id=${order_id}`,
            })
        } else {
            var order_sn = e.currentTarget.dataset.order_sn;
            var order_id = e.currentTarget.dataset.order_id;
            wx.navigateTo({
                url: `../comment/store_order_comment/store_order_comment?order_sn=${order_sn}&order_id=${order_id}`,
            })
        }

    },
    onTapConfirm(e){
        this.detail = e.detail|| "";
        this.onShowFnc();
    },
}))

function getMobileOrderList() {
    this.mobilePage = this.mobilePage + 1;
    let reqUrl = ""
    let params = {
        // userToken: app.LM.userToken,
        pageIndex: this.mobilePage,
        orderKind: 1,
        orderType: this.orderType,
        pageSize: app.Conf.PAGE_SIZE,
        brandCode: app.Conf.BRAND_CODE,
        isOrderForCustom: 1
    };
    if(this.orderType != 4) {
        reqUrl = 'getOrderList',
        params.searchStr = this.detail||"";
    }else {
        reqUrl = 'getReturnOrderList';
        params.returnType = 0
    }
    return app.CL_BuyApi[reqUrl]({
        params:params,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let mobileList = this.data.mobileList || [];
            let data = e.data && e.data.list || [];
            if (data.length < app.Conf.PAGE_SIZE) {0
                this.mobileOrderMore = false;
            } else {
                this.mobileOrderMore = true;
            }
            for (let item in data) {
                data[item].platform_src = data[item].platform_src && data[item].platform_src.toLowerCase() || 'wxapp'
            }
            mobileList = mobileList.concat(data);
            this.setData({
                mobileList: mobileList || []
            })
            if (this.data.mobileList.length == 0) {
                this.setData({
                    isEmptyMobile: true
                })
            }
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    }).finally(e => {
        if (!this.data.isReady) {
            this.setData({
                isReady: true
            })
        }
    });
}

function getReturnOrderList() {
    this.storePage = this.storePage + 1;
    return app.BuyApi['']({
        params: {
            userToken: app.LM.userToken,
            pageIndex: this.mobilePage,
            orderKind: 1,
            orderType: this.orderType,
            pageSize: app.Conf.PAGE_SIZE,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let storeList = this.data.storeList;
            let data = e.data || [];
            if (data.length < app.Conf.PAGE_SIZE) {
                this.storeOrderMore = false;
            } else {
                this.storeOrderMore = true;
            }
            storeList = storeList.concat(data);
            this.setData({
                storeList: storeList || []
            }) 
            if (this.data.storeList.length == 0) {
                this.setData({
                    isEmptyStore: true
                });
            }

            return Promise.resolve(e);
        }
        return Promise.reject(e);
    }).finally(e => {
        if (!this.data.isReady) {
            this.setData({
                isReady: true
            })
        }
    });
}  