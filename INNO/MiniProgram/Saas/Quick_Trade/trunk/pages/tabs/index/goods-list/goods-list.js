import WxApi from "../../../../common/utils/wxapi/index";
const App = getApp();
const purchaseButtonTextRef = {
  0: "待开始",
  1: "抢购",
  2: "已结束"
}
Component(App.BC({
  properties:{
    fromType:String,
  },
  data: {
    status: 0,  //活动状态: 0活动未开始，1正在进行中，2活动已过期
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
    this.setView({ 
      goodsSpecPopRef: { get: () => this.findView("#goods-spec-pop") }, 
      sharePopRef: { get: () => this.findView("#share-pop") }, 
      posterPopRef: { get: () => this.findView("#poster-pop") }, 
      oriScrollView: { get: () => this.findView("#ori-scroll-view") }, 
    })
  },
  methods: {
    loadData({activityId = 0, status = 0,activity_status}) {
      this.activityId = activityId;
      this.setData({
        status,
        activity_status,
        purchaseButtonText: purchaseButtonTextRef[status]
      });
      !this.data.isInit && setDefaultParams.call(this);
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
      getActivityGoodsInfo.call(this,'next');
    },
    handleGoodsTap(e) {
      this._throttle('handleGoodsTap');
      let goodsId = e.currentTarget.dataset.goodsId || 0;
      WxApi.navigateTo({
        url: `/pages/main/goods/index?activity_id=${this.activityId}&goods_id=${goodsId}&fromType=${this.properties.fromType}`
      })
    },
    handlePurchaseTap(e) {
      this._throttle('handlePurchaseTap');
      let item = this.getDataset(e, "item");
      let goodsId = item.goods_id || 0;
      getSumaryGoodsProductInfo.call(this, goodsId)
      .then(data => {
        data.goodsImg = item.goods_img || "";
        data.goodsId = goodsId;
        data.activityId = this.activityId; 
        this.goodsSpecPopRef.showModal(data)
      })
    },
    handleShareBtnTap() {
      this.tabBarToggle();
      this.sharePopRef.showModal({needLogin: true})
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
            this.posterPopRef.showModal({type: "index", data: posterData});
          }
        })
        .finally(() => {
          this.tabBarToggle();
        })
    },
    refreshEnd(){
      this.oriScrollView.refreshEnd();
    },
    noFn() {}
  }
}))

function setDefaultParams() {
  this.params = {
    pageIndex: 1,
    pageSize: 20,
  }
}

function getActivityGoodsInfo(fromType) {
  let {pageIndex, pageSize} = fromType=='next' ? this.params:{pageIndex:1,pageSize:this.params.pageIndex*this.params.pageSize};
  let extra = {};
  this.properties.fromType == 'PREVIEW' && (extra.other = {customStoreId:App.LM.storeInfo.store_id||storeInfo.storeId||0})
  return App.Http.QT_GoodsApi.getActivityGoodsInfo({
    params: {
      pageIndex,
      pageSize,
      activityId:this.activityId,
      cach:this.properties.fromType == 'HOME'?1:0,
    },
    ...extra
  })
    .then(res => {
      if (res.code == 1) {
        let {list: _list, count} = res.data || {};
        _list = _list.map(item=>({...item,down_price:App.Utils.StringUtils._toFixed(item.market_price - item.sale_price,2)}))
        let list = pageIndex == 1 ? JSON.parse(JSON.stringify(_list)) : JSON.parse(JSON.stringify([...this.data.list, ..._list]));
        let nomore = list.length >= count;
        this.setData({list, nomore, isInit:true});
        return res;
      }
      return Promise.reject(res.msg || "获取商品列表失败")
    })
}

function getSumaryGoodsProductInfo(goods_id) {
  let extra = {};
  this.properties.fromType == 'PREVIEW' && (extra.other = {customStoreId:App.LM.storeInfo.store_id||storeInfo.storeId||0})
  return App.Http.QT_GoodsApi.get_Sumary_GoodsProductInfo({
    params: {
      activityId: this.activityId || 0,
      goodsId: goods_id,
      colorId: 0,
    },
    ...extra
  })
    .then(res => {
      if (res.code == 1) {
        let {CategoryInfoList: skuList, ListGoodsProductInfo: productList} = res.data || {};
        return {skuList, productList}
      }
      return Promise.reject(res.msg || "获取商品数据失败");
    })
}