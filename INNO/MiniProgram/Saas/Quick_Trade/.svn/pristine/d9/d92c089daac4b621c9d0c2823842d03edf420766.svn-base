import WxApi from "../../../../../../../common/utils/wxapi/index";

// pages/main/staff-module/repository/goods/spec/edit/index.js
const App = getApp();
Page(App.BP({
  data: {
    inpuVal: "",
    specInfo: []
  },
  onLoad() {

  },
  onShow() {
    this.getSpecCategoryInfo();
  },
  getSpecCategoryInfo() {
    this.showLoading();
    return getSpecCategoryInfo()
      .then(data => {
        this.setData({
          specInfo: data
        })
      })
      .finally(() => {
        this.hideLoading();
      })
  },
  handleDeleteBtnTap(e) {
    let catId = this.getDataset(e, "catId");
    WxApi.showModal({
        title: "温馨提示",
        content: "确定要删除此规格吗?"
      })
      .then(info => {
        if (info.confirm) {
          deleteSpecCate.call(this, catId)
        }
      })

  },
  handleModifyBtnTap() {

  }
}))

function getSpecCategoryInfo() {
  return App.Http.QT_GoodsApi.getSpecCategoryInfo({
    params: {
      catId: 0, //查全部
    }
  })
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "获取规格信息失败")
    })
}

function deleteSpecCate(catId) {
  this.showLoading();
  return App.Http.QT_GoodsApi.deleteSpecCategoryInfo({
      params: {
        catId
      }
    })
    .then(res => {
      if (res.code == 1) {
        App.SMH.showToast({
          title: "删除成功"
        })
        return res.data
      }
      return Promise.reject(res.msg || "删除失败")
    })
    .then(() => {
      this.getSpecCategoryInfo()
    })
    .finally(() => {
      this.hideLoading()
    })
}