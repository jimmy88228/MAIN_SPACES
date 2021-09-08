import WindowBehaviors from "../../../../components/ui/cps/window/window-behaviors";
import {
  qrcode_custom,
  barcode_custom
} from "../../../../common/helper/utils/goComplete/index.js"
const app = getApp();

Component(app.BTAB({
  behaviors: [WindowBehaviors],
  /**
   * 组件的属性列表
   */
  properties: {
    handleType:{
      type:String,
      value:""
    }
  },
  attached() {
  },
  detached() {

  },
  data: {
    boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;",
    zIndex: "z-index:-1;top:1000rpx;left:1000rpx;"
  },
  ready(){},
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;",
        zIndex: "z-index:100;top:0px;left:0px;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;z-index:-1;",
      });
      setTimeout(()=>{
        this.setData({
          zIndex: "z-index:-1;top:1000rpx;left:1000rpx;"
        })
      },200)
      return 300;
    },
    showCode(code){
      code = code || "1741996160745459820120827";
      if(code){
        console.log("222");
        this.onAttached();
        qrcode_custom('payCode', code, 450, 450,this);
        barcode_custom('barCanvas', code, 500, 150,this);
        this.setData({
          codeNum: code
        })
      } 
    }
  }
}))