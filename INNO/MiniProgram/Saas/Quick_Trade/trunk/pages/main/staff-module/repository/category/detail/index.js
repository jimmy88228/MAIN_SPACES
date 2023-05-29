
const App = getApp();
Page(App.BP({
  data: {
    list: [],
    nomore: false,
  },
  onLoad(pageQuery) {
    this.pageQuery = pageQuery;
    this.requestParams = {
      pageSize: 20,
      pageIndex: 1
    }
  },
  onShow() {
    this.refresh();
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
    getGoodsCategoryInfo({pageIndex, pageSize, catId: this.pageQuery.id || 0})
      .then(data => {
        let {count, goodsInfoSimpleInfos: dataList} = data || {};
        let list = pageIndex === 1 ? dataList : [..._list, ...dataList];
        let nomore = list.length >= count;
        this.setData({
          list,
          nomore
        })
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

  return App.Http.QT_GoodsApi.getGoodsCategoryInfoDetail({
    params
  })
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "获取分类列表失败")
    })
}