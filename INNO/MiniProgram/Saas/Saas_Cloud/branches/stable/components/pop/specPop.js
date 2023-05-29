// pages/component/pop/specPop.js 
import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    // styleIsolation: 'isolated',
    multipleSlots: true,
  },
  properties: { 
  },
  data: {
    boxStyle: "opacity:0;transform:translateY(100%);transition: all 300ms ease-in-out;",
  },
  pageLifetimes: {
    show() {},
    hide() {}
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transform:translateY(0);transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transform:translateY(100%);transition: all 300ms ease-in-out;"
      });
      return 300;
    }, 
    _noFn() {},
    setShow(){
      console.log('show')
      this.show();
    },
    setHide(){
      console.log('hide')
      this.dismiss();
    },
  }
})) 