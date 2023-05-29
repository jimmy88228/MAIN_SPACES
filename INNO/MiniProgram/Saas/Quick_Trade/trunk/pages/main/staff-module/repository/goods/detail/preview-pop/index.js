
const App = getApp();
Component(App.BC({
  data: {
    windowDuration: 300, // 弹窗duration (ms)
    show: false,
    htmlStr: "",
  },

  ready() {
    
  },

  methods: {
    showModal({htmlStr}){
      this.setData({htmlStr, show: true})
    },
    dismiss() {
      this.setData({
        show: false,
      })
    },
  }
}))