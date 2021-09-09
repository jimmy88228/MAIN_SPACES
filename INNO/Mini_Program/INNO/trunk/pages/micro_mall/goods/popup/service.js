import WindowBehaviors from "../../../../components/ui/cps/window/window-behaviors";
const app = getApp();

Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {},
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      goodsService:[],
    }, 
    detached() {
    },
    methods: {
      onAttached() { 
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png"; 
        this.setData({
          boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;",
          server_close: server_close
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

