import WxApi from "../../../common/utils/wxapi/index";

const TAB_INDEX_REF = {
  "all": 0,
  "wait_to_pay": 1,
  "wait_to_shipping": 2,
  "wait_to_receiving": 3
}

const App = getApp();
Page(App.BP({
  data: {
    orderTabList: [{
        state: 0,
        title: "全部",
        key: "all",
        params: {
          pageIndex: 1,
          pageSize: 20
        },
        nomore: false,
        list: [{}, {}, {}, {}]
      },
      {
        state: 1,
        title: "待付款",
        key: 'wait_to_pay',
        params: {
          pageIndex: 1,
          pageSize: 20
        },
        nomore: false,
        list: []
      },
      {
        state: 2,
        title: "发货中",
        key: 'wait_to_shipping',
        params: {
          pageIndex: 1,
          pageSize: 20
        },
        nomore: false,
        list: []
      },
      {
        state: 3,
        title: "已发货",
        key: 'wait_to_receiving',
        params: {
          pageIndex: 1,
          pageSize: 20
        },
        nomore: false,
        list: []
      }
    ],
    activeTabIndex: 0, // 选中tab的index
  },
  onLoad(query) {
    this.pageQuery = query;
    let {orderType = "all"} = query;
    this.setData({
      activeTabIndex: TAB_INDEX_REF[orderType]
    })
  },
  handleOrderTabTap(e) {
    const index = this.getDataset(e,"index");
    if (index === this.data.activeTabIndex) return;
    this.setData({
      activeTabIndex: index
    })
  },
  handleSwiperChange(e) {
    const current = e.detail.current || 0;
    if (current === this.data.activeTabIndex) return;
    this.setData({
      activeTabIndex: current
    })
  },
  handleOrderItemTap(e) {
    WxApi.navigateTo({
      url: `/pages/micro_mall/order/order_info?order_id=1`
    })
  }
}))