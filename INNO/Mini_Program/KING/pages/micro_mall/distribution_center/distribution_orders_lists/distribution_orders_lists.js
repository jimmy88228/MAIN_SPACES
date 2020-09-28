const app = getApp();
Page(app.BP({
    data: {
        tabHeight: 106,
        record:false,
        tabs_staff: [{
            'num': '0',
            'value': '全部'
        }, {
            'num': '1',
            'value': '待付款'
        }, {
            'num': '2',
            'value': '结算中'
        }, {
            'num': '3',
            'value': '已完成'
        }, {
            'num': '4',
            'value': '售后'
        }, ],
        tabs_records: [{
            'num': '0',
            'value': '全部'
        }, {
            'num': '1',
            'value': '申请中'
        }, {
            'num': '2',
            'value': '审批成功'
        }, {
            'num': '3',
            'value': '审核失败'
        }, {
            'num': '4',
            'value': '已转账'
        }, ],
        commission:false
    },
    onLoad: function(options) {
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
                tabs: this.data.tabs_records,
                record:true
            })
        } else {
            wx.setNavigationBarTitle({
                title: '订单'
            })
            this.setData({
                tabs: this.data.tabs_staff
            })
        }
      let initInfo = app.Conf || {};
      let staffConf = initInfo.staffConf || {};
      this.setData({
        fromUserId: options.fromUserId || 0,
        commission:options && options.type == 'commission' ? true : false,
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