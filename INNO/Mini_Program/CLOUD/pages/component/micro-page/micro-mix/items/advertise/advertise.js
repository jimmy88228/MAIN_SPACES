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
    autoShow: {
      type: Boolean,
      value: false
    },
  },
  attached(){
    this.isAttached = true;
    this.queryInfo = {};
  },
  data: {
    screenWidth:app.SIH.screenWidth,
  },
  ready(){
  },
  methods: {
    init(_data){
      this.trimData(_data);
      this.setData({
        _data
      })
      if(this.properties.autoShow){
        this.loadData();
      }
    },
    loadData(_data){
      this.setData({
        isInited:true
      });
      if(this.data._data.type != 't2'){
        this.itemRefresh();
      }else{ //swiper 先不刷新
        this.swiperId = this.swiperId || this.selectComponent("#swiperId");
        this.swiperId.loadData();
      }
    }
  }
}))
