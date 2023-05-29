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
        pageType: {
            type: String,
            value: ''
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
        recordName: ["申请中", "审批成功", "审核失败", "", "已转账"],
        my_share_tab:[[{name:"生成卡片数",key:"create_poster_count"},{name:"分享链接次数",key:"create_share_count"},{name:"总分享数",key:"create_sum"}],
            [{name:"卡片访问人数",key:"from_poster_uv"},{name:"链接访问人数",key:"from_share_uv"},{name:"总访问人数",key:"from_sum"}]
        ],
        selectedEmployeesList: [], // 筛选已选择的店员列表
        staff_type: 0, // 店员: 0, 店长: 1
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
        getUserStaffType.call(this);
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
                this._selectedEmployeesList = this.data.selectedEmployeesList
                if (this.quickTemp[0] && this.quickTemp[1]) {
                    reset.call(this, true);
                    this.quick = this.quickTemp;
                    this.setData({
                        buttonIndex: 'set'
                    })
                    loadData.call(this, this.currentIndex);
                } else if(this.quickTemp[0] || this.quickTemp[1]) {
                    app.SMH.showToast({
                        title: '请设置完整的自定义时间'
                    })
                    return
                } else {
                    reset.call(this, true);
                    loadData.call(this, this.currentIndex);
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
            if(this.data.pageType == 'share')return
            let dataset = e.currentTarget.dataset || {};
            let sn = dataset.sn || "";
            let price = dataset.price || "0.00";
            let relationType = dataset.relation_type || "";
            if (sn) {
                wx.navigateTo({
                  url: `/pages/micro_mall/employee_center/distribution_orders_detail/distribution_orders_detail?sn=${sn}&staffPrice=${price}&showCommAmount=${this.data.order_detail_mod.commAmount || '0'}&commission=${this.data.commission}&relationType=${relationType}&pageType=${this.data.pageType}`,
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
        handleEmployeeSelectorOpen(){
            this.staffSelector = this.staffSelector || this.selectComponent("#staffSelector");
            this.staffSelector && this.staffSelector.activate();
        },
        handleSelectFinished(e){
            console.log("完成选择", e)
            let selectedEmployeesList = e.detail || [];
            this.setData({selectedEmployeesList}) 
        }
    }
}))

function initHeight() {
    this.setData({
        swiperHeight: `calc(100% - ${this.data.tabHeight}rpx);`
    })
    this.setData({
        scrollHeight: this.data.pageType == 'record' ? '100%' : `calc(100% - 100rpx);`
    })
}

function loadData(type = 0, dateType) {
    if (this.hasMore[type] && !this.isLoading[type] && this.reflash[type]) {
        let typeParam;
        this.isLoading[type] = true;
        if (this.data.pageType == 'commission') {
            if (type == 1) {
                typeParam = 5;
            } else if (type == 3) {
                typeParam = 1;
            } else {
                typeParam = type;
            }
        } else if (this.data.pageType == 'staff_commission') { // 店员收益，跟上面那个类似
            if (type == 1) {
                typeParam = 5;
            } else if (type == 3) {
                typeParam = 1;
            } else {
                typeParam = type;
            }
        } else if(this.data.pageType == 'record'){
            typeParam = type - 1;
            if (type == 4) {
                typeParam = type;
            }
        } else if(this.data.pageType == 'share'){
            typeParam = type - 1;
            if (type == 4) {
                typeParam = type;
            }
        }
        let date = [];
        let str = [`getApplyCashoutList`]
        if (this.data.pageType == 'commission') {
            str = [`getStaffCommOrderList`]
        } else if (this.data.pageType == 'staff_commission'){
            str = [`getStaffAmountOrderList`]
        } else if (this.data.pageType == 'share') {
            str = [`getStaffUserReport`]
        }
        let dataTemp = new Date();
        let endDate = (this.quick && this.quick[1]) || (dataTemp.getFullYear() + '-' + (dataTemp.getMonth() + 1) + '-' + dataTemp.getDate() + ' 23:59:59');
        let staffIds = (this._selectedEmployeesList || []).map(item => item.staffId).join(",");
        selectLoadData.call(this, str, type, typeParam, endDate,dateType,staffIds).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                let dataList = [];
                if (this.data.pageType == 'commission' || this.data.pageType == 'staff_commission') {
                    dataList = data && data.comm_records || [];
                    this.records[type] = (data && data.records || 0);
                    this.hasMore[type] = this.page[type] * app.Conf.PAGE_SIZE < data.records;
                    this.total_order_amount[type] = (data && data.total_order_amount || 0);
                } else if(this.data.pageType == 'record'){
                    dataList = data && data.list || [];
                    this.records[type] = data && data.count || 0;
                    this.hasMore[type] = this.page[type] * app.Conf.PAGE_SIZE < data.count;
                } else if(this.data.pageType == 'share'){
                    let tempArr = [];
                    data.create_sum = parseInt(data.create_poster_count+data.create_share_count);
                    data.from_sum = data.total_visit_uv || 0;
                    tempArr.push(data);
                    dataList.push(tempArr,tempArr);
                    this.records = [data.create_sum,data.from_sum]
                    this.hasMore=[false,false]
                    this.setData({
                        dataList,
                        records:this.records,
                        none:[false,false]
                    })
                    return
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
        loadData.call(this, this.currentIndex,'today');
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


function selectLoadData(str, type, typeParam, endDate,dateType,staffIds) {
    let obj = {};
    obj = {
        // userToken:  app.LM.userToken || "",
        // brandCode: app.Conf.BRAND_CODE,
        pageIndex: this.page[type] || 1,
        pageSize: app.Conf.PAGE_SIZE,
    }
    obj.manageStoreId = (app.LM.storeInfo && app.LM.storeInfo.manageStoreId) || app.StoreH.storeId || "";
    staffIds && (obj.staffIds = staffIds);
    if (str && (this.data.pageType == 'commission' || this.data.pageType == 'staff_commission') ) { //分销订单
        obj.beginDate = encodeURIComponent((this.quick && this.quick[0]) || '2018-1-1 00:00:00');
        obj.endDate = encodeURIComponent((this.quick && this.quick[1]) || endDate);
        obj.sType = typeParam;
        obj.fromUserId = this.properties.fromUserId || 0
    } else if (str && this.data.pageType == 'record') { //提现记录
        obj.status = typeParam;
    } else if (str && this.data.pageType == 'share') { //分享记录
        obj = {
            userToken:  app.LM.userToken || "",
            brandCode: app.Conf.BRAND_CODE,
            isToday:dateType == 'today'?1:0,
            begin :dateType == 'today'?0:encodeURIComponent((this.quick && this.quick[0]) || '2018-1-1 00:00:00'),
            end : dateType == 'today'?23:encodeURIComponent((this.quick && this.quick[1]) || endDate),
        }; 
    }
    return app.CL_StoreCommApi[str]({
        params: obj,
        other: {
            isShowLoad: true
        }
    }).then(res => {
        return Promise.resolve(res)
    })
}

// 该用户是否店长
function getUserStaffType(){
    return app.LM.checkIfStore().then(data => {
        data = data || app.LM.storeInfo;
        console.log("检测店员", data);
        if (data && data.staff_id && data.staff_type != undefined){
            this.setData({
                staff_type: data.staff_type
            })
          return Promise.resolve(data.staff_type)
        } else return Promise.reject(0)
      }).catch(e => Promise.reject("获取店员信息出错", e))
}