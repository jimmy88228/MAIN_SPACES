// components/login/login_by_phone.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  /**
   * 组件的属性列表
   */
  properties: {
    isLogin:{
      type: Boolean,
      value: false
    },
    helpData:{
      type: Object,
      value:{}
    }
  },
  ready(){
  },
  attached() {
    this.setTouchCancel(false);
  },
  detached() {

  },
  data: {
    boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
  },
  ready(){
  },
  methods: {
    onAttached() {
      let timer = setTimeout(()=>{
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
        clearTimeout(timer);
      },500)
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
      });
      return 300;
    },
    hidePop(){
      this.dismiss();
      this.triggerEvent('joinLiveEvent',{isHelp: false});
    },
    joinLive(){
      let that = this;
      // let time = setTimeout(()=>{
      //   that.dismiss();
      //   clearTimeout(time);
      // },500)
      that.dismiss();
      this.triggerEvent('joinLiveEvent',{isHelp: true});
    }
  }
}))