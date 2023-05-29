import WindowBehaviors from "../../../../../../components/ui/cps/window/window-behaviors.js";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    data: {
      boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
      price: "", // 金额
      priceConfig: {}, // 调整价格设置
    },
    methods: {
      onAttached() {
        this.setData({
          price: "",
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        this.valificateResolve = null;
        this.valificateReject = null;
        return 300;
      },
      inputEvent(e){
        let detail = e.detail || {};
        let dataset = e.currentTarget.dataset || {};
        let key = dataset.key;
        let value = detail.value || "";
        if (key === "price"){
          let str = String(value);
          let digitIndex = str.indexOf('.');
          if (digitIndex >= 0 && str.length - digitIndex > 3) { // 最多只能输入两位小数
            app.SMH.showToast({title: "最多只能输入两位小数哦"});
            value = Number(this.data.price).toFixed(2)
          }
        }
        if(key){
          this.setData({
            [key]: value
          })
        }
      },
      showAndConfirm({
        isModifiedTotalPrice, // 是否调整总价
        recId, // 要调整的商品recId
        orderId, // 要调整的订单id
        minChangePrice, // 最小能调整价格
        maxChangePrice, // 最大能调整价格
      }){
        let priceConfig = {isModifiedTotalPrice, recId, orderId, minChangePrice, maxChangePrice};
        this.setData({priceConfig})
        return new Promise((rs, rj) => {
          this.valificateResolve = rs; // 将resolve存起来
          this.valificateReject = rj; // 将reject存起来
          this.show();
        })
      },
      validate() {
        let validateError = "";
        let price = this.data.price || "";
        let {minChangePrice, maxChangePrice} = this.data.priceConfig
        if (price === "") validateError = "请输入金额"
        else if (Number(price) < Number(minChangePrice)) validateError = "金额不能少于最低折扣价"
        else if (Number(price) > Number(maxChangePrice)) validateError = "金额不能大于售价"
        return validateError
      },
      confirm() {
        let validateError = this.validate();
        if (validateError) {
          app.SMH.showToast({title: validateError});
          return
        }
        changePriceByStaff.call(this)
      },
    }
  })
)

function changePriceByStaff() {
  let {orderId = 0, recId = 0} = this.data.priceConfig || {};
  return app.BuyApi.changePriceByStaff({
    data: {
      userToken: app.LM.userToken || "",
      orderId,
      recId,
      price: Number(this.data.price), // 修改后的价格
      brandCode: app.Conf.BRAND_CODE
    }
  })
    .then(res => {
      if (res.code == 1) {
        return Promise.resolve(this.price);
      }
      else if(res.code == "-10011") {
        app.SMH.showToast({title:res.msg||"调整价格失败"})
        return Promise.reject("expired")
      }
      return Promise.reject(res.msg || "调整价格失败")
    })
    .then(() => {
      typeof this.valificateResolve === "function" && this.valificateResolve(this.data.price);
      this.dismiss();
    })
    .catch(err => {
      typeof this.valificateReject === "function" && this.valificateReject(err);
      this.dismiss();
    })
}