import PH from "../../../../../common/helper/handle/paramsHandle";

export function modifyGoodsSelfGet(goods_info){
  PH.isfromSceneChannel("VIDEOLIVE") ? (goods_info && (goods_info.self_get = 2)) : undefined; // 仅快递配送
}

export function modifyCartSelfGet(shipInfo){
  PH.isfromSceneChannel("VIDEOLIVE") ? (shipInfo && (shipInfo.isSelfGet = 2)) : undefined; // 仅快递配送
}

export function cantSelfGet(isSelfget){
  return PH.isfromSceneChannel("VIDEOLIVE") && isSelfget
}