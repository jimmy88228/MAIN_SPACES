// pages/component/micro-page/items/ad-nav/ad-nav.js
const app = getApp();
Component(app.BTAB({
  properties: {
    _data:{
      type:Object,
      value:{},
      observer:function(n,o){
        console.log('advertise',n,o);
        if(!this.readyed)return
        this.init(n);
      }
    }
  },
  attached(){
    this.readyed = true;
  },
  data: {

  },
  methods: {
    init(data){
      console.log('init',data)
    },
    goLink(e){
      console.log('goLink',e)
    },
  }
}))
