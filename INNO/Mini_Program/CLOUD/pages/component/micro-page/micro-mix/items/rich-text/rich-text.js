// pages/component/micro-page/items/rich-text/rich-text.js
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
    htmlNodes:""
  },
  methods: {
    init(_data){
      this.setData({
        _data,
        htmlNodes:_data.content||"",
      })
    },
    loadData(_data){
      this.setData({
        isInited:true
      })
      setTimeout(() => {
        this.itemRefresh();
      }, 300);
    },
  }
}))

