import userJump from "../userJumpHandle";
const app = getApp();
Component(app.BTAB({
  properties: {
    userData: {
      type: Object,
      value: {}
    },
    setting: {
      type: Object,
      value: {}
    },
    sysConf:{
      type: Object,
      value: {}
    },
    isStaff:{
      type: Object,
      value: false
    },
    needVerify:{
      type: Object,
      value: 0
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    assetsObj: {},
    showAssetsMoreBool: false,
    userData: {},
    Points_Own: 0,
    offline_store_value_own: 0,
    canUseCouponNum: 0
  },
  ready(){
  },
  observers:{
    "userData": function(userData){
      let setting = this.properties.setting || {};
      if(userData.CardNo){
        this.getMoreAssets(setting);
      }
      if(userData){
        this.seedGrass = this.seedGrass || this.selectComponent("#seedGrass");
        this.seedGrass && this.seedGrass.initGrassData();
      }
      console.log("个人中心isLogin--- assetsBar", userData);
    },
  },
  methods: {
    funcJump(e){
      let dataset = e.currentTarget.dataset || {};
      let userData = this.properties.userData || {};
      if(dataset.key == "balance"){
        dataset.account_balance = userData.account_balance;
      } else if(dataset.key == "redpack"){
        dataset.redpack_amount_sum = userData.redpack_amount_sum;
        dataset.unusable_redpack_amount = userData.unusable_redpack_amount;
      }
      userJump.jump(dataset, this.properties.sysConf);
    },
    fillIdCard(){
      userJump.pageJump({
        func_type: "FILL_IDCARD",
        fromRoute: "USER",
      });
    },
    getMoreAssets(setting){
      let assetsObj = {
        assetsNorNum : 0,
        assetsMorNum : 0,
        assetsNormal : {},
        assetsMore : {},
      };
      if(setting.is_enable){
        let list = setting.list || [];
        for (let i = 0; i < list.length; i++) {
          let code = list[i].code || "";
          if (list[i].is_enable){
            if(assetsObj.assetsNorNum < 4){
              assetsObj.assetsNorNum += 1;
              assetsObj.assetsNormal[code] = list[i];
            }else{
              assetsObj.assetsMorNum += 1;
              assetsObj.assetsMore[code] = list[i];
            }
            setTimeout(()=>{
              this.getAssetData(code);
            }, 500)
          }
        }
        this.setData({
          assetsObj
        })
      }
    },
    showAreaContMore(e){
      let dataset = e.currentTarget.dataset;
      let assetsObj = this.data.assetsObj || {};
      let key = dataset.key || "";
      if(assetsObj.assetsMorNum > 0 && key){
          this.setData({
            [key]:!!!this.data[key]
          })
          setTimeout(()=>{
            this.setData({
              showAssetsMoreBool: !!!this.data.showAssetsMoreBool
            })
          },500)
      }
    },
    getAssetData(code){
      switch(code){
        case "balance":
          break;
        case "prepaidcard":
          getUserPrepaid.call(this);
          break;
        case "my_point":
          getUserPoint.call(this);
          break;
        case "coupon":
          getUsefulCouponCount.call(this);
          break;
        case "redpack":
          getUserRedpackAmount.call(this);
          break;
      }
    },
  }
}))
//积分
function getUserPoint(){
  return app.UserApi.getUserPointAmount({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        "userData.Points_Own": res.data || 0,
        "Points_Own": res.data || 0
      })
    }
  })
}
//储值
function getUserPrepaid(){
  return app.UserApi.getUserStoredValueAmount({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        "userData.offline_store_value_own": res.data || 0,
        "offline_store_value_own": res.data || 0
      })
    }
  })
}
//优惠券
function getUsefulCouponCount(){
  return app.UserApi.getUsefulCouponCount({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        "userData.canUseCouponNum": res.data || 0,
        "canUseCouponNum": res.data || 0,
      })
    }
  })
}
//红包余额
function getUserRedpackAmount(){
  return app.UserApi.getUserRedpackAmount({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      let redpack_amount_sum = parseFloat(((data.usable_amount || 0) + (data.unusable_amount || 0)).toFixed(2));
      this.setData({
        "userData.redpack_amount_sum": redpack_amount_sum,
        "userData.usable_redpack_amount": data.usable_amount,
        "userData.unusable_redpack_amount": data.unusable_amount
      })
    }
  })
}