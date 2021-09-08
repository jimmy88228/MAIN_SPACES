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
        diyStyle:"background:transparent;"
    },
    page: 0,
    hasMore: true,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      this.options = options;
      this.setData({
        "balance_info.sum": options.sum||0,
        "balance_info.un_amount": options.un_amount||0
      })
    },
    onReady: function() { 
        let redpack_logo = this.data.brand_info.default_icon_url + "redpack_logo.png";
        this.setData({
            redpack_logo
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.page = 0;
        // userBalacePoint.call(this);
        balanceList.call(this, this.data.currentIndex); 
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
    nav_init(e){
        console.log('jimmy init',e);
        let initMsg = e&&e.detail||{};
        let detail_top = initMsg.initHeight + initMsg.initTop;
        this.setData({
            detail_top:detail_top||0,
            showNav:true
        }) 
        console.log('initMsg',initMsg,detail_top)
    },
}))

function balanceList() {
    this.page = this.page + 1;
    return app.UserApi.getAccountChangeList({
        params: {
          userToken: app.LM.userToken, 
          brandCode: app.Conf.BRAND_CODE,
          pageIndex: this.page,
          pageSize: app.Conf.PAGE_SIZE
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