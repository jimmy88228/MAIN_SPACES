// pages/component/custom/module_ branches/advertise.js
import PageJump from "../../../../helper/page-jump.js";
import WxGH from "../../../../helper/handle/wxGroupHandle.js"
const app = getApp();
Component(app.BTAB({ 
  options: {
    addGlobalClass: true,
  },
  properties: {
    m_item: {
      type: Array,
      value: [],
      observer(n, o) {
        n = n || [];
        for (let i = 0; i < n.length; i++) {
          let iItem = n[i] || {};
          if (iItem.func_type == "VIDEO" && iItem.link_url) {
            this.videoObj = this.videoObj || {};
            if (!this.videoObj["video_" + i]) {
              this.data.needResetVideo["video_" + i] = true;
              this.needResetVideo = this.needResetVideo || {};
              this.needResetVideo["video_" + i] = false;
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
        this.setData({
          m_data: n,
          needResetVideo:this.data.needResetVideo
        })
      }
    },
    img_url: {
      type: String,
      value: '',
    },
    isLogin: {
      type: Boolean,
      value: false,
    },
    m_index: {
      type: Number,
      value: 0,
    },
  },
  lifetimes:{
    attached(){
      this.videoObj = {};
      // this.needResetVideo = {};
    }
  }, 
  data: {
    m_data:{},
    max_multiple:5,
    needResetVideo:{},
  },
  methods: { 
    goLink: function(e) {
      console.log(e);
      let dataset = e.type == "clickcallback" ? (e.detail || {}) : (e.currentTarget.dataset || {});
      let func_type = dataset.func_type || ""; 
      let related_id = dataset.related_id || "";
      let tag = dataset.tag || "";
      dataset.name = "AD";
      if (!func_type) return
      if (func_type == "COUPON") { //优惠券
        PageJump(dataset);
      } else if (func_type == "APPLETJUMP") { //小程序跳转  
        let temp = "", data = {};
        if (dataset.stringJump){
          temp = JSON.parse(dataset.stringJump || {});
          data.appId = temp.appId;
          data.applet_path = temp.applet_path;
        } else if (dataset.related_id && dataset.extent_id){
          data.appId = dataset.related_id;
          data.applet_path = dataset.extent_id;
        }else{
          return;
        }
        data.func_type = func_type;
        data.related_id = related_id;
        data.tag = tag;
        data.name = dataset.name;
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
    videoAction(e){
      // console.log('videoAction',e);
      let dataset = e.currentTarget.dataset || {};
      let id = dataset.id || e.currentTarget.id || "";
      dataset.type = dataset.type || e.type ||"";
      dataset.name = "AD";
      let needResetVideo = this.needResetVideo||{};
      if(dataset.type == 'play'){
        this.data.needResetVideo[id] = false;
        let videoObj = this.videoObj;
        !needResetVideo[id] && (videoObj[id] && videoObj[id].play()); 
        needResetVideo[id] || (needResetVideo[id] = true);
      }else{
        this.data.needResetVideo[id] = true;
        needResetVideo[id] && (needResetVideo[id] = false);
      }
      this.setData({
        needResetVideo:this.data.needResetVideo
      })
      PageJump(dataset);
    },
    videoEnd(e){

    },
    initVideo(status) {
      let videoObj = this.videoObj;
      if (!videoObj) { return }
      for (let i in videoObj) {
        if (videoObj[i]) {
          if (status == "play") {
            console.log("视频播放")
            videoObj[i].play();
          } else if (status == "pause") {
            console.log("视频暂停")
            videoObj[i].pause();
          }
        }
      }
    }, 
  },
  pageLifetimes:{
    show(){
    },
    hide:function(){
      let videoObj = this.videoObj;
      if(videoObj){
        let needResetVideo = this.data.needResetVideo || {};
        let needCheck = this.needResetVideo||{};
        let bool = false;
        for(let item in videoObj){
          videoObj[item].stop();
          if(needCheck[item]){
            needResetVideo[item] = true;
            !bool && (bool = true);
            needCheck[item] = false;
          }
        }
        bool && this.setData({
          needResetVideo
        })
      }  
    },
  },
}))

function staffJumpCheck() {
  return app.DistrApi.applyStaff({
    params: {
      brandCode: app.Conf.BRAND_CODE,
    },
    extraData: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      return Promise.resolve(res);
    }
    return Promise.reject();
  }).finally(() => {
    this.staffJumpLoading = false
  })
}