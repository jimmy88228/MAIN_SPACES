import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
import PageJump from "../../../common/helper/page-jump.js"
const app = getApp();
let couponPopAlreadyShowed = false;
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {},
  data: {
    showData: {
      title: "注册送礼"
    },
  },
  ready(){
    this.jumpConf = {
      CAT: "CA",
      VCAT:"VC",
      GOODS:"GOODS",
      PAGE:"CMPAGE",
      URL:"LINKURL"
    };
    this.setData({
      randomUnit: Math.random() * Math.random()
    })
  },
  attached() {

  },
  detached() {

  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: all 300ms ease-in-out;"
      }, () => {couponPopAlreadyShowed = true});
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        if (this._afterDismiss) this._afterDismiss();
      }, 300)
      return 300;
    },
    initData({type = "register", afterDismiss, afterHideFn}) {
      typeof afterDismiss === "function" && (this._afterDismiss = afterDismiss);
      typeof afterHideFn === "function" && (this.setMaskTapHandler(afterHideFn));
      switch (type){
        case "register":
          return registerShowCouponDetails()
            .then(value => value == '1' ? getCouponListAfterRegister.call(this) : Promise.resolve(false))
            .then((needToDisplay) => {
              return new Promise(resolve => {
                if (couponPopAlreadyShowed || !needToDisplay) return resolve(false) // 以防万一，弹过一次就不要弹了
                wx.nextTick(() => {
                  console.log("getCouponsPopshow")
                  this.show()
                  resolve(true)
                })
              })
            })
      }
    },
    userJump(e){
      console.log(e)
      let dataset = e.currentTarget.dataset;
      let jumpConfig = dataset.jumpconfig;
      if(!jumpConfig){
        let pages = getCurrentPages(), curPage = pages[pages.length - 1];
        if (curPage.route === "pages/micro_mall/index/index") return this.dismiss()
        wx.switchTab({
          url: '/pages/micro_mall/index/index',
        })
      }else{
        let func_type = this.jumpConf[jumpConfig.jump_type] || "";
        let related_id = jumpConfig.related_content || "";
        let tag = jumpConfig.tag;
        if (!func_type) return;
        PageJump({
          func_type,
          related_id,
          tag,
          fromModule: "COUPON",
        })
      }
       
    },
    goCoupon(){
      this.dismiss();
      wx.nextTick(() => {
        wx.navigateTo({
          url: "/pages/micro_mall/coupon/my_coupon"
        })
      })
    },
    _noFn(){},
  }
}))

function registerShowCouponDetails(){
  if (app.LM.isTotalNewUser <= 1) return Promise.resolve(0);
  app.StorageH.set("isTotalNewUser", 1)
  return app.sysTemConfig("register_show_coupon_details")
    .then(e => {
      return Promise.resolve(e.Value || 0)
    })
    .catch(err => {
      console.log("获取注册后是否送优惠券配置失败", err);
      return Promise.resolve(0)
    })
}

function getCouponListAfterRegister(){
  return app.BrandApi.getRegisterGiftCoupon({
    params: {
        userToken: app.LM.userToken,
        brandCode: app.Conf.BRAND_CODE
    }
  })
  .then(res => {
    if (res.code == '1' && res.data && res.data.length) {
      console.log("couponlist: ", res)
      this.setData({
        list: res.data || []
      })
      return Promise.resolve(res)
    }
    return Promise.resolve(0)
  })
  .catch(err => {
    console.log("获取注册后获取优惠券列表报错", err);
    return Promise.resolve(0)
  })
}