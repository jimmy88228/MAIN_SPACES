const app = getApp();
Component(
  app.BTAB({
    properties: {
      isLogin:{
        type:Boolean,
        value:false
      }
    },
    data: {
      showTip:false,
      actInfo:{}
    }, 
    detached() {
    },
    methods: {
      getTipData(goodsId){
        this.goods_id = goodsId;
        getGoodsReceiveBonusActivity.call(this, goodsId);
      },
      getCouponList(){
        let goods_id = this.goods_id || 0;
        this.couponList = this.couponList || this.selectComponent("#couponList");
        this.couponList.getCouponList(goods_id);
      }
    }
  })
);
function getGoodsReceiveBonusActivity(goodsId){
  if (!goodsId) return;
  return app.CL_GoodsApi.getGoodsReceiveBonusActivity({
    params:{
      goodsId: goodsId,
    }
  }).then(res=>{
    if(res.code == 1){
      let actInfo = res.data || [];
      this.setData({
        showTip: actInfo.length == 0 ? false : true,
        actInfo: actInfo
      })
      return Promise.resolve();
    }
    this.setData({
      showTip:false
    })
    return Promise.reject();
  })
}

