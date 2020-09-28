// pages/component/commission/commission.js
const app = getApp();
Component(app.BTAB({
  properties: {

  },
  data: {
    commissionAmount:{}
  },
  methods: {
    getCommission(goodsType, goodsId, relatedId){
      getGoodsCommissionAmount.call(this, goodsType, goodsId, relatedId)
    }
  }
}))
//
function getGoodsCommissionAmount(goodsType ="NORMAL",goodsId = 0, relatedId = 0) {
  if (goodsId == 0 || !app.LM.userToken) return;
  return app.GoodsApi.getGoodsCommissionAmountByType({
    params: {
      goodsId: goodsId,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken,
      relatedId: relatedId,
      goodsType: goodsType
    },
    other: { isShowLoad: true }
  }).then(e => {
    if (e.code == "1") {
      this.setData({
        commissionAmount: e.data,
      })
    }
  })
}
