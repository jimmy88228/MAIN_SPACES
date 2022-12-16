import StorageH from "../../helper/storage-handler/index";
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
  initParam(options){
    let query = options.query;
    if (query.barCodeId || query.scene){ //为定好的协议参数，通过解析协议获取需要的数据
      console.log(query, "scanWXLOG前参数")
    }
    this.handleParams({ options: options });
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

export default ParamsManager.getInstance();
