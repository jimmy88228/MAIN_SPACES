const app = getApp();
Component(app.BTAB({
  behaviors: [],
  options: {
    styleIsolation: "apply-shared",
  },
  properties: {
    activityId:{
      type:Number,
      value:0,
    },
    activityImg:{
      type: String,
      value: ""
    },
    amountForDiscountBuy:{
      type: Number,
      value: 0
    },
    chooseDiscountGoods: {
      type: Array,
      value: []
    }
  },
  data: {
    hasDiscount: false
  },
  observers:{},
  ready(){
    this.getPage();
  },
  methods: {
    getPage(){
      this.thisPage = getCurrentPages().slice(-1)[0] || {};
      return this.thisPage;
    },
    chooseGoods(){
     this.discountPopup = this.discountPopup || this.selectComponent("#discountPopup");
     this.discountPopup.initData && this.discountPopup.initData({
       amountForDiscountBuy: this.properties.amountForDiscountBuy || 0,
       activityId: this.properties.activityId,
      })
    },
    removeGoods(e){
      let dataset = e.currentTarget.dataset || {};
      let index = dataset.index;
      let chooseDiscountGoods = this.data.chooseDiscountGoods || [];
      let thisPage = this.thisPage || this.getPage();
      if(parseInt(index) == 0 || index){
        let that = this;
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle("温馨提示");
        this.pageDialog.setTouchCancel(false);
        this.pageDialog.setCentent("确定移除该换购商品么");
        this.pageDialog.setTwoBtn(
          {
            name: "取消",
            tap: function () {
              that.pageDialog.dismiss();
            }
          },
          {
            name: "确定",
            tap: function () {
              chooseDiscountGoods.splice(index, 1);
              thisPage.setData({
                chooseDiscountGoods: chooseDiscountGoods
              })
              thisPage.getCheckOut();
              that.pageDialog.dismiss();
            }
          }
        )
        this.pageDialog.show();
      }
    }
  }
})) 
