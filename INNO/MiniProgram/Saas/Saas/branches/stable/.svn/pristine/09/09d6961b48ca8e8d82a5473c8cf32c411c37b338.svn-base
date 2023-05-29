const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {
    isDetail: {
      type: Boolean,
      default: false
    },
    setGiftData: {
      type: Object,
      default: {},
      observer(nVal){
        this.setData({
          giftData: nVal || {}
        })
      }
    }
  },
  data: {
    showModal:true,
    giftData: {},
    giftSteps: [],
    statusClass:{
      0: "",
      1: "process",
      2: "finish"
    }
  },
  observers:{
    'giftData': function(data){
      if(data.activityId){
        stepHandle.call(this, data);
      }
    }
  },
  methods: {
    initData(){
      getOrderGift.call(this);
    },
    getGiftDetail(e){
      let giftData = this.data.giftData || {};
      wx.navigateTo({
        url: '/pages/micro_mall/order_gift/gift_detail/gift_detail?activityId=' + giftData.activityId,
      })
    }
  }
}))
function getOrderGift(){
  return app.UserApi.getOrderGiftActivity({
    params:{
      userToken:app.LM.userToken,
      brandCode:app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    if(e.code == 1){
      let data = e.data || {};
      this.setData({
        giftData: data
      })
      return Promise.resolve(e);
    }else{
      return Promise.reject(e);
    }
  })
}
function stepHandle(data){
  let orderCount = data.orderCount || 0;
  let rewardCondition = data.rewardCondition || 0;
  let waitExchangeCount = data.waitExchangeCount || 0;
  let giftSteps = [];
  for(let i = 1; i <= rewardCondition; i++){
    let status = waitExchangeCount > 0 ? 1 : (i == orderCount) ? 1 : (i < orderCount) ? 2 : 0
    giftSteps.push({
      num: i,
      status: status,
      statusName: this.data.statusClass[status]
    })
  }
  this.setData({
    giftSteps: giftSteps
  })
}
