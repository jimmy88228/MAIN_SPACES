// pages/micro_mall/prepaid/prepaid_card_erp.js
import Utils from "../../../../common/support/utils/utils";
var app = getApp();
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        showCard: true,
        showCodeBtn: "1",
        shopIcon: '',
    },
    onShow() {
        loadData.call(this);
        loadStoredValueActivity.call(this);
        app.sysTemConfig("is_show_storevalue_password").then(data => {
            this.setData({
                showCodeBtn: data.Value || 0,
                shopIcon: this.data.brand_info.icon_url + "micro_mall/left_menu.png"
            })
        })
        app.sysTemConfig("show_stored_value_activity_entrance").then(data => {
            this.setData({
                showRecharge: data == null ? 1 : data.Value || 0
            })
        })
    },
    onReady: function () {
        this.cardCode = this.cardCode || this.selectComponent("#cardCode");
        let headerImg = this.data.brand_info.logo_path + "micro_mall/applet_logo.png";
        let telephoneIcon = this.data.brand_info.icon_url + "micro_mall/perpaid/telephone_icon.png";
        this.setData({
            headerImg,
            telephoneIcon
        });
    },
    checkRecode: function () {
        wx.navigateTo({
            url: '/pages/micro_mall/prepaid/erp/prepaid_card_erp_detail?storeValue=' + this.data.storedValue
        });
    },
    jumpDetails() {
        wx.navigateTo({
            url: `/pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge?activityId=${this.data.activityId}&type=recharge`
        });
    },
    showCode() {
        controlClick.call(this, () => {
            this.cardCode.show();
            this.cardCode.getCaptcha();
        });
    },
    goToBind() {
        wx.navigateTo({
            url: '/pages/micro_mall/user_info/user_info'
        });
    },
    handleSelectShop() {
        wx.navigateTo({
            url: '/pages/micro_mall/stores/store_nav?value=none',
        })
    }
}))
function loadData() {
    return app.UserApi.getUserStoredValueInfo({
        params: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            this.setData({ //当前活动的ID，为0 表示没正在进行的充值活动
                cardNum: data.cardNum,
                mobilePhone: data.mobilePhone,
                storedValue: data.storedValue,
                showCard: false
            });
            return Promise.resolve(data);
        } else {
            return Promise.reject(res);
        }
    });
}
function loadStoredValueActivity() {
    return app.UserApi.getCurrentStoredValueActivity({
        params: {
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            console.log("getCurrentStoredValueActivity", res);
            let data = res.data || {};
            this.setData({
                activityId: data.activityId,
                noteImg: data.noteImg
            })
            return Promise.resolve(data);
        } else {
            return Promise.reject(res);
        }
    });
}

let controlClick = Utils.debounce(fn => {
    fn();
}, 400);