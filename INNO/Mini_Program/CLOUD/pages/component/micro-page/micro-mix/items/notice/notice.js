// pages/component/micro-page/items/notice/notice.js
import mcBehavior from '../../../help/mc-behavior.js'
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
const colorMap = {
  "none":{
    val:"#171717",
    str:"color:#171717;background:none;"
  },
  "primary":{
    val:"#0c79ff",
    str:"color:#0c79ff;background:rgba(236,245,255,1);"
  },
  "success":{
    val:"#19be6b",
    str:"color:#19be6b;background:rgba(219,241,225,1);"
  },
  "warning":{
    val:"#ff9600",
    str:"color:#ff9600;background:rgba(253,246,236,1);"
  },
  "error":{
    val:"#fa3534",
    str:"color:#fa3534;background:rgba(254,240,240,1);"
  },
}
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        n && this.init(n);
      }
    },
    autoShow: {
      type: Boolean,
      value: false
    },
  },
  attached(){
    this.readyed = true;
  },
  data: {
    playMode:{},
    colorMap,
    currentSwiper: 0,
    screenWidth:app.SIH.screenWidth,
  },
  methods: {
    init(_data){
      let playMode = {};
      if(_data && _data.option){
        if(_data.option.direction == '1'){
          playMode = playModeSel.vertical;
        }else{
          playMode = playModeSel.level;
        } 
      }
      this.setData({
        _data,
        playMode, 
      })
    },
    loadData(_data){
      this.setData({
        isInited:true
      })
      this.mcItemRefresh();
    },
    toogle: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      });
    },
  }
}))
