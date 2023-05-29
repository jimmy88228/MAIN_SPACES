// components/pop/adsPop.js
import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
import WelcomeH from "../../../common/helper/handle/welcomeHandle.js";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {},
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    welcomeConf:{}
  },
  ready(){
    this.setMaskBg("none")
  },
  pageLifetimes: {
    hide: function() {
      let timer = setTimeout(()=>{
        this.dismiss()
        clearTimeout(timer)
        timer = null;
      },500);
    },
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    loadConf(){
      // getStartPageConfigList.call(this).finally(()=>{
      //   app.globalData.isShowWelcome = true;
      // })
      getStartPageConfigList.call(this);
    },
    imgLoad(e){
      console.log("imgLoad",e);
      let height = e.detail.height || 0;
      let Vh = app.SIH.windowHeight || 0;
      if(height > Vh && !this.data.isLong){
        this.setData({
          isLong: true
        })
      }
      let timer = setTimeout(()=>{
        this.timeDown(this.DownSecond);
        clearTimeout(timer)
        timer = null;
      },500);
      this.show();
      this.timeDown(this.DownSecond);
    },
    timeDown(DownSecond){
      if(this.timer){
        clearInterval(this.timer);
        this.timer = null;
      }
      if(DownSecond > 0){
        this.timer = setInterval(() => {
          if(DownSecond > 0){
            DownSecond = DownSecond - 1
            this.setData({
              DownSecond: DownSecond
            })
          }else{
            clearInterval(this.timer);
            this.timer = null;
            this.closeHandle()
          }
        }, 1000);
      }
    },
    jumpAction(e){
        let dataset = e.currentTarget.dataset || {};
        let url = dataset.url;
        if(url){
            wx.navigateTo({
              url: url,
              fail(){
                  wx.switchTab({
                    url: url
                  })
              }
            })
        }
    },
    closeHandle(){
      this.dismiss();
      console.log("触发 WelcomeH")
      WelcomeH.activeCallbackEvent();
    },
    _noFn() {},
  }
}))
function getStartPageConfigList(){
  let conf = WelcomeH.welcomeConf || {};
  console.log("getStartPageConfigList  111",conf)
  if(conf.weapp_start_enable == 1){
    this.setData({
      welcomeConf:  conf,
      DownSecond: conf.weapp_start_seconds
    })
    this.DownSecond = conf.weapp_start_seconds
    getMenuBtn.call(this);
  }
}
function getMenuBtn(){
  let menuObject = app.SIH.getMenuObject;
  this.setData({
    bTop: menuObject.top,
    bHeight: menuObject.height
  })
}