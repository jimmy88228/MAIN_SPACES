// import WindowBehaviors from "../../../../ui/cps/window/window-behaviors";
// import BTab from "../../../helper/base/base-tab.js";
const app = getApp();

Component(
  app.BTAB({
    // behaviors: [WindowBehaviors],
    properties: {},
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      filter: [
        {
          key: 0,
          val: "全部"
        },
        {
          key: 1,
          val: "订单收益"
        },
        {
          key: 2,
          val: "奖励"
        },
        {
          key: 3,
          val: "提现"
        },
        {
          key: 4,
          val: "系统调整"
        }
      ],
    }, 
    detached() {
    },
    methods: {
      onAttached() { 
        // let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png"; 
        // this.setData({
        //   boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;",
        //   server_close: server_close
        // });
        // this.popup = this.popup || this.selectComponent("#popup");
        // this.popup.show();
      },
      onDetached() {
        // this.popup = this.popup || this.selectComponent("#popup");
        // this.popup.dismiss();
        // this.setData({
        //   boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;"
        // });
        // return 300;
      },
      getCurrFilter(filterCurr){
        if (filterCurr){
          this.setData({
            filterCurr: filterCurr
          })
        }
        this.show();
      },
      show(){
        this.popup = this.popup || this.selectComponent("#popup");
        this.popup.show();
      },
      dismiss(){
        this.popup = this.popup || this.selectComponent("#popup");
        this.popup.dismiss();
      },
      filterTap(e){
        let dataset = e.currentTarget.dataset || {};
        let filter = this.data.filter || [];
        this.setData({
          filterCurr: filter[dataset.index]
        })
      },
      confirmTap(){
        this.dismiss();
        let filterCurr = this.data.filterCurr;
        this.triggerEvent("filtercallback", { filterCurr: filterCurr })
      }
    }
  })
);

