import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
import BTab from "../../../../../common/helper/base/base-tab.js";
const app = getApp();

Component(
  BTab({
    behaviors: [WindowBehaviors],
    properties: {},
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      goodsService:[],
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
          boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;"
        });
        return 300;
      },
      getGoodsServiceData(goodsService){
        this.setData({
          goodsService: goodsService
        })
      },
      closeList(){
        this.dismiss();
      }
    }
  })
);

