import PH from "./paramsHandle.js";
import Conf from "../../conf";
import EB from "../../support/tools/event-bus.js";
import SMH from "../../helper/show-msg-helper"
import StrH from "../../support/utils/string-util";
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
          if(scanType == "QR_CODE"){
            let params = StrH.getUrlParam(res.result);
            typeof(callback) == "function" && callback(params);
          }else{
            typeof(callback) == "function" && callback(res.result);
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
function scanAction() {
  if(this.lock){
    console.log('lock');return
  };
  let that = this;
  that.lock = true;
  wx.scanCode({
    success: res => {
      let msg = res && res.errMsg || "";
      if (msg.indexOf('ok') != -1) {
        let result = res.result || "";
        console.log(res.result,res,"扫码 suc")
        return app.GoodsApi.getGoodsScanInfo({
          params:{
            brandCode:app.Conf.BRAND_CODE,
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
          this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
          this.pageDialog.setTitle("温馨提示");
          this.pageDialog.setTouchCancel(true);
          this.pageDialog.setCentent(res && res.msg || "商品信息异常");
          this.pageDialog.setSingleBtn(
            {
              name: "确定",
              tap: function () {
                that.pageDialog.dismiss();
              }
            }
          )
          this.pageDialog.show();
        })
      }
    },
    fail: res => {
      console.log('扫码 fail', res)
    },
    complete: res => {
      that.lock = false;
      console.log('扫码 complete', res)
    }
  })
}



export default ScanParamsManager.getInstance();