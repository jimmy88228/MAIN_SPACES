import StorageH from "../../helper/storage-handler/index";
import LM from "../../manager/login-manager/index";
import Conf from "../../../config/index";
import { BarCodeApi } from "../../manager/http-manager/index";


class ParamsManager {
  static getInstance() {
    if (!ParamsManager.instance) {
      ParamsManager.instance = new ParamsManager();
    }
    return ParamsManager.instance;
  }
  constructor() {
    let paramJson = StorageH.get("PAGE_PARAMS_JSON") || {};
    this._paramsJson = paramJson || {};
  }
  initStatus(){
    this.isScanWXCodeLog = false;
  }
  /**
   * 
   * @param {Object} options 进入App参数
   * @returns {Object} options 处理后的App参数 
   */
  initParam(options){
    let query = options.query;
    if (query.barCodeId || query.scene){ //为定好的协议参数，通过解析协议获取需要的数据
      console.log(query, "scanWXLOG前参数")
      return scanWXCodeLog.call(this, query);
    }
    this.handleParams({ options: options });
    return Promise.resolve(options)
  }
  handleParams(obj) {
    this.mergePageParam(obj);
  }
  saveParams(obj){
    if (!this._paramsJson){
      this._paramsJson = {}
    }
    for (let i in obj){
      this._paramsJson[i] = obj[i];
    }
    console.log("saveParams",obj,this._paramsJson)
    StorageH.set("PAGE_PARAMS_JSON", this._paramsJson);
  }
  mergePageParam(obj) {//合并options参数
    if (obj.options) {
      this.saveParams(obj);
      return;
    } else {
      let ops = this.paramsJson("options") || {};
      let query = ops.query || {};
      query = {
        ...query,
        ...obj
      }
      ops.query = query || {};
      this.saveParams({ options: ops });
    }
  }
  delParams(key){
    if (key instanceof Array){
      for (let i in key){
        delete this._paramsJson[key[i]]
      }
    }else{
      delete this._paramsJson[key];
    }
    StorageH.set("PAGE_PARAMS_JSON", this._paramsJson);
  }
  paramsJson(key){
    let paramsJson = this._paramsJson;
    console.log(paramsJson,"get paramsJson");
    if(key){
      if (paramsJson[key]){
        return paramsJson[key]
      }
      let options = paramsJson.options || {};
      let query = options.query || {};
      return query[key] || ""
    }
    return paramsJson;
  }
}

function scanWXCodeLog(options = {}) {
  if (!options.barCodeId && !options.scene) return Promise.resolve(options);
  return BarCodeApi.scanWXCodeLog({
    data: {
      "barCodeId": options.barCodeId || "",
      "scence": options.scene || "",
      brandCode: Conf.BRAND_CODE,
      userToken: LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      console.log(e,"scanWXCodeLog 请求后的参数 data")
      let data = e.data;
      let p_scene = data.p_scene || "";
         p_scene = JSON.parse(p_scene);
      let fromUser = data.userToken;
      let opKind = data.opKind;
      let p_path = data.p_path || "";
      let { extendParam1,extendParam2,extendParam3 } = data;
      p_scene = {
        fromUser,
        opKind,
        extendParam1,
        extendParam2,
        extendParam3,
        p_path,
        ...p_scene
      }
      //须保留兼容之前的
      this.saveParams(p_scene);
      this.handleParams(p_scene);
      //
      this.isScanWXCodeLog = true;
      //
      // let _time = setTimeout(function(){
      //   clearTimeout(_time);
      //   EB.call("SceneParamsChange", this);
      // }.bind(this),350);
      //
      return this.paramJson().options || options;
    }
    return options;
  })
}

export default ParamsManager.getInstance();
