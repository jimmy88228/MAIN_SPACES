const App = getApp();
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
      title:"待付款",
      key:'wait_to_pay',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/image/show/assets-icons-cargo_unpaid.png",
    },{
      state:2,
      title:"待发货",
      key:'wait_to_shipping',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/////////////////////image/show/assets-icons-cargo_deliver.png",
    },{
      state:3,
      title:"已发货",
      key:'wait_to_receiving',
      img:"http://devimgtest.innourl.com/SAAS_IMAGE/////////////////////image/show/assets-icons-cargo_receive.png",
    },]
  },
  ready() {
    
  },
  methods: {
    jump(){}
  }
}))