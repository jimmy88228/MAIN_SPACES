import LM from "../../common/manager/login-manager";
const app = getApp();
Page.BasePage({
    data: {
        usegeHtmlDetails: "",
        opacityVal:0,
        showRefresh: false,
    },
    onLoad(options) {
        this.configuration({ autoSetPageScroll: true });
        this.lotteryRecordId = options.lotteryRecordId || options.rewardId;//兼容旧的rewardId
        Object.defineProperties(this, {
            dialogPoster: { get: () => this.findView("#dialog-poster", "usePosterDialog") }
        });
    },
    onReady() {
        this.setData({ isAttached: true, showRefresh: true });
        this.refresh();
        this.isInited = true;
    },
    onShow() {
        if (this.isInited && this.checkLoginChange())//登录状态改变时刷新
            this.loadData();
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
        if (!this.isLogin) return Promise.reject();
        return getLotteryInfo(this.token, this.lotteryRecordId).then(data => {
            this.setData({
                ...transformData(data),
                opacityVal:1,
                showRefresh: false,//避免拿不到 组件
            });
            this.loadLayoutData();
            this.loadUsege();
        }).showError();
    },
    loadLayoutData() {
        let info = this.data.info || {};
        if (!info.adLayoutId)
            return;
        getLayout(info.adLayoutId).then(data =>
            data && this.setData({ layoutData: data })
        );
    },
    loadUsege() {
        let info = this.data.info || {};
        if (!info.ruleId)
            return;
        getUsegeDetail(info.ruleId).then(data =>
            data && this.setData({ usegeHtmlDetails: data })
        );
    },
    onAuthed() {
        //登录状态改变时刷新
        if (this.checkLoginChange())
            this.loadData();
    },
    onShareTap() {
        let obj = this.data.info;
        this.dialogPoster.showData({
            picture: obj.picture,
            title: obj.title,
            code: obj.code
        });
    },
    onEShopTap() {
        let appId = app.Conf.APPIDS.ESHOP;
        wx.navigateToMiniProgram({
            appId: appId,
            success: () => {
                this.addActionLog("JUMP_OUTER", "WINPRIZE", {
                    keyParam1: 1,
                    keyParam2: this.lotteryRecordId || 0,
                    keyParam3: appId
                });
            },
            fail: () => {
                this.addActionLog("JUMP_OUTER", "WINPRIZE", {
                    keyParam1: 0,
                    keyParam2: this.lotteryRecordId || 0,
                    keyParam3: appId
                });
            }
        });
    }
});

function transformData(data) {
    let info = data.lotteryInfo;
    let enrollItems = [];
    let enrollInfo = data.enrollInfo;
    if (enrollInfo) {
        let items = enrollInfo.enrollItems;
        for (let i = 0, n = items.length; i < n; i++) {
            let item = items[i];
            enrollItems.push({ name: item.name, value: item.value });
        }
        let productInfo = enrollInfo.productInfo;
        if (productInfo) {
            if (productInfo.price) {
                info.price = productInfo.price;
                info.unit = productInfo.unit;
            }
            try {
                let specs = JSON.parse(productInfo.specs);
                for (let key in specs) {
                    enrollItems.push({ name: key, value: specs[key] });
                }
            } catch (e) { }
        }
    }
    return { info, enrollItems };
}

function getLotteryInfo(userToken, lotteryRecordId) {
    return app.DrawApi.getLotteryInfo({
        params: { userToken, lotteryRecordId }
    }).netData();
}

function getLayout(layoutId) {
    return app.LayoutApi.getLayout({
        params: { layoutId }
    }).netData(null);
}

function getUsegeDetail(ruleId) {
    return app.WebApi.getLotteryUsegeDetails({
        params: { ruleId }
    }).netData(null);
} 