const app = getApp();
Component(app.BTAB({
  data: {
    color: "#7f7f7f",
    selectedColor: app.Conf.style.bg_color,
    list: app.Conf.tabbar_list,
    isHideTab: true
  },
  ready(){
  },
  methods: {
    switchTab(e) {
      let data = e.currentTarget.dataset
      let url = data.path
      let id = data.id; 
      let that = this;
      wx.switchTab({ 
        url:"/" + url,
        success(){}
       })
    }
  }
}))