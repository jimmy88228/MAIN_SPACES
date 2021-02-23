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
                        titleText: '谢谢你！帮我砍掉'
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
        user_info: {
            type: Object,
            value: {},
        },

    },
    data: {
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
        titleText: '',
        _hagglePrice: ''
    },
    attached() {
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        let moneyImg = this.data.brand_info.icon_url + "micro_mall/bargain/broken_money.png";
        let l_theme_color =  app.getColor(this.data.brand_info.style.bargain_color.theme_color,30,220,218,1);
        this.setData({
            server_close,
            moneyImg,
            l_theme_color
        });
    },
    methods: {
        onAttached() {
            this.setTouchCancel(false);
            setTimeout(() => {
                this.setData({
                    boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
                })
            }, 300);
        },
        onDetached() {
            this.setData({
                boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
            });
            return 300;
        },
        cancel() {
            this.dismiss();
            this.triggerEvent("dismiss");
        },
        bargainHandle(e) {
            let dataset = e.currentTarget.dataset||{};
            let type = dataset.type||"";
            if(type == 'invite'){
                this.dismiss();
                this.triggerEvent("onTapShare",{});
            }else if(type == 'goCoupon'){
                wx.navigateTo({
                  url: '/pages/micro_mall/coupon/my_coupon?type=bargain'
                })
            }else if(type == 'goBargain'){
                wx.navigateTo({
                    url: '/pages/micro_mall/bargain/index/bargain_index'
                });
            }
            // if (this.data.bargainType != 0) {
            //     wx.navigateTo({
            //         url: '/pages/micro_mall/bargain/index/bargain_index'
            //     });
            // }else{
            //     this.dismiss();
            //     this.triggerEvent("onTapShare",{});
            // }
        }
    }
}))