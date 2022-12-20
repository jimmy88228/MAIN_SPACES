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
  },
  methods: {
    showModal() {
      this.toggle();
    },
    handleSkuSelect() {
      
    },
    toggle() {
      this.setData({show: !this.data.show})
    },
  }
}))