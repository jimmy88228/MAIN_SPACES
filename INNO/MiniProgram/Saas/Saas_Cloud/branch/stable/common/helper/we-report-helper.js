import SysConf from './handle/getSystemConfig.js'
import {CL_GoodsApi,CL_BuyApi} from "../manager/http-manager";
class WxReportHelp {
  static getInstance() {
    if (!WxReportHelp.instance) {
      WxReportHelp.instance = new WxReportHelp();
    }
    return WxReportHelp.instance;
  }
  constructor() { 
    this.goso_cloud_report = -1;
    this.catGoods = {};
    this.getConf();
  }
  getConf(){
    if(this.goso_cloud_report != -1){
      if(this.goso_cloud_report == 1){
        return Promise.resolve(this.goso_cloud_report);
      }
      return Promise.reject(this.goso_cloud_report)
    }
    return SysConf.getSysConfig('goso_cloud_report').then(res=>{
      console.log('WE分析 配置',res)
      let Value = res && res.Value || 0;
      this.goso_cloud_report = Value;
      if(this.goso_cloud_report == 1){
        return Promise.resolve(this.goso_cloud_report);
      }
      return Promise.reject(this.goso_cloud_report);
    })
  } 

  setGoodsExpose({goodsInfo={},productInfo={},isSelect=false}){
    return this.getConf().then(()=>{
      return this.getGoodsCat().then(list=>{
      // return this.getGoodsCat([goodsInfo.goods_id||0]).then(list=>{
        let catInfo = list && list[0] || {};
        let params = {
          spu_id:goodsInfo.goods_id||0,
          spu_name:goodsInfo.goods_name||"--",
          sku_id:productInfo.product_id||0,
          sku_name:isSelect?(productInfo.product_sn||"--"):"未选规格",
          price_original:PriceTrans(isSelect?productInfo.market_price||0:goodsInfo.max_market_price||0),
          price_current:PriceTrans(isSelect?productInfo.sale_price||0:goodsInfo.min_price||0),
          spu_catg_first_id:String(catInfo.catId||""),
          spu_catg_first_name:catInfo.catName||"",
          spu_catg_second_id:String(catInfo.twoCatId||""),
          spu_catg_second_name:catInfo.twoCatName||"",
        };
        return this.reportEvent('wxdata_expose_goods',params);
      })
    })
  }

