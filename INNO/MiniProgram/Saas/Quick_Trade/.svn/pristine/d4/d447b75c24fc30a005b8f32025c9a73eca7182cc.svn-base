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
      value:"",
      observer(newVal) {
        if (newVal === "staff") {
          let {barList = [], checkMoreItem = {}} = this.data || {};
          barList.forEach(item => {
            item.url += `&staff_type=1`
          })
          this.setData({
            barList,
            'checkMoreItem.url': checkMoreItem.url + `?staff_type=1`
          })
        }
      }
    }
  },
  data:{
    checkMoreItem: {
      key:'all',
      url:"/pages/micro_mall/order/order_list"
    },
    barList:[{
      state:1,
      title:"待付款",
      key:'wait_to_pay',
      url:"/pages/micro_mall/order/order_list?orderType=wait_to_pay",
    },{
      state:2,
      title:"发货中",
      key:'wait_to_shipping',
      url:"/pages/micro_mall/order/order_list?orderType=wait_to_shipping"
    },{
      state:3,
      title:"待提货",
      key:'wait_to_pickupgoods',
      url:"/pages/micro_mall/order/order_list?orderType=wait_to_pickupgoods"
    },{
      state:4,
      title:"已完成",
      key:'wait_to_receiving',
      url:"/pages/micro_mall/order/order_list?orderType=wait_to_receiving"
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