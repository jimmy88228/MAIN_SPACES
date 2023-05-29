// components/pop/adsPop.js
import WxApi from "../../../../../common/helper/wx-api-helper";
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
import {
  qrcode_custom
} from "../../../../../common/helper/utils/goComplete/index.js"
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {

  },
  data: {

  },
  ready(){
    
  },
  pageLifetimes: {
    show() {
    },
    hide() {
    }
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: `opacity:1;transition: all 300ms ease-in-out;`
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      typeof this._afterDismiss === "function" && wx.nextTick(() => {
        this._afterDismiss();
        this._afterDismiss = null;
      });
      return 300;
    },
    initData(data = {}){
      return loadData.call(this, data)
    },
    _noFn() {},
  }
}))

function loadData({content, autoShow = true, afterDismiss}){
  try {
    return initQrCode.call(this, content)
    .then(() => {
      typeof afterDismiss === "function" && (this._afterDismiss = afterDismiss);
      return new Promise(resolve => {
        // this.setData({agreeData: data});
        if (autoShow) {
          this.show()
          return resolve(true)
        } else return resolve(false)
      })
    })
    .catch(err => {
      console.log("没有拉起会员协议弹窗: ", err)
      return Promise.resolve(false)
    })
  } catch (error) {
    console.log("会员协议弹窗报错", error);
    return Promise.resolve(false)
  }
}

function initQrCode(content){
  if (content === this.qrcodeContent) return Promise.resolve(true);
  this.qrcodeContent = content;
  return new Promise(resolve => {
    wx.nextTick(() => {
      qrcode_custom("pay_qrcode", content, 450, 450, this)
      resolve(true)
    })
  })
}