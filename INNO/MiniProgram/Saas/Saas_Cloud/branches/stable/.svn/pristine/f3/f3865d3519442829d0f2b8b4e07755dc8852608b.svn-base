import LM from "../manager/login-manager";
import SConf from "./handle/getSystemConfig.js";
import Conf from "../../conf.js"
import { CL_StoreCommApi } from "../manager/http-manager.js";
import StorageH from "./handle/storageHandle";

let commissionConfig = "";
let openShareConfig = ""; // 店员分享store_staff 、分销staff、空字符串表示还没判断到(因为是异步的) 

export function checkCommission(){ // 检测是否显示佣金(分销)
  return SConf.getSysConfig("all_user_show_goods_commission").then(conf=>{
    // '1','所有会员都显示分销佣金，1都显示，0仅分销员，默认0
    let value = conf.Value || 0;
    if(value == 1){
      return {
        isShowCommission: 1
      }
    } else {
     return LM.checkIfStaffDstbEvent(true).then(staff=>{
       if(staff.isStaffDstbData){
         return Promise.resolve({
          isShowCommission: 1,
          staff: staff
         }); 
       }
       return  Promise.reject();
      })
    }
  })
}

export function checkStoreCommission(){ // 检测是否显示佣金(店员分享)
  return LM.checkIfStore().then(data => {
    data = data || LM.storeInfo;
    console.log(data);
    if (data && data.staff_id){
      return Promise.resolve(data)
    } else return Promise.reject("获取店员信息失败")
  })
}

export function checkCommissionOpenConfig(){ // 检查店铺分销配置，如果店铺分销开启，则不能再出现旧分销的东西
  let p = commissionConfig ? 
    Promise.resolve(commissionConfig)
    :
    CL_StoreCommApi.getStoreCommConfig({
      params: {
        "brandCode": Conf.BRAND_CODE
      }
    })
  return p
    .then(res => {
      if (res) commissionConfig = res;
      if (res.code == 1) {
        let data = res.data;
        if (data) return Promise.resolve(res)
        return Promise.reject(res)
      }
      return Promise.reject(res);
    }).then(res => {
      checkCommission = () => {
        console.log("分销配置 因为开启了店铺分销，所以关闭掉旧分销佣金的显示")
        return Promise.reject()
      }
      LM.checkIfStaffDstbEvent = () => {
        console.log("分销配置 因为开启了店铺分销，所以原判断是否分销员方法固定返回空对象Promise")
        return Promise.resolve({})
      }
      LM.setStaffInfo({});
      StorageH.set("STAFFINFO", {})
      openShareConfig = "store_staff";
      console.log("分销配置 开启了店铺分销 store_staff")
      return Promise.resolve(res);
    })
    .catch(err => {
      console.log("分销配置 获取店铺分销配置失败，原因: ", err)
      return Promise.reject()
    })
    .finally(() => {
      !openShareConfig && (openShareConfig = "staff");
      console.log('分销配置 openShareConfig',openShareConfig)
    })
}

export const checkCommissionOpenConfigAsync = () => openShareConfig;