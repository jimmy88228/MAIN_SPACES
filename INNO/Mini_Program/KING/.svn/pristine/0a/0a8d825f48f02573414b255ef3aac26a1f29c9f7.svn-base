const app = getApp();
var dateTimePicker = require('../../help/dateTimePicker.js');
Component(app.BTAB({
    properties: {
        tabs: {
            type: Array
        },
        current: {
            type: Number
        },
        tabHeight: {
            type: Number,
            value: 106
        },
        dateType: {
            type: String,
            value: ''
        },
        record: {
            type: Boolean,
            value: false
        },
        buttonIndex: {
            type: String,
            value: ''
        },
        order_list_mod: {
            type: Object,
            value: {}
        },
        order_detail_mod: {
            type: Object,
            value: {}
        },
        commission: {
            type: Boolean,
            value: false
        }, 
        fromUserId:{
           type: String,
           value: "0"
        } 
    },
    data: {
        reflash: [true, true, true, true, true],
        filter: false,
        startYear: 2000,
        endYear: 2050,
        dataList: [],
        records: [],
        none: [false, false, false, false, false],
        recordName: ["申请中", "审批成功", "审核失败", "", "已转账"]
    },

    ready() {
        let bInfo = this.data.brand_info || {};
        let bg_color = app.getColor(bInfo.style.bg_color, 0, 0, 0, 0.2);
        let staff_right = bInfo.icon_url + "micro_mall/staff/staff_right.png";
        this.setData({
            staff_right: staff_right,
            bg_color: bg_color
        })
        initHeight.call(this);
        //日期
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var lastArray = obj1.dateTimeArray.pop();
        var lastTime = obj1.dateTime.pop();
        this.setData({
            multiSelector_start: obj1.dateTimeArray,
            multiSelector_end: obj1.dateTimeArray,
            mul_array_start: obj1.dateTime,
            mul_array_end: obj1.dateTime
        });

        reset.call(this);
        check.call(this);
    },
    methods: {
        handleScroll(e) {
            let num = e.currentTarget.dataset.num;
            this.reflash[num] = true;
            loadData.call(this, num)
        },
        handleFilter(e) {
            if (e.currentTarget.dataset.type == 'today') {
                this.quickTemp = [];
                this.setData({
                    quickTemp: ''
                });
                reset.call(this);
                todayOrder.call(this, true);
                this.setData({
                    buttonIndex: 'today'
                })
            } else if (e.currentTarget.dataset.type == 'week') {
                this.quickTemp = [];
                this.setData({
                    quickTemp: ''
                });
                reset.call(this);
                weekOrder.call(this, true);
                this.setData({
                    buttonIndex: 'week'
                })
            } else if (e.currentTarget.dataset.type == 'month') {
                this.quickTemp = [];
                this.setData({
                    quickTemp: ''
                });
                reset.call(this);
                monthOrder.call(this, true);
                this.setData({
                    buttonIndex: 'month'
                })
            } else if (e.currentTarget.dataset.type == 'set') {
                if (this.quickTemp[0] && this.quickTemp[1]) {
                    reset.call(this, true);
                    this.quick = this.quickTemp;
                    this.setData({
                        buttonIndex: 'set'
                    })
                    loadData.call(this, this.currentIndex);
                } else {
                    app.SMH.showToast({
                        title: '请设置完整的自定义时间'
                    })
                    return
                }
            }
            this.setData({
                filter: !this.data.filter
            });
        },
        mul_change_start(e) {
            let tempArray = e.detail.value;
            let tempValue = this.data.multiSelector_start;
            this.quickTemp[0] = tempValue[0][tempArray[0]] + '-' + tempValue[1][tempArray[1]] + '-' + tempValue[2][tempArray[2]] + ' ' + tempValue[3][tempArray[3]] + ':' + tempValue[4][tempArray[4]];
            this.setData({
                mul_array_start: e.detail.value,
                [`quickTemp[${0}]`]: this.quickTemp[0]
            });
        },
        mul_change_end(e) {
            let tempArray = e.detail.value;
            let tempValue = this.data.multiSelector_end;
            this.quickTemp[1] = tempValue[0][tempArray[0]] + '-' + tempValue[1][tempArray[1]] + '-' + tempValue[2][tempArray[2]] + ' ' + tempValue[3][tempArray[3]] + ':' + tempValue[4][tempArray[4]];
            this.setData({
                mul_array_end: e.detail.value,
                [`quickTemp[${1}]`]: this.quickTemp[1]
            });
        },
        goDetail(e) {
            let dataset = e.currentTarget.dataset || {};
            let sn = dataset.sn || "";
            let price = dataset.price || "0.00";
            let relationType = dataset.relationType || "";
            if (sn) {
                wx.navigateTo({
                  url: `/pages/micro_mall/distribution_center/distribution_orders_detail/distribution_orders_detail?sn=${sn}&staffPrice=${price}&showCommAmount=${this.data.order_detail_mod.commAmount || '0'}&commission=${this.data.commission}&relationType=${relationType}`,
                })
            }
        },
        swiperChange(e) {
            this.triggerEvent('swiperCurrent', e.detail.current);
            this.currentIndex = e.detail.current;
            if (!this.first) {
                this.first = true;
                let _timer = setTimeout(() => {
                    clearTimeout(_timer);
                    loadData.call(this, e.detail.current);
                }, 800)
            } else {
                loadData.call(this, e.detail.current);
            }
        },
        init(e) {
            this.currentIndex = 0;
            if (!this.first) {
                this.first = true;
                let _timer = setTimeout(() => {
                    clearTimeout(_timer);
                    loadData.call(this, 0)
                }, 800)
            } else {
                loadData.call(this, 0)
            }
        },
    }
}))

