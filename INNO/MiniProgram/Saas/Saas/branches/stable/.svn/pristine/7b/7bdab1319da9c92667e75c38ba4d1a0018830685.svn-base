let app = getApp();
Page(app.BP({
    data: {
        orderId: '',
        brand_info: app.globalData.brand_info,
        packageLevel: [true, true, true, true, true],
        shippingLevel: [true, true, true, true, true],
        mannerLevel: [true, true, true, true, true],
        orderGoodsInfoList: [],
        hasCommentLogistics: false,
    },

    buildLevel: function(level) {
        return [true, true, true, true, true].map((item, index) => {
            if (index >= level && level > 0) {
                return false;
            } else {
                return true;
            }
        })
    },
    onLoad: function(options) {
        // options.order_id = 17;
        this.options = options || {};
        let start_icon_active = this.data.brand_info.icon_url + "micro_mall/comment/start_icon_active.png";
        let start_icon = this.data.brand_info.icon_url + "micro_mall/comment/start_icon.png";
        let comment_list = this.data.brand_info.default_icon_url + "comment_list.png";

        this.setData({
            "start_icon_active": start_icon_active,
            "start_icon": start_icon,
            orderId: options.order_id,
            options, 
            comment_list,
        });
    },
    onReady: function() {},
    onShow: function() {
        getOnlineOrderCommentDetail.call(this, this.options);
    },
    handleScore: function(e) {
        if (this.data.hasCommentLogistics) {
            return
        }
        const commentType = e.target.dataset.commenttype;
        const clickIndex = +e.target.dataset.index;
        let startScore = this.data[commentType];
        for (let index = 0, len = startScore.length; index < len; index++) {
            if (index > clickIndex) {
                startScore[index] = false;
            } else {
                startScore[index] = true;
            }
        }
        this.setData({
            [commentType]: startScore
        });
    },

    culateLevel: function(list) {
        return list.filter(item => {
            return item === true
        }).length
    },

    confirmComment: function() {
        let options = this.options;
        let packageLevel = this.data.packageLevel;
        let shippingLevel = this.data.shippingLevel;
        let mannerLevel = this.data.mannerLevel;
        let tip = "";
        if (!this.culateLevel(packageLevel)) {
            tip = "请评论包裹质量";
        } else if (!this.culateLevel(shippingLevel)) {
            tip = "请评论送货速度";
        } else if (!this.culateLevel(mannerLevel)) {
            tip = "请评论快递员态度";
        }
        if (tip) {
            app.SMH.showToast({
                "title": tip
            })
            return;
        }
        return app.GoodsApi.commentOnlineOrder({
            data: {
                "orderId": options.order_id,
                "package_level": this.culateLevel(this.data.packageLevel),
                "shipping_level": this.culateLevel(this.data.shippingLevel),
                "manner_level": this.culateLevel(this.data.mannerLevel),
                "brandCode": app.Conf.BRAND_CODE
            },
            other: {
                isShowLoad: true
            }
        }).then(e => {
            if (e.code == "1") {
                app.SMH.showToast({
                    title: '评价成功！'
                });
                this.setData({
                    hasCommentLogistics: true
                });
                return Promise.resolve(e);
            }
            return Promise.reject();
        })
        // app.wxReq("", "comment_setCommentOrder", reqData, (info) => {
        //   wx.hideLoading();

        //   if (info.error != 0) {
        //     wx.showToast({
        //       image: '../../../images/micro_mall/cn/err_icon.png',
        //       title: info.message,
        //     });
        //     return;
        //   } else {
        //     wx.showToast({
        //       title: '评价成功！',
        //       icon:'success'
        //     });
        //     this.setData({
        //       hasCommentLogistics: true
        //     });
        //   }
        // })
    }
}))

function getOnlineOrderCommentDetail(options = {}) {
    let _params= options.type == 'store'? {orderSn:options.order_sn}:{orderId: options.order_id};
    let url = options.type == 'store'?'getOfflineOrderCommentDetail':'getOnlineOrderCommentDetail';
    return app.GoodsApi[url]({
        params: {
            ..._params,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            let orderCommentInfo = data.orderCommentInfo;
            this.setData({
                orderGoodsInfoList: data.orderGoodsInfos,
                // packageLevel: this.buildLevel(orderCommentInfo.package_level),
                // shippingLevel: this.buildLevel(orderCommentInfo.shipping_level),
                // mannerLevel: this.buildLevel(orderCommentInfo.manner_level),
                hasCommentLogistics: (
                    orderCommentInfo.package_level +
                    orderCommentInfo.shipping_level +
                    orderCommentInfo.manner_level
                ) > 0
            }); 
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}