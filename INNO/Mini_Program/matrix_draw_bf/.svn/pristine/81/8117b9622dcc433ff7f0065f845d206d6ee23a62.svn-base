// pages/micro_mall/shopping/prom_pop/prom_pop.js
import WindowBehaviors from "../../../../ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({ 
  properties: {
    changePromInfo:{
      type:Object,
      value:{},
      observer:function(n){
        console.log('changePromInfo',n);
        n && this.init(n);
      }
    },
    customTab:{
      type:Boolean,
      value:false
    }
  },
  behaviors: [WindowBehaviors], 
  data: {
    boxStyle: "opacity:0; transform:translate(0%,100%);",
    curRuleId:0,
    bottomTabH:0,
    data:{}
  },  
  methods: {
    onAttached() {
      let bottomTabH = this.data.customTab? app.SIH.isIphoneX? app.StringUtl.transPx(158):app.StringUtl.transPx(90):0;
      this.setData({
        boxStyle: `opacity:1;transform: translate(0%,-${bottomTabH}px);`
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transform:translate(0%,100%);"
      });
      return 300;
    },
    init(data){
      let info = data.info||{};
      this.setData({
        data: info || {},
        curRuleId:info.rule_id,
      })
      this.dataset = data;;
      this.initRuleId = data.rule_id;
    },
    close(){
      this.dismiss();
    },
    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let curRuleId = dataset.id||0;
      this.setData({
        curRuleId
      })
    },
    confirm(){
      let curId = this.data.curRuleId;
      let data = this.data.data||{}; 
      if(this.initRuleId == curId){
        this.triggerEvent('changePromCallback',{dataset:this.dataset});
        this.dismiss();
        return
      }
      let params = {
        recId:data.rec_id||0,
        ruleId:this.data.curRuleId||0
      }
      return app.RunApi.go('post','CL_GoodsApi','changeShoppingCartPromotionRule',params,{diy:true}).then(res=>{
        console.log('res',res);
        this.triggerEvent('changePromCallback',{dataset:this.dataset});
        this.dismiss();
      }).catch(e=>{
        app.SMH.showToast({
          title:e&&e.msg||"更改失败"
        })
      })
    }
  }
}))