function initHeight() {
    this.setData({
        swiperHeight: `calc(100% - ${this.data.tabHeight}rpx);`
    })
    this.setData({
        scrollHeight: this.data.record ? '100%' : `calc(100% - 100rpx);`
    })
}

function loadData(type = 0, reflash = true) {
    if (this.hasMore[type] && !this.isLoading[type] && this.reflash[type]) {
        let typeParam;
        this.isLoading[type] = true;
        if (!this.data.record) {
            if (type == 1) {
                typeParam = 5;
            } else if (type == 3) {
                typeParam = 1;
            } else {
                typeParam = type;
            }
        } else {
            typeParam = type - 1;
            if (type == 4) {
                typeParam = type;
            }
        }
        let date = [];
        let str = [`staffCommOrderList`]
        if (this.data.record) {
            str = [`cashOutList`]
        }
        let dataTemp = new Date();
        let endDate = (this.quick && this.quick[1]) || (dataTemp.getFullYear() + '-' + (dataTemp.getMonth() + 1) + '-' + dataTemp.getDate() + ' 23:59:59');
        // app.DistrApi[str]({
        //     params: {
        //         beginDate: !this.data.record ? (this.quick && this.quick[0] || '2018-1-1 00:00:00') : '',
        //         endDate: !this.data.record ? (this.quick && this.quick[1] || endDate) : '',
        //         sType: !this.data.record ? typeParam : '',
        //         status: !this.data.record ? '' : typeParam,
        //         userToken: app.LM.userToken || "",
        //         brandCode: app.Conf.BRAND_CODE,
        //         pageIndex: this.page[type] || 1,
        //         pageSize: app.Conf.PAGE_SIZE,
        //     },
        //     other: {
        //         isShowLoad: true
        //     }
        // })
        selectLoadData.call(this, str, type, typeParam, endDate).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                let dataList = [];
                if (!this.data.record) {
                    dataList = data && data.comm_records || [];
                    this.records[type] = (data && data.records || 0);
                    this.hasMore[type] = this.page[type] * app.Conf.PAGE_SIZE < data.records;
                    this.total_order_amount[type] = (data && data.total_order_amount || 0);
                } else {
                    dataList = data && data.data || [];
                    this.records[type] = data && data.totals || 0;
                    this.hasMore[type] = this.page[type] * app.Conf.PAGE_SIZE < data.totals;
                }
                this.page[type] += 1;
                this.setData({
                    [`dataList[${type}]`]: [...this.data.dataList[type], ...dataList],
                    [`records[${type}]`]: this.records[type],
                    [`total_order_amount[${type}]`]: this.total_order_amount[type],
                    [`none[${type}]`]: this.records[type] <= 0
                })
            }
            return res
        }).finally(() => {
            this.isLoading[type] = false;
            this.reflash[type] = false;
            console.log('status:', this.page, this.reflash, this.isLoading, this.hasMore);
            console.log('page', 'reflash', 'load', 'more')
        })
    }

}


