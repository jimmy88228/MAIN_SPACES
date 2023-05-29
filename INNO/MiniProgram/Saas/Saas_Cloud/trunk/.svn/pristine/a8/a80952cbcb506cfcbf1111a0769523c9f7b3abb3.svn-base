// components/custom/tabBar.js
var app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
      type: {
          type: String,
          value: {}
      }
  },
  nextRoute:"",
  /**
   * 组件的初始数据
   */
  data: {
    tabbar:[],
  },
  ready: function () {
  },
  attached(){},
  //移除的时候
  detached() {
    app.globalData.nextRoute = "";
  },
  pageLifetimes:{
    show(){
      listen.call(this);
    },
    hide(){
      unListen.call(this);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    setTabbar(data){
      if (data){
        data.map((item, index) => {
          return item.customData = {
            index: index
          }
        })
        this.setData({
          tabbar: data
        })
      }

    },
    pageJump(e){
      let detail = e.detail || {};
      let index = detail.index || 0;
      // let index = e.currentTarget.dataset.index;
      let tabbar = this.data.tabbar;
      let is_original_tab = tabbar[index].is_original_tab;
      let pagePath = tabbar[index].pagePath;
      let is_this_page = tabbar[index].is_this_page;
      let need_login = tabbar[index].need_login;
      let pageLength = getCurrentPages().length;
      if (is_this_page) return false;
        // if (need_login) {
        //     authorizeUserInfo.call(this).then(e => {
        //         if (app.LM.isLogin) calcDelta.call(this, pageLength, pagePath);
        //     });
        // } else {
        //     calcDelta.call(this, pageLength, pagePath);
        // }
      calcDelta.call(this, pageLength, pagePath);
    },
  }
}))
//授权
function authorizeUserInfo() {
  return app.LM.getUserTokenAsync(true);
}
function listen() {
  if (app.LM.isLogin) {
    this.setData({
      isLogin: true
    })
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: true
    })
  });
}
function unListen() {
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}
function calcDelta(pageLength, pagePath) {
    if (pageLength > 0) {
        var pageList = getCurrentPages().map(item => item.route);
        var pagePathIndex = -1;
        var lastIndex = pageLength - 1;
        var delta = -1;
        pageList.forEach((page, index) => {
            if (page == pagePath) pagePathIndex = index;
        });
        if (pagePathIndex == -1) {
            wx.navigateTo({
                url: "/" + pagePath,
            });
        } else {
            delta = lastIndex - pagePathIndex;
            wx.navigateBack({
                delta: delta
            });
        }
    } else {
        wx.navigateTo({
            url: "/" + pagePath,
        });
    }
}