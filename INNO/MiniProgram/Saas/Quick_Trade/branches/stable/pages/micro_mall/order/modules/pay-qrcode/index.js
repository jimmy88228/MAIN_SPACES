// components/pop/adsPop.js
import {
  qrcode_custom
} from "../../../../../common/utils/code/index"
const App = getApp();
Component(App.BC({
  data: {
    show: false,
  },
  methods: {
    showModal() {
      this.setData({show: true})
    },
    dismiss() {
      this.setData({show: false})
      typeof this._afterDismiss === "function" && wx.nextTick(() => {
        this._afterDismiss();
        this._afterDismiss = null;
      });
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
        if (autoShow) {
          this.showModal();
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