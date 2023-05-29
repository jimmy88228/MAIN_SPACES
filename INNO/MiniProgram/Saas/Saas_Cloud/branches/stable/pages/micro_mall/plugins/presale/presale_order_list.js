// pages/micro_mall/presale/presale_order_list.js
var app = getApp();
import MyDate from '../../../../common/support/utils/date-util.js';

Page(app.BP({
    data: {
        order_list: [],
        sys_info: {},
        brand_info: app.globalData.brand_info,
        jumpType: "custom",
        showAll: true
    },
    req_data: {},
    page: 1,
    is_more: true,
    is_pull_down: false,
    onLoad: function(options) {
        this.tababr = this.selectComponent("#custom_tabbar");
        this.req_data = options;
    },
    onReady: function() {
    },
    onShow: function() {
        this.iniTabbar(this.data.brand_info);
        this.page = 1;
        this.is_more = true;
        this.getInitData();
    },
    onPullDownRefresh: function() {
        this.is_more = true;
        this.page = 1;
        this.is_pull_down = true;
        this.getInitData();
    },
    onReachBottom: function() {
        var that = this;
        if(this.is_more){
          this.getInitData();
        }else{
          app.SMH.showToast({
            "title":"已经到底啦！"
          })
        }
    },
    getInitData: function() {
        app.CL_PreSaleApi.getPreOrderInfoList({
            params: {
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                brandCode: app.Conf.BRAND_CODE,
                userToken: app.LM.userKey
            },
            other: {
                 isShowLoad: true
             }
        }).then(info => {
            let data = info.data.dataList;
            if (data.length == 0) {
                this.is_more = false;
                return;
            }
            //
            for (let i in data){
              let goods_attr = data[i].goods_attr;
              let attrArray = goods_attr.split(":");
              data[i].goods_attr = attrArray;
              let total_amount = (parseFloat(data[i].deposit_amount) + parseFloat(data[i].tail_amount)).toFixed(2);
              data[i].order_amount = total_amount || 0.00;
              data[i].estimate_delivery_date_str =MyDate.format(MyDate.parse(data[i].estimate_delivery_date || ""),"M月dd日 hh:mm");
            }
            //
            let order_list = this.data.order_list || [];
            if (this.page == 1) {
                order_list = data;
            } else {
                order_list = order_list.concat(data);
            }
            this.setData({
                order_list: order_list,
            });
            if (this.is_pull_down) {
                this.is_pull_down = false;
                wx.stopPullDownRefresh();
                app.SMH.showToast({
                    "title": "刷新成功！"
                });
            }
            this.page++;
         }).finally(()=>{
           this.setData({
             showAll:false
           })
         })
    },
    cancelOrder: function(e) {
        var that = this;
        var order_id = e.currentTarget.dataset.order_id;
        wx.showModal({
            title: '提示',
            content: '确定要取消订单吗？',
            success: function(sm) {
                if (sm.confirm) {
                    var reqData = {
                        preOrderId: order_id,
                        brandCode: app.Conf.BRAND_CODE,
                        userToken: app.LM.userKey
                    };
                    app.CL_PreSaleApi.cancelPresaleOrder({
                        data: reqData,
                        other: {
                            isShowLoad: true
                        }
                    }).then(res => {
                        if(res.code == "1"){
                          app.SMH.showToast({
                            "title": "取消成功"
                          })
                        }else{
                          app.SMH.showToast({
                            "title": res.msg || "操作失败"
                          })
                        }
                    })
                } else if (sm.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    gotoOrderInfo: function(e) {
        let order_id = e.currentTarget.dataset.order_id;
        let order_status = e.currentTarget.dataset.order_status;
        let related_order_id = e.currentTarget.dataset.related_order_id;
        let isDetails = e.currentTarget.dataset.isDetails;
        let delta = e.currentTarget.dataset.delta;
        wx.navigateTo({
            url: `presale_buy_info?order_id=${order_id}&orderStatus=${order_status}&related_order_id=${related_order_id}&isDetails=${isDetails}&delta=${delta}`
        })
    },
    gotoRelateOrderInfo: function(e) {
        var related_order_id = e.currentTarget.dataset.related_order_id;
        wx.navigateTo({
            url: '/pages/micro_mall/order/order_info?order_id=' + related_order_id,
        })
    },
    iniTabbar(brand_info) {
        let brandStyle = this.data.brandStyle;
        this.tababr.setTabbar([{
            "pagePath": "pages/micro_mall/plugins/presale/presale_activity_list",
            "text": "预售首页",
            "iconfont": "icon-yushou",
            // "iconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreHome.png",
            // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreHomeActive.png",
            "is_this_page": false,
            "select_color": brandStyle.pre_color.to_color,
            "is_original_tab": false
        },
        {
            "pagePath": "pages/micro_mall/plugins/presale/presale_order_list",
            "text": "我的预售",
            "iconfont": "icon-huodongzhongxin",
            // "iconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreMine.png",
            // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreMineActive.png",
            "is_this_page": true,
            "select_color": brandStyle.pre_color.to_color,
            "is_original_tab": false,
            "need_login": true,
        }
        ]);
    },
    toDetails(e) {
        let activity_id = e.currentTarget.dataset.activity_id;
        wx.navigateTo({
            url: `./presale_activity_detail?activity_id=${activity_id}`,
        })
    }
}))