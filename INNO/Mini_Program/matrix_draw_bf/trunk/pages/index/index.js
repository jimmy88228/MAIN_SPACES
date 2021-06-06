// import MyDate from "../../common/support/utils/date-util";
// import LM from "../../common/manager/login-manager";
// import Sub from "../../common/helper/subscribe-helper";
// import Smm from "../../common/helper/show-msg-helper";

// const app = getApp();
// Page.BasePage({
//     onLoad() {
//         this.configuration({ autoSetPageScroll: true });
//         Object.defineProperties(this, {
//             dialog: { get: () => this.findView("#dialog", "useDialog") }
//         });
//     },
//     onReady() {
//         this.setData({ isAttached: true, showRefresh: true });
//         LM.login(false)
//             .ignore(() => this.refresh());
//         this.isInited = true;
//     },
//     onShow() {
//         this.isInited && this.checkLoginChange();
//     },
//     onPullDownRefresh() {
//         this.refresh();
//     },
//     refresh() {
//         this.checkLoginChange();
//         this.loadData().finally(() => {
//             wx.stopPullDownRefresh();
//             this.setData({ showRefresh: false });
//         });
//     },
//     loadData() {
//         let token = this.token;
//         return Promise.all([getHomeActivitys(token), getLayout()]).then(res => {
//             let acts = res[0] || {};
//             this.setData({
//                 actList: transformActs.call(this, acts.openingActs),
//                 saleList: transformPreSaleActs.call(this, acts.beforeActs),
//                 periodList: transformActs.call(this, acts.pastActs),
//                 layoutData: res[1] || []
//             })
//         }).showError();
//     },
//     onAuthed() {
//         this.checkLoginChange();
//         if (this.isLogin) {
//             Smm.showToast({
//                 title: "授权成功，请再次订阅",
//                 duration: 3000
//             })
//         }
//     },
//     onSubTap(e) {
//         if (!app.clickHold("lockSub")) return;
//         let data = e.currentTarget.dataset;
//         let index = data.index;
//         let token = this.token;
//         let keyId = data.id;
//         let toSubscribe = !data.isSubscribe;
//         Sub.setSubscribe(token, "DRAW_START", toSubscribe, { keyId })
//             .then(isSub => this.setData({ [`saleList[${index}].isSubscribe`]: isSub }),
//                 err => Sub.showSettingsDialog(this.dialog, err))
//             .showError();
//     }
// });

// function transformPreSaleActs(data) {
//     data && data.forEach(item => {
//         item.date = `${MyDate.formatStr(item.startTime, "MM/dd")}`;
//         let estimate = `${MyDate.formatStr(item.startTime, "HH")}`;
//         let estimateHh = estimate == 12 ? 12 : parseInt(`${MyDate.formatStr(item.startTime, "hh")}`);
//         let estimateName = "";
//         if (estimate >= 0 && estimate < 12) {
//             estimateName = "上午";
//         } else if (estimate >= 12 && estimate < 14) {
//             estimateName = "中午";
//         } else if (estimate >= 14 && estimate < 18) {
//             estimateName = "下午";
//         } else if (estimate >= 18 && estimate < 24) {
//             estimateName = "晚上";
//         }
//         item.dateTime = `${estimateName}${estimateHh}:${MyDate.formatStr(item.startTime, "mm")}`;
//     });
//     return data;
// }

// function transformActs(data) {
//     data && data.forEach(item => {
//         if(MyDate.formatStr(item.startTime, "yyyy.MM.dd") != MyDate.formatStr(item.endTime, "yyyy.MM.dd")){
//             item.date = `${MyDate.formatStr(item.startTime, "yyyy.MM.dd")}-${MyDate.formatStr(item.endTime, "MM.dd")}`;
//         }else{
//             item.date = MyDate.formatStr(item.startTime, "yyyy.MM.dd");
//         }
//     });
//     return data;
// }


// function getHomeActivitys(userToken) {
//     const brandCode = app.Conf.BRAND_CODE;
//     return app.DrawApi.getHomeActivitys({
//         params: { userToken, brandCode }
//     }).netData();
// }

// function getLayout() {
//     const brandCode = app.Conf.BRAND_CODE;
//     return app.LayoutApi.getLayoutByToken({
//         params: { token: "HOME_AD", brandCode }
//     }).netData(null);
// }



import LM from "../../common/manager/login-manager";
const app = getApp();
Page.BasePage({
    data(){
        extraH:0
    },
    onLoad(options) {
        this.setData({
            isAttached: true,
            showRefresh: true
        });
        LM.login(false)
            .ignore(() => {
                console.log('进来index LM.login ignore')
                this.setData({
                    showRefresh: false,
                    isLogin:app.LM.isLogin
                });
                // this.mcPage = this.mcPage || this.selectComponent("#mcPage");
                // this.mcPage.getPageData(this.options);
            });
    },
    onShow() {

    },
    onReady() {
        // this.setData({
        //     isAttached: true,
        //     showRefresh: true
        // });
        // LM.login(false)
        //     .ignore(() => {
        //         this.setData({
        //             showRefresh: false,
        //             isLogin:app.LM.isLogin
        //         });
        //         // this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        //         // this.mcPage.getPageData(this.options);
        //     });
    },
    data() {

    },
    onAuthed(){
        console.log('onAuthed',app.LM.isLogin,app.LM.userToken)
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
    onReachBottom(){
        this.mcPage.reachBottom('callEvent');
    },
    onPageScroll(e){
      this.mcPage = this.mcPage || this.selectComponent("#mcPage");
      this.mcPage.handle_scroll(e&&e.scrollTop);
    },
})