// components/commission/commission.js
import { checkCommission } from "../../common/helper/checkCommission.js";
const app = getApp();
Component(app.BTAB({
  properties: {

  },
  data: {
    commissionAmount:{}
  },
  methods: {
    getCommission(goodsType, goodsId, relatedId){
      return checkCommission().then(checkConf=>{
        if(checkConf.isShowCommission){
          getGoodsCommissionAmount.call(this, goodsType, goodsId, relatedId)
        }
      })
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
      relatedId: relatedId || 0,
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
