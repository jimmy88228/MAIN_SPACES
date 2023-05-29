import { PayApi, SecKillApi, NewPayApi,BuyApi } from "../../manager/http-manager";
import { PayType } from "../../manager/log-map";
import LM from "../../manager/login-manager";
import Conf from "../../../conf"
import WxApi from "../wx-api-helper";
import DateUtil from '../../support/utils/date-util'
import SMH from '../show-msg-helper';
import PH from "./paramsHandle";
import retainSessionH from '../handle/retainSessionHandle';
import SConf from "../handle/getSystemConfig.js"
const TempPrice = 0.01;
class payManager {
  static getInstance() {
    if (!payManager.instance) {
      payManager.instance = new payManager();
    }
    return payManager.instance;
  }
  constructor() {}
  UnifiedorderByOrderId({type,order_id,isNeedUser=true,sceneCheck=true,orderInfo={},payType,isCheckInventory=false,platform_src=""}){
    console.log("支付类型",Conf.PAYMETHOD,order_id,orderInfo,PayType);
    if(!order_id) return Promise.reject();
    // PH.isfromSceneChannel("VIDEOLIVE") && (type = "zhibo"); // 如果是通过直播间进入小程序下单，这里拦截一下，间接修改payType
    // return getPaymentInfoHandle.call(this,{type,order_id,isNeedUser,payType}).then(e=>{
    //   console.log('getPaymentInfoHandle then',sceneCheck,e)
    //   if(sceneCheck){
    //     return checkPaymentMode.call(this).then(mode=>{
    //       if((mode == 1 && wx.requestOrderPayment)){
    //         return Fnc.requestOrderPayment(e,orderInfo);
    //       }else{
    //         return Fnc.requestPayment(e);
    //       }
    //     })
    //   }else{
    //     return e
    //   }
    // }) 
    return checkOrderInventory(order_id,isCheckInventory).then(()=>{
      return getPaymentInfoHandle.call(this,{type,order_id,isNeedUser,payType,platform_src}).then(e=>{
        console.log('getPaymentInfoHandle then',sceneCheck,e)
        if(sceneCheck){
          return checkPaymentMode.call(this).then(mode=>{
            let pay_channel = e && e.pay_channel || ""
            if(wx.requestOrderPayment && ((mode == 1)||(Conf.LiveType == 'channels' && pay_channel === 'wx_zhibo'))){
              return Fnc.requestOrderPayment(e,orderInfo);
            }else{
              return Fnc.requestPayment(e);
            }
          })
        }else{
          return e
        }
      })
    })
  }
  getUnifiedorderByOrderId(params = {}){
    let type = params.type || "";
    let orderId = params.orderId || 0;
    if(!orderId) return Promise.reject();
    return getUnifiedorderByOrderId.call(this,type,orderId);
  }
}

