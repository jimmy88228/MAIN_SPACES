// pages/draw/draw.js
// pages/micro_mall/lottery/lottery.js
// import LIST from "./lottery-config.js.js";
// import ImgLoader from "./img_loader/img_loader";
import MyDate from '../../common/support/utils/date-util.js';

const app = getApp();
Page.BasePage({
    data: {
        iconUrl: app.Conf.ICON_URL,
        isDecode: true,
        activityType: 0,
        lotteryInfo: {},
        activityId: 0,
        isHided: false,
        isClosed: true,
        isLogin: app.LM.isLogin,
        isNeedBindPhone: false,
        showTips: false,
        // maskBg:"rgba(0, 0, 0, 0.4)",
    },
    onLoad: function (options) {
        this.options = options; 
        this.setData({ 
            isAttached: true,
            showRefresh: true, 
        })
    },
    onReady() { 
        app.LM.login(true).ignore(() => {
            setTimeout(() => {
                this.setData({
                    showRefresh: false 
                });
                this.checkLoginChange();
                let activityId = this.options.activityId || 0;
                this.draw_box = this.draw_box || this.selectComponent("#draw_box");
                this.draw_box._onShow(activityId);
            }, 500);
        })
    },
    onShow: function () {},
    onHide() {},
    onUnload() {},
    onShareAppMessage: function () {
        return {
            // isCustom: true,
            // title: this.data.shareTitle,
            // path: '/pages/micro_mall/lottery/lottery?activityId=' + this.options.activityId,
            // imageUrl: this.data.shareImg
        };
    },
    onPageScroll(e) { 
    }, 
})
 
 