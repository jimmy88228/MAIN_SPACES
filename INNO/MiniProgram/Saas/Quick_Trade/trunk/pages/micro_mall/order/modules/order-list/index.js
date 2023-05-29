import WxApi from "../../../../../common/utils/wxapi/index";
const App = getApp();
Component(App.BC({
  properties:{
    orderTabList:Array,
    isHideTab:Boolean,
    fromType:String, 
  },
  data: {
    // orderTabList: JSON.parse(JSON.stringify(DEFAULT_ORDER_TAB_LIST)),
    activeTabIndex: 0, // 选中tab的index
    _searchStr: "", // 搜索关键字(临时存着，点了搜索才赋值给searchStr)
    pullDownRefreshing: false, // 下拉刷新中
    inited:false
  },
  methods:{
    onLoadFunc(query,index=0,searchStr) {
      this.pageQuery = query;
      this.searchStr = searchStr || ""; // 搜索关键字
      this.setData({
        staff_type:query.staff_type||0,
        _searchStr:this.searchStr
      })
      switchActiveTab.call(this, index)
    },
    onShowFunc() {
      this.init();
    },
    init(){
      App.LM.loginAsync(false).ignore(()=>{
        this.setData({inited:true,isLogin:App.LM.isLogin})
        loadOrderList.call(this)
      })
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
      this._throttle('handleSearchBtnTap');
      let {_searchStr, activeTabIndex} = this.data;
      this.searchStr = _searchStr;
      this.setData({
        [`orderTabList[${activeTabIndex}]params.pageIndex`]: 1,
        [`orderTabList[${activeTabIndex}].nomore`]: false,
      }, loadOrderList.bind(this))
    },
    handleScrollToLower() {
      console.log("handleScrollToLower")
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
      console.log("handleRefresh")
      if (this.refreshing) return; // 解决下拉刷新，有时会多次触发这个方法的问题
      this.refreshing = true;
      this.setData({pullDownRefreshing: true})
      refreshCurrentOrderTab.call(this)
        .then(() => {
          setTimeout(() => {this.setData({pullDownRefreshing: false})}, 100)
        })
        .finally(() => {this.refreshing = false})
    },
    handleOrderItemTap(e) {
      this._throttle('handleOrderItemTap');
      let orderId = this.getDataset(e,'orderId');
      let staffType = this.pageQuery.staff_type || 0
      let url = `/${App.Conf.navConfig.ORDER_DETAIL}?order_id=${orderId||0}&staff_type=${staffType}`;
      this.properties.fromType == 'return' && (url = `/${App.Conf.navConfig.ORDER_RETURN_DETAIL}?alterSaleId=${orderId||0}&staff_type=${staffType}`);
      WxApi.navigateTo({
        url
      })
    }, 
    loginCallback(){
      this.init();
    },
    return_return(e){
      this._throttle('return_return');
      let {orderSn,refundType} = this.getDataset(e);
      let staff_type = this.pageQuery.staff_type||'0';
      let orderType = staff_type == 1 ? refundType == 1 ? 'refund' : 'return' : '';
      this.jumpAction(`/${App.Conf.navConfig.ORDER_RETURN_LIST}?searchStr=${orderSn}&staff_type=${staff_type}&orderType=${orderType}`)
    }
  },
}))

function switchActiveTab(index) {
  this.setData({
    activeTabIndex: index
  })
}

function loadOrderList() {
  if(!App.LM.isLogin){
    return Promise.reject(false)
  }
  let {
    activeTabIndex = 0, orderTabList = []
  } = this.data;
  let orderTab = orderTabList[activeTabIndex] || {};
  let {
    pageIndex,
    // pageSize,
  } = orderTab.params;
  this.showLoading();
  return App.Http[orderTab.api][orderTab.url]({
      params: {
        // orderType: orderTab.state,
        staffType:  this.pageQuery.staff_type || 0,
        searchStr: this.searchStr,
        ...orderTab.params,   
      }
    })
    .then(res => {
      if (res.code == 1) {
        let {
          list: _list,
          count = 0
        } = res.data;
        let currentList = orderTab.list || [];
        if(this.properties.fromType == 'return'){
          _list = _list.map(item=>({
            ...item,
            orderSn:item.altersaleSn||"", 
            orderAmount:item.realRefundAmount||0,
            goodsNumber:item.altersaleGoodsnum||0,
            orderId:item.id||0,
            orderStatus:item.altersaleStatus||"",
            goodsList:item.goodsList.map(l_item=>({
              ...l_item,
              thumbUrl:l_item.goodsImg||"",
            }))
          }))
        }
        let list = pageIndex === 1 ? _list : [...currentList, ..._list];
        this.setData({
          [`orderTabList[${activeTabIndex}]list`]: list,
          [`orderTabList[${activeTabIndex}]nomore`]: list.length >= count,
        })
        console.log('orderTabList',this.data.orderTabList)
        return res.data
      }
      return Promise.reject(res.msg || "获取订单列表失败");
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
      _searchStr: "",
      [`orderTabList[${activeTabIndex}]params.pageIndex`]: 1,
      [`orderTabList[${activeTabIndex}].nomore`]: false,
    }, () => {
      loadOrderList.call(this).ignore(res => rs(res))
    })
  })
}