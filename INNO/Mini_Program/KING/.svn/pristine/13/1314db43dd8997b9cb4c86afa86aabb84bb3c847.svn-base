import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors.js";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  properties: { 
  },
  data: { 
    boxStyle: "transform:translateY(100%);transition: transform 300ms ease-in-out",
  }, 
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "transform:translateY(0);transition: transform 300ms ease-in-out"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "transform:translateY(100%);transition: transform 300ms ease-in-out"
      });
      return 300;
    }, 
    init(data = [], _sum=0) {
      let friends = data || [];
      let sum = _sum || 0;
      this.setData({
        friends,
        sum
      });
      this.show();
    },
    hide() {
      this.dismiss();
    },
    _noFn() { },

  }
}))