import dateUtil from "../../../../../common/support/utils/date-util";
const app = getApp();
Page(app.BP({
  data: {
    list: [],
    reqParams: {
      pageIndex: 1,
      searchStr: "",
      pageSize: app.Conf.PAGE_SIZE,
    },
    hasMore: true,
    refreshing: false, // 正在刷新
  },
  isLoading: false,
  onLoad(ops){
    this.options = ops;
    getStaffId.call(this)
      .then(handleOptions.bind(this))
      .then(loadData.bind(this))
  },
  onShow(){
    
  },
  handleTap(e){
    const dataset = e.currentTarget.dataset || {};
    const tapType = dataset.tapType || ""
    if (tapType == 'order'){
      wx.navigateTo({url: `/pages/micro_mall/employee_center/distribution_service/bonusOrderList/bonusOrder?order_id=${dataset.orderId}`})
    }
  },
  handleSearchConfirm(e = {}){
    const value = e.detail || "";
    this.setData({
      "reqParams.searchStr": value,
      "reqParams.pageIndex": 1,
      hasMore: true
    }, loadData.bind(this))
  },
  handleSiftConfirm(e){
    let {dateArray, staffIds} = e.detail || {};
    this.dateArray = dateArray || [];
    this.staffIds = staffIds || [];
    console.log("筛选", e.detail)
    this.refreshData();
  },
  scrollToLower(){
    loadNextPage.call(this)
  },
  refreshData(){
    this.setData({
      "reqParams.pageIndex": 1,
      hasMore: true
    })
    loadData.call(this).finally(
      setTimeout(() => {this.setData({refreshing: false})}, 500)
    )
  }
}))

function handleOptions(){
  let options = this.options || {};
  let dateType = options.dateType || "0";
  this.sifter = this.sifter || this.selectComponent("#sifter");

  return this.sifter
  ? this.sifter.setDefault({dateType}).then(loaded => loaded? Promise.reject("已加载，跳出"): Promise.resolve())
  : Promise.resolve()
}

function loadData(params = {}){
  if (!this.data.hasMore) return Promise.reject("没有更多数据")
  else if (this.isLoading) return Promise.reject("正在加载中")
  const {searchStr, pageIndex, pageSize = 20} = this.data.reqParams
  this.isLoading = true;
  return app.ActApi.getBuyBonusOrderStaffList({
    params: {
      searchStr,
      pageIndex,
      pageSize,
      brandCode: app.Conf.BRAND_CODE,
      staffId: this.staffId || 0, // 本用户的staffId，接口那边可能不好查，所以带上了
      staffIds: this.staffIds && this.staffIds.join(",") || "", // 要查询的店员ids
      beginDate: this.dateArray && this.dateArray[0] || "1970-1-1 00:08:00", // 带上默认开始时间
      endDate: this.dateArray && this.dateArray[1] || dateUtil.format(new Date(), "yyyy-MM-dd hh:mm:ss"), // 带上默认现在时间
      manageStoreId: (app.LM.storeInfo && app.LM.storeInfo.manageStoreId) || app.StoreH.storeId || "",
      ...params
    },
    other: {
        isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1){
      const data = res.data || {};
      const {totalCount, totalAmount} = data;
      const list = this.data.list || [];
      let listData = data.list || [];
      let hasMore = list.length + listData.length < totalCount;
      this.setData({
        list: pageIndex == 1 ? listData : [...list, ...listData],
        totalCount,
        totalAmount,
        hasMore
      })
      return Promise.resolve(res)
    }
    return Promise.reject(res)
  }).catch((err = {}) => {
    app.SMH.showToast({title: err.msg || err || "获取店员提成比例失败"})
  }).finally(() => {this.isLoading = false})
}

function loadNextPage(){
  if (!this.data.hasMore){
    app.SMH.showToast({title: "没有更多数据"});
    return Promise.reject("没有更多数据")
  } 
  this.setData({
    "reqParams.pageIndex": this.data.reqParams.pageIndex + 1
  })
  return loadData.call(this).catch(err => {app.SMH.showToast({title: err || '加载下一页失败'})})
}

function getStaffId(){
  return app.LM.checkIfStore()
    .then(data => {
      if (data.staff_id) {
        this.staffId = data.staff_id;
        return Promise.resolve(data.staff_id)
      }
      console.log("用户不是店员", data)
      return Promise.reject("用户不是店员")
    })
    .catch(err => {
      console.log("获取店员信息失败", err);
      return Promise.reject("获取店员信息失败")
    })
}