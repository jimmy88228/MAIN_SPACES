// pages/component/empty_tip/empty_tip.js
const app = getApp();
Component(app.BTAB({ 
  properties: {
    tip:{
      type:String,
      value:""
    },
    showImg:{
      type:Boolean,
      value:true
    },
    showBtn:{
      type:Boolean,
      value:true
    },
    btnText:{
      type:String,
      value:"返回"
    },
    jumpUrl:{
      type:String,
      value:""
    },
  }, 
  data: {

  },
  attached(){
    let empty_tip_img = this.data.brand_info.default_icon_url + "empty_tip.png";
    this.setData({
      empty_tip_img
    })
  },
  methods: {
    jump(){
      let url = this.data.jumpUrl || "";
      if(url){
        wx.redirectTo({
          url: '/' + url,
          fail:res=>{
            wx.switchTab({
              url: '/' + url,
            })
          }
        })
      }else{
        wx.navigateBack({
          delta: 1,
        })
      }
    }
  }
}))
