// pages/component/micro-page/items/rich-text/rich-text.js
import {ItemsParentNodes} from '../../../help/parent-nodes'
import mcBehavior from '../../../help/mc-behavior.js'
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
        console.log('init rich-text',n);
        n && this.init(n);
      }
    }
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
        Promise.nextTick().then(()=>{
          this.itemRefresh(); 
        })
      }, 1000);
    },
  }
}))

