import WxApi from "../../../../common/utils/wxapi/index";
const App = getApp();
const purchaseButtonTextRef = {
  0: "活动未开始",
  1: "抢购",
  2: "活动已过期"
}
Component(App.BC({
  data: {
    activityStatus: 0,  //活动状态: 0活动未开始，1正在进行中，2活动已过期
    purchaseButtonText: "抢购", // 购买按钮文案 
    list: [],
    nomore: false,
    isInit: false,
    moveViewOps:{
      x:"9999",
      y:"9999"
    },
  },
  ready() {

  },
  methods: {
    loadData({activityId = 0, activityStatus = 0}) {
      this.activityId = activityId;
      this.setData({
        activityStatus,
        purchaseButtonText: purchaseButtonTextRef[activityStatus]
      });
      setDefaultParams.call(this);
      getActivityGoodsInfo.call(this);
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
        url: `/pages/main/goods/index?activity_id=${this.activityId}&goods_id=${goodsId}`
      })
    },
    handlePurchaseTap(e) {
      let item = this.getDataset(e, "item");
      let goodsId = item.goods_id || 0;
      getSumaryGoodsProductInfo.call(this, goodsId)
      .then(data => {
        data.goodsImg = item.goods_img || "";
        data.goodsId = goodsId;
        data.activityId = this.activityId;
        this.goodsSpecPop = this.goodsSpecPop || this.selectComponent("#goods-spec-pop");
        this.goodsSpecPop.showModal(data)
      })
      .catch(err => {
        console.log("handlePurchaseBtnTap err", err);
        App.SMH.showToast({title: err})
      })
    },
    handleShareBtnTap() {
      this.tabBarToggle();
      this.sharePop = this.sharePop || this.selectComponent("#share-pop");
      this.sharePop.showModal({needLogin: true})
        .then(selectedItem => {
          if (selectedItem.shareId === 2) { // 生成海报
            let posterData = {
              info:{
                opKind: "QT_INDEX",
              },
              scene: {
                "shareType": "QT_INDEX",
                ...this.pageQuery
              }
            }
            this.posterPop = this.posterPop || this.selectComponent("#poster-pop");
            this.posterPop.showModal({type: "index", data: posterData});
          }
        })
        .finally(() => {
          this.tabBarToggle();
        })
    },
    noFn() {}
  }
}))

function setDefaultParams() {
  this.params = {
    pageIndex: 1,
    pageSize: 20,
    activityId: this.activityId
  }
}

function getActivityGoodsInfo() {
  let {pageIndex, pageSize, activityId} = this.params;
  return App.Http.QT_GoodsApi.getActivityGoodsInfo({
    params: {
      pageIndex,
      pageSize,
      activityId
    }
  })
    .then(res => {
      if (res.code == 1) {
        let {list: _list, count} = res.data || {};
        let currentList = this.data.list || [];
        _list = _list.map(item=>({...item,down_price:App.Utils.StringUtils._toFixed(item.market_price - item.sale_price,2)}))
        let list = pageIndex == 1 ? _list : [...currentList, ..._list];
        let nomore = list.length >= count;
        this.setData({list, nomore,isInit:true});
        return res.data;
      }
      return Promise.reject(res.msg || "获取商品列表失败")
    })
}

function getSumaryGoodsProductInfo(goods_id) {
  return App.Http.QT_GoodsApi.get_Sumary_GoodsProductInfo({
    params: {
      activityId: this.activityId || 0,
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