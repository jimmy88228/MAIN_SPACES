// pages/micro_mall/video_shopping/v_page/v_components/v_top_bar.js
const app = getApp();
Component(app.BTAB({
  properties: {
  }, 
  data: {

  },
  ready(){
    initBar.call(this);
  },
  methods: {
    onTap(e){
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || '';
      if(type=='back'){
        wx.navigateBack({
          delta:-1
        })
      }
    }
  }
}))


function initBar(e) {
  let page = getCurrentPages() || [];
  if (page.length>1){
    let img_back = app.Conf.default_icon_url + "back.png"; 
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
  }
}