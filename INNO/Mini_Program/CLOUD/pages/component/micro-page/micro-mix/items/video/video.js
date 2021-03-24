// pages/component/micro-page/items/video/video.js
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
    screenWidth:app.SIH.screenWidth
  },
  methods: {
    init(data){
      // console.log('init video',data);
      this.setData({
        videoData:data||{}
      })
    },
  }
}))