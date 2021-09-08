import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
import BTab from "../../../../../common/helper/base/base-tab.js";
import LM from "../../../../../common/manager/login-manager.js";
const app = getApp();

Component(
  BTab({
    behaviors: [WindowBehaviors],
    properties: {},
    data: {
      boxStyle: "opacity:0; transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      memberRight:[],
      current:0,
    },
    attached() {
    },
    detached() {
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1; transition: all 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0; transition: all 300ms ease-in-out;"
        });
        return 300;
      },
      getMemberRight(memberRight,index){
        this.setData({
          memberRight: memberRight,
          current: index || 0,
        })
        this.show();
      },
      changeSwiper(e){
        let current = e.detail.current;
        this.setData({
          current: current
        })
      },
      closeList(){
        this.dismiss();
      }
    }
  })
);

