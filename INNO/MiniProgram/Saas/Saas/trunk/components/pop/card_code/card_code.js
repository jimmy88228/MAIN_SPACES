import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors.js";
const app = getApp();
Component(app.BTAB({
    behaviors: [WindowBehaviors],
    data: {
        boxStyle: "opacity:0; transition: all 300ms ease-in-out;",
        iconUrl: app.Conf.ICON_URL,
        getCodeVaild: true,
        countDown: "",
        isInvaild: false
    },
    attached() {
        this.loading = false;
    },
    methods: {
        onAttached() {
            this.setData({
                boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
            });
        },
        onDetached() {
            this.setData({
                boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
            });
            this.triggerEvent("windowClose");
            return 300;
        },
        cancel() {
            this.dismiss();
        },
        getCaptcha(type) {
            type && this.setData({type})
            loadData.call(this,type);
        }
    }
}))
function loadData(type) {
    if (!this.loading) {
        this.loading = true;
        let url = 'getUserStoredValueCaptcha';
        type == 'userPoint' && (url = 'get_UserPointCaptcha');
        return app.UserApi[url]({
            params: {
                userToken: app.LM.userToken,
                brandCode: app.Conf.BRAND_CODE
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data;
            if (res.code == 1) {
                this.setData({
                    captcha: data.captcha,
                    invalidTime: data.invalidTime,
                    serverTime: data.serverTime,
                    getCodeVaild: true
                });
                // if(this.data.type == 'dynamicCode')return Promise.resolve(data);
                try {
                    let validTime = (new Date(String(this.data.invalidTime).replace(/\-/gmi, "/")).getTime() - new Date(String(this.data.serverTime).replace(/\-/gmi, "/")).getTime()) / 1000;
                    if (validTime < 0) {
                        this.setData({
                            countDown: "口令已失效，请重新获取",
                            isInvaild: true
                        });
                    } else {
                        startCount.call(this, validTime);
                    }
                } catch(err) {
                    console.log(err);
                }
                return Promise.resolve(data);
            } else {
                this.setData({
                    getCodeVaild: false
                });
                return Promise.reject(res);
            }
        }).finally(() => {
            this.loading = false;
        });
    }
}

function startCount(validTime) {
    let result = formatTime.call(this, validTime);
    this.setData({
        countDown: `${result}后失效`
    });
    this.timer = setInterval(() => {
        if (validTime <= 0) {
            clearInterval(this.timer);
            return;
        }
        result = formatTime.call(this, --validTime);
        this.setData({
            countDown: `${result}后失效`
        });
        if (validTime <= 0) {
            this.setData({
                countDown: "口令已失效，请重新获取",
                isInvaild: true
            });
        }
    }, 1000);
}

function formatTime(value) {
    var secondTime = parseInt(value);
    var minuteTime = 0;
    var hourTime = 0;
    if (secondTime > 60) {
        minuteTime = parseInt(secondTime / 60);
        secondTime = parseInt(secondTime % 60);
        if (minuteTime > 60) {
            hourTime = parseInt(minuteTime / 60);
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = "" + parseInt(secondTime) + "秒";
    if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
    }
    if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
    }
    return result;
}