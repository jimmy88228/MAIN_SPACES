const app = getApp();
const tabs_staff = [{
    'i': '0',
    'key': '全部'
}, {
    'i': '1',
    'key': '待付款'
}, {
    'i': '2',
    'key': '结算中'
}, {
    'i': '3',
    'key': '已完成'
}, {
    'i': '4',
    'key': '售后'
}, ];
const tabs_records = [{
    'i': '0',
    'key': '全部'
}, {
    'i': '1',
    'key': '申请中'
}, {
    'i': '2',
    'key': '审批成功'
}, {
    'i': '3',
    'key': '审核失败'
}, {
    'i': '4',
    'key': '已转账'
}, ];
const tabs_share = [{
    'i': '0',
    'key': '总分享数'
},{
    'i': '0',
    'key': '总访问人数'
}];
Page(app.BP({
    data: {
        tabHeight: 106,
        record: false,
        commission: false
    },
     
    onLoad: function (options) {
        console.log('optionsoptions', options)
        this.options = options;
        this.currentTab = options.currentIndex || 0;
        this.currentSwiper = options.currentIndex || 0;
        this.dateType = options.dateType || '';
        if (options.type == "record") {
            wx.setNavigationBarTitle({
                title: '申请提现记录'
            })
            this.setData({
                tabs: tabs_records,
                record: true,
                pageType: options.type
            })
        } else if(options.type == "share"){
            wx.setNavigationBarTitle({
                title: '我的分享'
            })
            this.setData({
                tabs: tabs_share,
                pageType: options.type
            })
        }else {
            wx.setNavigationBarTitle({
                title: '订单'
            })
            this.setData({
                tabs: tabs_staff,
                pageType: options.type || "commission"
            })
        }
        let initInfo = app.Conf || {};
        let staffConf = initInfo.staffConf || {};
        this.setData({
            fromUserId: options.fromUserId || 0,
            commission: options && options.type == 'commission' ? true : false,
            staffConf: initInfo.staffConf || {},
            order_detail_mod: staffConf.orderDetail || {},
            order_list_mod: staffConf.orderList || {},
            currentTab: this.currentTab,
            currentSwiper: this.currentSwiper,
            dateType: this.dateType,
            buttonIndex: this.dateType && this.dateType == 1 ? 'month' : this.dateType && this.dateType == 2 ? 'week' : '',
        })
    },
    onReady() {
        this.list = this.selectComponent('#list');
        if (this.currentTab == 0) {
            this.list.init(this.currentTab);
        }
    },
    handleSwitch(e) {
        this.setData({
            currentSwiper: e.detail
        })
    },
    handleSwiperCurrent(e) {
        this.setData({
            currentTab: e.detail
        })
    },
}))