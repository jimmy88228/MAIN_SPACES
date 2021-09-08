// pages/micro_mall/sk/orders-sk/order-sync/order-sync.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      tipsArr: {
        type: Array,
        value: []
      }, 
      type:{
        type: String,
        value: ""
      },
      text: {
        type: String,
        value: ""
      },
    },
    data: {
      boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
    },
    attached() {
    },
    detached() {
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        return 300;
      },
      init(data){
        let tipsArr = data;
        if(!tipsArr)return;
        this.status = 1;
        this.title = "以下商品已卖完咯"
        for (let item in tipsArr){
          console.log(item, tipsArr[item])
          if (tipsArr[item].msg != "商品已售罄"){
            this.status = 2;
            this.title = "以下商品状态已变更，无法添加"
            break;
          }
        }
        this.setData({
          status:this.status,
          title: this.title
        })
      },
      close() {
        this.dismiss();
      },
      _noFn(){}
    }
  })
);