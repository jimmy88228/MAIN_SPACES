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
      value: {}
    },
    m_index: {
      type: Number,
      value: 0
    },
    img_url: {
      type: String,
      value: '',
    },
    module_data: {
      type: Object,
      value: {}
    },
    isLogin: {
      type: Boolean,
      value: false
    },
  },
  data: {
    user_info:{},
    isLogin:false,
    imageInfo:{},
    brand_info:{},
    openData: wx.canIUse('open-data')
  },
  ready(){
  },
  methods: {
    goLink: function(e) {
      // let that = this;
      // let type = e.type;
      console.log('eee',e)
      let dataset =  e.currentTarget.dataset || {};
      // let related_id = dataset.related_id || false;
      PageJump(dataset);
    },
    //获取用户信息
    getUserInfoEvent: function(check){
      let storage = app.StorageH.get('USER_INFOS');
      if(!storage)return;
      if(check && (!storage.mobilePhone))return;
      this.setData({
        user_info:storage
      })
      return
      // return app.UserApi.getUserInfoWap({
      //   params: {
      //     brandCode: app.Conf.BRAND_CODE,
      //     userToken: app.LM.userToken
      //   },
      //   other: {
      //     isShowLoad: true
      //   }
      // }).then(e => {
      //   if(e.code == "1"){
      //     let data = e.data;
      //     this.setData({
      //       isLogin: app.LM.isLogin,
      //       user_info: data
      //     });
      //     return Promise.resolve(data);
      //   }
      //   return Promise.reject();
      // })
    },
    initSessionFrom(){
      if(app.LM.isLogin){
        this.getUserInfoEvent();
      }
    }
  },
  lifetimes: {
    attached: function() {
      this.initSessionFrom();
    },
    ready:function () {
    },
    detached:function () {
      app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
    }
  },
  pageLifetimes: {
    show: function() {
      if(!this.data.isLogin){
        this.initSessionFrom();
      }else{
        let info = this.data.user_info||{};
        if(!info.mobilePhone){ //手机号补充的检测
          this.getUserInfoEvent(true);
        }
      }
    },
  }
}))

