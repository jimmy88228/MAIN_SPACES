import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
    current:{
      type:Number,
      value:0,
    },
    all:{
      type:Number,
      value:0,
    }
  },
  behaviors: [WindowBehaviors],
  /**
   * 组件的初始数据
   */
  data: {
    boxStyle: "opacity:0; transition: opacity 300ms ease-in-out;",
  },

  /**
   * 组件的方法列表
   */
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
