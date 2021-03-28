// pages/component/micro-page/items/ad-nav/ad-nav.js
import mcBehavior from '../../../help/mc-behavior.js'
import ParentNodes from '../../../help/parent-nodes'
const app = getApp();
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
      console.log('init ad-nav',_data)
      this.setData({
        _data
      })
    },
    goLink(e){
      console.log('goLink',e)
    },
  }
}))
