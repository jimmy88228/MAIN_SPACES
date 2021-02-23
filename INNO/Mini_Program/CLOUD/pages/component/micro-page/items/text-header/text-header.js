// pages/component/micro-page/items/text-header/text-header.js
const app = getApp();
Component(app.BTAB({
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
  ready(){
    this.readyed = true;
  },
  data: {

  },
  methods: {
    init(data){
      console.log('init',data)
    }
  }
}))
