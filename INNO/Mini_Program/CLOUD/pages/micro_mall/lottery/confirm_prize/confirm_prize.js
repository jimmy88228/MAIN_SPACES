// pages/micro_mall/lottery/confirm_prize/confirm_prize.js
let globalOptions = {};
const app = getApp();
import LIST from "../lottery-config.js";
Page(app.BTAB({
    data: {
        iconUrl: app.Conf.ICON_URL,
        isSelected: false
    },
    onLoad: function (options) {
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        this.loading = false;
        globalOptions = options;
        this.setData({
            rightbutton: rightbutton
        });
    },
    onShow: function () {
        loadData.call(this);
    },
    onUnload() {
        if (app.StorageH.get('userChoiceData')) {
            app.StorageH.remove('userChoiceData');
        }
    },
    confirm() {
        if (!this.data.isSelected) {
            app.SMH.showToast({
                "title": "请填写收货地址信息"
            });
            return;
        } else {
            receivePrize.call(this);
        }
    },
    changeAddress() {
        wx.navigateTo({
            url: '/pages/micro_mall/address/address_list'
        });
    },
    checkExpress(e){
      let dataset = e.currentTarget.dataset || {};
      let expressNo = dataset.expressNo || ""
      if (expressNo){
        wx.navigateTo({
          url: '/pages/micro_mall/shipping_info/shipping_info?type=LOTTERY&invoiceNo=' + expressNo + '&winningRecordId=' + this.data.winningRecordId
        });
      }
    }
}))
function loadData() {
    return app.LotteryApi.lotteryWinningRecordDetail({
        params: {
            activityId: globalOptions.activityId || 0,
            winningRecordId: globalOptions.winningRecordId || 0,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
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
                statusText: LIST.prizeStatus[data.status] || '',
                winningRecordId: data.winningRecordId
            });
            // 没有数据，从缓存读取
            if (this.data.addressDetail === "") {
                addressCache.call(this);
            } else {
                this.setData({
                    isSelected: true
                });
            }
        }
    });
}

function addressCache() {
    let userChoiceData = app.StorageH.get('userChoiceData') || {};
    if (userChoiceData && "selectAddr" in userChoiceData) {
        let selectAddr = userChoiceData["selectAddr"];
        let consignee = selectAddr.consignee;
        let addressId = selectAddr.address_id || 0;
        let province = selectAddr.province_str;
        let city = selectAddr.city_str;
        let district = selectAddr.district_str;
        let address = selectAddr.address;
        let mobileNo = selectAddr.mobile;
        let addressDetail = province + city + district + address;
        this.setData({
            consignee,
            mobileNo,
            addressDetail,
            addressId,
            isSelected: true
        });
    }
}

function receivePrize() {
    if (!this.loading) {
        this.loading = true;
        return app.LotteryApi.receivePrize({
            data: {
                addressId: this.data.addressId || 0,
                winningRecordId: globalOptions.winningRecordId || 0,
                brandCode: app.Conf.BRAND_CODE,
                userToken: app.LM.userKey
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