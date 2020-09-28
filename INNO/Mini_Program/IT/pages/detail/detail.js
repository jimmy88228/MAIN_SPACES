import LM from "../../common/manager/login-manager";
const HELP_FRI_MAP_KEY = "HELP_FRI";
const CHECK_WIN_MAP_KEY = "CHECK_WIN";

const app = getApp();

Page.BasePage({
    data: {
        actHtmlDetails: "",
        showRefresh: false,
        swiperCurrent: 0,
        opacityVal:0,
        navigationBarHeight : app.SIH.navigationBarHeight
    },
    onLoad(options) {
        this.activityId = options.activityId;
        this.friEnrollId = options.friEnrollId;
        Object.defineProperties(this, {
            navBar: { get: () => this.findView("#nav-bar") },
            dialog: { get: () => this.findView("#dialog", "useDialog") },
            popupAuth: { get: () => this.findView("#popup-auth", "useAuthPopup") },
            popupEnroll: { get: () => this.findView("#popup-enroll", "useEnrollPopup") },
            popupEnrollInfo: { get: () => this.findView("#popup-enroll-info", "useEnrollInfoPopup") },
            dialogAuth: { get: () => this.findView("#dialog-auth", "useAuthDialog") },
            dialogNoSucc: { get: () => this.findView("#dialog-no-succ", "useNoSuccDialog") },
        });
    },
    onReady() {
        this.setData({ isAttached: true, showRefresh: true });
        this.refresh(true);
        this.isInited = true;
    },
    onShow() {
        if (this.isInited && this.checkLoginChange(false)) {//登录状态改变时刷新
            this.loadData(false);
        }
    },
    onPullDownRefresh() {
        this.refresh();
    },
    //****  业务数据逻辑  ****/
    refresh(isInit) {
        return LM.login(false).ignore(() => {
            this.checkLoginChange(false);
            return this.loadData(isInit);
        }).finally(() => {
            wx.stopPullDownRefresh();
            this.setData({ showRefresh: false });
        });
    },
    loadData(isInit) {
        let token = this.token;
        let p = getActivityInfo(token, this.activityId).then(data => {
            let act = data.activityInfo;
            this.act = act;
            this.setData({
                act: act,
                opacityVal:1,
                showRefresh: false//避免拿不到 组件
            });
            let userProgress = data.userProgress || {};
            this.setUserProgress(userProgress);
            // this.initPageScroll();
            this.loadLayoutData(act);
            if (isInit) {
                this.afterInited(act, userProgress);
            }
        }).showError();
        this.loadActivityDetail();
        return p;
    },
    loadLayoutData(act) {
        let adLayoutId = act.adLayoutId;
        if (!adLayoutId)
            return;
        return getLayout(adLayoutId).then(data => {
            data && this.setData({ layoutData: data });
            console.log('layoutData',this.data.layoutData)
        });
    },
    loadActivityDetail() {
        return getActivityDetail(this.activityId).then(data =>
            data && this.setData({ actHtmlDetails: data })
        );
    },
    setUserProgress(userProgress) {
        this.enrollId = userProgress.enrollId;
        this.setData({
            progress: userProgress.progress || 0,
            codes: userProgress.codes || []
        });
    },
    afterInited(act, userProgress) {
        let isLogin = this.isLogin;
        if (isLogin) {
            this.checkIsWin(act, userProgress);
            this.toHelpFriend(act);
        } else if (this.checkNeedHelpFriend(act)) {
            this.dialogAuth.wait(() => {
                //判断登录状态是否变更
                if (this.checkLoginChange(false))
                    this.loadData(true);
            }).setContent("授权登录后，可为好友获取额外抽签码")
                .show();
        }
    },
    checkIsWin(act, userProgress) {
        let token = this.token;
        let status = act.status;
        let enrollId = userProgress.enrollId || 0;
        let progress = userProgress.progress || 0;
        if (status != 2 || enrollId <= 0 || progress <= 1) return;

        let key = CHECK_WIN_MAP_KEY + `_${enrollId}`;
        if (wx.getStorageSync(key)) return;
        getLotteryRecord(token, enrollId).then(isWin => {
            if (wx.getStorageSync(key)) return;
            wx.setStorage({ key, data: 1 });
            !isWin && this.dialogNoSucc.show();
        }).ignore();
    },
    checkNeedHelpFriend(act) {
        let status = act.status;
        let friEnrollId = this.friEnrollId;
        if (status != 1 || !friEnrollId) return false;
        var key = HELP_FRI_MAP_KEY + `_${friEnrollId}`;
        return !wx.getStorageSync(key);
    },
    toHelpFriend(act) {
        if (!this.checkNeedHelpFriend(act))
            return;
        let token = this.token;
        let friEnrollId = this.friEnrollId;
        var key = HELP_FRI_MAP_KEY + `_${friEnrollId}`;
        createHelp(token, friEnrollId).then(() => {
            delete this.friEnrollId;
            wx.setStorage({ key, data: 1 });
        }).ignore();
    },
    toEnrollCheckAuth() {
        let act = this.act || {};
        let activityId = this.activityId;
        LM.login(false).ignore(() => {
            this.checkLoginChange(false);
            let isLogin = this.isLogin;
            let followUrl = act.followUrl || "";
            let followType = act.followType || 0;
            followType = followUrl ? followType : 0;
            let key = `DrawCheckAuth-${activityId}`;
            if (isLogin) {
                if (wx.getStorageSync(key)) {
                    this.toEnroll();
                } else {
                    let token = this.token;
                    return getConditionStatus(token, activityId).then(data => {
                        let isBindPhone = data.isBindPhone;
                        let isFollow = data.isFollow;
                        if (!isBindPhone || (followType > 0 && !isFollow)) {
                            this.showAuthPupop({
                                activityId, isLogin: true, isBindPhone, followType, followUrl, isFollow,
                                callBack: () => wx.setStorage({ key, data: 1 })
                            });
                        } else {
                            wx.setStorage({ key, data: 1 });
                            this.toEnroll();
                        }
                    });
                }
            } else {
                this.showAuthPupop({
                    activityId, followType, followUrl,
                    callBack: () => wx.setStorage({ key, data: 1 })
                });
            }
        }).showError();
    },
    toEnroll() {
        let token = this.token;
        let activityId = this.activityId;
        getEnrollState(token, activityId).then(data => {
            if (data.state === 2) {//报名
                this.popupEnroll.showData(token, activityId, userProgress => {
                    this.setUserProgress(userProgress);
                    this.addActionLog("DRAW", "DETAIL", { keyParam1: activityId });
                });
            } else if (data.state === 3) {//获取额外抽签码
                this.popupEnrollInfo.showData(token, data.enrollId, userProgress => {
                    this.setUserProgress(userProgress);
                    this.addActionLog("GET_CODE", "DETAIL", { keyParam1: activityId, keyParam2: data.enrollId });
                });
            } else {//弹出提示
                this.dialog.setTitle(data.title)
                    .setContent(data.msg)
                    .setSingleBtn()
                    .show();
            }
        }).showError();
    },
    showAuthPupop(obj) {
        this.popupAuth.listenShowState(isShow => {
            this.setData({ isShowAuthPopup: isShow });
            //蒙层隐藏时，判断登录状态是否变更
            if (!isShow && this.checkLoginChange(false))
                this.loadData(true);
        }).checkShow(obj);
    },

    /**** 滚动效果 ****/
    // initPageScroll() {
    //     wx.nextTick(() => {
    //         const query = wx.createSelectorQuery();
    //         query.select('#sticky-area').boundingClientRect((res) => {
    //             let h = res && res.height || 0;
    //             if (h > 0) {
    //                 this.stickyAreaHeight = h;
    //             }
    //             this.handlePageScroll();
    //         }).exec()
    //     })
    // },
    // handlePageScroll() {
    //     let scrollTop = this._PageScrollTop || 0;
    //     let stickyAreaHeight = this.stickyAreaHeight || 0;
    //     let navigationBarHeight = app.SIH.navigationBarHeight;
    //     let dt = stickyAreaHeight - navigationBarHeight;
    //     let detailOpacity;
    //     let navBarOpacity;
    //     if (scrollTop <= 0) {
    //         detailOpacity = 0.2;
    //         navBarOpacity = 0;
    //     } else if (scrollTop > dt) {
    //         detailOpacity = 1;
    //         navBarOpacity = 1;
    //     } else {
    //         detailOpacity = scrollTop / dt * 0.8 + 0.2
    //         navBarOpacity = scrollTop / dt;
    //     }
    //     this.setData({ detailOpacity });
    //     this.navBar.setOpacity(navBarOpacity);
    // },
    // onPageScroll(event) {
    //     this._PageScrollTop = event.scrollTop;
    //     this.handlePageScroll();
    // },
    
    /**** 分享 ****/
    onShareAppMessage() {
        let act = this.data.act;
        let name = act.name;
        name && (name = name.replace(/<[^>]+>/g, ""));
        let path = `/pages/detail/detail?activityId=${this.activityId}`;
        if (this.enrollId > 0) {
            path += `&friEnrollId=${this.enrollId}`;
        }

        this.addActionLog("DRAW_INVITE", "DETAIL", {
            keyParam1: this.activityId,
            keyParam2: this.enrollId
        });

        return {
            title: name,
            path: path,
            imageUrl: this.data.act.picture
        };
    },
    /**** 事件 ****/
    swiperChange(e) {
        let detail = e.detail || {};
        this.setData({
            swiperCurrent: detail.current || 0
        })
    }
});


function getActivityInfo(userToken, activityId) {
    return app.DrawApi.getActivityInfo({
        params: { userToken, activityId }
    }).netData();
}

function getActivityDetail(activityId) {
    return app.WebApi.getActDetails({
        params: { activityId }
    }).netData(null);
}

function getEnrollState(userToken, activityId) {
    return app.DrawApi.getEnrollState({
        params: { userToken, activityId }
    }).netData();
}

function getLotteryRecord(userToken, enrollId) {
    return app.DrawApi.getLotteryRecord({
        params: { userToken, enrollId }
    }).netData();
}

function createHelp(userToken, friEnrollId) {
    return app.DrawApi.createHelp({
        params: { userToken },
        data: { friEnrollId }
    }).netData();
}

function getConditionStatus(userToken, activityId) {
    return app.DrawApi.getConditionStatus({
        params: { userToken, activityId }
    }).netData();
}

function getLayout(layoutId) {
    return app.LayoutApi.getLayout({
        params: { layoutId }
    }).netData(null);
}