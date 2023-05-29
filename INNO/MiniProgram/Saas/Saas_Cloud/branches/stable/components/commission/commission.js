// components/commission/commission.js
import { checkCommission, checkStoreCommission } from "../../common/helper/commission-helper.js";
const app = getApp();
const requstApiRef = {
  "NORMAL": "CL_GoodsApi", // 普通商品
  "COLLAGEGROUP": "CL_CollageApi", // 拼团商品
  "PRESALE": "CL_PreSaleApi", // 预售商品
  "POINTMKT": "CL_PointApi", // 积分商品
}
Component(app.BTAB({
  properties: {

  },
  data: {
    commissionAmount:{}
  },
  methods: {
    getCommission(goodsType, goodsId, relatedId, byStore){ // 获取佣金信息
      // 店员分享 优先
      storeShareCommissionProcess.call(this, goodsType, goodsId, relatedId, byStore)
        .catch(err => {
          console.log("获取佣金(店员分享)失败->", err);
          distributionCommissionProcess.call(this, goodsType, goodsId, relatedId);
        })
    }
  }
}))


// 进行显示佣金(店员分享)流程
function storeShareCommissionProcess(...args){
  return checkStoreCommission() // 获取店员信息
    .then(data => {
      // 获取商品佣金信息
      if (data) getGoodsCommissionAmount.apply(this, args)
    })
}

// 进行显示佣金(分销)流程
function distributionCommissionProcess(...args){
  return checkCommission().then(checkConf=>{
    if(checkConf.isShowCommission){
      getGoodsCommissionAmount.apply(this, args);
    }
  })
}

// 获取佣金信息(分销 和 店员分享[带上byStore=true])
function getGoodsCommissionAmount(goodsType ="NORMAL",goodsId = 0, relatedId = 0, byStore = false) {
  if (goodsId == 0 || !app.LM.userToken) return;
  let apiListName = requstApiRef[goodsType] || "CL_GoodsApi"
  let params = {
    goodsId: goodsId,
    brandCode: app.Conf.BRAND_CODE,
    relatedId: relatedId || 0,
    goodsType: goodsType,
    byStore
  };
  return app[apiListName].getGoodsCommissionAmount({
    params,
    other: { isShowLoad: true }
  }).then(e => {
    if (e.code == "1") {
      this.setData({
        commissionAmount: e.data,
      })
    }
  })
}
