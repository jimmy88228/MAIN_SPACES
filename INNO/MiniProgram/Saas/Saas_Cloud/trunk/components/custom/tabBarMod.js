// components/custom/tabBar.js
let app = getApp();
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
    customData:{
      
    }
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
      let page = getCurrentPages().pop();
      if (is_this_page) return false;
      // if (need_login){
      //   authorizeUserInfo.call(this).then( e=>{
      //     if(app.LM.isLogin){
      //       if (is_original_tab) {
      //         wx.switchTab({
      //           url: "/" + pagePath,
      //         })
      //       } else {
      //         if (app.globalData.nextRoute == pagePath){
      //           wx.navigateBack();
      //         }else{
      //           wx.navigateTo({
      //             url: "/" + pagePath,
      //           })
      //         }
              
      //       }
      //     }
      //   })
      // }else{
      //   if (is_original_tab) {
      //     wx.switchTab({
      //       url: "/" + pagePath,
      //     })
      //   } else {
      //     if (app.globalData.nextRoute == pagePath) {
      //       wx.navigateBack();
      //     } else {
      //       wx.navigateTo({
      //         url: "/" + pagePath,
      //       })
      //     }
      //   }
      // }
      if (is_original_tab) {
        wx.switchTab({
          url: "/" + pagePath,
        })
      } else {
        if (app.globalData.nextRoute == pagePath) {
          wx.navigateBack();
        } else {
          wx.navigateTo({
            url: "/" + pagePath,
          })
        }
      }
      app.globalData.nextRoute = page.route;
    } 
  },
  
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
