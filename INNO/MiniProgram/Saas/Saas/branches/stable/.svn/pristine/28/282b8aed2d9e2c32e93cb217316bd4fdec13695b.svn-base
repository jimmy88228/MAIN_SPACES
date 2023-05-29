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
      if(data && data.code == 'couponUrl'){
        let extra = this.data.extraInfo||{};
        data.page_id = extra.page_id||0;
      }
      data.ActionName = ActionName[dataset.type] || "";
      console.log('linkJump',dataset,dataset.type,data.ActionName);
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
    trimData(setting,imagesGroup){
      let images = imagesGroup && imagesGroup.images;
      //热点检测
      if(Array.isArray(images)){
        for(let i =0,len=images.length;i<len;i++){
          if(Array.isArray(images[i].hot_map)){
            images[i].hot_map = this.setHotMapData(images[i].hot_map,setting); // 新热点处理;
          } else if(Array.isArray(images[i].poster_map)){
            this.mapData(images[i].poster_map,setting); //热点处理
          }
          if(images[i].link){
            ChannelsLiveH.getChannelsInfo(images[i].link);
          }
        }
      }
    },
    setHotMapData(data = [],setting){ //新热点处理
      if(setting.type == 't2'){ //轮播 暂时只有一行一个
        setting.row = 1;
      }
      // let row = setting.row;
      data.forEach((item) => {
        if(item.link && item.link.code == "channelsLive"){
          ChannelsLiveH.getChannelsInfo(item.link);
        }
        item.x = item.x * 100;
        item.y = item.y * 100;
        item.w = item.w * 100;
        item.h = item.h * 100; 
      })
      return data;
    },
    mapData(data = [],setting) { //热点处理
      if(setting.type == 't2'){ //轮播 暂时只有一行一个
        setting.row = 1;
      }
      let row = setting.row;
      data.forEach((item) => {
        if(item.link && item.link.code == "channelsLive"){
          ChannelsLiveH.getChannelsInfo(item.link);
        }
        item.x = this.transMnPx(item.map_x)/row;
        item.w = this.transMnPx(item.map_width)/row;
        item.h = this.transMnPx(item.map_height)/row; 
        item.y = this.transMnPx(Math.abs(item.map_y) - item.map_height)/row; 
      })
      console.log('热点',data)
    },
    transMnPx(data){
      return (data*750)/600;
    }
  }
})