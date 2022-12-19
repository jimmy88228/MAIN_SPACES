const App = getApp();
Component(App.BC({
  data: {
    show: false,
  },
  methods: {
    showModal() {
      this.setData({show: true})
    },
    handleMaskTap() {
      this.setData({show:false})
    },
    toggle() {
      this.setData({show: !this.data.show})
    }
  }
}))