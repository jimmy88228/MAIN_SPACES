// pages/micro_mall/send_goods/send_goods_code.js
import {
    qrcode
} from "../../../common/utils/codeCanvas/index.js";
const app = getApp();
Page(app.BP({
    data: {
        isHidden: true,

    },
    onLoad: function(options) {
        this.options = options;
        // if (!app.LM.isLogin) { //记录没有登录访问的页面
        //     loginPageHandle.call(this);
        // } else {
        //     checkUserBindPhone.call(this).then(isBindPhone => {
        //         if (isBindPhone == 0) {
        //             loginPageHandle.call(this);
        //         }
        //     });
        // }
    },
    onShow: function() {
        loadSendCode.call(this);
    },
    refreshCode() {
        refreshSendCode.call(this);
    },
    pageJump(e){
      let dataset = e.currentTarget.dataset || {};
      if (!dataset.url) {return}
      switch (dataset.type){
        case "switchTab":
          wx.switchTab({
            url: dataset.url,
          })
          break;
        case  "redirect":
          wx.redirectTo({
            url: dataset.url,
          })
          break;
        default:
          wx.navigateTo({
            url: dataset.url,
          })
      }
    }
}))

function loadSendCode() {
    if(!app.LM.isLogin) return;
    return app.UserApi.getPickupCode({
        params: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            storeId: this.options.storeId || 0
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            qrcode('sendCode', e.data, 650, 650);
            this.setData({
                isHidden: false,
                sendCode: e.data
            });
            return Promise.resolve(e);
        } else {
            app.SMH.showToast({
                "title": e.msg
            });
        }
    })
}

function refreshSendCode() {
    return app.UserApi.refreshPickupCode({
        params: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            storeId: this.options.storeId || 0
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            this.setData({
              sendCode: e.data
            })
            qrcode('sendCode', e.data, 650, 650);
            return Promise.resolve(e);
        } else {
            app.SMH.showToast({
                "title": e.msg
            });
        }
    })
}

function checkUserBindPhone() {
    let isBindMobile = app.StorageH.get("isBindMobile") || 0;
    if (isBindMobile == 1) {
        return Promise.resolve(isBindMobile);
    }
    return app.UserApi.checkUserBindPhone({
        params: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            if (e.data == 1) {
                app.StorageH.set("isBindMobile", e.data);
            }
            return e.data;
        }
    });
}

function loginPageHandle() {
    let page = getCurrentPages().pop();
    let options = page.options;
    let route_param = "";
    for (let i in options) {
        if (route_param) {
            route_param += '&' + i + "=" + options[i];
        } else {
            route_param += '?' + i + "=" + options[i];
        }
    }
    let path = page.route + route_param;
    app.globalData.nextRoute = "/" + path;
    wx.redirectTo({
        url: '/pages/micro_mall/send_goods/login_page',
    });
}