import LM from "../../common/manager/login-manager";
import { CountDown } from "../../common/helper/timer-manager";
import MyDate from "../../common/support/utils/date-util";
import SIH from "../../common/helper/sys-infos-helper";
import Sub from "../../common/helper/subscribe-helper";
import Smm from "../../common/helper/show-msg-helper";

const app = getApp();
Page.BasePage({
    data: {
        htmlDetails: "",
        canShow: false,
        allowJoin: false,
        isReachBottom: false,
        navH: SIH.navigationBarHeight || 100
    },
    onLoad(options) {
        wx.hideShareMenu();
        this.activityId = options.activityId;
        Object.defineProperties(this, {
            navBar: { get: () => this.findView("#nav-bar") },
            dialog: { get: () => this.findView("#dialog", "useDialog") }
        });
    },
    onReady() {
        this.setData({ isAttached: true, showRefresh: true });
        this.refresh();
        this.isInited = true;
    },
    onShow() {
        if (this.isInited && this.checkLoginChange()) {//登录状态改变时刷新
            this.loadData();
        }
    },
    onPullDownRefresh() {
        this.refresh();
    },
    refresh() {
        return LM.login(false).ignore(() => {
            this.checkLoginChange();
            return this.loadData();
        }).finally(() => {
            wx.stopPullDownRefresh();
            this.setData({ showRefresh: false });
        });
    },
    loadData() {
        let token = this.token;
        return getActivityInfo(token, this.activityId).then(data => {
            let act = data.activityInfo;
            let allowJoin = data.allowJoin;
            let isSubscribe = data.isSubscribe;

            let st = MyDate.parse(act.startTime);
            let et = MyDate.parse(act.endTime);
            let svt = MyDate.parse(act.serverTime);
            let state = 0;
            if (svt.getTime() < st.getTime()) {
                state = 1;
            } else if (svt.getTime() < et.getTime()) {
                state = 2;
            } else {
                state = 3;
            }
            let canShow = state > 1 && allowJoin;
            this.canShow = canShow;

            wx.pageScrollTo({
                scrollTop: 0
            });
            this.setData({
                act: data.activityInfo,
                state: state,
                canShow: canShow,
                isSubscribe: isSubscribe,
                showRefresh: false,//避免拿不到 组件
            });
            this.initPageScroll();
            if (canShow) {
                this.setCountDownData({ st, et, svt, state });
            } else {
                this.setCountDownData(null);
                this.loadActDetails();
            }
        }).showError();
    },
    loadActDetails() {
        return getActivityDetail(this.activityId)
            .then(data => data && this.setData({ htmlDetails: data }))
            .showError();
    },
    onHide() {
        stopCountDown.call(this);
    },
    onUnload() {
        stopCountDown.call(this);
    },
    onAuthed() {
        this.checkLoginChange();
        if (this.isLogin) {
            Smm.showToast({
                title: "授权成功，请再次订阅",
                duration: 3000
            })
        }
    },
    onSubTap() {
        if (!app.clickHold("lockSub")) return;
        let token = this.token;
        let keyId = this.activityId;
        let toSubscribe = !this.data.isSubscribe;
        Sub.setSubscribe(token, "SPECIAL_START", toSubscribe, { keyId })
            .then(isSub => this.setData({ isSubscribe: isSub }),
                err => Sub.showSettingsDialog(this.dialog, err))
            .showError();
    },
    setCountDownData(data) {
        if (data == null) {
            stopCountDown.call(this);
            return;
        }
        let state = data.state;
        if (state == 1 || state == 2) {
            let target;
            if (state == 1) {
                target = data.st;
            } else if (state == 2) {
                target = data.et;
            }
            startCountDown.call(this, data.svt, target, cd => {
                let day = Math.floor(cd.value / (60 * 60 * 24 * 1000));
                this.setData({
                    time: cd.format(day > 0 ? "dd天HH:mm:ss" : "HH:mm:ss")
                });
            }, () => {
                data.state++;
                this.setCountDownData(data)
            });
            this.setData({ state });
        } else {
            this.setData({ state });
            stopCountDown.call(this);
        }
    },
    onReachBottom() {
        this.scrollTopOnReachBottom = this._pageScrollTop;
        this.setData({ isReachBottom: true });
    },
    onPageScroll(event) {
        this._pageScrollTop = event.scrollTop;
        if (this.data.isReachBottom && this._pageScrollTop < this.scrollTopOnReachBottom) {
            this.setData({ isReachBottom: false });
        }
        this.handlePageScroll();
    },
    initPageScroll() {
        if (this.canShow) {
            wx.nextTick(() => {
                const query = wx.createSelectorQuery();
                query.select('#sticky-area').boundingClientRect((res) => {
                    let h = res && res.height || 0;
                    if (h > 0) {
                        this.stickyAreaHeight = h;
                    }
                    this.handlePageScroll();
                }).exec()
            });
        } else {
            this.handlePageScroll();
        }
    },
    handlePageScroll() {
        let scrollTop = this._pageScrollTop || 0;
        if (this.canShow) {
            let stickyAreaHeight = this.stickyAreaHeight || 0;
            let navigationBarHeight = app.SIH.navigationBarHeight;
            let dt = stickyAreaHeight - navigationBarHeight;
            let navBarOpacity;
            if (scrollTop <= 0) {
                navBarOpacity = 0;
            } else if (scrollTop > dt) {
                navBarOpacity = 1;
            } else {
                navBarOpacity = scrollTop / dt;
            }
            this.navBar.setOpacity(navBarOpacity);
        } else {
            this.navBar.setPageScrollTop(scrollTop);
        }
    },
});

function startCountDown(st, et, setTime, finishCb) {
    if (!this.countDown) {
        stopCountDown.call(this);
        this.countDown = new CountDown(st);
    }
    this.countDown.setTarget(et);
    setTime(this.countDown);
    if (!this.countDown.isRunning) {
        this.countDown.start(e => {
            if (e.value <= 0) {
                finishCb();
            }
            setTime(e);
        });
    }
}

function stopCountDown() {
    if (this.countDown) {
        this.countDown.stop();
    }
}

function getActivityInfo(userToken, activityId) {
    return app.SpecialApi.getActivityInfo({
        params: { userToken, activityId }
    }).netData();
}

function getActivityDetail(activityId) {
    return app.WebApi.getSpecialActivityDetails({
        params: { activityId }
    }).netData();
}