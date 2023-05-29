import WxApi from "../../../../../../../common/utils/wxapi/index";
// pages/main/staff-module/repository/goods/spec/add/index.js
const App = getApp();
Page(App.BP({
  data: {
    specCatName: "",
    specCatId: 0,
    specList: [],
    selectedSkuRef: {}, // 在编辑商品规格页面跳转过来，会有，是那边已选择的规格对象;为了不让用户修改删除这些规格
  },
  onLoad(options) {
    this.options = options;
    let selectedSkuRef = App.StorageH.get("selectedSkuRef") || {};
    this.setView({ 
      addPopRef: { get: () => this.findView("#add-pop") }, 
    })
    this.setData({
      specCatId: options.spec_cat_id || 0,
      selectedSkuRef
    })
  },
  onShow() {
    this.getSpecCategoryInfo();
  },
  getSpecCategoryInfo() {
    let specCatId = this.data.specCatId || 0;
    if (!specCatId) return Promise.resolve();
    this.showLoading();
    getSpecCategoryInfo(specCatId)
      .then(data => {
        this.setData({
          specCatName: data[0] && data[0].specCatName || "",
          specList: data[0] && data[0].SpecInfoList || []
        });
      })
      .finally(() => {
        this.hideLoading();
      })
  },
  onInput(e) {
    this.setData({
      specCatName: e.detail.value || ""
    })
  },

  handleAddSpecBtnTap() { // 按下添加规格按钮 
    this.addPopRef.showModal();
  },
  confirm(e) {
    this._setPageLoading('confirm');
    let detail = e.detail;
    this.addSpec(detail);
  },
  addSpec(specName) { // 添加规格操作
    let {
      specList
    } = this.data
    specList.push({
      specId: 0,
      specName
    })
    this.setData({
      specList
    })
    console.log(this.data.specList)
  },
  handleItemDelete(e) { // 长按规格删除操作
    let {
      specList
    } = this.data;
    let index = this.getDataset(e, "index");
    WxApi.showModal({
        title: "确认要删除此规格吗"
      })
      .then(info => {
        if (info.confirm) {
          let nSpecList = specList.filter((item, i) => {
            return i != index
          })
          this.setData({
            specList: nSpecList
          })
        }
      })
  },
  saveSpec() {
    let err = "";
    if(!this.data.specCatName.trim()){
      err = "请输入规格类型名称"  
    }else if(this.data.specList.length<=0){
      err = "请添加具体规格"  
    }
    if(err){
      App.SMH.showToast({title:err});
      return Promise.reject(false);
    }
    this._setPageLoading('saveSpec');
    return createOrUpdateSpecCategoryAll.call(this).then(res=>{
      if(res.code == 1){
        App.SMH.showToast({title:"保存成功"});
        WxApi.navigateBack();
      }
      return res;
    })
  }
}))

function getSpecCategoryInfo(catId) {
  return App.Http.QT_GoodsApi.getSpecCategoryInfo({
      params: {
        catId
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data;
      }
      return Promise.reject(res.msg || "获取规格信息失败")
    })
}



function createOrUpdateSpecCategoryAll() {
  let {specCatId,specCatName,specList}  = this.data
  return App.Http.QT_GoodsApi.createOrUpdateSpecCategoryAll({
      data: {
        catId: Number(specCatId) || 0,
        catName: specCatName,
        SpecInfoList: specList
      }
    })
}