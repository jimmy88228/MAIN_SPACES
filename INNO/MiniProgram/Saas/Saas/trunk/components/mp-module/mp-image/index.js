const app = getApp();
Component(app.BTAB({
  options: {
    styleIsolation: 'apply-shared'
  },
  externalClasses: ['ext-class'],
  properties:{
    src:String,
    lazyLoad:{
      type:Boolean,
      value:true
    },
    mode:{
      type:String,
      value:"aspectFit"
    },
    showMenuByLongpress:Boolean,
  },
  data:{
    isInit:false,
  },
  methods:{
    load(e){
      // console.log('load',e);
      if(!this.data.isInit){
        this.setData({isInit:true})
      }
      this.triggerEvent('load',e);
    },
    onError(e){
      // console.log('onError',e);
      this.triggerEvent('error',e);
    },
  },
}))