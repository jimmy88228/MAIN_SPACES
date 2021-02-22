// pages/component/micro-page/items/rich-text/rich-text.js
const app = getApp();
Component(app.BTAB({
  properties: {
    _data:{
      type:Object,
      value:{},
      observer:function(n,o){
        if(!this.readyed)return
        this.init(n);
      }
    }
  },
  attached(){
    this.readyed = true;
  },
  data: {
    htmlNodes:""
  },
  methods: {
    init(data){
      console.log('init rich-text',data);
      this.setData({
        htmlNodes:data.content||""
      })
    },
  }
}))

