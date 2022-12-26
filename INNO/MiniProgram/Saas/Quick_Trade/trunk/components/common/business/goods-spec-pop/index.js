import WxApi from "../../../../common/utils/wxapi/index";

const App = getApp();
Component(App.BC({
  properties: {
    showShortCut: { // 是否显示"商品详情"捷径
      type: Boolean,
      value: false
    }
  },
  data: {
    show: false,
    selectSkuFinished: false, // 是否完成选择sku
    selectedSku: [], //已选择的sku列表
    selectedProductInfo: {}, // 已选中的产品信息
    selectedProductNumber: 1, // 已选产品数量
    shippingWay: 0, // 0快递配送、1门店自提
  },
  methods: {
    showModal({skuList = [], productList = [], goodsId = 0}) {
      this.initSkuCompnent({skuList, productList});
      this.setData({
        skuList,
        productList,
        goodsId
      }, () => {
        this.toggle();
      })
    },
    initSkuCompnent(skuData) {
      this.sku = this.sku || this.selectComponent("#sku");
      this.sku.initData(skuData)
    },
    handleSkuSelect(e) {
      const {finished = false, productInfo = {}, selectedSku = []} = e.detail;
      this.setData({selectedProductInfo: productInfo, selectSkuFinished: finished, selectedSku, selectedProductNumber: 1})
    },
    handleProductNumberInput(e) {
      let {selectSkuFinished, selectedProductInfo} = this.data;
      if (!selectSkuFinished) return;
      let inputValue = Number(e.detail.value) || 1;
      if (inputValue <= 0) inputValue = 0;
      else if (inputValue > selectedProductInfo.goods_number) inputValue = selectedProductInfo.goods_number;
      this.setData({
        selectedProductNumber: inputValue
      })
    },
    handleProductNumberResize(e) {
      let {num, disabled} = e.currentTarget.dataset;
      if (disabled) return;
      let {selectedProductInfo, selectedProductNumber} = this.data;
      let productGoodsNumber = selectedProductInfo.goods_number || 0;
      selectedProductNumber += Number(num);
      if (selectedProductNumber <= 0 || selectedProductNumber > productGoodsNumber) return;
      this.setData({selectedProductNumber});
    },
    handleShippingWayRadioChange(e) {
      let shippingWay = e.detail.value || 1;
      if (shippingWay === this.data.shippingWay) return;
      this.setData({shippingWay: Number(shippingWay)})
    },
    handlePurchaseButtonTap() {
      WxApi.navigateTo({url: `/pages/main/cart/checkout/checkout?activity_product_id=${this.data.selectedProductInfo.activity_product_id}&goods_number=${this.data.selectedProductNumber}&shippingWay=${this.data.shippingWay}`})
    },
    previewImage(e) {
      const src = e.currentTarget.dataset.src || "";
      src && WxApi.previewImage({
        urls: [src]
      });
    },
    handleShortCutTap() {
      if (this.data.goodsId) WxApi.navigateTo({url: `/pages/main/goods/index?goods_id=${this.data.goodsId}`})
    },
    toggle() {
      this.setData({show: !this.data.show})
    },
  }
}))