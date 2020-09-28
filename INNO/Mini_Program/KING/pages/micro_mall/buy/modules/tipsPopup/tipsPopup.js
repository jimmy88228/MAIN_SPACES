// pages/micro_mall/buy/modules/tipsPopup/tipsPopup.js
// pages/micro_mall/buy/modules/redPopup/redPopup.js
import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    addGlobalClass: true,
  },
  properties: {
  },
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    list:[{},{}]
  },
  // pageLifetimes: {
   
  // },
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
    close(e) {
      this.dismiss();
    },
    onTap(e) {
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || "";
    },
    _noFn() {},
  }
})) 
