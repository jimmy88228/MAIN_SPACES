// pages/component/custom/nav_bar/nav_bar.js 
const app = getApp();
Component(app.BTAB({
  properties: {
    pageType:{
      type:String,
      value:"normal"
    },
    title:{
      type:String,
      value:""
    }, 
    diyStyle:{
      type:String,
      value:""  
    },
  }, 
  data: {
  },
  ready(){
    let result = initBar.call(this) || {};  
    this.triggerEvent('init',result);
  },
  methods: {
    init(){
      let result = initBar.call(this) || {};
      return result;
    },
    onTap(e){
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || '';
      if(type=='back'){
        if(this.properties.pageType == 'normal'){
          wx.navigateBack({
            delta:-1
          })
        }else if(this.properties.pageType == 'comment'){
          this.triggerEvent('tap',{type:"back"});
        }
      }
    }
  }
}))


function initBar(e) {
  let page = getCurrentPages() || [];
  let result = {};
  if (page.length>1||true){
    let img_back = app.Conf.default_icon_url + "nav_back.png"; 
    let info = app.SIH.systemInfo;
    let wxInfo = wx.getMenuButtonBoundingClientRect();
    let baseW = app.SIH.screenWidth / 750;
    let statusBarHeight = (info.statusBarHeight || 0) / baseW;
    let topBarHeight = (wxInfo.bottom + wxInfo.top)|| 0; 
    this.setData({
      showBar:true,
      initTop: statusBarHeight + 'rpx',
      initHeight: topBarHeight + 'rpx',
      img_back
    })
    result.initTop = statusBarHeight;
    result.initHeight = topBarHeight;
  }
  return result;
}
