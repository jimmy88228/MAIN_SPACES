const App = getApp();
Component(App.BC({
  externalClasses: ['ext-class','ext-child-class'],
  properties:{
    src:String,
    lazyLoad:{
      type:Boolean,
      value:true
    },
    mode:{
      type:String,
      value:"aspectFill"
    },
    preview:{
      type:Boolean,
      value:true
    },
    showMenuByLongpress:Boolean,
  },
  data:{

  },
  methods:{ 
    load(e){
      this.triggerEvent('load',e);
    },
    onError(e){
      this.triggerEvent('error',e);
    },
    onTap(e){
      let src = this.data.src||"";
      wx.previewImage({
        urls: [src],
        current: 0
      })
    },
  }
}))