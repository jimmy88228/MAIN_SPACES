// components/pop/adsPop.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    bindStoreId:{
      type:Number,
      value:0
    },
    bindStaffId: {
      type: Number,
      value: 0
    },
    setStyle:{
      type:String,
      value:""
    }
  },
  data: {
    haveMore: true,
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    list: [],
    selectedEmployees: {},
  },
  ready(){
    let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
    this.setData({ls_icon1, ls_icon2})
  },
  pageLifetimes: {
    show() {
      this.reqParams = {
        pageIndex: 1,
        pageSize: app.Conf.PAGE_SIZE || 20
      }
    },
    hide() {

    }
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transform: translate(-50%, 0);transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transform: translate(-50%, 100%);transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    activate() {
      !this.firstTimeLoaded && getUserStoreInfo.call(this)
        .then(() => {
          loadData.call(this);
        })
        .catch(err => {app.SMH.showToast({title: err.msg || err || "获取店员信息失败"})})
      this.show()
    },
    handleEmployeeSelect(e){
      const {id: staffId, name: staffName} = e.currentTarget.dataset;
      const selectedEmployees = this.data.selectedEmployees || {};
      this.setData({[`selectedEmployees.${staffId}`]: selectedEmployees[staffId] ? "" : staffName})
    },
    handleSelectConfirm(){
      const selectedEmployees = this.data.selectedEmployees || {};
      let selectedEmployeesList = [];
      for (let staffId of Object.keys(selectedEmployees)){
        const staffName = selectedEmployees[staffId];
        staffName && selectedEmployeesList.push({staffId, staffName})
      }
      this.triggerEvent("selectfinished", selectedEmployeesList);
      return this.dismiss();
    },
    handleScrollToLower(){
      if (!this.data.haveMore) return app.SMH.showToast({title: "已无更多数据"})
      this.reqParams.pageIndex++;
      loadData.call(this).catch(err => {app.SMH.showToast({title: err.msg || err || "获取店员信息失败"})})
    },
    _noFn() {},
  }
}))

function loadData(){
  if (!this.data.haveMore) return Promise.reject("已无更多数据")
  return app.UserApi.getStoreStaffList({
    params:{
      storeId: this.storeInfo.manageStoreId || this.storeInfo.store_id || 0,
      searchText: "",
      pageIndex: this.reqParams.pageIndex,
      pageSize: this.reqParams.pageSize,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    this.firstTimeLoaded = true; // 完成过一次加载
    if (res.code == 1){
      const list = res.data && res.data.list || [],
        _list = this.data.list || [],
        totalCount = res.data && res.data.totalCount || 0;
      this.setData({
        list: this.reqParams.pageIndex == 1 ? list : [..._list, ...list],
        haveMore: list.length + _list.length < totalCount
      })
      return Promise.resolve(res)
    }
    return Promise.reject(res)
  })
}

// 该用户店员信息
function getUserStoreInfo(){
  return app.LM.checkIfStore().then(data => {
      data = data || app.LM.storeInfo;
      console.log("检测店员", data);
      if (data && data.staff_id){
        this.storeInfo = data;
        return Promise.resolve(data)
      } else return Promise.reject(data)
    }).catch(e => {
      console.log("获取店员信息失败, 原因: ", e)
      return Promise.reject("获取店员信息出错")
    })
}