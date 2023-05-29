const App = getApp();
Component(App.BC({
  properties: {
    userData: {
      type: Object,
      value:{}
    },
    isLogin: {
      type: Boolean,
      value:true
    },
  },
  data:{
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