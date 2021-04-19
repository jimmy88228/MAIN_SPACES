// pages/component/micro-page/items/text-header/text-header.js
const app = getApp();
import mcBehavior from '../../../help/mc-behavior.js'
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
    loadData(_data){
      this.setData({
        isInited:true
      })
      this.itemRefresh(); 
    }
  }
}))
