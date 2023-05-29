import PageJump from '../../../common/helper/page-jump.js'
import ChannelsLiveH from "../../../common/helper/handle/channelsLiveHandle.js";
import {ActionName} from '../../../common/manager/log-map'
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
    linkJump(e){ // 微页面跳转事件
      let dataset = e.currentTarget.dataset||{};
      let data = dataset.data || dataset || {}; //跳转数据放在data-data 或者 dataset里面
      console.log('linkJump',dataset);
      if(data && data.code == 'couponUrl'){
        let extra = this.data.extraInfo||{};
        data.page_id = extra.page_id||0;
      } else if(data && data.link && data.link.code == 'couponUrl'){
        let extra = this.data.extraInfo||{};
        data.link.page_id = extra.page_id||0;
      }
      data.ActionName = ActionName[dataset.type] || "";
      if(!data.tag){
        if(dataset.goodsJson && dataset.goodsJson.tag){ //普通商品
          data.tag = dataset.goodsJson.tag;
        }else if(data.item && data.item.tag){ //活动商品
          data.tag = data.item.tag;
        }
      }
      PageJump(data); 
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
      wx.nextTick(()=>{
        this.triggerEvent('queryRefresh',e||{},{bubbles:true,composed:true,capturePhase:true});
      })
      // Promise.nextTick().then(()=>{
      //   this.triggerEvent('queryRefresh',e||{},{bubbles:true,composed:true,capturePhase:true});
      // })
    },
    trimData(setting,imagesGroup,containerWidth = 750){
      let images = imagesGroup && imagesGroup.images;
      //热点检测
      if(Array.isArray(images)){
        for(let i =0,len=images.length;i<len;i++){
          if(Array.isArray(images[i].poster_map)){
            this.mapData(images[i].poster_map,setting,containerWidth); //热点处理
          }
          if(images[i].link){
            ChannelsLiveH.getChannelsInfo(images[i].link);
          }
        }
      }
    },
    mapData(data = [],setting, containerWidth = 750) { //热点处理
      if(setting.type == 't2'){ //轮播 暂时只有一行一个
        setting.row = 1;
      }
      let row = setting.row;
      data.forEach((item) => {
        if(item.link && item.link.code == "channelsLive"){
          ChannelsLiveH.getChannelsInfo(item.link);
        }
        item.x = this.transMnPx(item.map_x, containerWidth)/row;
        item.w = this.transMnPx(item.map_width, containerWidth)/row;
        item.h = this.transMnPx(item.map_height, containerWidth)/row; 
        item.y = this.transMnPx(Math.abs(item.map_y) - item.map_height, containerWidth)/row; 
      })
      console.log('热点',data)
    },
    transMnPx(data, containerWidth){
      return (data*containerWidth)/600;
    },
    getCompContainerSize(){
      return new Promise((resolve, reject) => {
        if(this.containerSize) resolve(this.containerSize)
        let selector = wx.createSelectorQuery().in(this);
        selector.select(".main").fields({size: true})
          .exec((res = []) => {
            this.containerSize = res[0]
            resolve(res[0] || {})
          })
      }).catch(err => {
        console.log("获取组件尺寸失败", err)
        return Promise.resolve({});
      })
    },
  }
})
 
function initActionName(type){
  if(!type)return type;
  switch (key) {
    case value:
      
      break;
  
    default:
      break;
  }
}