// pages/integral/myIntegral.js
var app = getApp();
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        log_info: {
            userPointsLog: [],
            user_points: 0
        },
        integral_list: [],
        integral_info: {},
        s_config: {},
        brand_info: {},
        showImg: true,
        url: "",
        currentIndex: 0,
        showTab: false, //false,
        tabList: [{
            label: 0,
            value: "积分明细",
        }, {
            label: 1,
            value: "即将失效积分"
        }],
        totalExpirePoint:0,
        tempShow:app.Conf.BRAND_CODE != "GOSO" //临时
    },
    page: 0,
    hasMore: true,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.loadingList(); 
        initTab.call(this);
    },
    onReady: function() {
        let str = this.data.brand_info.icon_url + "micro_mall/integral/user_center_points.png";
        let point_url = this.data.brand_info.icon_url + "micro_mall/Integral/point_icon.png";
        let power_url = this.data.brand_info.icon_url + "micro_mall/Integral/my_power.png";
        let deduction_url = this.data.brand_info.icon_url + "micro_mall/Integral/point_deduction.png";
        this.setData({
            url: str,
            point_url: point_url,
            power_url: power_url,
            deduction_url: deduction_url,
            showImg: false
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.page = 0;
        if(this.data.currentIndex == 0){
            userBalacePoint.call(this);
        } 
        pointList.call(this, this.data.currentIndex);

        this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        this.pageHome.initPageHome();
    },
    handle_scroll: function() {
        if (this.hasMore) {
            pointList.call(this, this.data.currentIndex);
        } else {
            app.SMH.showToast({
                "title": "已经到底啦！"
            })
        }
    },
    changeTab: function(e) {
        console.log(e);
        let dataset = e.currentTarget.dataset || {};
        let num = dataset.num || 0;
        if (num == this.data.currentIndex) {
            return
        }
        this.setData({
            currentIndex: num,
        });
        console.log('currentIndex', this.data.currentIndex)
        reset.call(this);
        pointList.call(this, this.data.currentIndex);
    },
    onShareAppMessage: function() {

    },
    // loadingList:function(){
    //   var that = this;
    //   var is_more = this.data.is_more;
    //   var log_info = this.data.log_info;
    //   var page_size = this.data.page_size;
    //   var reqData = { "page": page_size };
    //   if (!is_more){
    //     return;
    //   }
    //   wx.showLoading({
    //     title: '加载中，请稍后',
    //   })
    //   app.wxReq('', "ucenter_getUserPointLog", reqData, function (info) {
    //     wx.hideLoading();
    //     if(info.error != 0){
    //       wx.showToast({
    //         title: info.message ? info.message : '请求错误',
    //         image: '/images/micro_mall/cn/err_tip_icon.png'
    //       })
    //       return;
    //     }
    //     var data_info = info.data;
    //     var userPointsLog = data_info.userPointsLog;
    //     var system_config = info.system_config;
    //     //检测返回的数据是否为空！
    //     if (userPointsLog && userPointsLog.length > 0){
    //       page_size ++;
    //     }else{
    //       is_more = false;
    //     }
    //     for (var i in userPointsLog){
    //       log_info.userPointsLog.push(userPointsLog[i]);
    //     }
    //     data_info.userPointsLog = log_info.userPointsLog;
    //     that.setData({
    //       page_size: page_size,
    //       log_info: data_info,
    //       is_more: is_more,
    //       s_config: system_config
    //     });
    //   });

    // }
}))

function pointList(label=0) {
    label = label || 0;
    console.log('label', label)
    this.page = this.page + 1;
    let url = label == 1 ? 'get_UserExpirePoint' :'pointList'
    let params = {
    };
    if (label == 0){
        params.pageIndex = this.page ; 
        params.pageSize = app.Conf.PAGE_SIZE;
    }
    return app.UserApi[url]({
        params: params,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {

            if (label == 0){
                let integral_list = this.page == 1 ? [] : this.data.integral_list;
                if (e.data.length == 0) {
                    this.hasMore = false;
                } else {
                    this.hasMore = true;
                }
                integral_list = integral_list.concat(e.data);
                this.setData({
                    integral_list: integral_list || []
                })
                return Promise.resolve(e);
            }

            if(label == 1){
                let integral_list = this.page == 1 ? [] : this.data.integral_list;
                let data = e.data || {};
                console.log('1---',e)
                if (!data.detail || (data.detail.length == 0)) {
                    this.hasMore = false;
                } else {
                    this.hasMore = true;
                }
                integral_list = integral_list.concat(data.detail || []);
                this.setData({
                    integral_list: integral_list || [],
                    totalExpirePoint: data.totalExpirePoint || 0
                })
                return Promise.resolve(e);
            }
           

        }
        return Promise.reject(e);
    })
}

function userBalacePoint() {

    return app.UserApi.userBalacePoint({
        params: {
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data || {};
            data.exchange_money = (parseFloat(data.exchange_rate) * parseFloat(data.totalPoint)).toFixed(2)
            this.setData({
                integral_info: e.data || {}
            })
            return Promise.resolve(e);
        }
        return Promise.reject();
    })

}

function initTab() {
    // is_show_expired_point is_show_expire_point
    app.sysTemConfig('is_show_expire_point').then(res => {
        let value = res.Value || 0;
        console.log('配置', res)
        if (value == '1') {
            this.setData({
                showTab: true
            });
        }
    })
}

function reset() {
    this.page = 0;
    this.hasMore = true;
    this.data.integral_list = [];
    this.setData({
        integral_list: []
    })
}