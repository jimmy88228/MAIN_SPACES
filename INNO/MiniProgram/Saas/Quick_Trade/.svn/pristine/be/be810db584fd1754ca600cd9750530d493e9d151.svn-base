const App = getApp();
Component(App.BC({ 
  externalClasses: ['ext-class','ext-radio-class','ext-name-class'], 
  relations: {
    '../radio/index': {
      type: 'child', // 关联的目标节点应为子节点 
    }
  },
  properties:{ 
    color:{  //选择圈颜色
      type:String,
      value:"#333"
    }, 
    isMyRadio:{
      type:Boolean,
      value:true
    },
    curValue:String,
    checked:Boolean,
    arr:Array, 
  },
}))