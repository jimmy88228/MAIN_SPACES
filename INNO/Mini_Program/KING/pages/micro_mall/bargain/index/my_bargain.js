// pages/micro_mall/bargain/index/my_bargain.js
var app = getApp();
Page(app.BP({
    data: {
        jumpType: "custom",
        // 查询状态，-1全部，0进行中，2已失效
        bargainTab: [
            {
                name: "全部",
                sign: 0,
                width: "30%",
                left: "0",
                status: "-1"
            },
            {
                name: "砍价中",
                sign: 1,
                width: "40%",
                left: "30%",
                status: "0"
            },
            {
                name: "已失效",
                sign: 2,
                width: "30%",
                left: "70%",
                status: "2"
            }
        ],
        curIndex: 0,
        myBargainList: [],
        activityStatus: {
            0: "砍价中",
            1: "砍价成功",
            2: "已失效",
            3: "无库存"
        },
        // 查询状态
        status: -1,
        isEmpty: false
    },
    onLoad: function (options) {
        resetData.call(this);
        this.tababr = this.selectComponent("#custom_tabbar");
    },
    onShow: function () {
        this.iniTabbar(this.data.brand_info);
        loadData.call(this);
    },
    onHide() {
        resetData.call(this);
    },
    onPullDownRefresh: function () {
        resetData.call(this);
        loadData.call(this);
        let _timer = setTimeout(() => {
            clearTimeout(_timer);
            wx.stopPullDownRefresh();
            app.SMH.showToast({
                "title": "刷新成功"
            });
        }, 500);
    },
    onReachBottom: function () {
        if (this.hasMore) {
            loadData.call(this);
        } else {
            app.SMH.showToast({
                "title": "已经到底啦！"
            });
        }
    },
    iniTabbar(brand_info) {
        this.tababr.setTabbar([{
            "pagePath": "pages/micro_mall/bargain/index/bargain_index",
            "text": "砍价首页",
            "iconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHome.png",
            "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHomeActive.png",
            "is_this_page": false,
            "select_color": brand_info.style.bargain_color.theme_color,
            "is_original_tab": false
        },
        {
            "pagePath": "pages/micro_mall/bargain/index/my_bargain",
            "text": "我的砍价",
            "iconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/myBargin.png",
            "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/myBarginActive.png",
            "is_this_page": true,
            "select_color": brand_info.style.bargain_color.theme_color,
            "is_original_tab": false,
            "need_login": true
        }
        ]);
    },
    selectList(e) {
        let sign = e.currentTarget.dataset.sign;
        let status = e.currentTarget.dataset.status;
        this.setData({
            curIndex: sign,
            status: status
        });
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        resetData.call(this);
        loadData.call(this);
    },
    toBuy(e) {
        let userActivityId = e.currentTarget.dataset.userActivityId;
        wx.navigateTo({
            url: `/pages/micro_mall/bargain/bargain/order_detail?userActivityId=${userActivityId}`
        });
    },
    inviteFriend(e) {
        let userActivityId = e.currentTarget.dataset.userActivityId;
        wx.navigateTo({
            url: `/pages/micro_mall/bargain/bargain/bargain_detail?userActivityId=${userActivityId}`
        });
    },
    toOrderDetails(e) {
        let relatedOrderId = e.currentTarget.dataset.relatedOrderId;
        wx.navigateTo({
            url: `/pages/micro_mall/order/order_info?order_id=${relatedOrderId}`
        });
    },
    waitPay(e) {
        let userActivityId = e.currentTarget.dataset.userActivityId;
        let orderId = e.currentTarget.dataset.orderId;
        if (orderId > 0) {
            // 创建过订单，跳转至确认订单
            wx.navigateTo({
                url: `/pages/micro_mall/bargain/bargain/order_confirm?userActivityId=${userActivityId}`
            });
        } else {
            // 没创建过，直接订单详情
            wx.navigateTo({
                url: `/pages/micro_mall/bargain/bargain/order_detail?userActivityId=${userActivityId}`
            });
        }
    },
    jumpToDetails(e) {
        let userActivityId = e.currentTarget.dataset.userActivityId;
        wx.navigateTo({
            url: `/pages/micro_mall/bargain/bargain/bargain_detail?userActivityId=${userActivityId}`
        });
    }
}))
function loadData() {
    if (!this.loading) {
        this.loading = true;
        return app.BargainApi.getUserHagglePriceActivityList({
            params: {
                userToken: app.LM.userToken,
                brandCode: app.Conf.BRAND_CODE,
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                status: this.data.status
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data;
            if (res.code == 1) {
                let currentPage = this.data.myBargainList;
                let totalCount = data.totalCount;
                let newData = data.dataList;
                if (this.page > 1) {
                    newData = currentPage.concat(newData);
                }
                this.setData({
                    myBargainList: newData,
                    totalCount: data.totalCount
                });
                if (this.data.myBargainList.length === totalCount) {
                    this.hasMore = false;
                }
                this.setData({
                    isEmpty: this.data.myBargainList.length == 0 ? true : false
                });
                return Promise.resolve(data);
            } else {
                app.SMH.showToast({
                    "title": res.msg
                });
                return Promise.reject(res);
            }
        }).finally(() => {
            this.loading = false;
            this.page += 1;
        });
    }
}

function resetData() {
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
}