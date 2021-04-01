//pages/component/micro-page/micro-mix/box/box.js
import {BoxChildNodes} from '../../help/child-nodes.js';
import mcBehavior from '../../help/mc-behavior.js'
const app = getApp(); 
Component(app.BTAB({
  options: {
    multipleSlots: true
  },
  behaviors: [mcBehavior],
  relations:BoxChildNodes,
  properties: { 
    isLogin: {
      type: Boolean,
      value: false
    },
    // actData: {
    //   type: Object,
    //   value: ""
    // },
    // showSalesVolume: {
    //   type: Boolean,
    //   value: false
    // },
    // autoShow: {
    //   type: Boolean,
    //   value: false
    // },
    // customTab: {
    //   type: Boolean,
    //   value: false
    // },
    // isCustomNav: {
    //   type: Boolean,
    //   value: false
    // },
    // sysConf: {
    //   type: Object,
    //   value: {}
    // },
    // extraSumH:{
    //   type: Number,
    //   value:0,
    // },
    // extraH:{
    //   type: Number,
    //   value:0,
    // },
  },
  data: {
  }, 
  attached() {
    this.isAttached = true;
    this.curQueryArr = [];
  },
  ready(){ 
  },
  methods: {
    queryAllRefresh(e){
      this.getAllQueryInfo({});
    },
    queryRefresh(){
      if(this.refreshKeyId){
        clearTimeout(this.refreshKeyId);
        delete this.refreshKeyId;
      }
      this.refreshKeyId = setTimeout(()=>{
        this.trimQuery()
      },1000)
    },
    trimQuery(){
      console.log('刷新',this.queryArr);
      if(!this.isInitData){
        this.isInitData = true;
        if(!this.queryArr){ //null 重新执行
          setTimeout(() => {
            this.queryRefresh()
           }, 1000);
          return
        }else{
          setTimeout(() => {
            this.initData();
          }, 300);
        }
      }
    },
    initData(){
      let scH = app.SIH.screenHeight;
      this.queryArr && this.queryArr.some((item,index)=>{
        let itemQyInfo = item.queryInfo || {};
        item.isLoaded = true;
        item.loadData && item.loadData();
        console.log('初始化',index,item,scH,itemQyInfo.top,JSON.parse(JSON.stringify(itemQyInfo)))
        if(itemQyInfo.top >= scH){
          return true
        }
      }) 
    },
    scroll(top){
      // console.log(top);
      this.queryArr && this.queryArr.some((item,index)=>{
        let itemQyInfo = item.queryInfo || {};
        if(top>=itemQyInfo.top && !item.isLoaded){
          item.isLoaded = true;

          console.log('加载',index,item.data._data.code,item.data._data.moduleId,JSON.parse(JSON.stringify(this.curQueryArr)))
          item.loadData && item.loadData();
          return true
        }
      })
    },
    reset(){ 
      this.isInitData = false;
    }
  }, 
  pageLifetimes: {
  },
   
}))
 