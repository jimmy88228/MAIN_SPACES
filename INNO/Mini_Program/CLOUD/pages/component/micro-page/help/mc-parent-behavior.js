import PageJump from '../../../../helper/page-jump.js'
const PATH = {
  "text-header-key":"../items/text-header/text-header",
  "advertise-key":"../items/advertise/advertise",
  "ad-nav-key":"../items/ad-nav/ad-nav",
  "mc-rich-text-key":"../items/rich-text/rich-text",
  "mc-video-key":"../items/video/video",
  "notice-key":"../items/notice/notice",
  "goods-list-key":"../items/goods-list/goods-list"
};
const nodes = {
  '../items/advertise/advertise': {
      type: 'child',
      linked: function(target) {
        console.log('advertise linked',target);
        // this.cleanTimeOutJob('advertise-key',this.getQueryInfo,this,{id:'main'});
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      }, 
      linkChanged: function(target) {
        console.log('advertise linkChanged',target);
         // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
      }, 
      unlinked: function(target) {
        console.log('advertise unlinked',target);
         // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
      }, 
    }, 
    '../items/ad-nav/ad-nav': {
      type: 'child',
      linked: function(target) {
        console.log('ad-nav linked',target);
      },   
    }, 
    '../items/goods-list/goods-list': {
      type: 'child',
      linked: function(target) {
        console.log('goods-list linked',target);
      }, 
      linkChanged: function(target) {
        console.log('goods-list linkChanged',target);
      }, 
      unlinked: function(target) {
        console.log('goods-list unlinked',target);
      }, 
    },  
    '../items/notice/notice': {
      type: 'child',
      linked: function(target) {
        console.log('notice linked',target);
      },   
    }, 
    '../items/rich-text/rich-text': {
      type: 'child',
      linked: function(target) {
        console.log('rich-text linked',target);
      },   
    }, 
    '../items/text-header/text-header': {
      type: 'child',
      linked: function(target) {
        console.log('text-header linked',target);
      },   
    }, 
    '../items/video/video': {
      type: 'child',
      linked: function(target) {
        console.log('video linked',target);
      },   
    }, 
}
module.exports = Behavior({
  behaviors: [],
  relations:nodes,
  properties: {
  },
  data: {
  }, 
  attached(){ 
  },
  ready: function () {
  },
  methods: {  
    cleanTimeOutJob(key,fnc,that,param) {
      if(that[key]){
        clearTimeout(that[key]);
        delete that[key];
      }
      console.log('cleanTimeOutJob',key,fnc,that,param)
      that[key] = setTimeout(()=>{
        fnc && fnc({key,...param});
        // .call(that);
      },0)
    },
    getQueryInfo({key,id}){
      let arr = this.getNodes(PATH[key||'']);
      console.log('getQueryInfo',key,arr,id);
      arr && arr.forEach(item=>{
        item.getQuery && item.getQuery(id||'main');
      })
    },
    getNodes(path) {
      return this.getRelationNodes(path);
    },
    getQuery(id){
      let query = this.createSelectorQuery();
      query.select(id||'main').boundingClientRect().exec(
        res=>{
          console.log('getQuery',res);
          console.log(this.data._data.moduleId,res);
          this.queryInfo = res && res[0] || {};
        }
      )
    }
  }
})