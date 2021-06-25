// pages/matrix/draw_box/draw_rule/draw_rule.js
const app = getApp();
Page.BasePage({
  data: {

  },
  onLoad: function (options) {
    let rule = app.StorageH.get('curRuleData') || "";
    this.setData({ 
      isAttached: true,
      showRefresh: true, 
      rule
    })
  },
  onReady(){
    setTimeout(() => {
      this.setData({ 
        showRefresh: false, 
      })
    }, 500);
  },
  onShareAppMessage: function () {

  }
})