// pages/component/login/login_by_phone.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const app = getApp();

Component(app.BTAB({
  behaviors: [WindowBehaviors],
  /**
   * 组件的属性列表
   */
  properties: {
    activityRule:{
      type: String,
      value:""
    }
  },
  attached() {
  },
  detached() {

  },
  /**
   * 组件的初始数据
   */
  data: {
    boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
  },
  ready(){
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
      });
      return 300;
    },
  }
}))