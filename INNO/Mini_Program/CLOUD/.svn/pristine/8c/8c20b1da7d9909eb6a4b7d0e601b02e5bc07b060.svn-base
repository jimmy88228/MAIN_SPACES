// pages/micro_mall/sign/app/rule/rule.js
import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
        ruleList: {
            type: Object,
            value: {},
            observer(nV) {
                console.log("new", nV);
            }
        }
    },
    data: {
        boxStyle: "opacity:0;",
        iconUrl: app.Conf.ICON_URL
    },
    detached() {},
    methods: {
        onAttached() {
            let signImg = this.data.brand_info.icon_url + "micro_mall/sign/sign.jpg";
            this.setData({
                boxStyle: "opacity:1",
                signImg: signImg, 
            });
            this.setTouchCancel(false);
        },
        onDetached() {
            this.setData({
                boxStyle: "opacity:0"
            });
            return 300;
        },
        cancel() {
            this.dismiss();
        },
        showData(data){
            let sum = 0;
            data = data||{};
            if(data.totalGiftPoint>0){
                sum+=1;
            }
            if(data.totalGiftBonus>0){
                sum+=1;
            }
            if(data.totalGiftLottery>0){
                sum+=1;
            }
            this.setData({
                sum
            })
            this.show();
        },
    }
}))