// pages/micro_mall/header/indexHeader.js
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  options:{
    addGlobalClass: true,
  },
  properties: {
      customTab:{
        type: "boolean",
        value: false,
      },
      btn_follow_must_show: {
        type: "boolean",
        value: 0,
        observer: function (news, olds, path) {}
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    brand_info: {},
    is_close:1,
    is_loading:false,
  },
  attached() {
    this.getSysConfigInfo();
  },
  detached() {
  },
  ready() {
       
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getSysConfigInfo:function(){
      app.sysTemConfig("applet_subscribe_tip").then( e=>{
        if(e.Value == "1"){
          this.checkSubscribeWechat().then(res=>{
            if(res.data == 0){
              let is_close = app.StorageH.get('follow_close') ? app.StorageH.get('follow_close') : 0;
              this.setData({
                is_close: is_close
              });
            }
          }).catch(res=>{})
          
        }
      })        
    },
    loadstatus:function(e){
      console.log("loadstatus",e);
      if (e.detail.status === 0){
        this.setData({
            is_loading:true
        });
      };
    },
    errorstatus:function(e){
      console.log("errorstatus",e)
    },
    closeFollow:function(){
        let is_close = 1;
        app.StorageH.set('follow_close', is_close);
        this.setData({
            is_close: is_close,
            btn_follow_must_show:0
        });
    },
    checkSubscribeWechat(){
      if (!app.LM.userToken){return Promise.resolve({data: 0});}
      return app.UserApi.checkUserSubscribeWechat({
        params:{
          userToken: app.LM.userToken,
          brandCode: app.Conf.BRAND_CODE
        },other:{
          isShowLoad: true
        }
      }).then(e=>{
        if(e.code == "1"){
          let data = e.data;
          if (data == 0) {
            return Promise.resolve(e);
          }
        }
        return Promise.reject(e);
      })
    }
  }
}))
