// pages/micro_mall/buy/modules/signTip/signTip.js
const app = getApp();
Component(app.BTAB({
  properties: {
    signOrderActivityReward:{
      type:Object,
      value:{}
    }
  },
  data: {
    isSelect:true
  },
  ready(){
    let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
    let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    this.setData({
      return_img,
      return_active
    })
  },
  methods: {
    select(e){
      let signOrderActivityReward = this.data.signOrderActivityReward||{};
      if(!signOrderActivityReward.hasInventory || signOrderActivityReward.results)return
      this.setData({isSelect:!!!this.data.isSelect});
    },
    getInfo(){
      let signOrderActivityReward = this.data.signOrderActivityReward||{};
      let isSelect = signOrderActivityReward.hasInventory && this.data.isSelect && !signOrderActivityReward.results || false;
      return {isSelect:isSelect?1:0}
    }
  }
}))
