// pages/micro_mall/shopping/promotion/promotion.js
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
    promotionData:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPage : false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(bool = false, data={}){
      let that = this;
      if (!this.data.showPage){
        this.setData({
          showPage:true,
          promotionData: data
        });
        wx.nextTick(()=>{
          that.setData({
            active: true
          })
        })
      }else{
        this.setData({
          active: false
        });
        setTimeout(()=>{
          this.setData({
            showPage: false
          })
        },250)
      }
    },
    cancel(){
      this.setData({
        active: false
      });
      setTimeout(() => {
        this.setData({
          showPage: false
        })
      }, 250)
    },
    _noFn(){},
  }
}))
