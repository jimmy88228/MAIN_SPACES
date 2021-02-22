import { PayApi, SecKillApi } from "../manager/http-manager";
import { PayType } from "../manager/log-map";
import LM from "../manager/login-manager";
import Conf from "../../conf"
class payManager {
  static getInstance() {
    if (!payManager.instance) {
      payManager.instance = new payManager();
    }
    return payManager.instance;
  }
  constructor() {
    
  }
  UnifiedorderByOrderId(type,orderId,isNeedUser = true){
    if(!orderId) return;
    console.log("支付类型",PayType);
    if(Conf.PAYMETHOD && Conf.PAYMETHOD == "TONGLIAN"){//新支付
      return getUnifiedorderByOrderId.call(this,type,orderId);
    }else{
      if(type == "seckill"){
        return secKillUnifiedorder.call(this,orderId);
      }
      return beforeAppletPrepayId.call(this,type,orderId,isNeedUser);
    }
  }
}
//原支付--旧接口
function beforeAppletPrepayId(type,orderId,isNeedUser){
  if(isNeedUser){
    return LM.getUserSimpleInfo(LM.userToken).then(res =>{
      let user_id = res.uId || 0;
      return getAppletPrepayId.call(this,type,orderId,user_id)
    })
  }else{
    return getAppletPrepayId.call(this,type,orderId);
  }
}
function getAppletPrepayId(type,orderId,user_id){
  let params = {
    order_id: orderId,
    pay_type: PayType[type].type,
  }
  if(user_id){
    params.user_id = user_id
  }
  return PayApi.getAppletPrepayId({
    params: params,
    other: {
      isShowLoad: true
    }
  })
}
//通联第三方
function getUnifiedorderByOrderId(type,orderId){
  return PayApi.UnifiedorderByOrderId({
    params: {
      orderId: orderId,
      payType: PayType[type].type,
      payMethod: "",//Conf.PAYMETHOD,
    },
    other: {
    isShowLoad: true
    }
})
}
//助力秒杀--旧接口
function secKillUnifiedorder(order_id){
  return SecKillApi.unifiedorder({
    params: {
      orderId: order_id,
    },
    other: {
      isShowLoad:true
    }
  })
}

export default payManager.getInstance();