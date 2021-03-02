// pages/micro_mall/buy/buy_coupon.js
var app = getApp();
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        brand_info: {},
        coupon_list: [],
        no_use_coupon: false,
        use_coupon: ''
    },
    page: 0,
    hasMore: true,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.options = options;
        let arrow = this.data.brand_info.icon_url + "micro_mall/coupon/arrow.png";
        let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
        let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
        let storeBonus = this.data.brand_info.icon_url + "micro_mall/coupon/storeBonus.jpg";
        let onlineBonus = this.data.brand_info.icon_url + "micro_mall/coupon/onlineBonus.jpg";
        let bonus_none = this.data.brand_info.icon_url + "micro_mall/coupon/bonus_none.png";
        this.setData({
            arrow: arrow,
            ls_icon2: ls_icon2,
            ls_icon1: ls_icon1,
            storeBonus: storeBonus,
            onlineBonus: onlineBonus,
            bonus_none: bonus_none
        });
        let userChoiceData = app.StorageH.get("userChoiceData")||{};
        this.bonus_id = userChoiceData.use_coupon && userChoiceData.use_coupon.bonus_id || 0;
    },
    onShow() {
        useBonusList.call(this, this.options);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    onShowUseLimit: function(e) {
        var id = e.currentTarget.dataset.id;
        var coupon_list = this.data.coupon_list;
        for (var i in coupon_list) {
            if (i == id) {
                coupon_list[i].showLimit = !coupon_list[i].showLimit;
            } else {
                coupon_list[i].showLimit = false;
            }
        }
        this.setData({
            coupon_list: coupon_list
        });


    },
    noUseCoupon: function() {
        if (this.lock){return}
        var no_use_coupon = this.data.no_use_coupon;
        this.setData({
            no_use_coupon: !no_use_coupon
        })
        //删除缓存数据
        let userChoiceData = app.StorageH.get('userChoiceData') || {};
        delete userChoiceData.use_coupon;
        app.StorageH.set('userChoiceData', userChoiceData);
        wx.showLoading();
        this.lock = true;
        setTimeout(function() {
            wx.navigateBack();
        }, 500);
    },
    useCoupon: function(e) { 
        if (this.lock) { return }
        let bonus_id = e.currentTarget.dataset.bonus_id;
        let coupon_list = this.data.coupon_list;
        let userChoiceData = app.StorageH.get('userChoiceData') || {};
        for (let i in coupon_list) {
            if (coupon_list[i].bonus_id == bonus_id) {
                let use_coupon = coupon_list[i];
                this.setData({
                    use_coupon: use_coupon
                })
                userChoiceData.use_coupon = use_coupon;
                app.StorageH.set('userChoiceData', userChoiceData);
                wx.showLoading();
                this.lock = true;
                setTimeout(function() {
                    wx.navigateBack();
                }, 500);
                return
            } 
        }
    }
}))

function useBonusList(options = {}) {
    this.page = this.page + 1;
    return app.GoodsApi.useBonusList({
        params: {
            userToken: options.userToken || app.LM.userToken, //暂时保留
            bonus_ids: options.bonus_ids, 
            pageIndex: this.page,
            pageSize: app.Conf.PAGE_SIZE,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            for (let i in data) {
                data[i].showLimit = false;
                data[i].type_money = parseInt(data[i].type_money);
                data[i].discountStr = app.NH.getDiscount(data[i].discount);
                if (this.bonus_id){
                    if (data[i].bonus_id == this.bonus_id){
                        this.setData({
                            [`use_coupon.bonus_id`]: this.bonus_id
                        })
                    }
                }
            }
            console.log(data,"-");
            this.setData({
                coupon_list: data
            })
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}