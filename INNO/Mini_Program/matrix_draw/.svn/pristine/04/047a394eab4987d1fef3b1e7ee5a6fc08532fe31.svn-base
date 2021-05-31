// pages/component/micro-page/micro-mix/content/content.js 
import mcBehavior from '../../help/mc-behavior.js'
const app = getApp();
Component({ 
  behaviors: [mcBehavior,Behavior.BaseBehavior],
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        n && this.init(n);
      }
    },
    isLogin: {
      type: Boolean,
      value: false
    },
    cIndex: {
      type: Number,
      value: 0
    }, 
  },
  data: { 
  },
  pageLifetimes: {
    show() {},
    hide() {}
  }, 
  attached() {
    this.nodeInfo = {};
    this.loadModuleObj = {};
  },
  ready(){
  },
  methods: {
    init(_data){
      this.setData({
        _data
      })
    },
    loadData(){ 
      this.cItem = this.cItem || this.selectComponent('#cItem') || {};
      this.cItem.loadData && this.cItem.loadData();
    }, 
  },
})