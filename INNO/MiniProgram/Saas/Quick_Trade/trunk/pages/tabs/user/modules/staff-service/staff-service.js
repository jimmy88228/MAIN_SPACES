const App = getApp();
import JumpHelp from "../jumpHelp.js";
Component(App.BC({
  properties: {
    userData: {
      type: Object,
      value:{}
    }
  },
  data:{
    barList:[{
      state:1,
      title:"店员中心",
      key:'address',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-service4.png",
      url:"/pages/main/staff-module/staff-center/staff-center",
    },{
      state:2,
      title:"活动管理",
      key:'activity',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-service28.png",
      url:""
    },{
      state:3,
      title:"商品库",
      key:'goods',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-service17.png",
      url:""
    },]
  },
  ready() {
    
  },
  methods: {
    jump(e){
      let item = this.getDataset(e,'item')||{};
      JumpHelp.jump(item); 
    }
  }
}))