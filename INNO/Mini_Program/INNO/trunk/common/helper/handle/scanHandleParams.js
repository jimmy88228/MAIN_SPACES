import PH from "./paramsHandle.js";
import Conf from "../../../conf";
import EB from "../../support/tools/event-bus.js";
import SMH from "../../helper/show-msg-helper";
import {GoodsApi} from "../../manager/http-manager";
import StrH from "../../support/utils/string-util";
import WxApi from "../wx-api-helper"
class ScanParamsManager {
  static getInstance() {
    if (!ScanParamsManager.instance) {
      ScanParamsManager.instance = new ScanParamsManager();
    }
    return ScanParamsManager.instance;
  }
  constructor() {
    
  }
  //获取扫码后的参数
  getParams(keys = []){
    return new Promise((rs, rj) => {
      let isScanWXCodeLog = PH.isScanWXCodeLog;
      let params = {};
      // console.log(isScanWXCodeLog,"isScanWXCodeLog");
      if (isScanWXCodeLog) {
        let paramsJson = PH.paramsJson();
        if (keys instanceof Array) {
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (paramsJson[key]) {
              params[key] = paramsJson[key] || "";
            }
          }
        }else{
          return rj();
        }
        return rs(params);
      }
      this.sceneParamsChangeId = EB.listen("SceneParamsChange", () => {
        let paramsJson = PH.paramsJson();
        if (keys instanceof Array) {
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (paramsJson[key]) {
              params[key] = paramsJson[key] || "";
            }
          }
        } else {
          setTimeout(()=>{
            EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
            delete this.sceneParamsChangeId;
          })
          return rj();
        }
        setTimeout(() => {
          EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
          delete this.sceneParamsChangeId;
        })
        return rs(params);
      })
    })
  }
  //扫码识别于条形码，普通二维码
  scanAction(){
    if(this.lock) return Promise.reject();
    this.lock = true;
    return WxApi.scanCode({}).then(res=>{
      console.log('扫码',res)
      if(res.errMsg.indexOf("ok") != -1){
        let result = res.result || "";
        if(result){
          if(result.indexOf("goods_id") != -1 || result.indexOf("goodsId") != -1){
            let params = StrH.getUrlParam(result);
            // typeof(callback) == "function" && callback(params);
            return Promise.resolve(params);
          } else{
            return Promise.resolve(result); 
            // typeof(callback) == "function" && callback(result);
          }
        } else {
          SMH.showToast({
            title: "扫码内容为空"
          })
        }
      }
      return Promise.reject();
    }).finally(()=>{
      this.lock = false;
    }).catch(e=>{
      console.log('catch',e);
      SMH.showToast({
        title: "扫码内容无效"
      })
      return Promise.reject();
    }) 
  }

  scanActionAnalyse(result,pageDialog,type="goods"){
    if(typeof(result) == "string"){
      if(type == 'goods'){
        getGoodsScanInfo.call(this, result,pageDialog);
      }
    }else if(typeof(result) == "object"){
      if(type == 'goods'){
        if(result.goods_id){
          wx.navigateTo({
            url: `/pages/micro_mall/goods/goods_info?goods_id=${result.goods_id||0}&color_id=${result.color_id||0}`,
          })
        }
      }
    }
  }
}

 
function getGoodsScanInfo(result,pageDialog){
  return GoodsApi.getGoodsScanInfo({
    params:{
      brandCode:Conf.BRAND_CODE,
      searchVal: result||""
    },other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data||{};
      if(data){
        wx.navigateTo({
          url: `/pages/micro_mall/goods/goods_info?goods_id=${data.goodsId||0}&color_id=${data.colorId||0}`,
        })
      }
      return Promise.resolve(res);
    }
    if(pageDialog){
      pageDialog.setTitle("温馨提示");
      pageDialog.setTouchCancel(true);
      pageDialog.setCentent(res && res.msg || "商品信息异常");
      pageDialog.setSingleBtn(
        {
          name: "确定",
          tap: () => {
            pageDialog.dismiss();
          }
        }
      )
      pageDialog.show();
    } 
  })
}



export default ScanParamsManager.getInstance();