  setGoodsBrowse({goodsInfo={},productInfo={},isSelect=false}){
    return this.getConf().then(()=>{
      return this.getGoodsCat([goodsInfo.goods_id||0]).then(list=>{
        let catInfo = list && list[0] || {};
        this.catGoods[goodsInfo.goods_id||0] = catInfo;
        let params = {
          spu_id:goodsInfo.goods_id||0,
          spu_name:goodsInfo.goods_name||"--",
          sku_id:productInfo.product_id||0,
          sku_name:isSelect?(productInfo.product_sn||"--"):"未选规格",
          price_original:PriceTrans(isSelect?productInfo.market_price||0:goodsInfo.max_market_price||0),
          price_current:PriceTrans(isSelect?productInfo.sale_price||0:goodsInfo.min_price||0),
          spu_catg_first_id:String(catInfo.catId||""),
          spu_catg_first_name:catInfo.catName||"",
          spu_catg_second_id:String(catInfo.twoCatId||""),
          spu_catg_second_name:catInfo.twoCatName||"",
          stay_time:goodsInfo.stayTime||0,
        };
        return this.reportEvent('wxdata_browse_goods',params);
      })
    })
  }
  setGoodsPurchase({goodsInfo={},action_type=0,action_num=0,is_goods_page=0}){ 
    return this.getConf().then(()=>{
      //  action_type（0：加购；1：减购）, action_num（加减购数量）, is_goods_page（0代表不是；1代表是）
      return this.getGoodsCat([goodsInfo.goods_id||0]).then(list=>{
        let catInfo = list && list[0] || {};
        this.catGoods[goodsInfo.goods_id||0] = catInfo;
        let params= {
          "spu_id": goodsInfo.goods_id||0,
          "spu_name": goodsInfo.goods_name||"--",
          "sku_id": goodsInfo.product_id||0,
          "sku_name": goodsInfo.product_sn||"--",
          "price_original": PriceTrans(goodsInfo.market_price||0),
          "price_current": PriceTrans(goodsInfo.sale_price||0),
          "action_type": action_type,
          "action_num": action_num,
          "is_goods_page": is_goods_page, 
          "spu_catg_first_id":String(catInfo.catId||""),
          "spu_catg_first_name":catInfo.catName||"",
          "spu_catg_second_id":String(catInfo.twoCatId||""),
          "spu_catg_second_name":catInfo.twoCatName||"",
        } 
        return this.reportEvent('wxdata_purchase_goods',params);
      })
    })
  }
  setOrderStatus({orderInfo={},goodsList=[],order_status}){
    return this.getConf().then(()=>{
      console.log('setOrderStatus',orderInfo,goodsList,order_status)
      return this.getGoodsCat(goodsList.map(g_item=>g_item.goodsId||0)).then(list=>{
        list && list.forEach(r_item=>{
          this.catGoods[r_item.goodsId] = r_item; 
        })
        goodsList.forEach(item=>{
          let catInfo = this.catGoods[item.goodsId] || {};
          let params = {
            "spu_id": item.goodsId||0,
            "spu_name": item.goodsName||"--",
            "sku_id": item.productId||0,
            "sku_name": item.productSn||"--",
            "price_original": PriceTrans(item.marketPrice||0),
            "price_current": PriceTrans(item.salePrice||0),
            "sku_count": item.goodsNumber||0,
            "sku_pay_amt": PriceTrans(item.realPrice||0), //sku实付价格
            "order_amt": PriceTrans(orderInfo.goodsAmount||0),
            "pay_amt": PriceTrans(orderInfo.orderAmount||0),
            "order_id": orderInfo.orderId||0,
            "order_status": order_status||"", //订单状态（3：用户提交订单；9001：用户关闭支付密码浮层；11：用户完成支付；250：用户取消订单）
            "spu_catg_first_id": String(catInfo.catId||""),
            "spu_catg_first_name": catInfo.catName||"",
            "spu_catg_second_id": String(catInfo.twoCatId||""),
            "spu_catg_second_name": catInfo.twoCatName||"",
          }
          order_status && this.reportEvent('wxdata_order_status',params);
        })
        return true
      })
    })
  }
  setOrderRefund({orderInfo={},goodsList=[],type='refund'}){
    return this.getConf().then(()=>{
      console.log('setOrderRefund',orderInfo,goodsList,type)
      let ids = goodsList.map(g_item=>g_item.goodsId||0);
      return this.getGoodsCat(ids).then(list=>{
        list && list.forEach(r_item=>{
          this.catGoods[r_item.goodsId] = r_item; 
        })
        let func = null;
        type == 'refund' ? (func = (orderSn)=>getRefundOrderList(orderSn)) : (func = (orderSn)=>getReturnOrderList(orderSn));
        return func(orderInfo.orderSn).then(refundList=>{
          let refundInfo = {};
          for(let i = 0,len=refundList.length;i<len;i++){
            let item = refundList[i];
            let refundCheck = 0;
            item.goodsList.forEach(g_item=>{
              if(ids.includes(g_item.goodsId)){
                refundCheck+=1;
              }
            })
            if(refundCheck == ids.length){
              refundInfo = item;
              break;
            }
          } 
          console.log('匹配售后单',refundInfo,refundList)
          goodsList.forEach(item=>{
            let catInfo = this.catGoods[item.goodsId] || {};
            let params = {
              "spu_id": item.goodsId||0,
              "spu_name": item.goodsName||"--",
              "sku_id": item.productId||0,
              "sku_name": item.productSn||"--",
              "price_original": PriceTrans(item.marketPrice||0),
              "price_current": PriceTrans(item.salePrice||0),
              "sku_count": item.goodsNumber||0,
              "refund_count":item.return_num||item.goodsNumber||1,
              "sku_refund_amt": PriceTrans((item.realPrice*(item.return_num||item.goodsNumber||1)/(item.goodsNumber||1)).toFixed(2)||0), //当前sku退款的金额 //发货前取消订单+取消单品是没有return_num的
              "refund_amt": PriceTrans(refundInfo.totalAmount||refundInfo.refundAmount||0), //订单退款金额 //接口
              "pay_amt": PriceTrans(orderInfo.orderAmount||0),
              "order_id": orderInfo.orderId||0,
              "refund_order_id": refundInfo.returnId||refundInfo.refundId||0, //退款单id //接口
              "spu_catg_first_id": String(catInfo.catId||""),
              "spu_catg_first_name": catInfo.catName||"",
              "spu_catg_second_id": String(catInfo.twoCatId||""),
              "spu_catg_second_name": catInfo.twoCatName||"",
            }
            this.reportEvent('wxdata_refund',params);
          })
        })
      })
    })
  }
  setPageShare({goodsInfo={},shareInfo={}}){
    return this.getConf().then(()=>{
      return this.getGoodsCat([goodsInfo.goods_id||goodsInfo.goodsId||0]).then(list=>{
        let catInfo = list && list[0] || {};
        this.catGoods[goodsInfo.goods_id||0] = catInfo;
        let params = {
          spu_id:goodsInfo.goods_id||goodsInfo.goodsId||0,
          spu_name:goodsInfo.goods_name||goodsInfo.goodsName||"",
          share_image_url: String(shareInfo.shareImg || '').trim() || '--',
          share_title: String(shareInfo.shareTitle || '').trim() || '--',
          share_from: shareInfo.shareFrom == 'button' ? 1 : 2, //	分享来源（1：按钮；2：菜单）
          is_goods_page: shareInfo.fromPage == 'SPXQ' ? 1 : 0, // (1:商品详情页)
          spu_catg_first_id:String(catInfo.catId||""),
          spu_catg_first_name:catInfo.catName||"",
          spu_catg_second_id:String(catInfo.twoCatId||""),
          spu_catg_second_name:catInfo.twoCatName||"",
          share_to:1,
        };
        this.reportEvent('wxdata_page_share',params) 
      })
    })
  }
  getGoodsCat(goodsIdList){
    if((goodsIdList && !goodsIdList[0]) || !goodsIdList){
      return Promise.resolve([])
    }
    if(goodsIdList.every(item=>!!(this.catGoods[item]))){//goodsIdList完全匹配
      return Promise.resolve(goodsIdList.map(item=>({...this.catGoods[item]})));
    }
    return CL_GoodsApi.getGoodsStyle({
      data:{
        goodsIdList
      },
      other:{
        isShowLoad:false
      }
    }).then(res=>{
      return res && res.data||[]
    }).catch(e=>{
      return Promise.resolve([]);
    })
  }
  reportEvent(eventId,params){
    console.log('数据上报',eventId,params)
    wx.reportEvent(eventId,params);
    return {eventId,params}
  }
  
} 

function PriceTrans(price,times=100) {
  return parseInt((Number(price)*times));
}

function getReturnOrderList(searchStr) {
  return CL_BuyApi.getReturnOrderList({
    params:{
      returnType:1,
      searchStr,
      pageIndex:1,
      pageSize:20
    }, 
    other:{
      isShowLoad:false
    }
  }).then(res=>{
    return res && res.data && res.data.list||[]
  }).catch(e=>{
    return Promise.resolve([])
  })
}

function getRefundOrderList(searchStr) {
  return CL_BuyApi.getRefundOrderList({
    params:{ 
      searchStr,
      pageIndex:1,
      pageSize:20
    }, 
    other:{
      isShowLoad:false
    }
  }).then(res=>{
    return res && res.data && res.data.list||[]
  }).catch(e=>{
    return Promise.resolve([])
  })
}
export default WxReportHelp.getInstance();