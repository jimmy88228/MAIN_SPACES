// pages/component/micro-page/items/notice/notice.js
const app = getApp();
const playModeSel = {
  vertical:{
    easing:"default",
    interval: 3000,
    autoplay: true,
    vertical: true,
    duration: 2000,
    circular: true,
    opacity_hide: "opacity:0;transition: all 300ms ease-in-out;",
    opacity_show: "opacity:1;transition: opacity 400ms ease-in-out 1000ms;",
  },
  level:{
    easing:"linear",
    interval: 6000,
    autoplay: true,
    vertical: false,
    duration: 6000,
    circular: true,
    opacity_hide: "",
    opacity_show: "",
  }
}
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
    playMode:{},
    currentSwiper: 0,
  },
  methods: {
    init(data){
      console.log('init',data);
      if(data && data.option){
        let playMode = {};
        if(data.option.direction == '1'){
          playMode = playModeSel.vertical;
        }else{
          playMode = playModeSel.level;
        }
        this.setData({
          playMode
        })
      }
    },
    toogle: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      });
    },
    // loadData(){
    // },
  }
}))
