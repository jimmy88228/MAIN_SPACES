// pages/component/custom/tabBar.js
let app = getApp();
Component(app.BTAB({
  properties: {
      type: {
          type: String,
          value: {}
      }
  },
  nextRoute:"",
  data: {
    tabbar:[
      // 例子
      // {
      //   "pagePath": "路劲",
      //   "text": "tab文字",
      //   "iconfont": , //使用iconfont名称， 使用iconfont，iconPath和selectedIconPath会失效
      //   "iconfontsize": , iconfont 大小
      //   "iconPath":,
      //   "selectedIconPath":,
      //   "is_this_page": false, //当前页
      //   "color": "",
      //   "select_color": ,
      //   "is_original_tab": false // 原生tabbar页
      // }
    ],
    customData:{
      
    }
  },
  ready: function () {
  },
  attached(){},
  //移除的时候
  detached() {
    // app.globalData.nextRoute = "";
  },
  pageLifetimes:{
    show(){
      listen.call(this);
    }
  },
  methods: {
    
    setTabbar(data){
      console.log("setTabbar", data);
      if (data){
        data.map((item,index)=>{
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
      let that = this;
      let detail = e.detail || {};
      let index = detail.index || 0;
      let tabbar = this.data.tabbar;
      let is_original_tab = tabbar[index].is_original_tab;
      let pagePath = tabbar[index].pagePath;
      let is_this_page = tabbar[index].is_this_page;
      let need_login = tabbar[index].need_login;
      // let page = getCurrentPages().pop();
      if (is_this_page) return false;
      if (is_original_tab) {
        wx.switchTab({
          url: "/" + pagePath,
        })
      } else {
        let pageLength = getCurrentPages().length;
        calcDelta.call(this, pageLength, pagePath)
        // if (app.globalData.nextRoute == pagePath) {
        //   wx.navigateBack();
        // } else {
        //   wx.navigateTo({
        //     url: "/" + pagePath,
        //   })
        // }
      }
      // app.globalData.nextRoute = page.route;
    } 
  },
  
}))
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
function listen() {
  app.LM.loginAsync(false).finally(()=>{
    if (app.LM.isLogin != this.data.isLogin) {
      this.setData({
        isLogin: app.LM.isLogin
      })
    }
  })
}
