// pages/component/micro-page/items/text-header/text-header.js
const app = getApp();
import mcBehavior from '../../../help/mc-behavior.js'
import ParentNodes from '../../../help/parent-nodes'
Component(app.BTAB({
  behaviors: [mcBehavior],
  relations:ParentNodes,
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
      // console.log('init text-header',data)
      this.setData({
        _data
      })
    }
  }
}))
