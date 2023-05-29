const TAB_INDEX_REF = { //tab顺序
  "all": 0,
  "refund": 0,
  "return": 1,
}

const DEFAULT_ORDER_TAB_LIST = [{
  state: 0,
  title: "全部",
  key: "all",
  api:"QT_OrderReturnApi",
  url:"getAfterSaleList",
  params: {
    pageIndex: 1,
    pageSize: 20,  
    refundType:0,
  },
  nomore: false,
  list: []
}]

const DEFAULT_ORDER_TAB_LIST_STAFF = [{
  state: 0,
  title: "退款单",
  key: "refund",
  api:"QT_OrderReturnApi",
  url:"getAfterSaleList",
  params: {
    pageIndex: 1,
    pageSize: 20,  
    refundType:1,
  },
  nomore: false,
  list: []
},
{
  state: 1,
  title: "退货单",
  key: 'return',
  api:"QT_OrderReturnApi",
  url:"getAfterSaleList",
  params: {
    pageIndex: 1,
    pageSize: 20,
    isOrderForCustom: 0,
    refundType:2,
  },
  nomore: false,
  list: []
}]

const App = getApp();
Page(App.BP({ 
  data:{
    orderTabList:[],
    staffType:0,
    isInited:false
  },
  onLoad(query) { 
    this.setView({ 
      orderListRef: { get: () => this.findView("#orderList") }, 
    })
    let orderTabList = JSON.parse(JSON.stringify(query.staff_type == 1 ? DEFAULT_ORDER_TAB_LIST_STAFF:DEFAULT_ORDER_TAB_LIST));
    this.setData({
      orderTabList,
      staffType:query.staff_type||0,
    },()=>this.setData({isInited:true}))
    this.orderListRef.onLoadFunc(query,switchActiveTab(query.orderType || "all"),query.searchStr||"");
  },
  onShow() {
    this.orderListRef.init(); 
  },
}))


function switchActiveTab(orderType) {
  return TAB_INDEX_REF[orderType]; 
}
