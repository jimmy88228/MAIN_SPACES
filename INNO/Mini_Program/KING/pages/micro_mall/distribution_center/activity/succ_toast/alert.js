import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors";
const app = getApp();

Component(
    app.BTAB({
        behaviors: [WindowBehaviors],
        properties: {},
        data: {
            boxStyle: "opacity:0;",
            title:"去朋友圈分享",
            conts:[],
            btns:{
              txt:"知道了",
              tap:null
            }
        },
        attached() {
        },
        detached() {
        },
        methods: {
            onAttached() {
               let _timer = setTimeout(()=>{
                  clearTimeout(_timer);
                   this.setData({
                       boxStyle: "opacity:1;"
                   });
               },200)
            },
            onDetached() {
                this.setData({
                    boxStyle: "opacity:0;"
                });
                return 300;
            },
            setTitle(title){
              this.setData({
                title: title
              })
              return this;
            },
            setCont(cont) {
              this.setData({
                conts: cont
              })
              return this;
            },
            setBtn(params){
              let btns = this.data.btns;
              if(typeof(params) == "string"){
                btns.txt = params;
              }
              if(typeof(params) == "object"){
                btns.txt = params.txt;
                btns.tap = params.tap;
              }
              this.setData({
                btns: btns
              })
              return this;
            },
            tapHandle(e){
              let btns = this.data.btns;
              this.dismiss();
              typeof (btns.tap) == "function" && btns.tap();
            }

        }
    })
);
