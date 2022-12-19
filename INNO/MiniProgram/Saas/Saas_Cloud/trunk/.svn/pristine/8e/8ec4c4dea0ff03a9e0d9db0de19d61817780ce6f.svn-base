// pages/micro_mall/lottery/confirm_prize/confirm_prize.js
let globalOptions = {};
const app = getApp();
import LIST from "../lottery-config.js";
Page(app.BTAB({
    data: {
        iconUrl: app.Conf.ICON_URL
    },
    onLoad: function (options) {
        this.loading = false;
        globalOptions = options;
    },
    onShow: function () {
        // loadData.call(this);
    },
    onUnload() {
        
    },
    confirm() {
        
    }
}))
function loadData() {
    return app.CL_LotteryApi.lotteryWinningRecordDetail({
        params: {
            activityId: globalOptions.activityId || 0,
            winningRecordId: globalOptions.winningRecordId || 0
            // userToken: app.LM.userToken,
            // brandCode: app.Conf.BRAND_CODE,
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            let addressDetail = data.province + data.city + data.district + data.address;
            this.setData({
                consignee: data.consignee || '',
                mobileNo: data.mobileNo || '',
                addressDetail: addressDetail || '',
                prizeImg: data.prizeImg,
                prizeName: data.prizeName,
                addressId: data.addressId || 0,
                status: data.status || 0,
                expressNo: data.expressNo || '',
                createTime: data.createTime,
                statusText: LIST.prizeStatus[data.status] || ''
            });
        }
    });
}

function receivePrize() {
    if (!this.loading) {
        this.loading = true;
        return app.CL_LotteryApi.receivePrize({
            data: {
                addressId: this.data.addressId || 0,
                winningRecordId: globalOptions.winningRecordId || 0
                // userToken: app.LM.userToken,
                // brandCode: app.Conf.BRAND_CODE,
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data;
            if (res.code == 1) {
                app.SMH.showToast({
                    "title": "领取成功"
                });
            } else {
                app.SMH.showToast({
                    "title": "领取失败"
                });
            }
        }).finally(() => {
            this.loading = false;
            loadData.call(this);
        });
    }
}