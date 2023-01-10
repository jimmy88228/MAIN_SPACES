
const App = getApp();
Page(App.BP({
  data: {
    list: [],
    nomore: false,
  },
  onLoad() {
    this.requestParams = {
      pageSize: 20,
      pageIndex: 1
    }
    this.refresh();
  }, 
  handleAddCateBtnTap() {
    this.createPop = this.createPop || this.selectComponent("#create-pop");
    this.createPop.showModal()
    .then(catName => {
      this.showLoading();
      return createOrUpdateCategoryInfo({catName, id: 0})
    })
    .then(() => {
      App.SMH.showToast({title: "添加商品分类成功"});
      this.refresh();
    })
    .finally(() => {
      this.hideLoading();
    })
    .catch(() => {})
  },
  refresh() {
    this.requestParams.pageIndex = 1;
    this.setData({
      nomore: false
    })
    this.getGoodsCategoryInfo()
  },
  getGoodsCategoryInfo() {
    if (this.data.nomore) return Promise.reject("没有更多数据了哦");
    let {pageIndex, pageSize} = this.requestParams || {};
    let _list = this.data.list || [];
    this.showLoading();
    getGoodsCategoryInfo({pageIndex, pageSize})
      .then(data => {
        let {count, goodsCategoryInfoResps: dataList} = data || {};
        let list = pageIndex === 1 ? dataList : [..._list, ...dataList];
        let nomore = list.length >= count;
        this.setData({
          list,
          nomore
        })
      })
      .catch(err => {
        App.SMH.showToast({title: err});
      })
      .finally(() => {
        this.hideLoading();
      })
  },
  handleScrollToLower() {
    if (this.data.nomore) {
      App.SMH.showToast({title: "已经到底啦"});
      return 
    }
    this.requestParams.pageIndex++;
    this.getGoodsCategoryInfo();
  }
}))

function getGoodsCategoryInfo(params) {

  return App.Http.QT_GoodsApi.getGoodsCategoryInfo({
    params
  })
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "获取分类列表失败")
    })
}

function createOrUpdateCategoryInfo(data) {
  return App.Http.QT_GoodsApi.createOrUpdateCategoryInfo({
    data
  })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res.msg || "添加商品分类失败")
    })
}