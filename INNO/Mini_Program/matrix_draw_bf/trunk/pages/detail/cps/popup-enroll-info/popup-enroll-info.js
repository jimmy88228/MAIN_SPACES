import EnrollPopupBehavior from "../popup-enroll-behavior";
const app = getApp();

Component({
    options: {
        styleIsolation: "apply-shared"
    },
    behaviors: [Behavior.BaseBehavior, EnrollPopupBehavior],
    data: {
        list: []
    },
    lifetimes: {
        created() {
            Object.defineProperties(this, {
                dialogCode: { get: () => this.findView("#dialog-code", "useCodeDialog") }
            });
        }
    },
    methods: {
        showData(token, enrollId, cb) {
            this.token = token;
            this.enrollId = enrollId;
            this.cb = cb;
            this.loadData().then(() => {
                this.show();
            })
            return this;
        },
        loadData() {
            return getEnrollInfo(this.token, this.enrollId).then(data => {
                data = transformData(data);
                this.setData({
                    list: data
                });
            }).showError();
        },
        submit() {
            createEnrollCode(this.token, this.enrollId)
                .then(userProgress => {
                    this.dismiss();
                    this.cb && this.cb(userProgress);
                    this.dialogCode
                        .setContent({ code: userProgress.code })
                        .show();
                }).showError();
        }
    }
});

function transformData(data) {
    let list = [];
    for (let i = 0, n = data.enrollItems.length; i < n; i++) {
        let item = data.enrollItems[i];
        list.push({ name: item.name, value: item.value });
    }
    if (data.productInfo) {
        try {
            let specs = JSON.parse(data.productInfo.specs);
            for (let key in specs) {
                list.push({ name: key, value: specs[key] });
            }
        } catch (e) { }
    }
    return list;
}

function getEnrollInfo(userToken, enrollId) {
    return app.DrawApi.getEnrollInfo({
        params: { userToken, enrollId }
    }).netData();
}

function createEnrollCode(userToken, enrollId) {
    return app.DrawApi.createEnrollCode({
        params: { userToken },
        data: { enrollId }
    }).netData();
}