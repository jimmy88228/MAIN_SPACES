// pages/micro_mall/user/seed_grass/seed_grass.js
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {

  },
  data: {
    grassData:{},
    showModal:false,
    jumpJson: {
      focuse: "/pages/micro_mall/seeding_grass/my_follow/my_follow",
      fans: "/pages/micro_mall/seeding_grass/my_fans/my_fans",
      collects: "/pages/micro_mall/seeding_grass/my_collection/my_collection",
      pubs: "/pages/micro_mall/seeding_grass/my_publish/my_publish"
    },
  },
  
  methods: {
    initGrassData(){
      app.sysTemConfig("OpenGrassFunction").then( e=>{
        if (e.Value == "1"){
          this.setData({
            showModal: true
          })
          getUserGrass.call(this);
        }
      })
    },
    getDetail(e){
      let dataset = e.currentTarget.dataset || {};
      let key = dataset.key;
      console.log(this.data.jumpJson);
      if(key){
        let url = this.data.jumpJson[key];
        wx.navigateTo({
          url: url,
        })
      }
    }
  }
}))
function getUserGrass(){
  return app.GrassApi.getMyGrassCenter({
    params:{
      userToken:app.LM.userToken,
      brandCode:app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    if(e.code == 1){
      this.setData({
        grassData:e.data || {}
      })
      return Promise.resolve(e);
    }else{
      return Promise.reject(e);
    }
  })
}
