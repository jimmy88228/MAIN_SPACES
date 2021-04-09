import PageJump from '../../../../helper/page-jump.js'
const PATH = {
  "content-key":"../content/content", 
  "text-key":"../items/text-header/text-header", 
  "imageAd-key":"../items/advertise/advertise", 
  "imageTextNavigate-key":"../items/ad-nav/ad-nav", 
  "goodsList-key":"../items/goods-list/goods-list", 
  "richText-key":"../items/rich-text/rich-text", 
  "video-key":"../items/video/video", 
  "textScroll-key":"../items/notice/notice", 
  // "customerService-key":"../items/advertise/advertise", 
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
      let dataset = e.currentTarget.dataset||{};
      console.log('linkJump',dataset);
      let type = dataset.type||"";
      let data = dataset.data||{};
      PageJump(data || {}); 
    },
    initQuery(key,param={}) { //parent
      if(this[key]){
        clearTimeout(this[key]);
        delete this[key];
      }
      this[key] = setTimeout(()=>{
        console.log('initQuery',key)
        this.getAllQueryInfo({key,...param});
      },10)
    },
    getAllQueryInfo({key,id}){ //parent
      this.queryArr = this.getAllNodes(key);
      console.log('getAllQueryInfo',this.queryArr);
      this.queryArr && this.queryArr.forEach((item,index)=>{
        item.getQuery && item.getQuery(id||'main',this);
      })
    },
    getAllNodes(key){ //parent
      return this.getNodes(PATH[key||'content-key']);
    },
    getNodes(path) { //parent
      return this.getRelationNodes(path);
    }, 
    getQuery(id,thatP,fnc){ //child (content)
      setTimeout(() => {
        let query = this.createSelectorQuery();
        let idSel = '#' + (id||'main');
          query.select(idSel).boundingClientRect()
          query.selectViewport().scrollOffset().exec(
            res=>{
              this.queryInfo = {};
              this.queryInfo = res && res[0] || {};
              this.queryInfo.top = this.queryInfo.top + (res&&res[1]&&res[1].scrollTop); //绝对定位的top坐标
              console.log(this.data._data.moduleId,'getQuery',this.queryInfo.top,!!thatP,res);
              thatP && thatP.queryRefresh(); //box的循环刷新item
              !thatP && (this.itemRefresh(res)); //item的局部刷新
              // !thatP && (this.allRefresh({})); //item抛出事件，走循环刷新
            }
          )
      }, 300);
    },
    itemRefresh(e){ //child (content)
      this.triggerEvent('queryRefresh',e||{},{bubbles:true,composed:true,capturePhase:true})
    },
    allRefresh(e){ //child (content)
      this.triggerEvent('queryAllRefresh',e||{},{bubbles:true,composed:true,capturePhase:true})
    },
    trimData(setting){
      let images = setting.images;
      //热点检测
      if(Array.isArray(images)){
        for(let i =0,len=images.length;i<len;i++){
          if(Array.isArray(images[i].poster_map)){
            this.mapData(images[i].poster_map,setting); //热点处理
          }
        }
      }
    },
    mapData(data = [],setting) { //热点处理
      if(setting.type == 't2'){ //轮播 暂时只有一行一个
        setting.row = 1;
      }
      let row = setting.row;
      data.forEach((item) => {
        item.x = this.transMnPx(item.map_x)/row;
        item.w = this.transMnPx(item.map_width)/row;
        item.h = this.transMnPx(item.map_height)/row; 
        item.y = this.transMnPx(Math.abs(item.map_y) - item.map_height)/row; 
      })
    },
    transMnPx(data){
      return (data*750)/600;
    }
  }
})
 