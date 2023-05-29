import getSystemConfig from "../../../../common/helper/handle/getSystemConfig"
import StorageH from "../../../../common/helper/handle/storageHandle";
import {
  UserApi
} from "../../../../common/manager/http-manager";
import LM from "../../../../common/manager/login-manager";
import Conf from "../../../../conf";


function processConfigIsOpen() { // 是否开启了"要判断用户是否关注企微"配置
  return getSystemConfig.getSysConfig("check_subscribe_enterprise_wechat")
    .then(data => {
      let value = data && data.Value || 0;
      if (value > 0) return Promise.resolve()
      else return Promise.reject("配置check_subscribe_enterprise_wechat没开启")
    })
}

function userDidNotSubscribedEnterpriseWechat() { // 用户还未关注企微
  return UserApi.checkUserIsSubscribeEnterpriseWechat({
    params: {
      brandCode: Conf.BRAND_CODE,
      userToken: LM.userToken
    }
  })
    .then(res => {
      let data = res && res.data; // 0 是未关注, 1是已关注
      if (res.code && data == 0) return Promise.resolve();
      else {
        markAsFinished()
        return Promise.reject("checkUserIsSubscribeEnterpriseWechat -> 1 用户已经关注企微")
      }
    })
}

function neverDisplayedContactStaff() { // 没有自动展示过(判断缓存)
  return new Promise((rs, rj) => {
    let alreadyDisplayContactStaff = StorageH.get("alreadyDisplayContactStaff") || 0;
    if (alreadyDisplayContactStaff == 1) rj("缓存 -> 已经自动展示过")
    else rs()
  })
}

export function displayContactStaffHandle() { // 主要
  return neverDisplayedContactStaff()
    .then(processConfigIsOpen)
    .then(userDidNotSubscribedEnterpriseWechat)
}

export function markAsFinished() { // 标记为自动展示了
  StorageH.set("alreadyDisplayContactStaff", 1);
}