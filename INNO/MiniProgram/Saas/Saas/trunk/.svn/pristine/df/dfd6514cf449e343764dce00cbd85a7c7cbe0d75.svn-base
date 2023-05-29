// pages/micro_mall/register/help/tips_box.js
const app = getApp();
Component(app.BTAB({ 
  properties: {
    showTips:{
      type:Boolean,
      value:false
    },
    msg:{
      type:String,
      value:""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e){
      let dataset = e.currentTarget.dataset;
      let type = dataset.type||"";
      if(type=="complete"){
        wx.switchTab({
          url: '/pages/micro_mall/user/user',
        })
      }
    },
    _noFn(){}
  }
}))
