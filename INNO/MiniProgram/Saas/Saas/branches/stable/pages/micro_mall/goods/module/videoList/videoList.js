// pages/micro_mall/goods/module/videoList/videoList.js
const app = getApp();
Component(app.BTAB({ 
  properties: {

  }, 
  data: {
    cur_v:0
  }, 
  methods: {
    onUnloadFnc(){
      this.toggleFnc(0, true, { type: "toggle", setFalse: true });
    },
    loadData(goodsId=0){
      return app.GoodsApi.getGoodsDetailVideoShopinggList({
        params: {
          goodsId: goodsId || 0,
          brandCode: app.Conf.BRAND_CODE
        }, other: {
          isShowLoad: true
        }
      }).then(res => {
        if (res.code == "1") {
          let list = res.data || [];
          let index = 0;
          this.arr = [];
          list.forEach(item=>{
            item.toggle = false;
            item.muteActive = false;
            item.fullScreen = false;
            item.showCover = true;
            let id = `video_${index}`;
            index += 1;
            let context = wx.createVideoContext(id, this);
            this.arr.push(context);
          })
          this.setData({
            video_list: list
          })
          return Promise.resolve();
        }
        return Promise.reject();
      })
    },
    onTap(e){
      if (this.isLoadingTap)return
      isLoadingTap.call(this);
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type ||"";
      let index = dataset.index || 0;
      if (type){
        this.toggleFnc(index,true,{type});
      }
    },
    onPlay(e){
      // console.log('onPlay',e);
      fullScreenToggle.call(this,e,true);
    }, 
    onPause(e){
      // console.log('onPause',e)
      fullScreenToggle.call(this, e,false);
    },
    onError(e){
      console.log('onError',e)
    },
    fullscreenchange(e){
      let dataset = e.currentTarget.dataset || {};
      let detail = e.detail || {};
      let index = dataset.index||0;
      let v_info = this.arr[index] || {};
      let data = this.data.video_list || [];
      data[index] && (data[index].fullScreen = detail.fullScreen || detail.fullscreen || false);
      if (!data[index].fullScreen){
        this.triggerEvent('videoJump');
      }
      this.setData({
        [`video_list[${index}]`]: this.data.video_list[index] || {}
      })
    },
    toggleFnc(index = 0, action = true, obj = {}) {
      let label = index || 0;
      obj = obj || {};
      let arr = this.arr || [];
      let data = this.data.video_list || [];
      if (!data[index]) {
        return
      }
      if(obj.type == "toggle"){
        if (data[index].toggle || obj.setFalse) {
          data.forEach((item,i) => {
            item.toggle = false;
            (action || obj.fullScreenSet) && arr[i].pause();
          })
        } else if (!data[index].toggle || obj.setTrue) {
          data.forEach((item,i) => {
            if (label == i){
              item.toggle = true;
              item.showCover = false;
              (action && !obj.fullScreenSet) && arr[i].play();
            }else{
              item.toggle = false;
              (action || obj.fullScreenSet) && arr[i].pause();
            } 
          })
        };
      } else if (obj.type == "mute"){
        data[index].muteActive = !data[index].muteActive;
      } else if (obj.type == "fullScreen") {
        data[index].fullScreen = !data[index].fullScreen;
        action && this.arr[index] && this.arr[index].requestFullScreen();
      }
      this.setData({
        video_list: this.data.video_list || {}
      })
    },
    onChange(e){
      let detail = e.detail || {};
      let cur_v = detail.current || 0;
      let data = {};
      data.cur_v = cur_v;
      this.setData({
        cur_v,
      })
    },
    onFinish(e) {
    },
  }
}))

function fullScreenToggle(e,bool=false){
  let dataset = e.currentTarget.dataset || {};
  let index = dataset.index || 0;
  let data = this.data.video_list || [];
  if (data[index] && data[index].fullScreen && (data[index].toggle != bool)) {
    this.toggleFnc(index, true, { type: "toggle",fullScreenSet:true});
  }
}

function isLoadingTap(time=300){
  if (this.isLoadingTap)return
  this.isLoadingTap = true;
  this.isLoadingTapId = setTimeout(()=>{
    this.isLoadingTap=false;
  },time)
}