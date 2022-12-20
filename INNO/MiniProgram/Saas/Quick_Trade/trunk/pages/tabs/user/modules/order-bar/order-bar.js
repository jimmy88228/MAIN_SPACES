const App = getApp();
import JumpHelp from "../jumpHelp.js";
Component(App.BC({
  properties: {
    userData: {
      type: Object,
      value:{}
    },
    fromType:{
      type: String,
      value:""
    }
  },
  data:{ 
    barList:[{
      state:1,
      title:"待付款",
      key:'wait_to_pay',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-cargo_unpaid.png",
      url:""
    },{
      state:2,
      title:"发货中",
      key:'wait_to_shipping',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-cargo_deliver.png",
      url:""
    },{
      state:3,
      title:"已发货",
      key:'wait_to_receiving',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-cargo_receive.png",
      url:""
    },],
    baseInfo:{
      user:{
        title:"我的订单",
      },
      staff:{
        title:"会员订单"
      }
    }
  },
  ready() {
    
  },
  methods: {
    jump(e){
      console.log('userData',this.data.userData)
      let item = this.getDataset(e,'item')||{};
      JumpHelp.jump(item); 
    }
  }
}))