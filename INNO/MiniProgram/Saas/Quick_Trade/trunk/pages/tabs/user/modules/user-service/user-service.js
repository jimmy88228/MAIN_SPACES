const App = getApp();
import JumpHelp from "../jumpHelp.js";
Component(App.BC({
  ready() {
    
  },
  data:{ 
    barList:[{
      state:1,
      title:"收货地址",
      key:'address',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-service5.png",
      url:"",
    },{
      state:2,
      title:"个人资料",
      key:'information',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-service9.png",
      url:"/pages/tabs/user/update_avatar/update_avatar"
    },]
  },
  methods: {
    jump(e){
      let item = this.getDataset(e,'item')||{};
      JumpHelp.jump(item); 
    }
  }
}))