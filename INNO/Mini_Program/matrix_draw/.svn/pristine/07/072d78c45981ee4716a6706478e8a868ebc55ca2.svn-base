const app = getApp();
import LM from "../../common/manager/login-manager";
import MyDate from "../../common/support/utils/date-util";
Page.PagingPage({
    data: {
        isEnd: false,
        showRefresh: false,
        showLoadMore: false
    },
    onReady() {
        this.setData({ isAttached: true, showRefresh: true });
        this.refresh();
        this.isInited = true;
    },
    onShow() {
        if (this.isInited && this.checkLoginChange()) {//登录状态改变时刷新
            this.loadData(true);
        }
    },
    onPullDownRefresh() {
        this.refresh();
    },
    refresh() {
        return LM.login(false).ignore(() => {
            this.checkLoginChange();
            return this.loadData(true);
        }).finally(() => {
            wx.stopPullDownRefresh();
            this.setData({ showRefresh: false });
        });
    },
    onReachBottom() {
        this.setData({ showLoadMore: true });
        this.loadData(false)
            .finally(() => this.setData({ showLoadMore: false }));
    },
    loadData(refresh = false) {
        if (!this.isLogin) {
            this.clearDataList();
            return Promise.reject();
        }
        if (this.isLoading || (!refresh && this.data.isEnd)) {
            return Promise.reject();
        }
        let token = this.token;
        this.isLoading = true;
        return getMsgPage(token, this.nextDataIndex(refresh)).then(list =>
            this.setDataList(refresh, transformData(list))
        ).finally(() => this.isLoading = false).showError();
    },
    onAuthed() {
        //登录状态改变时刷新
        if (this.checkLoginChange())
            this.refresh(true);
    },
    onItemTap(e) {
        let msg = e.currentTarget.dataset.message;
        var url = "";

        if (msg.relatedType === "DRAW_ACTIVITY") {
            url = `/pages/detail/detail?activityId=${msg.relatedId}`;
        } else if (msg.relatedType === "DRAW_REWARD") {
            url = `/pages/winprize/winprize?lotteryRecordId=${msg.relatedId}`;
        }

        if (url.length > 0) {
            wx.navigateTo({
                url: url
            });
        }
    }
});

function transformData(list) {
    return list.map(item => {
        return {
            messages: item.messages,
            createTime: MyDate.formatStr(
                item.createTime,
                "yyyy.MM.dd"
            ),
            relatedType: item.relatedType,
            relatedId: item.relatedId
        };
    });
}

function getMsgPage(userToken, pageIndex) {
    const pageSize = app.Conf.PAGE_SIZE;
    return app.UserApi.getMsgPage({
        params: { userToken, pageIndex, pageSize }
    }).netData();
}