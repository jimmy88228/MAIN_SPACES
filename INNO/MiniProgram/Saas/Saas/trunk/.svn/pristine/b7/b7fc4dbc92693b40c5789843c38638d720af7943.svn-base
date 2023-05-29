// pages/micro_mall/lottery/lottery_record/lottery_record.js
import LIST from "../lottery-config.js";
let globalOptions = {};
const app = getApp();
Page(app.BTAB({
    data: {
        winningRecord: [],
        signs: true,
        toShow: false,
        currentRecordId: 0
    },
    onLoad: function (options) {
        globalOptions = options;
    },
    onShow: function () {
        this.hasMore = true;
        this.page = 1;
        loadData.call(this);
    },
    onReady() {
        let _timer = setTimeout(() => {
            clearTimeout(_timer);
            app.EB.call("resetData", this);
        }, 200);
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
    onHide() {
        this.setData({
            toShow: false
        });
    },
    onUnload() {
        this.setData({
            toShow: false
        });
    },
    jumpPage(e) {
        let dataset = e.currentTarget.dataset || {};
        let path = dataset.path;
        let prizeType = dataset.prizeType;
        let winningRecordId = dataset.recordId;
        let status = dataset.status;
        let activityId = globalOptions.activityId || dataset.activityId;
        let mainOrderId = dataset.mainOrderId || 0;
        let expressNo = dataset.expressNo || ""
        this.setData({
            currentRecordId: winningRecordId,
            currentStatus: status
        });
        if (prizeType == 3) {
            let path = ""
            if(mainOrderId && !expressNo){
                wx.navigateTo({
                    url: `/pages/micro_mall/order/order_info?order_id=${mainOrderId}`
                });
                return;
            }
            if (status == 0) {
                path = `/pages/micro_mall/lottery/confirm_prize/confirm_prize?winningRecordId=${winningRecordId}&activityId=${activityId}`;
                wx.navigateTo({
                    url: path
                });
            } else {
                path = `/pages/micro_mall/lottery/confirm_prize/confirm_prize?winningRecordId=${winningRecordId}&activityId=${activityId}`;
                wx.navigateTo({
                    url: path
                });
            }
            return;
        }
        if (path !== "") {
            wx.navigateTo({
                url: path
            });
        }
    },
    _noFn() { },
    filtrate(e) {
        this.setData({
            toShow: !this.data.toShow
        });
    },
    handle_filtrate(e) {
        let type = e.currentTarget.dataset.type;
        let activityId = globalOptions.activityId;
        if (type == 1) {
            let winningRecordId = this.data.currentRecordId;
            let path = `/pages/micro_mall/lottery/confirm_prize/confirm_prize?winningRecordId=${winningRecordId}&activityId=${activityId}`;
            wx.navigateTo({
                url: path
            });
        } else if (type == 2) {
            wx.navigateTo({
                url: "/pages/micro_mall/lottery/confirm_prize/store_confirm"
            });
        } else if (type == 3) {
            this.setData({
                toShow: !this.data.toShow
            });
        }
    }
}))
function loadData() {
    return app.LotteryApi.userLotteryWinningRecord({
        params: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            activityId: globalOptions.activityId || 0,
            pageIndex: this.page,
            pageSize: app.Conf.PAGE_SIZE
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            let currentPage = this.data.winningRecord;
            let totalCount = data.totalCount;
            let newData = data && data.dataList.map(item => {
                let [tips, bg, path] = ["", "", ""];
                if (item.prizeType == 3) {
                    tips = LIST.prizeBtnStatus[item.status];
                    if (item.status == 0) {
                        bg = "#e21a29";
                    } else {
                        bg = "#009944";
                    }
                } else if (item.status == 1 && item.prizeType !== 3) {
                    bg = "#009944";
                    tips = LIST.prizeStatus["-2"];
                    if (item.prizeType == 1) {
                        // 积分
                        path = "/pages/micro_mall/integral/my_integral";
                    } else if (item.prizeType == 2) {
                        // 优惠券
                        path = "/pages/micro_mall/coupon/my_coupon";
                    } else if(item.prizeType == 5){ 
                        path = "/pages/micro_mall/red_packet/red_balance/red_balance";
                    }
                } else {
                    tips = LIST.prizeStatus[item.status];
                    bg = "#009944"
                }
                return Object.assign(item, {
                    tips,
                    bg,
                    path
                });
            }) || [];
            if (this.page > 1) {
                newData = currentPage.concat(newData);
            }
            this.setData({
                winningRecord: newData
            });
            if (this.data.winningRecord.length == totalCount) {
                this.hasMore = false;
            }
            if (this.data.winningRecord.length == 0) {
                this.setData({
                    signs: false
                });
            } else {
                this.setData({
                    signs: true
                });
            }
        }
    }).finally(() => {
        this.page += 1;
    });
}
