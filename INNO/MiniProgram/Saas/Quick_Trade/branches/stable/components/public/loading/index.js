const App = getApp();

Component(App.BC({
  data: {
    show: false
  },
  methods: {
    showLoading(){
      return new Promise(rs => {
        this.setData({show: true}, rs)
      })
    },
    hideLoading(){
      return new Promise(rs => {
        this.setData({show: false}, rs)
      })
    }
  }
}))