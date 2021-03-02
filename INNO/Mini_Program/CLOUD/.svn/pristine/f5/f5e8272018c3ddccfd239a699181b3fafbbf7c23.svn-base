const app = getApp();
Page({
    data: {
        list_record: []
    },
    page: 1,
    hasMore: true,
    onLoad: function(options) {
        GetExchangeLogList.call(this);
    },
    handleScrollLower: function(e) {
        if (this.hasMore) {
            GetExchangeLogList.call(this);
        }
    },
    jump_order: function(e) {
      let dataset = e.currentTarget.dataset;
      let mainOrderId = dataset.mainOrderId;
      let mktOrderId = dataset.mktOrderId;
      if (mainOrderId){
        wx.navigateTo({
          url: `/pages/micro_mall/order/order_info?order_id=${mainOrderId}`,
        })
      } else if (mktOrderId){
        wx.navigateTo({
          url: `/pages/micro_mall/point/point_order_detail/point_order_detail?order_id=${mktOrderId}`,
        })
      }else{
        wx.navigateTo({
          url: `/pages/micro_mall/coupon/my_coupon`,
        })
      }
    }
}) 

function GetExchangeLogList() {
    return app.PointApi.GetExchangeLogList({
        params: {
            pageIndex: this.page,
            pageSize: app.Conf.PAGE_SIZE,
        },
        other: {}
    }).then(res => {
        const data = res.data || {};
        const list = data.list || [];
        let total = data && data.totalCount || 0;
        let list_record = list.map(item => {
            return {
                name: item.name,
                integral: item.integral,
                create_time: item.create_time,
                cancel_type: item.cancel_type,
                state: item.state,
                main_order_id: item.main_order_id,
                mkt_order_id: item.mkt_order_id
            }
        });
        this.setData({
            list_record: [...this.data.list_record, ...list_record],
            showPage:true
        });
        this.hasMore = this.page * app.Conf.PAGE_SIZE < total;
        this.page += 1;
    })
}