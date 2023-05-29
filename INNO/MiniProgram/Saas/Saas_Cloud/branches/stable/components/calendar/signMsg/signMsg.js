// components/calendar/signMsg/signMsg.js
const app = getApp();
Component(app.BP({ 
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    isLogin:{
      type:Boolean,
      value:false, 
    },
    inited:{
      type:Boolean,
      value:false, 
    },
    signData:{
      type:Object,
      value:{}
    },
    getInfo:{
      type:Object,
      value:{},
      observer(n,o){
        console.log('getInfo',n,o);
        n && this.setData({
          info:n
        })
      }
    },
    signOrderActivityInfo:{
      type:Object,
      value:{},
    },
    btnSize:{
      type:String,
      value:"normal"
    },
    fromType:{
      type:String,
      value:""
    },
    signStyleBox:{
      type:String,
      value:""
    }, 
  }, 
  data: {
  }, 
  methods: {
    createAppSign(e){
      let type = e && e.type||"";
      console.log('createAppSign',type,e);
      this.triggerEvent('createAppSign');
    }, 
  }, 
}))