const App = getApp();
Component(App.BC({
  properties: {
    duration: {
      type: Number,
      value: 300
    },
    show: {
      type: Boolean,
      value: false,
      observer(val) {
        setTimeout(() => {
          this.setData({_show: val})
        }, this.properties.duration)
      }
    },
  },
  data: {
    _show: false
  },
  methods: {
    _maskTap() {
      this.triggerEvent("masktap")
    },
    _noFn() {}
  }
}))