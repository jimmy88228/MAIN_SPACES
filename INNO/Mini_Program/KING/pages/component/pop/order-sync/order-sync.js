import WindowBehaviors from "../../../../ui/cps/window/window-behaviors";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      tips:{
        type:String,
        value:''
      },
      type:{
        type: String,
        value: ''
      }
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
      setAnim(bool){
        let loadText = '加载中';
        let arr = ['加载中.', '加载中..', '加载中...'];
        let num = 0;
        if (bool) {
          this.show();
          this.setData({
            tips:loadText
          })
          // this.loadId = setInterval(() => {
          //   loadText = arr[num];
          //   num += 1;
          //   if (num == 3) num = 0;
          //   this.setData({
          //     tips:loadText
          //   })
          // }, 500)
        } else {
          // clearInterval(this.loadId);
          this.dismiss();
        }
      },
      clearId(){
        // clearInterval(this.loadId);
        this.dismiss();
      }
    }
  })
);