// pages/component/swiper/swiper.js
const app = getApp(); 
Component(app.BTAB({
  properties: {
    _data:{
      type:Array,
      value:[],
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

  },
  methods: {
    init(data){
      this.setData({
        swiperData:data
      })
    }
  }
}))
