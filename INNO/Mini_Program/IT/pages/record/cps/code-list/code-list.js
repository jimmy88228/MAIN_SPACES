import MyDate from "../../../../common/support/utils/date-util";
import LM from "../../../../common/manager/login-manager";
import TabBehavior from "../tab-behaviors";
const app = getApp();

const statusNames = {
    "0": "待公布",
    "1": "中签",
    "2": "未中签"
};
Component({
    options: {
        styleIsolation: "apply-shared"
    },
    behaviors: [Behavior.BaseBehavior, Behavior.PagingBehavior, TabBehavior],
    data: {
        isEnd: false,
        showRefresh: false,
        showLoadMore: false
    },
    lifetimes: {
        created() {
            Object.defineProperties(this, {
                dialogPoster: { get: () => this.findView("#dialog-poster", "usePosterDialog") }
            });
        }
    },
    methods: {
        onTabShow() {
            if (!this.isInited) {
                this.isInited = true;
                this.setData({ isAttached: true, showRefresh: true });
                this.refresh();
            } else if (this.checkLoginChange()) {//登录状态改变时刷新
                this.loadData(true);
            }
        },
        onTabHide() {
            this.dialogPoster && this.dialogPoster.dismiss();
        },
        onRefresh() {
            this.setData({ triggered: true });
            this.refresh();
        },
        refresh() {
            return LM.login(false).ignore(() => {
                this.checkLoginChange();
                return this.loadData(true);
            }).finally(() => this.setData({ triggered: false, showRefresh: false }));
        },
        onScrolltolower() {
            this.setData({ showLoadMore: true });
            return this.loadData(false)
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
            return getEnrollCodePage(token, this.nextDataIndex(refresh)).then(list =>
                this.setDataList(refresh, transformData(list))
            ).finally(() => this.isLoading = false).showError();
        },
        onItemTap(e) {
            let id = e.currentTarget.id;
            let dataset = e.currentTarget.dataset;
            let index = dataset.index;
            let list = this.data.list;
            if (index < list.length) {
                let obj = list[index];
                wx.createSelectorQuery()
                    .in(this)
                    .select(`#${id}`)
                    .fields(
                        { rect: true, size: true },
                        res => {
                            if (!res) return;
                            this.dialogPoster.showData({
                                picture: obj.picture,
                                title: obj.title,
                                code: obj.code,
                                status: obj.status,
                                lotteryRecordId: obj.lotteryRecordId
                            }, {
                                x: res.left,
                                y: res.top,
                                w: res.width,
                                h: res.height,
                            });
                        })
                    .exec();
            }
        },
        onAuthed() {
            //登录状态改变时刷新
            if (this.checkLoginChange())
                this.loadData(true);
        }
    }
});

function transformData(list) {
    return list.map(item => {
        return {
            picture: item.picture,
            title: item.title,
            status: item.status,
            statusName: statusNames[item.status],
            code: item.code,
            createTime: MyDate.formatStr(item.createTime, "yyyy.MM.dd"),
            userRewardId: item.userRewardId,
            lotteryRecordId: item.lotteryRecordId
        };
    });
}

function getEnrollCodePage(userToken, pageIndex) {
    const pageSize = app.Conf.PAGE_SIZE;
    return app.DrawApi.getEnrollCodePage({
        params: { userToken, pageIndex, pageSize }
    }).netData();
}