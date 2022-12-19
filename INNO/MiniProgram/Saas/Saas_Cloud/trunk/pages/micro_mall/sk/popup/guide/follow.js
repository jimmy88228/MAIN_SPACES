// import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
// import StrH from "../../../../../common/support/utils/string-util"
const app = getApp();
Component(app.BTAB({
  // behaviors: [WindowBehaviors],
  properties: {
    isLogin:{
      type: Boolean,
      value: false,
      observer(){
        // console.log("监听登录登录登录")
        getInit.call(this);
      }
    },
    activityInfo:{
      type: Object,
      value: {}
    }
  },
  ready(){
  },
  attached() {
    // this.setTouchCancel(false);
  },
  detached() {},
  data: {
    // boxStyle: "opacity:1;transition: all 500ms ease-in-out;",
  },
  ready(){
  },
  pageLifetimes:{
    show(){
      
    },
  },
  methods: {
    onAttached() {
      this.setData({
        isShow: true
      })
      switchSmall.call(this,true);
    },
    onDetached() {
      this.setData({
        isShow: false
      })
    },
    hidePop(){
      switchSmall.call(this,false);
    },
    showPop(){
      switchSmall.call(this,true);
    },
    getLogin(){
      app.SMH.showToast({
        title: "请重新点击关注"
      })
    },
    _func(){

    },
    getJump(e){
      let dataset = e.currentTarget.dataset || {};
      let url = dataset.url || "" ;
      app.SMH.showLoading();
      if(url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
        wx.navigateTo({
          url: '/pages/micro_mall/web/webForSF/SF?link_url=' + encodeURIComponent(url),
        })
      }else{
        wx.navigateTo({
          url: url,
          fail(){
            wx.switchTab({
              url: url,
            })
          }
        })
      }
      setTimeout(()=>{
        app.SMH.hideLoading();
        switchSmall.call(this,false);
      },500)
    }
  }
}))
function getInit(){
  if(this.isLoading){ return }
  this.isLoading = true;
  checkSubscribeWechat.call(this).then(data=>{
    if(data != 1){//未关注
      getGuideFollowWechatInfo.call(this);
    }
  }).finally(()=>{
    this.isLoading = false;
  })
}
function switchSmall(isShow){
  let isSmaller = this.data.isSmaller || false;
  let boxStyle,smallIconStyle,smallBgStyle,contStyle;
  if(!isShow){//缩小
    boxStyle= "right:10rpx;transform: translate(0,20%);transition: all 350ms ease-in-out;";
    contStyle= "transform: translate(50%,-50%) scale(.2);transition: all 350ms ease-in-out;";
    smallBgStyle= "opacity:0;transition: all 350ms ease-in-out;";
    smallIconStyle= "z-index:10;opacity:1;transition: all 150ms 150ms ease-in-out;";
  }else{
    boxStyle= "right:50%;transform: translate(50%,-50%);transition: all 350ms ease-in-out;";
    contStyle= "transform:translate(50%,-50%) scale(1);transition: all 350ms 100ms ease-in-out;"
    smallBgStyle= "opacity:1;transition: all 350ms ease-in-out;";
    smallIconStyle= "z-index:1;opacity:0;transition: all 150ms ease-in-out;";
  }
  //背景图
  let bgStyle = setBg.call(this,isShow);
  this.setData({
    boxStyle: boxStyle,
    contStyle: contStyle,
    smallBgStyle: smallBgStyle,
    smallIconStyle: smallIconStyle,
    isSmaller: !isSmaller,
    bgStyle: bgStyle
  })
}
function setBg(isShow){
  let bgStyle = "";
  if(isShow){
    this.setData({
      showBg: true,
    })
    bgStyle =  "opacity:1;transition: all 350ms ease-in-out;"
  }else{
    bgStyle = "opacity:0;transition: all 350ms ease-in-out;"
    setTimeout(()=>{
      this.setData({
        showBg: false
      })
    },400)
  }
  return bgStyle;
}
function getGuideFollowWechatInfo(){
  let params = {
    cookieId: app.SIH.cookieId,
    brandCode: app.Conf.BRAND_CODE
  }
  let extra = {
    diy:true
  }
  return app.RunApi.go('CL_SecKillApi', 'getGuideFollowWechatInfo', params, extra).then(res => {
    if(res.code == 1){
      let data = res.data || {};
      this.setData({
        followData: data
      })
      if(data.needPush && data.adSlotImg){
        this.onAttached();
        setCardfInfo.call(this);
        pushGuideFollowWechat.call(this);
      }else{
        this.onDetached();
      }
    }
  })
}
function pushGuideFollowWechat(){
  let params = {
    cookieId: app.SIH.cookieId,
    brandCode: app.Conf.BRAND_CODE
  }
  let extra = {
    diy:true
  }
  return app.RunApi.go('post','CL_SecKillApi', 'pushGuideFollowWechat', params, extra).then(res => {})
}
function checkSubscribeWechat(){
  if (!app.LM.userToken){return Promise.resolve({data: 0});}
  return app.UserApi.checkUserSubscribeWechat({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
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
function setCardfInfo(){
  let activityInfo = this.properties.activityInfo || {};
  let page = getCurrentPages().pop() || {};
  let path = "/" + page.route + "?groupId=0&activityId=" + (activityInfo.activityId || 0) + "&keyword=关注公众号回复";
  let img = this.data.brand_info.default_icon_url + "follow/card_info.png"
  this.setData({
    cardInfo: {
      path: path,
      img: img
    }
  })
}