import userJump from "../userJumpHandle";
const app = getApp();
Component(app.BTAB({
  properties: {
    setting: {
      type: Object,
      value: {},
      observer(n,o){
        if(n.is_enable){
          this.getOrderCountReq();
        }
      }
    },
    sysConf: {
      type: Object,
      value: {}
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  attached() {
  },
  detached() {
  },
  data: {
    userOrderCount: {},
    codeKey: {
      unpaid: "wait_to_pay",
      deliver: "wait_to_shipping",
      receive: "wait_to_receiving",
      change: "return_exchanged"
    }
  },
  ready(){},
  methods: {
    funcJump(e){
      let dataset = e.currentTarget.dataset || {};
      userJump.jump(dataset, this.properties.sysConf);
    },
    getOrderCountReq(){
      app.LM.islogin && getUserOrderCount.call(this);
    }
  }
}))
function getUserOrderCount(){
  return app.RunApi.go('BuyApi','getUserOrderCount').then(res=>{
    let data = res.data || {};
    this.setData({
      "userOrderCount": data || {},
    })
    console.log('userOrderCount',this.data.userOrderCount)
  }) 
}