import PageJump from '../../../../helper/page-jump.js'
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
    throttle(time,key,fnc,init) {
      if(this[key]){
        clearTimeout(this[key]);
        delete this[key];
      }else if(init){
        setTimeout(() => {
          fnc && typeof(fnc) == 'function' && fnc()
        }, 500);
      }
      this[key] = setTimeout(()=>{
        delete this[key];
        fnc && typeof(fnc) == 'function' && fnc();
      },time||10)
    },  
    mcGetQuery(id,type,fnc){
      return new Promise((rs,rj)=>{
        setTimeout(() => { 
          let query = this.createSelectorQuery();
          let idSel = id || '#main';
          if(type == 'all'){
            query.selectAll(idSel).boundingClientRect()
          }else{
            query.select(idSel).boundingClientRect();
          }
          query.selectViewport().scrollOffset().exec(
            res=>{
              fnc && typeof(fnc) == 'function' && fnc();
              rs(res || {})
            }
          )
        }, 300);
      })
    },
    mcItemRefresh(e){
      Promise.nextTick().then(()=>{
        this.triggerEvent('queryRefresh',e||{},{bubbles:true,composed:true,capturePhase:true});
      })
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
 