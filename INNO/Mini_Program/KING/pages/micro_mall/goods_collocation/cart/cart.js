// pages/component/sceneOperate/pageHome.js
import PH from "../../../../helper/handle/paramsHandle"
const app = getApp();
Component(app.BTAB({
  properties: {
      showTip:{
        type: Boolean,
        value: false
      }
  },
  data: {
    animStyle:""
  },
  ready(){
    this.animStyle = "animation:animShow_cart 0.8s linear";
  },
  methods: {
    activeAnim(){
      actActive.call(this);
    },
    jumpPage(){
      wx.switchTab({
        url: '/pages/micro_mall/shopping/shopping_cart',
      })
    }
  }
}))
function actActive(){
  setTimeout(() => {
    this.setData({
      animStyle: this.animStyle
    })
    console.log()
  }, 50);
  setTimeout(() => {
    this.setData({
      animStyle: ""
    })
  }, 850);
}
