// pages/component/sceneOperate/pageHome.js
import PH from "../../common/helper/handle/paramsHandle"
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
      customStyle: {
          type: String,
          value: ''
      },
      customImg:{
        type: String,
        value: ''
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showHome:false,
    jumpUrl:"/pages/micro_mall/index/index",
    customUrl:"",
  },
  attached(){},
  /**
   * 组件的方法列表
   */
  methods: {
    initPageHome(url,isShow){
      let pageOption = PH.paramsJson() || {};
      let options = pageOption.options || {};
      let scene = options.scene;
      if(isShow){
        this.setData({
          showHome: true,
          customUrl: url || ""
        })
        return;
      }
      let sceneLimit = {
        '1007':'1007',
        '1008':'1008',
        '1011':'1011',
        '1012':'1012',
        '1013':'1013',
        '1014':'1014',
        '1020':'1020',
        '1035':'1035',
        '1036':'1036',
        '1037':'1037',
        '1043':'1043',
        '1044':'1044',
        '1045':'1045',
        '1046':'1046',
        '1047':'1047',
        '1048':'1048',
        '1049':'1049',
        '1058':'1058',
        '1067':'1067',
        '1073':'1073',
        '1074':'1074',
        '1081':'1081',
        '1082':'1082',
        '1084':'1084',
        '1091':'1091',
        '1096':'1096'
      }
      if (sceneLimit[scene]) {
        this.setData({
          showHome: true,
          customUrl: url || ""
        })
      }
    },
    pageJump(e){
      let that = this;
      let pageOption = PH.paramsJson() || {};
      let options = pageOption.options || {};
      options.scene = 1001;
      PH.saveParams(pageOption);
      if (this.data.customUrl){
        wx.navigateTo({
          url: that.data.customUrl,
          fail() {
            wx.switchTab({
              url: that.data.customUrl,
            })
          }
        })
      }else{
        wx.switchTab({
          url: that.data.jumpUrl,
        })
      }
      
    }
  }
}))
