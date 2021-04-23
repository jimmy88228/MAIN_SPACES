// pages/component/custom/module_ branches/carousel.js
import PageJump from "../../../../helper/page-jump.js";
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {
    m_item: {
      type: Object,
      value: {},
      observer(n,o){
        console.log("轮播数据", n);
        n = n || [];
        for(let i = 0; i < n.length;i++){
          let iItem = n[i] || {};
          if (iItem.func_type == "VIDEO" && iItem.link_url){
            if (!this.data.hasVideo){
              this.setData({
                hasVideo: true
              })
            }
            this.videoObj = this.videoObj || {};
            if (!this.videoObj["video_" + i]){
              this.videoObj["video_" + i] = wx.createVideoContext("video_" + i, this);
            }
          }else if(iItem.func_type == "RD"){
            for(let j = 0; j < iItem.map_data.length; j++){
              let map_item = iItem.map_data[j] || {};
              map_item.customData = {
                func_type: map_item.func_id, 
                related_id: map_item.f_child_id,
                extent_id: map_item.extent_id,
                page_id: iItem.page_id,
                tag: map_item.rd_tag,
              }
            }
          }
        }
        if(n.length > 0){
          this.showLimitSwiper(n, 0);
        }
        this.setData({
          m_data: n
        })
      }
    },
    m_index: {
      type: Number,
      value: 0,
    }, 
    img_url: {
      type: String,
      value: '', 
    }, 
    isLogin: {
      type: Boolean,
      value: false,
    },
    circular: {
      type: Boolean,
      value: true,
    },
    multiple: {
      type: Number,
      value: 1,
    },
    duration: {
      type: Number,
      value: 500,
    },
    page_module_list: {
      type: Object,
      value: {}
    }
  },
  data: {
    swiper_heights:{},
    swiper_current:0,
    hasVideo:false,
    m_data:{}
  },
  videoObj:{},
  ready(){
  },
  methods: { 
    imgLoad: function(e) {
      let dataset = e.currentTarget.dataset || {}; 
      let module_id = dataset.module_id || 0;
      let img_h = e.detail.height;
      let img_w = e.detail.width;
      let swiper_heights = this.data.swiper_heights || {}; 
      let page_module_list = this.properties.page_module_list || {};
      let swiper_h = 0;
      if(page_module_list.moduleType != 2){
        swiper_h = swiper_heights.swiper_h || 0;
        let scaler_h = (img_h * 750) / img_w / (this.properties.multiple||1);
        if (swiper_h < scaler_h) {
          swiper_h = scaler_h;
        }
      } else {
        swiper_h = "430"
      }
      swiper_heights.swiper_h = swiper_h || 0; 
      this.setData({
        swiper_heights: swiper_heights,
      })
    },

    changeSwiper: function(e) {
      let detail = e.detail || {};
      let swiper_current = e.detail.current;
      this.setData({
        swiper_current: swiper_current,
      })
      this.showLimitSwiper(this.properties.m_data, swiper_current);
      if (detail.source == "touch"){ 
        this.initVideo("pause");
      }
    },
    showLimitSwiper(data, current){ // 只显示三个
      let page_module_list = this.data.page_module_list || {};
      if(page_module_list.moduleType != 3) return;
      current = current || 0;
      let swiperConf = [];
      let count = data.length;
      let limitC = Math.ceil(count / 2);
      let j = limitC;
      for(let i = 0; i < count; i++){
        let show = false, zIndex = 0;
        let limitl = current - 1, limitlr = current + 1;
        if(i == current){
          show = true;
          zIndex = 99;
        } else if((i == limitl) || (limitl < 0 && i == (count - 1))) {
          show = true;
          zIndex = 98;
        } else if((i == limitlr || (limitlr > (count - 1) && i == 0))){
          show = true;
          zIndex = 98;
        }
        swiperConf[i] = {
          show: show,
          zIndex: zIndex
        }
      }
      this.setData({
        swiperConf: swiperConf
      })
    },
    initVideo(status){
      let videoObj = this.videoObj;
      if (!videoObj){return}
      for (let i in videoObj){
        if (videoObj[i]){
          if (status == "play"){
            videoObj[i].play();
          } else if (status == "pause"){
            videoObj[i].pause();
          }
        }
      }
    },
    goLink: function(e) {
      let that = this;
      let type = e.type;
      let dataset = e.type == "clickcallback" ? (e.detail || {}) : (e.currentTarget.dataset || {});
      let func_type = dataset.func_type || "";
      console.log('轮播图', func_type, dataset, e)
      if (!func_type)return
      let related_id = dataset.related_id || "";
      let tag = dataset.tag;
      dataset.name = "LOOP_AD";
      if (func_type == "COUPON") { //优惠券
        PageJump(dataset);
      } else if (func_type == "APPLETJUMP") { //小程序跳转
        let temp = "", data = {};
        if (dataset.stringJump) {
          temp = JSON.parse(dataset.stringJump || {});
          data.appId = temp.appId;
          data.applet_path = temp.applet_path;
        } else if (dataset.related_id && dataset.extent_id) {
          data.appId = dataset.related_id;
          data.applet_path = dataset.extent_id;
        } else {
          return;
        }
        data.func_type = func_type;
        data.related_id = related_id;
        data.name = dataset.name;
        data.tag = tag;
        PageJump(data);
      } else if (func_type == "TOJUMP" && related_id == 15) { //申请分销员
        if (!this.staffJumpLoading) {
          this.staffJumpLoading = true;
          staffJumpCheck.call(this).then(res => {
            if (res.data.is_enabled != 0) {
              let pageId = app.LM.staffInfo.pageId;
              dataset.page_id = pageId;
              PageJump(dataset);
            } else {
              app.SMH.showToast({
                title: '活动已结束'
              })
            }
          })
        }
      } else {
        PageJump(dataset);
      }
    },
    videoAction(e) {
      let dataset = e.currentTarget.dataset || {};
      dataset.type = e.type || "";
      dataset.name = "LOOP_AD";
      PageJump(dataset);
    },
    handle_v_play(e) {
      this.setData({
        v_noScroll: true
      })
      this.videoAction(e);
    },
    handle_v_pause(e) {
      this.setData({
        v_noScroll: false
      })
      this.videoAction(e);
    },
    handle_v_end(e) {
      this.setData({
        v_noScroll: false
      })
    },
    _noFn(){}
  },
  pageLifetimes:{
    hide(){
      // this.initVideo("pause");
    }
  }
}))
 