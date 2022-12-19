const App = getApp();
Component(App.BC({
  ready() {
    
  },
  methods: {
    jump(){
      wx.navigateTo({
        url: "/pages/tabs/user/update_avatar/update_avatar"
      })
    }
  }
}))