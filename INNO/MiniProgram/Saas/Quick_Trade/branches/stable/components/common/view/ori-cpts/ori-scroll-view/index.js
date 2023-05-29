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
    refresherTriggered:false
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
        this.triggerEvent('refresherrefresh',{},{
          bubbles:true,
          composed:true,
          capturePhase:true,
        });
      }, 300);
    },
    refreshEnd(){
      console.log('refreshEnd')
      this.refreshShow();
      App.SMH.showToast({
        title: '已刷新',
      })
      setTimeout(()=>{
        this.setData({
          refresherTriggered:false
        })
      },200)
    },
    refreshShow(){
      
      this.setData({
        refresherTriggered:true
      })
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