import WxApi from "../../../../../../../common/utils/wxapi/index";
// pages/main/staff-module/repository/goods/spec/add/index.js
const App = getApp();
Page(App.BP({
  data: {
    inpuVal: ""
  },
  handleAddSpecBtnTap() {
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
          createOrUpdateCategoryInfo(content)
            .then(() => {
              App.SMH.showToast({title: "增加规格分类成功"})
            })
        }
      })
  }
}))

function createOrUpdateCategoryInfo(catName) {
  return App.Http.QT_GoodsApi.createOrUpdateCategoryInfo({
      data: {
        id: 0,
        catName
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "添加规格失败")
    })
}