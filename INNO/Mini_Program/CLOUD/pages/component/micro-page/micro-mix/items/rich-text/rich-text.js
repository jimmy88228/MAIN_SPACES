// pages/component/micro-page/items/rich-text/rich-text.js
import ParentNodes from '../../../help/parent-nodes'
const app = getApp();
Component(app.BTAB({
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
    htmlNodes:""
  },
  methods: {
    init(_data){
      // console.log('init rich-text',_data);
      this.setData({
        _data,
        htmlNodes:_data.content||"",
      })
    },
  }
}))

