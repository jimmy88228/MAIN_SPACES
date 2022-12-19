const App = getApp();
Component(App.BC({
  properties: {
    userData: {
      type: Object,
      value:{}
    }
  },
  ready() {
    
  },
  methods: {
    showUpdateAvatarPage(){
      wx.navigateTo({
        url: "/pages/tabs/user/update_avatar/update_avatar"
      })
    }
  }
}))