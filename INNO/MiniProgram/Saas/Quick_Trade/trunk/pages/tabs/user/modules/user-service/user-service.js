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
      title:"收货地址",
      key:'address',
      url:"/pages/main/address/address-list/index?visit_type=check",
    },{
      state:2,
      title:"个人资料",
      key:'information',
      url:"/pages/tabs/user/update_avatar/update_avatar"
    },
    {
      state:3,
      title:"售后订单",
      key:'userAfterSaleSum',
      url:"/pages/micro_mall/order/order-return/list/index"
    }
  ]
  },
  methods: {
    jump(e){
      let item = this.getDataset(e,'item')||{};
      console.log(e)
      JumpHelp.jump(item); 
    }
  }
}))