import StoreH from "../../common/helper/handle/storeHandle";
import { CL_GoodsApi } from "../../common/manager/http-manager";
let promotionLabelsByStore = {};

function getStoredPromotionLabels(){ // 拿当前门店存储的标签
  let storeId = StoreH.storeInfo && StoreH.storeInfo.storeId || 0;
  promotionLabelsByStore[storeId] = promotionLabelsByStore[storeId] || [];
  return promotionLabelsByStore[storeId];
}

function fetchPromotionLabels(goodsId){
  return CL_GoodsApi.getGoodsLableInfo({
    params: {
      goodsId
    }
  })
}

function handleRespondList(list, result){
  let promotionLabels = getStoredPromotionLabels();

  let ascendList = list.reverse(); // 接口返回的是(第0位是优先级最高)，这里改成相反的(最后1位优先级最高)

  ascendList.forEach(activity => {
    let {lables, goods} = activity || {};
    if (lables && goods && goods.length){
      goods.forEach(goods_id => {
        promotionLabels[goods_id] = result[goods_id] = lables;
      })
    }
  })
}

export function getPromotionLabels(goodsIds){
  if (!goodsIds.length) return Promise.reject();
  let promotionLabels = getStoredPromotionLabels();
  let result = {};
  let requestIds = goodsIds.split(",").filter(id => {
    if (promotionLabels[id]){
      result[id] = promotionLabels[id]
      return false
    }
    promotionLabels[id] = [];
    return true
  }).join(",");
  if (!requestIds.length) return Promise.resolve(result);
  
  return fetchPromotionLabels(requestIds)
    .then(res => {
      if (res.code == 1 && res.data && res.data.length) {
        handleRespondList(res.data, result)
      }
      return Promise.resolve(result);
    })
}
