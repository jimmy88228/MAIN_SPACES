import { createBehavior } from "../../../../components/window/anim-helper";
import LM from "../../../../common/manager/login-manager";
import Smm from "../../../../common/helper/show-msg-helper";
import Utils from "../../../../common/utils/util"
const mainStyles = {
    enterTo: "transition: opacity 600ms ease-in-out;",
    leaveTo: "opacity: 0; transition: opacity 300ms ease-in-out;",
    duration: 300
}
const app = getApp();
Component({
    options: {
        styleIsolation: "apply-shared"
    },
    behaviors: [Behavior.BaseBehavior, createBehavior(mainStyles)],
    data: {
        step: 0,
        isLogin: false,
        isBindPhone: false,
        isFollow: false
    },
    pageLifetimes: {
        show() {
            this.changeStep();
        }
    },
    methods: {
        checkShow({ activityId, isLogin = false, isBindPhone = false, followType = 0, followUrl, isFollow = false, callBack }) {
            this.activityId = activityId;
            this.isLogin = isLogin;
            this.isBindPhone = isBindPhone;
            this.followUrl = followUrl;
            this.followType = followType;
            this.isFollow = isFollow;
            this.callBack = callBack;
            this.tryFollowed = false;
            this.ok = false;
            this.changeStep();
            this.show();
            return this;
        },
        onAuthed(e) {
            let openType = e.detail.openType;
            if (openType == "getUserInfo") {
                this.isLogin = true;
                getConditionStatus(LM.token, this.activityId).then(data => {
                    this.isBindPhone = data.isBindPhone;
                    this.isFollow = data.isFollow;
                }).finally(() => this.changeStep());
            } else {
                this.isBindPhone = true;
                this.changeStep();
            }
        },
        toFollow() {
            this.tryFollowed = true;
            //this.followUrl = "https://mp.weixin.qq.com/s?__biz=MzIwNzYzMDY2OA==&mid=2247483658&idx=1&sn=3e180a5a61602c79807604d326434800&chksm=970e3929a079b03fc6d8d983207e4340745800dc4e468283e9de74fa3e98298d452d648fbb09&token=1932226663&lang=zh_CN#rd"
            wx.navigateTo({
                url: `/pages/web/web?url=${encodeURIComponent(this.followUrl)}`
            });
        },
        onForceFollowedTap() {
            this.forceThrottle || (this.forceThrottle = Utils.debounce(
                ()=>
                    getConditionStatus(LM.token, this.activityId).then(data => {
                        if (data.isFollow) {
                            this.isFollow = true;
                            this.changeStep();
                        } else {
                            Smm.showToast({ title: "请先关注公众号" });
                            wx.MyAnims.jumpScale(this, "#how-to-follow");
                        }
                    }).showError(),
                350
            ))
            this.forceThrottle();
        },
        onGuideFollowedTap() {
            this.isFollow = true;
            this.changeStep();
        },
        changeStep() {
            let step = 0;
            if (!this.isLogin) step = 1;
            else if (!this.isBindPhone) step = 2;
            else if (this.followType > 0 && !this.isFollow) step = 3;
            else step = 10;
            this.setData({
                step: step,
                isLogin: this.isLogin,
                isBindPhone: this.isBindPhone,
                followType: this.followType,
                isFollow: this.isFollow,
                tryFollowed: this.tryFollowed
            });
            if (step >= 10) {
                this.ok = true;
                if(this.followType == 2){
                    wx.nextTick(()=>{
                        this.onCloseTap();
                    })
                }
            }
        },
        onCloseTap() {
            this.dismiss();
        },
        onDetached() {
            this.ok && this.callBack && this.callBack();
        },
    }
});

function getConditionStatus(userToken, activityId) {
    return app.DrawApi.getConditionStatus({
        params: {
            userToken: userToken,
            activityId: activityId
        }
    }).netData();
}