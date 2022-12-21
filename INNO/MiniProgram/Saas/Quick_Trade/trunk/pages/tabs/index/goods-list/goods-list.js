import WxApi from "../../../../common/utils/wxapi/index";
const App = getApp();
Component(App.BC({
  data: {
    list: [],
    nomore: false,
  },
  ready() {

  },
  methods: {
    loadData() {
      setDefaultParams.call(this);
      getActivityGoodsInfo.call(this)
    },
    loadNextPage() {
      if (this.data.nomore) {
        App.SMH.showToast({
          title: "已经到底了哦"
        })
        return;
      }
      this.params.pageIndex++;
      getActivityGoodsInfo.call(this);
    },
    handleGoodsTap(e) {
      let goodsId = e.currentTarget.dataset.goodsId || 0;
      WxApi.navigateTo({
        url: `/pages/main/goods/index?goods_id=${goodsId}`
      })
    },
    handlePurchaseTap(e) {
      let goodsId = e.currentTarget.dataset.goodsId || 0;
      getSumaryGoodsProductInfo.call(this, goodsId)
      .then(data => {
        this.goodsSpecPop = this.goodsSpecPop || this.selectComponent("#goods-spec-pop");
        this.goodsSpecPop.showModal(data)
      })
      .catch(err => {
        console.log("handlePurchaseBtnTap err", err);
        App.SMH.showToast({title: err})
      })
    }
  }
}))

function setDefaultParams() {
  this.params = {
    pageIndex: 1,
    pageSize: 20
  }
}

function getActivityGoodsInfo() {
  let {pageIndex, pageSize} = this.params;
  return App.Http.QT_GoodsApi.getActivityGoodsInfo({
    params: {
      pageIndex,
      pageSize
    }
  })
    .then(res => {
      if (res.code == 1) {
        let {list: _list, count} = res.data || {};
        let currentList = this.data.list || [];
        let list = pageIndex == 1 ? _list : [...currentList, ..._list];
        let nomore = list.length >= count;
        this.setData({list, nomore});
        return res.data;
      }
      return Promise.reject(res.msg || "获取商品列表失败")
    })
}

function getSumaryGoodsProductInfo(goods_id) {
  return App.Http.QT_GoodsApi.get_Sumary_GoodsProductInfo({
    params: {
      goodsId: goods_id,
      colorId: 0
    }
  })
    .then(res => {
      if (res.code == 1) {
        let {CategoryInfoList: skuList, ListGoodsProductInfo: productList} = res.data || {};
        return {skuList, productList}
      }
      return Promise.reject(res.msg || "获取商品数据失败");
    })
}