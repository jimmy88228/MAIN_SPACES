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
    this.curQueryArr = [];
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
    queryAllRefresh(e){
      this.getAllQueryInfo({});
    },
    queryRefresh(e){ 
      // console.log('queryRefresh box')
      if(this.refreshKeyId){
        clearTimeout(this.refreshKeyId);
        delete this.refreshKeyId;
      }
      this.refreshKeyId = setTimeout(()=>{
        // console.log('刷新',this.queryArr);
        this.trimQuery(this.queryArr)
      },1000)
    },
    trimQuery(arr){
      let newArr = null;
      if(Array.isArray(arr)){
        newArr = arr.map(item=>{
          let queryInfo = item.queryInfo||{};
          return queryInfo
        })
      }
      newArr && (this.curQueryArr = newArr);
      console.log('刷新',this.queryArr,newArr);
      if(!this.isInitData){ 
        if(!this.queryArr){ //null 重新执行
          setTimeout(() => {
            this.queryRefresh()
           }, 1000);
          return
        }else{
          this.initData();
        }
      }
    },
    initData(_i=0){
      this.isInitData = true;
      for(let i = _i,len=_i+3;i<len;i++){
        this.queryArr[i] && this.queryArr[i].loadData && this.queryArr[i].loadData();
        this.queryArr[i] && (this.queryArr[i].isLoaded = true);
        // this.curQueryArr[i] && (this.curQueryArr[i].isLoaded = true);
        if(i==len-1){
          setTimeout(() => {
            this.getAllQueryInfo({})
          }, 1000);;
        }
      }
    },
    scroll(top){
      console.log(top);
      this.curQueryArr.some((item,index)=>{
        if(top>=item.top && !this.queryArr[index].isLoaded){
          this.queryArr[index].isLoaded = true;
          // this.queryArr[index+1] && (this.queryArr[index+1].isLoaded = true);

          console.log('加载',index,this.queryArr[index].data._data.code,this.queryArr[index].data._data.moduleId,JSON.parse(JSON.stringify(this.curQueryArr)))
          this.queryArr[index] && this.queryArr[index].loadData && this.queryArr[index].loadData();
          // this.queryArr[index+1] && this.queryArr[index+1].loadData && this.queryArr[index+1].loadData();
          return true
        }
      })
    },
    cleanAll(){ 
    }
  }, 
  pageLifetimes: {
  },
   
}))
 