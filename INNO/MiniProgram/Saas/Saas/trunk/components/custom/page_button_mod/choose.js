// components/custom/page_button_mod/choose.js
import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      customTab: {
        type: Boolean,
        value: false
      }
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;", 
      shareList: [
        {
          shareId: 1,
          shareTip: "前往分享",
          showed: true,
        },
        {
          shareId: 2,
          shareTip: "前往热门活动",
          showed: true,
        }, 
      ],
    },
    attached() {
    },
    detached() {
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;",
          // boxStyle2: "opacity:0;"
        });
        return 300;
      }, 
      chooseType(e){
        let dataset = e.currentTarget.dataset||{};
        let shareId = dataset.shareId || 1;
        console.log('chooseType',dataset)
        this.triggerEvent("chooseType", {shareId});
      },
    }
})) 

function getSysTemConfig(type = "") {
  return app.sysTemConfig(type)
}