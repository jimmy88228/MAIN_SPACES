//pages/component/micro-page/micro-mix/box/box.js
import mcBehavior from '../../help/mc-behavior.js'
const app = getApp(); 
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: { 
    _pageModelList:{
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
    tabIndex: {
      type: Number,
      value: 0
    },
    autoShow: {
      type: Boolean,
      value: false
    }, 
  },
  data: {
  }, 
  attached() {
    this.isAttached = true;
    this.screenH = app.SIH.screenHeight;
    this.reset();
  },
  ready(){ 
  },
  methods: {
    init(data){
      this.setData({
        pageModelList:data
      })
      this.getAllQuery();
    },
    queryRefresh(e){
      this.getAllQuery();
    },
    getAllQuery(){
      this.throttle(1000,'refreshKey',()=>{
        this.mcGetQuery(`.cItem${this.data.tabIndex||0}`,'all').then(res=>{
          this.nodeInfo = res;
          console.log('getAllQuery',this.data.tabIndex,JSON.parse(JSON.stringify(this.nodeInfo)));
          if(!this.isInitData){
            this.initData();
          }else{
            this.scroll(this.curTop||0);
          }
        })
      },!this.isInitData);
    },
    initData(){
      this.isInitData = true;
      let arr = this.nodeInfo[0],sclInfo = this.nodeInfo[1];
      arr.every((item,i)=>{
        if(this.properties.autoShow || (((item.top+sclInfo.scrollTop) <= this.screenH) && !this.nodeLoad[i])){
          this.nodeLoad[i] = true;
          this.cItem[i] = this.cItem[i] || this.selectComponent(`#cItem${i}`)
          console.log('初始化',i,JSON.parse(JSON.stringify(arr))) 
          this.cItem[i].loadData();
          return true
        }
      }) 
    },
    scroll(top){
      // console.log(top);
      this.curTop = top;
      let arr = this.nodeInfo[0] || [],sclInfo = this.nodeInfo[1] || {};
      arr.every((item,i)=>{
        if((this.curTop >= (item.top+sclInfo.scrollTop))){
          if(!this.nodeLoad[i]){
            this.nodeLoad[i] = true;
            this.cItem[i] = this.cItem[i] || this.selectComponent(`#cItem${i}`)
            console.log('加载',i,this.curTop,item.top+sclInfo.scrollTop) 
            this.cItem[i].loadData();
          }
          return true
        }
      })
    },
    reset(id){
      if(this.currentId && this.currentId == id){
        console.log('骨架不需重置',id)
        return false
      }
      this.currentId = id;
      this.curTop = 0;
      this.isInitData = false;
      this.nodeInfo = {};
      this.nodeLoad = {};
      this.cItem = {};
      return true
    } 
  },
}))
 