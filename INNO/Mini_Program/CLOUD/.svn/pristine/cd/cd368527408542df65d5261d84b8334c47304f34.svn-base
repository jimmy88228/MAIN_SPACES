// pages/micro_mall/prepaid/prepaid_card_erp_detail.js
var app = getApp();
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        dataList: [],
        hideRecord: true
    },
    onLoad(options){
      this.options = options;
      checkRemark.call(this);
    },
    onReady() {
        this.hasMore = true;
        this.page = 1;
        loadData.call(this);
    },
    onReachBottom: function () {
        if (this.hasMore) {
            loadData.call(this);
        } else {
            app.SMH.showToast({
                "title": "已经到底啦！"
            });
        }
    },
}))

function loadData() {
    return app.UserApi.getUserStoredValueFlowList({
        params: {
            pageIndex: this.page,
            pageSize: app.Conf.PAGE_SIZE,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            let currentPage = this.data.dataList;
            let totalCount = data.totalCount;
            let newData = data.dataList;
            if (this.page > 1) {
                newData = currentPage.concat(newData);
            }
            this.setData({
                hideRecord: false,
                dataList: newData,
                totalAmount: this.options.storeValue || data.totalAmount
            });
            if (this.data.dataList.length === totalCount) {
                this.hasMore = false;
            }
        }
    }).finally(() => {
        this.page += 1;
    });
}

function checkRemark(){
    return app.sysTemConfig('is_hide_storevalue_remark').then(data => {
        this.setData({
          hideRemark: data && data.Value || 0,
          showMsg:true
        })
    })
} 