import PageJump from '../../../../helper/page-jump.js'
const PATH = {
  "content-key":"../content/content", 
}; 
module.exports = Behavior({
  behaviors: [],
  properties: {
  },
  data: {
  }, 
  attached(){ 
  },
  ready: function () {
  },
  methods: {
    linkJump(e){ //common 微页面跳转事件
      console.log('jump',e);
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      let data = dataset.data||{};
      PageJump(data || {}); 
    },
    itemRefresh(e){ //child (content)
      this.triggerEvent('queryRefresh',e||{},{bubbles:true,composed:true})
    },
    initQuery(key,param={}) { //parent
      console.log('cleanTimeOutJob',this[key],key,param)
      if(this[key]){
        clearTimeout(this[key]);
        delete this[key];
      }
      this[key] = setTimeout(()=>{
        this.getAllQueryInfo({key,...param});
      },1500)
    },
    getAllQueryInfo({key,id}){ //parent
      this.queryArr = this.getNodes(PATH[key||'content-key']);
      console.log('getAllQueryInfo',this[key],key,this.queryArr);
      this.queryArr && this.queryArr.forEach((item,index)=>{
        item.getQuery && item.getQuery(id||'main',this);
      })
    },
    getNodes(path) { //parent
      return this.getRelationNodes(path);
    }, 
    getQuery(id,thatP){ //child (content)
      let query = this.createSelectorQuery();
      let idSel = '#' + (id||'main');
      query.select(idSel).boundingClientRect().exec(
        res=>{
          this.queryInfo = res && res[0] || {};
          console.log(this.data._data.moduleId,'getQuery',this.queryInfo,res,idSel);
          // console.log(this.data._data.moduleId,'getQuery',!!thatP,this,this.queryInfo);
          thatP && thatP.queryRefresh();
          !thatP && (this.itemRefresh(res));
        }
      )
    },  
  }
})
 