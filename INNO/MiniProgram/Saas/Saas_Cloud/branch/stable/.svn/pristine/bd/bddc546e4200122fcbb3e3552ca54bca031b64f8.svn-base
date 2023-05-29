import {CL_NewPayApi} from "../../manager/http-manager";
import { PayType } from "../../manager/log-map";
import Conf from "../../../conf";
import WxApi from "../wx-api-helper";
import DateUtil from '../../support/utils/date-util'
import retainSessionH from '../handle/retainSessionHandle';
class payManager {
  static getInstance() {
    if (!payManager.instance) {
      payManager.instance = new payManager();
    }
    return payManager.instance;
  }
  constructor() {
    
  }
  UnifiedorderByOrderId(type,orderId,isNeedUser = true,checkMod = false,curOrderInfo={}){
    console.log("支付类型",PayType,Conf.PAYMETHOD,orderId,curOrderInfo);
    if(!orderId) return Promise.reject();
    return getPaymentInfoHandle.call(this,{type,orderId,isNeedUser}).then(e=>{
      console.log('getPaymentInfoHandle then',e,checkMod)
      if(checkMod){
        return checkPaymentMode.call(this).then(mode=>{
          if(mode == 1 && wx.requestOrderPayment){
            return Fnc.requestOrderPayment(e,curOrderInfo);
          }else{
            return Fnc.requestPayment(e);
          }
        })
      }else{
        try {
          let page = getCurrentPages().slice(-1)[0] || {}
          // 保存短暂切换后台数据
          retainSessionH.saveRetainSession({
            shortPath: page.route,
            shortHome: true
          })
        } catch (error) {
          console.log("retainSessionH出错", error)
          return e
        }
        return e
      }
    }) 
  }
  getUnifiedorderByOrderId(params = {}){
    let type = params.type || "";
    let orderId = params.orderId || 0;
    if(!orderId) return Promise.reject();
    return getUnifiedorderByOrderId.call(this,type,orderId);
  }
  unifiedCloudShopOrderByCode(type,orderId){
    console.log("支付类型",PayType,Conf.PAYMETHOD,orderId);
    if(!orderId) return Promise.reject();
    return unifiedCloudShopOrderByCode.call(this, type, orderId)
      .then(res => {
        if (res.code == "1" && res.data && res.data.code_url){
          return Promise.resolve(res.data.code_url)
        }
        return Promise.reject(res)
      })
  }
}  
//通联第三方
function getUnifiedorderByOrderId(type,orderId){
  return CL_NewPayApi.unifiedCloudShopOrder({
    params: {
      orderId: orderId,
      payType: PayType[type].type,
      payMethod: "",
      brandCode: Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  })
}

function unifiedCloudShopOrderByCode(type, orderId){
  return CL_NewPayApi.unifiedCloudShopOrderByCode({
    params: {
      orderId,
      payType: PayType[type].type,
      payMethod: "",
      brandCode: Conf.BRAND_CODE
    }
  })
}

function getPaymentInfoHandle({type,orderId,isNeedUser}){
  return getUnifiedorderByOrderId.call(this,type,orderId); //新支付 (云店都调新支付)
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
    // return WxApi.requestPayment({...params})
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
      if(error && error.errMsg && error.errMsg.indexOf('fail') != -1){
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
  requestOrderPayment(e,curOrderInfo){
    let params = this.getPaymentParams(e); 
    params.orderInfo = getInfo(e,curOrderInfo);
    console.log('requestOrderPayment params',{...params});
    // return WxApi.requestOrderPayment({...params})
    return WxApi.requestOrderPayment({...params}).then((res)=>{
      console.log("支付回调", res);
      if(res && res.errMsg && res.errMsg.indexOf('ok') != -1){
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
      'paySign': info.sign,
    }
  }
} 
 
function getInfo(payInfo={},curOrderInfo={}){
  let orderEntity = curOrderInfo.orderEntity||{};
  let orderDetailList = curOrderInfo.orderDetailList||[];
  let order_id = orderEntity.order_id;
  let order_info = {
    "create_time": DateUtil.getDetailToday(),
    "out_order_id": order_id,                
    "openid": payInfo.openid,
    "path": `/pages/micro_mall/order/order_info?order_id=${order_id}`,
    "order_detail":
    {
        "product_infos":get_product_infos(orderDetailList),
        "pay_info": {
            "pay_method_type": 0,       
            "prepay_id": order_id,
            "prepay_time": DateUtil.getDetailToday()
        },
        "price_info": {
            "order_price": orderEntity.order_amount * 100 || 0,
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
      "out_product_id": item.productId||0,
      "out_sku_id":item.product_sn||"",
      "product_cnt": item.goods_num,
      "sale_price": item.market_price * 100, 
      "real_price": item.goodPrice * 100, 
      "path": `pages/micro_mall/goods/goods_info?goods_id=${item.goodsId}`,
      "title" : item.goods_Name||"",
      "head_img": item.img_url||""
    }
    arr.push(temp);
  }
  return arr
}

export default payManager.getInstance();