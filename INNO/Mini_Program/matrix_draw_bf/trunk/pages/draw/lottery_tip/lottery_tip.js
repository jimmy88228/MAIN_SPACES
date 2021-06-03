import {createBehavior} from "../../../components/window/anim-helper";
const app = getApp();
const anim = {
    enterTo: "transition: all 300ms ease-in-out;",
    leaveTo: "opacity: 0; transform: scale(0.8, 0.8) translateX(-50%); transition: all 300ms ease-in-out;",
    duration: 300
}
Component({
    behaviors: [Behavior.BaseBehavior,createBehavior(anim)],
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