function reset(quick = false) {
    if (!quick) {
        this.quick = [];
        this.quickTemp = [];
    }
    this.page = [];
    this.reflash = [];
    this.isLoading = [];
    this.hasMore = [];
    this.dataList = [];
    this.records = [];
    this.total_order_amount = [];
    for (let item in this.data.tabs) {
        this.page.push(1);
        this.reflash.push(true);
        this.isLoading.push(false);
        this.dataList.push([]);
        this.hasMore.push(true);
        this.records.push('');
        this.total_order_amount.push('');
    }
    this.setData({
        dataList: this.dataList,
        records: this.records,
        total_order_amount: this.total_order_amount
    })
}

function check() {
    if (this.quick.length > 0) {
        console.log('有设值', this.quick)
    } else if (this.data.dateType) {
        console.log('有传值', this.data.dateType);
        let num = this.data.dateType;
        if (num == 0) {} else if (num == 1) {
            this.setData({
                buttonIndex: 'month'
            })
            monthOrder.call(this);
        } else if (num == 2) {
            this.setData({
                buttonIndex: 'week'
            })
            weekOrder.call(this);
        }
    } else {
        console.log('非日期搜索')
    }
}


// 今日 按钮
function todayOrder(goLoad = false) {
    var myDate = new Date();
    var ifromTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 00:00:00';
    var itoTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 23:59:59';
    this.quick[0] = ifromTime;
    this.quick[1] = itoTime;
    if (goLoad) {
        loadData.call(this, this.currentIndex);
    }
}
// 本月 按钮
function monthOrder(goLoad = false) {
    var myDate = new Date();
    var ifromTime = getMonthFirstDay.call(this) + ' 00:00:00';
    var itoTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 23:59:59';
    this.quick[0] = ifromTime;
    this.quick[1] = itoTime;
    if (goLoad) {
        loadData.call(this, this.currentIndex);
    }
}
// 本周按钮
function weekOrder(goLoad = false) {
    var myDate = new Date();
    var ifromTime = getWeekFirstDay.call(this) + ' 00:00:00';
    // var ifromTime = this.getWeekFirstDay() + ' 00:00:00';
    var itoTime = myDate.toLocaleDateString().replace(/\//g, '-') + ' 23:59:59';
    this.quick[0] = ifromTime;
    this.quick[1] = itoTime;
    if (goLoad) {
        loadData.call(this, this.currentIndex);
    }
}

// 本周第一天
function getWeekFirstDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    var M = Number(WeekFirstDay.getMonth()) + 1;
    return WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate();
}
// 获取本月第一天
function getMonthFirstDay() {
    var Nowdate = new Date();
    var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
    var M = Number(MonthFirstDay.getMonth()) + 1
    return MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
}


function selectLoadData(str, type, typeParam, endDate) {
    let obj = {};
    obj = {
        userToken:  app.LM.userToken || "",
        brandCode: app.Conf.BRAND_CODE,
        pageIndex: this.page[type] || 1,
        pageSize: app.Conf.PAGE_SIZE,
    }
    if (str && !this.data.record) { //分销订单
        obj.beginDate = encodeURIComponent((this.quick && this.quick[0]) || '2018-1-1 00:00:00');
        obj.endDate = encodeURIComponent((this.quick && this.quick[1]) || endDate);
        obj.sType = typeParam;
        obj.fromUserId = this.properties.fromUserId || 0
    } else if (str && this.data.record) { //提现记录
        obj.status = typeParam;
    }
    return app.DistrApi[str]({
        params: obj,
        other: {
            isShowLoad: true
        }
    }).then(res => {
        return Promise.resolve(res)
    })
}