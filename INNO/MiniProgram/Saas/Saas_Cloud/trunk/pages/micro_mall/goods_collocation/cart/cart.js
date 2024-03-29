// pages/component/sceneOperate/pageHome.js
// import PH from "../../../../common/helper/handle/paramsHandle"
const app = getApp();
Component(app.BTAB({
  properties: {
      showTip:{
        type: Boolean,
        value: false
      },
      jumpType:{
        type:String,
        value:"special",
      },
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
      if(this.properties.jumpType == 'special'){ 
        wx.navigateTo({
          url: '/pages/micro_mall/special_shopping/shopping_cart',
        }) 
      }else{ 
        wx.switchTab({
          url: '/pages/micro_mall/shopping/shopping_cart',
        })
      }
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
