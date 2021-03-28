//pages/component/micro-page/micro-mix/box/box.js
import ChildNodes from '../../help/child-nodes.js';
import mcBehavior from '../../help/mc-behavior.js'
const app = getApp(); 
Component(app.BTAB({
  options: {
    multipleSlots: true
  },
  behaviors: [mcBehavior],
  relations:ChildNodes,
  properties: { 
    isLogin: {
      type: Boolean,
      value: false
    },
    actData: {
      type: Object,
      value: ""
    },
    showSalesVolume: {
      type: Boolean,
      value: false
    },
    autoShow: {
      type: Boolean,
      value: false
    },
    customTab: {
      type: Boolean,
      value: false
    },
    isCustomNav: {
      type: Boolean,
      value: false
    },
    sysConf: {
      type: Object,
      value: {}
    },
    extraSumH:{
      type: Number,
      value:0,
    },
    extraH:{
      type: Number,
      value:0,
    },
  },
  data: {
  }, 
  attached() {
    this.isAttached = true;
  },
  ready(){ 
  },
  methods: {
    init(data){
      console.log('init box',data);
      this.setData({
        pageModelList:data
      })
    },
    queryRefresh(e){
      if(this.refreshKeyId){
        clearTimeout(this.refreshKeyId);
        delete this.refreshKeyId;
      }
      this.refreshKeyId = setTimeout(()=>{
        console.log('刷新',this.queryArr);
      },1000)
    }, 
  },
  pageLifetimes: {
  },
   
}))
 