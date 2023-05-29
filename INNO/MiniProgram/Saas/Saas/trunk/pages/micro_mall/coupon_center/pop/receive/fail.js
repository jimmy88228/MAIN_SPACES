// components/pop/adsPop.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const PAGE_TYPE = "STAFF_COUPON";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {},
  properties: {
    sendUser:{
      type: Object,
      value:{}
    }
  },
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
  },
  ready(){
  },
  pageLifetimes: {
    show() {},
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
    _noFn() {},
  }
}))