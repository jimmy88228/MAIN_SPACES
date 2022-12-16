import WxApi from "../../../../../common/helper/wx-api-helper";

const app = getApp();
Page(app.BP({
  data: {
    tableHead: ['店员名字', '比例', '更新时间'],
    list: [],
    allStaffCommRate: "", // 统一设置比例
    isSlotContent: "", // 对话框是否加载slot;  "": 不加载slot; "llSet": 统一设置比例窗口
    reqParams: {
      pageIndex: 1,
      searchStr: "",
      pageSize: app.Conf.PAGE_SIZE,
    },
    hasMore: true,
    refreshing: false, // 正在刷新
  },
  isLoading: false,
  availableRatioSettingRange: [0, 100], // 可设置的比例范围
  onLoad(ops){
    checkConfigFn.call(this).finally(loadData.bind(this))
  },
  onShow(){
    
  },
  handleSearchConfirm(e = {}){
    const value = e.detail || "";
    this.setData({
      "reqParams.searchStr": value,
      "reqParams.pageIndex": 1,
      hasMore: true
    }, loadData.bind(this))
  },
  ontap(e){
    const {type} = e.currentTarget.dataset;
    if (type === 'setAll') toggleAllSetDialog.call(this, e)
  },
  handleUserInput(e){
    const {keyname = "", id: staffId} = e.currentTarget.dataset || {};
    let value = e.detail.value || "";
    if (keyname == 'singleRatio') { // 修改单个店员比例
      const {targetIndex} = findItemById.call(this, staffId) || {};
      if (targetIndex >= 0){
        this.setData({[`list[${targetIndex}].commRate`]: value})
      }
      return
    }
    this.setData({
      [keyname]: value
    })
  },
  handleInputBlur(e){
    const staffId = e.currentTarget.dataset.id,
      targetItem = findItemById.call(this, staffId).targetItem;
    let commRate = targetItem.commRate
    if (commRate === "未设置" || !validateRatio.call(this, commRate)) return;
    setRatio.call(this, {staffId, commRate});
  },
  handleInputFocus(e){
    const staffId = e.currentTarget.dataset.id,
      {targetItem, targetIndex} = findItemById.call(this, staffId);
    let commRate = targetItem.commRate
    if (commRate === "未设置") {this.setData({[`list[${targetIndex}].commRate`]: ""})}
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

function checkConfigFn() {
  return app.CL_StoreCommApi.getStoreCommConfig({
    params: {
      "brandCode": app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1 && res.data) {
      const {minCommRate, maxCommRate} = res.data || {}
      this.availableRatioSettingRange = [minCommRate, maxCommRate]
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}

function loadData(params = {}){
  if (!this.data.hasMore) return Promise.reject("没有更多数据")
  else if (this.isLoading) return Promise.reject("正在加载中")
  const {searchStr, pageIndex, pageSize = 20} = this.data.reqParams
  this.isLoading = true;
  return app.CL_StoreCommApi.getStaffCommRateList({
    params: {
      searchStr,
      pageIndex,
      pageSize,
      manageStoreId: (app.LM.storeInfo && app.LM.storeInfo.manageStoreId) || app.StoreH.storeId || "",
      ...params
    },
    other: {
        isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1){
      const data = res.data || {};
      const maxCount = data.count;
      const list = this.data.list || [];
      let listData = data.list || [];
      let hasMore = list.length + listData.length < maxCount;
      this.setData({
        list: pageIndex == 1 ? listData : [...list, ...listData],
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

function setRatio({commRate, staffId}, isAll = false){
  let reqFn = isAll ? app.CL_StoreCommApi.changeAllStaffCommRate : app.CL_StoreCommApi.changeStaffCommRate;
  let data = {
    commRate: Number(Number(commRate).toFixed(2)), // 仅是保留2位小数
  };
  isAll && (data.manageStoreId = (app.LM.storeInfo && app.LM.storeInfo.manageStoreId) || app.StoreH.storeId || "");
  !isAll && (data.staffId = staffId);
  this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
  return reqFn({data}).then(res => {
    if (res.code == "1") {
      wx.nextTick(() => {
        this.pageDialog.setTitle(`设置成功`);
        this.pageDialog.setSingleBtn();
        this.pageDialog.show();
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(err => {
    this.pageDialog.setTitle(err.msg || err || `设置失败`);
    this.pageDialog.setSingleBtn();
    this.pageDialog.show();
  }).finally(this.refreshData)
}

function toggleAllSetDialog(e){
  this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
  this.pageDialog.setTitle(`统一设置比例`);
  this.pageDialog.setTwoBtn({
      name: "取消",
      tap: () => {
        this.pageDialog.dismiss();
        setTimeout(() => {this.setData({ 'isSlotContent': "" })}, 500)
      }
  }, {
      name: "保存",
      tap: () => {
          let allStaffCommRate = this.data.allStaffCommRate;
          if (!validateRatio.call(this, allStaffCommRate)) return;
          this.pageDialog.dismiss();
          setTimeout(() => {this.setData({ 'isSlotContent': "" }, () => {setRatio.call(this, {commRate: allStaffCommRate}, true)})}, 500)
      }
  })
  this.setData({ 'isSlotContent': 'allSet' }, () => {
    this.pageDialog.show();
  })
}

function findItemById(staffId){
  const list = this.data.list || [];
  let targetItem = {}, targetIndex = -1;
  list.some((item,index) => {
    if (item.staffId === staffId){
      targetItem = item;
      targetIndex = index;
      return true
    }
  })
  return {targetItem, targetIndex}
}

function validateRatio(number){
  let [minCommRate, maxCommRate] = this.availableRatioSettingRange;
  if ((typeof number === "string" && !number.trim()) || Number(number) < minCommRate || Number(number) > maxCommRate) {
    let title = "提示",
      content = `请输入${minCommRate}~${maxCommRate}之间的数字`;
    if (this.data.isSlotContent){
      WxApi.showModal({
        title,
        content,
        showCancel: false,
        confirmText: '好的'
      })
    } else{
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      this.pageDialog.setTitle(title);
      this.pageDialog.setCentent(content);
      this.pageDialog.setSingleBtn(
        {
          name: "好的",
          tap: () => {
            this.pageDialog.setCentent("");
            this.pageDialog.dismiss();
          }
        }
      )
      this.pageDialog.show()
    }
    return false
  }
  return true
}