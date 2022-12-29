import WxApi from "../../../common/utils/wxapi/index";

const TAB_INDEX_REF = {
  "all": 0,
  "wait_to_pay": 1,
  "wait_to_shipping": 2,
  "wait_to_receiving": 3
}

const DEFAULT_ORDER_TAB_LIST = [{
    state: 0,
    title: "全部",
    key: "all",
    params: {
      pageIndex: 1,
      pageSize: 20
    },
    nomore: false,
    list: []
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
]

const App = getApp();
Page(App.BP({
  data: {
    orderTabList: JSON.parse(JSON.stringify(DEFAULT_ORDER_TAB_LIST)),
    activeTabIndex: 0, // 选中tab的index
    _searchStr: "", // 搜索关键字(临时存着，点了搜索才赋值给searchStr)
    pullDownRefreshing: false, // 下拉刷新中
  },
  onLoad(query) {
    this.pageQuery = query;
    this.searchStr = ""; // 搜索关键字
    switchActiveTab.call(this, query.orderType || "all")
  },
  onShow() {
    loadOrderList.call(this)
  },
  handleOrderTabTap(e) {
    const index = this.getDataset(e, "index");
    this.changeOrderTab(index);
  },
  handleSwiperChange(e) {
    const current = e.detail.current || 0;
    this.changeOrderTab(current);
  },
  changeOrderTab(index) {
    if (index === this.data.activeTabIndex) return;
    this.setData({
      activeTabIndex: index
    }, refreshCurrentOrderTab.bind(this))
  },
  handleSearchInput(e) {
    const value = e.detail.value || "";
    this.setData({
      _searchStr: value
    })
  },
  handleSearchBtnTap() {
    let {_searchStr, activeTabIndex} = this.data;
    this.searchStr = _searchStr;
    this.setData({
      [`orderTabList[${activeTabIndex}]params.pageIndex`]: 1,
      [`orderTabList[${activeTabIndex}].nomore`]: false,
    }, loadOrderList.bind(this))
  },
  handleScrollToLower() {
    let {orderTabList ,activeTabIndex} = this.data;
    let orderTab = orderTabList[activeTabIndex];
    if (orderTab.nomore) {
      App.SMH.showToast({title: "已经到底了哦"});
      return;
    }
    this.setData({
      [`orderTabList[${activeTabIndex}]params.pageIndex`]: orderTab.params.pageIndex + 1,
    }, loadOrderList.bind(this))
  },
  handleRefresh() {
    this.setData({pullDownRefreshing: true})
    refreshCurrentOrderTab.call(this)
      .then(() => {this.setData({pullDownRefreshing: false})})
  },
  handleOrderItemTap(e) {
    let orderId = this.getDataset(e, "orderId");
    let staffType = this.pageQuery.staff_type || 0
    WxApi.navigateTo({
      url: `/pages/micro_mall/order/order_info?order_id=${orderId}&staff_type=${staffType}`
    })
  }
}))

function switchActiveTab(orderType) {
  this.setData({
    activeTabIndex: TAB_INDEX_REF[orderType]
  })
}

function loadOrderList() {
  let {
    activeTabIndex = 0, orderTabList = []
  } = this.data;
  let orderTab = orderTabList[activeTabIndex] || {};
  let {
    pageIndex,
    pageSize
  } = orderTab.params;
  this.showLoading();
  return App.Http.QT_BuyApi.getOrderList({
      params: {
        orderType: activeTabIndex,
        staffType: this.pageQuery.staff_type ? 1 : 0,
        isOrderForCustom: 0,
        searchStr: this.searchStr,
        pageIndex,
        pageSize
      }
    })
    .then(res => {
      if (res.code == 1) {
        let {
          list: _list,
          count = 0
        } = res.data
        let currentList = orderTab.list || [];
        let list = pageIndex === 1 ? _list : [...currentList, ..._list];
        this.setData({
          [`orderTabList[${activeTabIndex}]list`]: list,
          [`orderTabList[${activeTabIndex}]nomore`]: list.length >= count,
        })
        return res.data
      }
      return Promise.reject(res.msg || "获取订单列表失败");
    })
    .catch(err => {
      console.log("getOrderList err", err);
      App.SMH.showToast({
        title: err
      });
      return Promise.reject(err);
    })
    .finally(() => {
      this.hideLoading();
    })
}

function refreshCurrentOrderTab() {
  let activeTabIndex = this.data.activeTabIndex || 0;
  this.searchStr = "";
  return new Promise(rs => {
    this.setData({
      [`orderTabList[${activeTabIndex}]params.pageIndex`]: 1,
      [`orderTabList[${activeTabIndex}].nomore`]: false,
    }, () => {
      loadOrderList.call(this).finally(res => rs(res))
    })
  })
}