const app = getApp();
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        tabList: [{
            id: "bonus",
            value: "兑换优惠券"
        }, {
            id: "goods",
            value: "兑换礼品"
        }],
        autoLeft: 163,
        currentIndex: 0,
        memberInfo: {}
    },
    onShareAppMessage(){
        let index = this.data.currentIndex;
        let title = index == 0?'快和我一起来积分商城兑换优惠券！':'快和我一起来积分商城兑换商品！';
        let type = index == 0?'bonus':'goods';
        return {
            isCustom:true,
            imageUrl:"",
            title: title,
            path: `/pages/micro_mall/point/point_goods_list/point_goods_list?type=${type}`
        }
    },
    onLoad: function(options) {
        let type = options.type;
        let currentIndex = 0;
        if (type == "bonus") {
            currentIndex = 0;  
        } else if (type == "goods") {
            currentIndex = 1; 
        }
        this.setData({
            currentIndex: currentIndex
        });
    },
    onReady(){
        getMyInfoByIM.call(this);
        loadData.call(this);
    },
    onReachBottom: function() {
        // console.log("加载")  
        this.goodsList = this.goodsList || this.selectComponent("#integralMall");
        this.goodsList.handleMore();
    },
    changeTab(e) {
        let dataset = e.currentTarget.dataset;
        let index = dataset.index;
        let currentIndex = this.data.currentIndex;
        if (currentIndex == index) return;
        this.setData({
            currentIndex: index,
            autoLeft: index==0?163:534
        })
        loadData.call(this);
    },
    jump_record(e){
        wx.navigateTo({
            url: '../point_record/point_record',
        })
    }
}))

function loadData() {
    let currentIndex = this.data.currentIndex;
    this.integralMall = this.integralMall || this.selectComponent("#integralMall");
    this.integralMall.installData(currentIndex);
}

function getMyInfoByIM() {
    return app.UserApi.getUserInfoWap({
        params: {
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        extraData: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data;
            this.setData({
                memberInfo: data
            })
        }
    })
}