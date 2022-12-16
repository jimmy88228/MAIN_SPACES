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
      getUserOrderCount.call(this);
    }
  }
}))
function getUserOrderCount(){
  return app.CL_BuyApi.getUserOrderCount({
    params:{}
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      this.setData({
        "userOrderCount": data || {},
      })
    }
  })
}