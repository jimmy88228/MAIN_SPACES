// pages/micro_mall/prepaid/prepaid_card_erp.js
import Utils from "../../../../support/utils/utils";
var app = getApp();
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        showCard: true,
        showCodeBtn: "1"
    },
    onShow() {
        loadData.call(this);
        app.sysTemConfig("is_show_storevalue_password").then(data=>{
          this.setData({
            showCodeBtn: data.Value || 0
          })
        })
        app.sysTemConfig("show_stored_value_activity_entrance").then(data=>{
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
    }
}))
function loadData() {
    return app.UserApi.getUserStoredValueInfo({
        params: {
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            this.setData({
                activityId: data.activityId, //当前活动的ID，为0 表示没正在进行的充值活动
                cardNum: data.cardNum,
                mobilePhone: data.mobilePhone,
                storedValue: data.storedValue,
                noteImg: data.noteImg,
                showCard: false
            });
            return Promise.resolve(data);
        } else {
            return Promise.reject(res);
        }
    });
}

let controlClick = Utils.debounce(fn => {
    fn();
}, 400);