// pages/component/micro-page/items/text-header/text-header.js
const app = getApp();
import mcBehavior from '../../help/mc-behavior.js'
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    _data:{
      type:Object,
      value:{},
      observer:function(n,o){
        console.log('text-header',n,o);
        if(!this.readyed)return
        this.init(n);
      }
    }
  },
  attached(){
    this.readyed = true;
  },
  data: {
    screenWidth:app.SIH.screenWidth
  },
  methods: {
    init(data){
      console.log('init',data)
    }
  }
}))
