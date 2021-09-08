// pages/component/calendar/signMsg/signMsg.js
const app = getApp();
import WxSub from "../../../common/helper/handle/wxSubscribe"
Component(app.BP({ 
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    isLogin:{
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
    info:{
      type:"GLOBAL",
      label:"SIGN",
      relatedType:"SIGN",
    },
  }, 
  methods: {
    createAppSign(e){
      let type = e && e.type||"";
      console.log('createAppSign',type,e);
      if(type == 'clickcallback' && app.LM.isLogin){
        return getTpls.call(this).then(res=>{
          console.log('订阅检测',this.tpls && this.tpls.length>0,this.tpls)
          if(this.tpls && this.tpls.length>0){
            app.SMH.showToast({
              title:"授权成功,请重新点击"
            })
          }else{
            this.triggerEvent('createAppSign');
          }
        })
      }else{
        this.triggerEvent('createAppSign');
      }
    }, 
  }, 
}))

function getTpls(){
  if(this.tpls) return Promise.resolve(this.tpls)
  return WxSub.getTpls("GLOBAL","SIGN").then(data => {
    this.tpls = data||[]; 
    return this.tpls;
  })
}