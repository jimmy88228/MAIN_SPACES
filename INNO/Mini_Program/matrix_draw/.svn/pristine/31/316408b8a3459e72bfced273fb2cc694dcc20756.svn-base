import WindowBehaviors from "../../../components/window/window-behaviors";
const app = getApp();
Component({
    behaviors: [WindowBehaviors,Behavior.BaseBehavior],
    properties: {
        lotteryInfo: {
            type: Object,
            value: {},
            observer(nV, oV){
                console.log(nV,"lotteryInfo");
                this.setData({
                    _lotteryInfo: nV
                });
            }
        },
        activityId: {
            type: Number,
            value: 0,
            observer(nV, oV) {
                this.setData({
                    _activityId: nV
                });
            }
        }
    },
    data: {
        // boxStyle: "opacity:0; transform: translate(0,110%); transition: all 300ms ease-in-out;",
        boxStyle: "",
        iconUrl: app.Conf.ICON_URL,
        _lotteryInfo: {},
        _activityId: 0,
        closeType: 'cancel'
    },
    attached() {
        let win_bg = this.data.brand_info.icon_url + "micro_mall/lottery/win_bg.png";
        let failure_bg = this.data.brand_info.icon_url + "micro_mall/lottery/failure_bg.png";
        let win_bg_btn = this.data.brand_info.icon_url + "micro_mall/lottery/win_bg_btn.png";
        let default_img = this.data.brand_info.icon_url + "micro_mall/lottery/win_default.png";
        this.setData({
            win_bg,
            win_bg_btn,
            default_img,
            failure_bg
        });
    },
    methods: {
        onAttached() {
            this.setData({
                boxStyle: "isShow"
            });
            this.setTouchCancel(false);
        },
        onDetached() {
            this.setData({
                boxStyle: "",
            });
            this.triggerEvent("windowClose");
            return 300;
        },
        closeWin() {
            this.dismiss();
        },
        cancel() {
            let self = this;
            if (this.data._lotteryInfo.isWinning) {
                wx.navigateTo({
                    url: "/pages/micro_mall/lottery/lottery_record/lottery_record?activityId=" + self.data._activityId
                });
            }
            this.dismiss();
        }
    }
})