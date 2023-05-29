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
      url:"/pages/main/staff-module/staff-center/staff-center",
    },{
      state:2,
      title:"活动管理",
      key:'activity',
      url:"/pages/main/staff-module/activity/index",
    },{
      state:3,
      title:"商品库",
      key:'goods',
      url:"/pages/main/staff-module/repository/index"
    },
    {
      state:4,
      title:"售后订单",
      key:'staffAfterSaleSum',
      url:"/pages/micro_mall/order/order-return/list/index?staff_type=1"
    }
    ]
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