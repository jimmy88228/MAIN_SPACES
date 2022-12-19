// pages/component/pop/adsPop.js
import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
// import SG from "../../../../common/helper/handle/shopGuideHandle.js";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    
  },
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
  },
  pageLifetimes: {
    show() {},
    hide() {
    }
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: all 300ms ease-in-out;"
      });
      this.setTouchCancel(false);
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    initData(staffInfo){
      this.setData({
        staffInfo: staffInfo || {}
      })
      let that = this;
      setTimeout(()=>{
        that.show();
      },100)
      
    },
    _noFn() {},
  }
}))