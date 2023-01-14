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
        })
      })
      .catch(err => {
        App.SMH.showToast({
          title: err
        });
        return
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
  onSpecCatSave() { // 添加或编辑
    let {
      specCatId = 0, specCatName = ""
    } = this.data;
    if (!specCatName.trim()) {
      App.SMH.showToast({
        title: "规格类型名称不能为空"
      });
      return
    }
    createOrUpdateSpecCategory({
        specCatId,
        specCatName
      })
      .then(_specCatId => {
        this.setData({
          specCatId: _specCatId
        })
        App.SMH.showToast({
          title: `${specCatId ?'编辑': '添加'}规格类型成功`
        })
      })
  },
  handleAddSpecBtnTap() { // 按下添加规格按钮
    if (!this.data.specCatName) {
      App.SMH.showToast({
        title: "请先输入规格类型名称"
      });
      return
    }
    this.addPop = this.addPop || this.selectComponent('#add-pop');
    console.log('this.addPop',this.addPop)
    this.addPop.showModal();
    return
    WxApi.showModal({
        title: "添加具体规格",
        editable: true,
        placeholderText: "请输入规格名字",
      })
      .then(info => {
        if (info.confirm) {
          let content = info.content || "";
          if (!content.trim()) {
            App.SMH.showToast({
              title: "请输入规格名称"
            });
            return;
          }
          this.addSpec(content);
        }
      })
  },
  confirm(e){
    let detail = e.detail;
    this.addSpec(detail);
  },
  addSpec(specName) { // 添加规格操作
    let {
      specCatId = 0
    } = this.data
    createOrUpdateSpecInfo({
        specCatId,
        specName,
        specId: 0
      })
      .then(() => {
        App.SMH.showToast({
          title: "增加规格分类成功"
        })
        this.getSpecCategoryInfo();
        return
      })
      .catch(err => {
        App.SMH.showToast({
          title: err
        })
      })
  },
  handleItemDelete(e) { // 长按规格删除操作
    let specId = this.getDataset(e, "specId");
    console.log("specId", specId)
    WxApi.showModal({
        title: "确认要删除此规格吗"
      })
      .then(info => {
        if (info.confirm) {
          deleteSpecItem(specId)
            .then(() => this.getSpecCategoryInfo())
        }
      })
  },
  back() {
    WxApi.navigateBack()
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

function deleteSpecItem(specId) {
  return App.Http.QT_GoodsApi.deleteSpecInfo({
      params: {
        specId
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data || 0
      }
      return Promise.reject(res.msg || '删除规格失败')
    }).catch(msg=>{
      App.SMH.showToast({title:msg})
    })
}



// createOrUpdateSpecCategory(content)
// .then(() => {
//   App.SMH.showToast({title: "增加规格分类成功"})
// })


function createOrUpdateSpecCategory({
  specCatId,
  specCatName
}) { // 新增/编辑 规格分类
  specCatId = Number(specCatId);
  return App.Http.QT_GoodsApi.createOrUpdateSpecCategory({
      data: {
        id: specCatId,
        name: specCatName
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data || 0
      }
      return Promise.reject(res.msg || `${specCatId?'编辑': '添加'}规格类型失败`)
    })
}

function createOrUpdateSpecInfo({
  specCatId = 0,
  specName = "",
  specId = 0
}) { //设置规格
  return App.Http.QT_GoodsApi.createOrUpdateSpecInfo({
      data: {
        cat_id: specCatId,
        name: specName,
        id: specId
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "添加规格失败")
    })
}