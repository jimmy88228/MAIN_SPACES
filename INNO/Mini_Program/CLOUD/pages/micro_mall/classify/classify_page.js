// pages/micro_mall/test/test.js
const app = getApp();
const INIT_LIMIT = 3;
const SCREEN_TIMES = 1.2; //懒加载x屏
const SHOW_MOD = INIT_LIMIT * 1; //限制模块
Page(app.BP({
  data: {
    one:1,
    two:2,
    initLoadingAnim:true,
    extraH:-1
  }, 
  onLoad: function(options) {
    // setAnim.call(this,true);
    let searchStr = this.data.brand_info.icon_url + "micro_mall/search_icon.png";
    this.setData({searchStr})
  },
  onShow: function() {
    let that = this;
      let index = '1';
      this.classify = this.classify || this.selectComponent(`#classify_${index}`);
      this.classify.init && this.classify.init();
      // setAnim.call(this,false);
      wx.nextTick(() => {
        this.classify.onLoadFnc && this.classify.onLoadFnc({});
        this.classify.onShowFnc && this.classify.onShowFnc({});
      })
    // getCustomDataRequest.call(this).then(res => {
    //   let index = res && res.category_style || '1';
    //   this.classify = this.classify || this.selectComponent(`#classify_${index}`);
    //   this.classify.init && this.classify.init();
    //   // setAnim.call(this,false);
    //   wx.nextTick(() => {
    //     this.classify.onLoadFnc && this.classify.onLoadFnc(res || {});
    //     this.classify.onShowFnc && this.classify.onShowFnc(res || {});
    //   })
    // })
  },
  onReady(){
    const query = wx.createSelectorQuery();
    let that = this; 
    query.select('#box').boundingClientRect(function (res) {
        that.setData({
            extraH:res && res.height||0
        })
    }).exec() 
  },
  onHide() {
    this.classify = this.classify || this.selectComponent(`#classify_${index}`);
    this.classify.onHideFnc && this.classify.onHideFnc();
  },
  onShareAppMessage: function() { 
  },  
  getSearchGoods(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/micro_mall/search/search_goods',
    })
  }
})) 

//获取页面信息
function getCustomDataRequest() {
  return app.GoodsApi.getCustomPagesList({
    params: {
      param: "catelog",
      pageType: 3, //0首页， 1 pageId， 2页面名称,3分类
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      if (data.is_index == 1) {
        wx.setNavigationBarTitle({
          title: data.page_name,
        })
      }
      return Promise.resolve(data || {});
    }
    return Promise.reject(e);
  })
}


function setAnim(bool=false){
  if (bool == this.data.initLoadingAnim)return
  this.setData({
    initLoadingAnim: bool || false
  })
}