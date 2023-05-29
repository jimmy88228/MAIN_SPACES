// 目前暂时未引用

import PH from "../params-handler/index";
import EB from "../../support/event-bus/index";
import SMH from "../show-message-helper/index"
import StrH from "../../utils/string/index";
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
  scanAction(callback){
    if(this.lock) return;
    this.lock = true;
    wx.scanCode({
      success:(res) => {
        if(res.errMsg.indexOf("ok") != -1){
          let scanType = res.scanType;
          let result = res.result || "";
          if(result){
            if(result.indexOf("goods_id") != -1 || result.indexOf("goodsId") != -1){
              let params = StrH.getUrlParam(result);
              typeof(callback) == "function" && callback(params);
            } else{
              typeof(callback) == "function" && callback(result);
            }
          } else {
            SMH.showToast({
              title: "扫码内容为空"
            })
          }
        }
      },
      fail: res => {
        SMH.showToast({
          title: "扫码失败"
        })
      },
      complete: res => {
        this.lock = false;
      }
    })
  }
}



export default ScanParamsManager.getInstance();