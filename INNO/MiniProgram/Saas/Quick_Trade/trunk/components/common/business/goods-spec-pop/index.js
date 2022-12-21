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
  },
  methods: {
    showModal({skuList = [], productList = []}) {
      this.initSkuCompnent({skuList, productList});
      this.setData({
        skuList,
        productList
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
    handlePurchaseButtonTap() {
      WxApi.navigateTo({url: "/pages/main/cart/checkout/checkout"})
    },
    previewImage(e) {
      const src = e.currentTarget.dataset.src || "";
      src && WxApi.previewImage({
        urls: [src]
      });
    },
    toggle() {
      this.setData({show: !this.data.show})
    },
  }
}))