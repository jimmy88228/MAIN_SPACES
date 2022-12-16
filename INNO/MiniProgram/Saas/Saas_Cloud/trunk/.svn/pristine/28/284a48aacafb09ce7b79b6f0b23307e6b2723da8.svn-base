// components/micro-page/items/video/video.js
import mcBehavior from '../../../help/mc-behavior.js'
const app = getApp(); 
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
    this.isAttached = true;
  },
  data: {
    screenWidth:app.SIH.screenWidth
  },
  methods: {
    init(_data){
      this.setData({
        _data
      })
    }, 
    loadData(){
      this.setData({
        isInited:true
      })
      this.mcItemRefresh();
    }
  }
}))