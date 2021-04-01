// pages/component/micro-page/items/video/video.js
import mcBehavior from '../../../help/mc-behavior.js'
import {ItemsParentNodes} from '../../../help/parent-nodes'
const app = getApp(); 
Component(app.BTAB({
  behaviors: [mcBehavior],
  relations:ItemsParentNodes,
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        // if(!this.isAttached)return
        n && this.init(n);
      }
    }
  },
  attached(){
    this.isAttached = true;
  },
  data: {
    screenWidth:app.SIH.screenWidth
  },
  methods: {
    init(_data){
      // console.log('init video',_data);
      this.setData({
        _data
      })
    }, 
    loadData(){
      this.setData({
        isInited:true
      })
      Promise.nextTick().then(()=>{
        this.itemRefresh(); 
      })
    }
  }
}))