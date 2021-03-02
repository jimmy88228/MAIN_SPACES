// pages/micro_mall/buy/modules/redPopup/redPopup.js
import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    addGlobalClass: true,
  },
  properties:{
    redpackList:{
      type:Array,
      value:[],
    },
    redpackSumary:{
      type:Object,
      value:{}, 
    },
  },
  data: {
    boxStyle: "opacity:0;transform:translateY(100%);transition: all 300ms ease-in-out;",
    list:[{},{}],
    tipShow:false,
  },
  ready(){
    let un_select_img = this.data.brand_info.icon_url + "micro_mall/ls_icon1.png";
    let select_img = this.data.brand_info.icon_url + "micro_mall/ls_icon2.png";
    let tips_img = this.data.brand_info.default_icon_url + "tips.png";
    this.setData({
      un_select_img, 
      select_img, 
      tips_img
    })
  },
  methods: {
    onAttached() {
      this.setTouchId = setTimeout(()=>{
        this.setTouchCancel(true);
      },500)
      this.setData({
        boxStyle: "opacity:1;transform:translateY(0);transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      clearTimeout(this.setTouchId);
      this.setData({
        boxStyle: "opacity:0;transform:translateY(100%);transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    close(e) {
      this.dismiss();
    },
    onTap(e) {
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || "";
      console.log('dataset',dataset)
      if(type=='use'){
        if(this.lockTime)return;
        throttle.call(this);
        let bool = !!!dataset.bool;
        this.triggerEvent('use',bool);
      }else if(type=="tip"){ 
        this.tipsPopup = this.tipsPopup || this.selectComponent('#tipsPopup');
        this.tipsPopup.show(); 
      }
    },
    _noFn() {},
  }
})) 

function throttle(time=500) {
  time=time||500;
  this.lockTime = true;
  this.throttleId = setTimeout(()=>{
    this.lockTime = false;
  },time)
}