//原支付--旧接口
function beforeAppletPrepayId(type,orderId,isNeedUser,platform_src){
  if(isNeedUser){
    return LM.getUserSimpleInfo(LM.userToken).then(res =>{
      let user_id = res.uId || 0;
      return getAppletPrepayId.call(this,type,orderId,user_id,platform_src)
    })
  }else{
    return getAppletPrepayId.call(this,type,orderId,platform_src);
  }
}
function getAppletPrepayId(type,orderId,user_id,platform_src){
  let params = {
    order_id: orderId,
    pay_type: PayType[type].type,
  }
  
  if(Conf.LiveType == 'channels'){
    params.pay_channel = PH.isfromSceneChannel("VIDEOLIVE") ? "wx_zhibo" : "";
    // 加多层wx_zhibo判断，如果 订单是视频号订单,且是手工订单,且pay_channel目前没有,那么就一定带上 wx_zhibo
    if(platform_src == "MINISHOP" && params.pay_type == "manual_order" && !params.pay_channel) params.pay_channel = "wx_zhibo";
  }
  if(user_id) params.user_id = user_id;
  return PayApi.getAppletPrepayId({
    params: params,
    other: {
      isShowLoad: true
    }
  }).then((e)=>{
    if(e.code == 1){
      return Promise.resolve(e);
    } else {
      return Promise.reject(e);
    }
  }).catch((e)=>{
    SMH.showToast({
      'title': e.msg
    })
    return Promise.reject(e);
  })
}
//通联第三方
function getUnifiedorderByOrderId(type,orderId){
  return NewPayApi.UnifiedorderByOrderId({
    params: {
      orderId: orderId,
      payType: PayType[type].type,
      userToken: LM.userToken,
      payMethod: "",//Conf.PAYMETHOD,
      brandCode: Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then((e)=>{
    if(e.code == 1){
      return Promise.resolve(e);
    } else {
      return Promise.reject(e);
    }
  }).catch((e)=>{
    SMH.showToast({
      'title': e.msg
    })
    return Promise.reject(e);
  })
}
//助力秒杀--旧接口
function secKillUnifiedorder(order_id){
  return SecKillApi.unifiedorder({
    params: {
      userToken: LM.userToken,
      orderId: order_id,
      brandCode: Conf.BRAND_CODE
    },
    other: {
      isShowLoad:true
    }
  }).then((e)=>{
    if(e.code == 1){
      return Promise.resolve(e);
    } else {
      return Promise.reject(e);
    }
  }).catch((e)=>{
    SMH.showToast({
      'title': e.msg
    })
    return Promise.reject(e);
  })
}

function getPaymentInfoHandle({type,order_id,isNeedUser,payType,platform_src}){
  if((Conf.PAYMETHOD && Conf.PAYMETHOD == "TONGLIAN") || payType == "newPay"){//新支付
    return getUnifiedorderByOrderId.call(this,type,order_id);
  }else{
    if(type == "seckill"){
      return secKillUnifiedorder.call(this,order_id);
    }
    return beforeAppletPrepayId.call(this,type,order_id,isNeedUser,platform_src)
  }
}

function checkPaymentMode(){
  let Options = wx.getEnterOptionsSync && wx.getEnterOptionsSync() || {};
  let scene = Options.scene || 1001;
  console.log('checkPaymentMode',Options,scene)
  return BuyApi.sceneCheck({
    data:{
      scene,
      brandCode:Conf.BRAND_CODE,
    }
  }).then(res=>{
    let data = res && res.data||0;
    console.log('sceneCheck',res)
    return data
  }).catch(e=>{
    return Promise.resolve(0);
  })
}
const Fnc = {
  requestPayment(e){
    let params = this.getPaymentParams(e);
    console.log('requestPayment params',params);
    return WxApi.requestPayment({...params}).then((res)=>{
      console.log("支付回调", res);
      if(res.errMsg.indexOf('ok') != -1){
        let page = getCurrentPages().slice(-1)[0] || {}
        // 保存短暂切换后台数据
        retainSessionH.saveRetainSession({
          shortPath: page.route,
          shortHome: true
        })
      }
      return Promise.resolve(res);
    }).catch((error)=>{
      console.log('支付取消', error);
      if(error.errMsg.indexOf('fail') != -1){
        let page = getCurrentPages().slice(-1)[0] || {}
        // 保存短暂切换后台数据
        retainSessionH.saveRetainSession({
          shortPath: page.route,
          shortHome: true
        })
      }
      return Promise.reject(error);
    })
  },
  requestOrderPayment(e,orderInfo){
    let params = this.getPaymentParams(e); 
    params.orderInfo = getInfo(e,orderInfo);
    console.log('requestOrderPayment params',{...params});
    return WxApi.requestOrderPayment({...params}).then((res)=>{
      console.log("支付回调", res);
      if(res.errMsg.indexOf('ok') != -1){
        let page = getCurrentPages().slice(-1)[0] || {}
        // 保存短暂切换后台数据
        retainSessionH.saveRetainSession({
          shortPath: page.route,
          shortHome: true
        })
      }
      return Promise.resolve(res);
    }).catch((error)=>{
      console.log('支付取消', error);
      if(error.errMsg.indexOf('cancel') != -1){
        let page = getCurrentPages().slice(-1)[0] || {}
        // 保存短暂切换后台数据
        retainSessionH.saveRetainSession({
          shortPath: page.route,
          shortHome: true
        })
      }else{
        SMH.showToast({
            title: error.errMsg,
        })
      }
      return Promise.reject(error);
    })
  },
  getPaymentParams(e){
    let info = typeof(e.data) == "string" ? JSON.parse(e.data) : e.data;
    return {
      'timeStamp': info.timeStamp + '',
      'nonceStr': info.nonceStr,
      'package': info.package,
      'signType': info.signType,
      'paySign': info.sign || info.paySign,
    }
  }
} 
 
function getInfo(payInfo={},curOrderInfo={}){
  let orderEntity = curOrderInfo.orderEntity||{};
  let orderDetailList = curOrderInfo.orderDetailList||[{}];
  let order_id = orderEntity.order_id || orderEntity.orderId || 1;
  let order_sn = orderEntity.order_sn || orderEntity.orderSn || 1;
  let order_info = {
    "create_time": DateUtil.getDetailToday(),
    "out_order_id": order_id,                
    "openid": payInfo.openid || payInfo.data.openid || payInfo.data.openid || "", 
    "path": order_sn && Conf.LiveType == 'channels' ? `/pages/micro_mall/order/order_info?order_sn=${order_sn}`:`/pages/micro_mall/order/order_info?order_id=${order_id}`,
    "order_detail":
    {
        "product_infos":get_product_infos(orderDetailList),
        "pay_info": {
            "pay_method_type": 0,       
            "prepay_id": order_id,
            "prepay_time": DateUtil.getDetailToday()
        },
        "price_info": {
            "order_price": (orderEntity.order_amount || TempPrice) * 100 || 0,
            "freight": 100
        }
    },
    "delivery_detail": {
        "delivery_type": 2
    }
  }
  // console.log(JSON.stringify(order_info))
  return order_info
}

function get_product_infos(goodsList=[]){
  let arr = [];
  for(let i = 0,len=goodsList.length;i<len;i++){
    let item = goodsList[i]||{};
    let temp = {
      "out_product_id": item.productId || 1,
      "out_sku_id":item.product_sn || "sku",
      "product_cnt": item.goods_num || 1,
      "sale_price": (item.market_price || TempPrice) * 100, 
      "real_price": (item.goodPrice || TempPrice) * 100, 
      "path": `pages/micro_mall/goods/goods_info?goods_id=${item.goodsId || 1}`,
      "title" : item.goods_Name || "商品",
      "head_img": item.img_url || (Conf.icon_url + "applet_logo.png")
    }
    arr.push(temp);
  }
  return arr
}

function checkOrderInventory(orderId,isCheckInventory){
  if(!isCheckInventory){
    return Promise.resolve();
  }
  return SConf.getOnceSysConfig('before_pay_check_order_inventory').then(res=>{
    if(res.Value == '1'){
      return BuyApi.checkOrderInventory({
        params:{
          orderId,
          userToken:LM.userToken,
          brandCode:Conf.BRAND_CODE,
        }
      }).then(res=>{
        if(res.code == 1){
          return res;
        }else{
          let title = res && res.msg || "库存异常";
          SMH.showToast({title});
          return Promise.reject({title,fromType:"reject"})
        }
      }).catch(e=>{
        if(e&&e.fromType=='reject'){
          return Promise.reject(e)
        }
        return Promise.resolve(e)
      })
    }else{
      return Promise.resolve();
    }
  })
}

export default payManager.getInstance();