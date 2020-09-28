import WindowBehaviors from "../../../../ui/cps/window/window-behaviors";
var app = getApp();
Component(app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
        bargainType: {
            type: Number,
            value: -1,
            observer(nV, oV) {
                if (nV == 0) {
                    this.setData({
                        titleText: '商品好价，唯快不破'
                    });
                } else if (nV == 1) {
                    this.setData({
                        titleText: '成功帮好友砍价'
                    });
                } else {
                    this.setData({
                        titleText: '砍价成功，快点通知好友吧'
                    });
                }
            }
        },
        hagglePrice: {
            type: String,
            value: "",
            observer(nV, oV) {
                this.setData({
                    _hagglePrice: nV
                });
            }
        },
        extra: {
            type: Object,
            value: {},
        },

    },
    data: {
        boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
        titleText: '',
        _hagglePrice: ''
    },
    attached() {
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        let moneyImg = this.data.brand_info.icon_url + "micro_mall/bargain/broken_money.png";
        this.setData({
            server_close,
            moneyImg
        });
    },
    methods: {
        onAttached() {
            this.setData({
                boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
            });
            this.setTouchCancel(false);
        },
        onDetached() {
            this.setData({
                boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
            });
            return 300;
        },
        cancel() {
            this.dismiss();
        },
        bargainHandle() {
            if (this.data.bargainType != 0) {
                wx.navigateTo({
                    url: '/pages/micro_mall/bargain/index/bargain_index'
                });
            }else{
                this.dismiss();
                this.triggerEvent("onTapShare",{});
            }
        }
    }
}))