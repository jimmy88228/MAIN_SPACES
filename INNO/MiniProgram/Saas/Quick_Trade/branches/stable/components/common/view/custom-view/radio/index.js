const App = getApp();
Component(App.BC({
  externalClasses: ['ext-class','ext-sel-class'], 
  relations: {
    '../radio-group/index': {
      type: 'parent', // 关联的目标节点应为父节点 
    }
  },
  properties:{
    color:{
      type:String,
      value:"#333"
    },
    value:String,
    checked:Boolean,
  },
  methods:{
    radioSel(e){
      this.triggerEvent('radioSel',this.properties.value,{
        bubbles:true,
        composed:true,
        capturePhase:true
      });
    }
  }
}))