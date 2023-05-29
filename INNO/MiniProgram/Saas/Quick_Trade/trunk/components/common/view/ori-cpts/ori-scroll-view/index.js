const App = getApp();
Component(App.BC({
  options: {
    styleIsolation: 'apply-shared'
  },
  externalClasses: ['ext-class'],
  properties:{
    scrollType:{
      type:String,
      value:"y"
    },
    refresherEnabled:{
        type:Boolean,
        value:true
    },
    scrollWithAnimation:{
      type:Boolean,
      value:true
    },
    setScroll:Boolean,
    scrollIntoView:String,
  },
  data:{
    scrollTop:0,
  }, 
  methods: {
    scroll(e){
        this.triggerEvent('scroll',e);
    },
    scrolltolower(e){
        this.triggerEvent('scrolltolower');
    },
    scrolltoupper(e){
        this.triggerEvent('scrolltoupper');
    },
    refresherrefresh(){
      clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => {
        this.triggerEvent('refresherrefresh');
      }, 300);
    },
    refreshEnd(){
      this.refreshShow();
      wx.showToast({
        title: '已刷新',
      })
      setTimeout(()=>{
        this.refreshTriggered = false;
      },200)
    },
    refreshShow(){
      this.refreshTriggered = true;
    }, 
    setScrollTop(top){
      return new Promise((rs)=>{
        this.setData({scrollTop:top||0},()=>{
          setTimeout(() => {
            console.log('setScrollTop',top)
            return rs();
          }, 300);
        });
      })
    }
     
}
}))