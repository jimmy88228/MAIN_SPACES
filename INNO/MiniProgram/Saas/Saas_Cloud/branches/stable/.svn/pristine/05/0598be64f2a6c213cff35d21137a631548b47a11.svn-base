// pages/component/pop/pagePop.js
import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  properties: {
    top:{
      type:Number,
      value: 0
    }
  },
  pageLifetimes:{
    hide(){
      this.timer && clearTimeout(this.timer)
    }
  },
  ready(){
    this.setMaskBg("none");
  },
  data: {
    boxStyle: "opacity:0;transform:translateY(-100%);transition: all 300ms ease-in-out;",
  },
  methods: {
    onReadyFnc(){
      let userOperate = app.StorageH.get("USER_OPERATE") || {};
      if (!userOperate.isShowAddTip){
       this.timer = setTimeout(()=>{
          this.show();
          userOperate.isShowAddTip = 1;
          app.StorageH.set("USER_OPERATE", userOperate);
        },500)
      }
    },
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transform:translateY(0);transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      return 300;
    },
  }
}))
