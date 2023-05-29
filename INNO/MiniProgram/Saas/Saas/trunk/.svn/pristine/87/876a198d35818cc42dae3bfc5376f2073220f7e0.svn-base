// pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/showProtocol/showProtocol.js

import WindowBehaviors from "../../../../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
 
  behaviors: [WindowBehaviors],
  properties: {
    content:Object
  }, 
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
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
    close(e){
      this.dismiss();
    },
    confirm(e){
      this.triggerEvent('confirm');
      this.dismiss();
    }
  }
}))
