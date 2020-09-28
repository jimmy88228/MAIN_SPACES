import EnrollPopupBehavior from "../popup-enroll-behavior";
import Sub from "../../../../common/helper/subscribe-helper";
const app = getApp();

Component({
    options: {
        styleIsolation: "apply-shared"
    },
    behaviors: [Behavior.BaseBehavior, EnrollPopupBehavior],
    properties: {
        goodsName: {
            type: String
        },
        priceRange: {
            type: String
        },
        priceUnit: {
            type: String
        },
        picture: {
            type: String
        }
    },
    data: {
        isSelectProduct: false,
        price: 0,
        specData: {},
        questions: []
    },
    lifetimes: {
        created() {
            Object.defineProperties(this, {
                dialog: { get: () => this.findView("#dialog", "useDialog") },
                dialogCode: { get: () => this.findView("#dialog-code", "useCodeDialog") }
            });
        }
    },
    methods: {
        showData(token, activityId, cb) {
            this.token = token;
            this.activityId = activityId;
            this.cb = cb;
            this.subscribed = false;
            this.loadData().then(() => {
                this.show();
            });
            return this;
        },
        loadData() {
            if (this.isInited) {
                return Promise.resolve();
            }
            return getEnrollOption(this.token, this.activityId)
                .then(data => {
                    this.setData(transformData(data));
                    this.isInited = true;
                    this.checkCatcht();
                }).showError();
        },
        checkCatcht() {
            wx.nextTick(() => {
                wx.createSelectorQuery()
                    .in(this)
                    .select(".enroll-scroll")
                    .fields({ size: true }, rect1 => {
                        wx.createSelectorQuery()
                            .in(this)
                            .select(".enroll-content")
                            .fields({ size: true }, rect2 => {
                                this.setData({ catcht: rect2.height <= rect1.height + 20 })
                            })
                            .exec();
                    })
                    .exec();
            });
        },
        onChange(e) {
            this.answer = this.answer || {};
            let id = e.currentTarget.dataset.fieldId;
            if (id > 0) {
                this.answer[id] = e.detail.value;
            }
        },
        onChoseProduct(e) {
            let product = e.detail.product;
            if (product) {
                this.setData({
                    isSelectProduct: true,
                    price: product.price
                });
            } else {
                this.setData({
                    isSelectProduct: false,
                    price: 0
                });
            }
        },
        submit() {
            if (!app.clickHold("submit")) return;
            Promise.resolve().then(() => {
                let token = this.token;
                let activityId = this.activityId;
                let questionView = this.selectComponent("#question-view");
                let answers = questionView && questionView.checkComplete();
                let specView = this.selectComponent("#spec-view");
                let product = specView && specView.checkComplete();
                let data = createData(product, answers);
                return this.subscribe(token, activityId)
                    .then(() => createEnroll(token, activityId, data))
                    .then(userProgress => {
                        this.dismiss();
                        this.cb && this.cb(userProgress);
                        this.dialogCode
                            .setContent({ code: userProgress.code })
                            .show();
                    });
            }).showError();
        },
        subscribe(token, keyId) {
            if (this.subscribed)
                return Promise.resolve();
            return new Promise((rs, rj) => {
                Sub.setSubscribe(token, "DRAW_RESULT", true, { showToast: false, keyId })
                    .then(isSub => rs(isSub),//订阅成功
                        err => {//订阅失败
                            if (err && err.subError) {//设置错误
                                let toEnroll = false;
                                this.dialog.setTitle("订阅失败").setContent(err.msg)
                                    .wait(() => toEnroll ? rs(false) : rj())
                                    .setTwoBtn({ name: "直接报名", tap: (_, d) => (toEnroll = true, d.dismiss()) },
                                        { name: "去设置", tap: (_, d) => (d.dismiss(), wx.openSetting({ withSubscriptions: true })) })
                                    .show();
                            } else {//非强制订阅，忽略其它错误
                                rs(false);
                            }
                        });
            }).then(() => this.subscribed = true);
        }
    }
});

function createData(product, answers) {
    let asList = [];
    if (answers) {
        for (let id in answers) {
            asList.push({
                id: parseInt(id),
                value: answers[id]
            });
        }
    }
    return {
        productId: (product && product.id) || 0,
        answers: asList
    }
}

function transformData(data) {
    let questions;
    if (data.questions && data.questions.length > 0) {
        questions = data.questions.map(e => {
            let type = e.questionType.toUpperCase();
            let options;
            if (type == "OPTION") {
                type = "";
                try {
                    let opt = e.option;
                    if (opt && opt.options && opt.options.length > 0) {
                        type = opt.theme && opt.theme.toUpperCase() == "GRID" ? "GRID" : "LIST";
                        options = opt.options;
                    }
                } catch (e) { }
            }
            let td = {
                id: e.id,
                name: e.name,
                type: type,
                options: options,
                placeHolder: e.tag,
                must: e.fillinType == 0
            };
            return td;
        });
    } else {
        questions = null;
    }
    let specData;
    if (data.goodsInfo) {
        specData = {
            specs: data.goodsInfo.specsGroups || [],
            products: data.goodsInfo.products || []
        };
    } else {
        specData = null;
    }
    return {
        questions,
        specData: specData
    };
}

function getEnrollOption(userToken, activityId) {
    return app.DrawApi.getEnrollOption({
        params: { userToken, activityId }
    }).netData();
}

function createEnroll(userToken, activityId, data) {
    return app.DrawApi.createEnroll({
        params: { userToken, },
        data: {
            activityId,
            ...data
        }
    }).netData();
}