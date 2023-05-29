const App = getApp();
const BackMode = {
  Auto: {
    m: "Auto",
    c: "back-i"
  },
  None: {
    m: "None",
    c: "back-i"
  },
  Back: {
    m: "Back",
    i: "nav-back",
    c: "back-i"
  },
  Close: {
    m: "Back",
    i: "close",
    c: "back-i-close"
  },
  Home: {
    m: "Home",
    i: "nav-home",
    c: "back-i"
  },
};
import SIH from "../../../../common/helper/system-info-helper/index"
import NavConf from "./nav-config";
Component(App.BC({
  options: {
    multipleSlots: true 
  },
  properties:{
    navTitle: String,
    boxStyle: String,
    bodyStyle: String,
    navBoxStyle: String,
    customPlace:"",
    full:Boolean, 
    stay:Boolean,
    isTransparent:Boolean,
    cover:Boolean,
    isHideHome:Boolean,
    hideBtn:Boolean,
    isCatch:Boolean,
    scrollHeight: Number,
    mode: {
      type: String,
      value: BackMode.Auto.m
    },
  },
  data:{
    navPlace:`height: ${SIH.navPlace}px;`,
    statusBarPlace: `padding-top:${SIH.statusBarHeight}px;`,
    hasBack: false,
    backMode: {},
    navBackground: "rgba(255,255,255,1)",
    bgOpacity: 0,
    MenuObjectPadding:"padding-right:0;",
  },
  observers:{ 
    mode(nV) {
      this.setMode(nV);
    },
    isTransparent(){
      this.initBg();
    },
    scrollHeight(nV){
      if (!this.properties.isTransparent) return
      let transparentPrecent = (nV / SIH.navPlace).toFixed(2) > 1 ? 1 : 0
      if (this.data.bgOpacity == transparentPrecent) return;
      this.setData({bgOpacity:transparentPrecent});
    }
  },
  lifetimes:{
    created(){
      console.log('createcreate');
      if (this.isCreated) return;
      this.isCreated = true;
      this.setMode(this.properties.mode);
      this.setMenuObject();
      this.initBg();
    },
  },
  methods:{ 
    toBack() {
      let mode = this.data.backMode;
      console.log('mode.m', mode.m, mode)
      if(this.properties.isCatch){
        this.triggerEvent('navClick');
        return
      }
      if (mode.m == BackMode.Back.m) {
        wx.navigateBack({
          delta: 1
        });
      } else if (mode.m == BackMode.Home.m) {
        wx.reLaunch({
          url: `/${NavConf.INDEX_PATH}`
        });
      }
    },
    setMode(mode) {
      let backMode = BackMode.None;
      let pages = getCurrentPages();
      if (!mode || mode == BackMode.Auto.m) {
        if (pages.length > 1) {
          backMode = BackMode.Back
        } else if (pages.length <= 1 && Array.isArray(NavConf.EXCLUDE_PATH) && NavConf.EXCLUDE_PATH.every(item =>
            pages[0].route != item)) {
          backMode = !this.properties.isHideHome && BackMode.Home || BackMode.None
        }
      } else if (BackMode[mode]) {
        backMode = BackMode[mode];
      }
      this.setData({
        hasBack:backMode.m != BackMode.None.m,
        backMode
      })
    },
    initBg() {
      let bgOpacity = 1;
      if (this.properties.isTransparent) {
        bgOpacity = 0
      } 
      this.setData({bgOpacity})
    },
    setMenuObject(){
      let menuObj = SIH.capsuleButtonInfo||{};
      let MenuObjectPadding = 'padding-right:' + ((menuObj.width||0) + ((SIH.systemInfo.screenWidth - (menuObj.right||0)))*2) + 'px;';
      this.setData({MenuObjectPadding})
    }
  },
  
}))