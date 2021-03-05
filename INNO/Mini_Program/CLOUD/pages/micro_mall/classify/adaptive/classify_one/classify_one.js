// pages/micro_mall/classify/adaptive_ classify/classify_one/classify_one.js
const app = getApp();
Component(app.BTAB({
  properties: {
    customTab:{
      type:Boolean,
      value:false,
    }
  },
  properties: {
    extraH:{
      type: Number,
      value: -1,
    },
    customTab:{
      type: Boolean,
      value: false,
    },
  },
  // options: {
  //   addGlobalClass: true,
  // },
  data: {
    navH:app.SIH.navPlace,
  }, 
  ready(){
    
  },
  methods: { 
    init(){
      this.setData({
        showPage:true
      })
    },
    onLoadFnc(){
    },
    onShowFnc(data = {}) {
      if (this.saveData) {
        this.jump = false;
        this.saveData = false;
        // console.log('保留')
        return
      }
      this.pageTab = this.pageTab || this.selectComponent("#pageTab");
      this.pageTab.getPageData({pageType:"catelog"});
      
      // console.log('重置')
      // this.setData({
      //   scrollTop: 0
      // })
      // getCustomCategoryList.call(this, data && data.page_id || 0).then(res => {
      //   loadData.call(this);
      // })
    }, 
    onUnloadFnc(){ 
    },
    goLink: function (e) {
      this.jump = true;
    },
    handle_jump(e) {
      this.jump = true
    },
  },
  pageLifetimes: {
    show: function () {
       
    },
    hide: function () {
      if (this.jump) {
        this.saveData = true;
      } else {
        this.saveData = false;
      }
    },
  }
}))
