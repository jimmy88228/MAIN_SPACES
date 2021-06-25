// pages/matrix/draw_box/shareHelp/shareHelp.js 
import {
  createBehavior
} from "../../../../components/window/anim-helper";
const app = getApp();
const anim = {
  enterTo: "transition: all 300ms ease-in-out;opacity: 1;",
  leaveTo: "opacity: 0; transition: all 300ms ease-in-out;",
  duration: 300
} 
Component({
  behaviors: [Behavior.BaseBehavior, createBehavior(anim)],
  properties: { 
    actInfo:{
      type:Object,
      default:{}
    }
  },
  data: { 
  },
  
  lifetimes: {
		ready() {
      this.checkLoginChange(); 
		}, 
	}, 
  methods: {
    close(){
      this.dismiss();
    },
    help(){
      this.triggerEvent('createShareHelp');
    },
    authed(){
      this.checkLoginChange(); 
      if(app.LM.isLogin){
        app.SMH.showToast({
          title:"授权成功，请重新点击"
        })
      }
    },
  }
}) 