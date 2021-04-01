// pages/component/micro-page/items/advertise/advertise.js
const app = getApp();
import mcBehavior from '../../../help/mc-behavior.js'
import {ItemsParentNodes} from '../../../help/parent-nodes'
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
    }, 
  },
  attached(){
    this.isAttached = true;
    this.queryInfo = {};
  },
  data: {
    screenWidth:app.SIH.screenWidth,
    // initCss:"init"
  },
  ready(){
    console.log('ready')
  },
  methods: {
    init(_data){
      this.trimData(_data);
      // console.log('init advertise',_data);
      this.setData({
        _data
      })
    },
    loadData(_data){
      // console.log('loadData',this);
      this.setData({
        // _data,
        isInited:true
      });
      if(this.data._data.type != 't2'){
        Promise.nextTick().then(()=>{
          this.itemRefresh(); 
        })
      }else{
        this.swiperId = this.swiperId || this.selectComponent("#swiperId");
        this.swiperId.loadData();
      }
    }
  }
}))
