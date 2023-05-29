// components/pop/adsPop.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
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
    groupList: []
  },
  pageLifetimes: {
    show() {
      
    },
    hide() {

    }
  },
  methods: {
    onAttached() {
      let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png"; 
      let l_bg_color = app.getColor(this.data.brand_info.style.bg_color, 0, 0, 0, 0.1);
      this.setData({
        boxStyle: "opacity:1;transform: translateY(0);transition: all 300ms ease-in-out;",
        server_close: server_close,
        l_bg_color: l_bg_color
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transform: translateY(100%);transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    handleCateTap(e) {
      const id = e.currentTarget.dataset.id;
      this.dismiss()
      this.triggerEvent("catetap", id)
    },
    showFn(groupList) {
      this.setData({ groupList }, this.show)
    },
    _noFn() {},
  }
}))