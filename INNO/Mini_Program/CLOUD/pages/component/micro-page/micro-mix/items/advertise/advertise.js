// pages/component/micro-page/items/advertise/advertise.js
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
    }, 
  },
  attached(){
    this.isAttached = true;
    this.queryInfo = {};
  },
  data: {
    screenWidth:app.SIH.screenWidth
  },
  ready(){
    console.log('ready')
    // setTimeout(()=>{
    //   this.getQuery();
    // },3000)
  },
  methods: {
    init(_data){
      console.log('init advertise',_data);
      this.setData({
        _data
      })
    },
    // getQuery(){
    //   let query = this.createSelectorQuery();
    //   query.select('#main').boundingClientRect().exec(
    //     res=>{
    //       console.log(this.data._data.moduleId,res);
    //       this.queryInfo = res && res[0] || {};
    //     }
    //   )
    // }
    // goLink(e){
    //   console.log('goLink',e)
    // },
  }
}))
