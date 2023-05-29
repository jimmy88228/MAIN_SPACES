// pages/balance/mybalance.js
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
        balance_list: [],
        balance_info: {},
        s_config: {},
        brand_info: {},
        showImg: true,
        url: "",
        totalExpirePoint:0,
    },
    page: 0,
    hasMore: true,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      this.options = options;
      this.setData({
        "balance_info.balance": options.balance,
        "balance_info.title": options.title
      })
      wx.setNavigationBarTitle({
        title: options.title,
      })
    },
    onReady: function() {
        let str = this.data.brand_info.icon_url + "micro_mall/balance/user_center_points.png";
        let point_url = this.data.brand_info.icon_url + "micro_mall/balance/point_icon.png";
        let power_url = this.data.brand_info.icon_url + "micro_mall/balance/my_power.png";
        let deduction_url = this.data.brand_info.icon_url + "micro_mall/balance/point_deduction.png";
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
        // userBalacePoint.call(this);
        balanceList.call(this, this.data.currentIndex);
        this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        this.pageHome.initPageHome();
    },
    handle_scroll: function() {
        if (this.hasMore) {
            balanceList.call(this);
        } else {
            app.SMH.showToast({
                "title": "已经到底啦！"
            })
        }
    },
}))

function balanceList() {
    this.page = this.page + 1;
    return app.UserApi.getAccountChangeList({
        params: {
          pageIndex: this.page,
          pageSize: app.Conf.PAGE_SIZE,
          brandCode: app.Conf.BRAND_CODE,
          userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
          let balance_list = this.page == 1 ? [] : this.data.balance_list;
          let data = e.data || {};
          let totalRecords = data.totalRecords || 0;
          let dataList = data.dataList || [];
          if (dataList.length == 0) {
              this.hasMore = false;
          } else {
              this.hasMore = true;
          }
          balance_list = balance_list.concat(dataList);
          this.setData({
              balance_list: balance_list || []
          })
          return Promise.resolve(e);
        }
        return Promise.reject(e);
    })
}

// function userBalacePoint() {

//     return app.UserApi.userBalacePoint({
//         params: {
//             userToken: app.LM.userToken,
//             brandCode: app.Conf.BRAND_CODE
//         },
//         other: {
//             isShowLoad: true
//         }
//     }).then(e => {
//         if (e.code == "1") {
//             let data = e.data || {};
//             data.exchange_money = (parseFloat(data.exchange_rate) * parseFloat(data.totalPoint)).toFixed(2)
//             this.setData({
//                 balance_info: e.data || {}
//             })
//             return Promise.resolve(e);
//         }
//         return Promise.reject();
//     })

// }

function reset() {
    this.page = 0;
    this.hasMore = true;
    this.data.balance_list = [];
    this.setData({
        balance_list: []
    })
}