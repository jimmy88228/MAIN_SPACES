import LM from "../manager/login-manager";
import SConf from "./handle/getSystemConfig.js";
export function checkCommission(){
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