import MyDate from "../../../../common/support/utils/date-util";
import LM from "../../../../common/manager/login-manager";
import TabBehavior from "../tab-behaviors";
const app = getApp();
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
            return getLotteryRecordPage(token, this.nextDataIndex(refresh)).then(list =>
                this.setDataList(refresh, transformData(list))
            ).finally(() => this.isLoading = false).showError();
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
            id: item.id,
            level: item.level,
            title: item.title,
            type: item.type,
            createTime: MyDate.formatStr(
                item.createTime,
                "yyyy.MM.dd"
            )
        };
    });
}

function getLotteryRecordPage(userToken, pageIndex) {
    const pageSize = app.Conf.PAGE_SIZE;
    return app.DrawApi.getLotteryRecordPage({
        params: { userToken, pageIndex, pageSize }
    }).netData();
}
