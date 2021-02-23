import LM from "../manager/login-manager.js";
import Conf from "../../conf";
import { BarCodeApi, DstbApi, UserApi } from "../manager/http-manager.js";
import LgMg from "../manager/log-manager.js";
import EB from "../../support/tools/event-bus.js";
import StorageH from "../../helper/handle/storageHandle";
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
  initParam(options){
    let query = options.query;
    if (query.barCodeId || query.scene){//为定好的协议参数，通过解析协议获取需要的数据
      console.log(query, "scanWXLOG前参数")
      scanWXCodeLog.call(this, query);
    }else{
      handleStoreStaffInfo.call(this, query);
    }
    this.handleParams({ options: options });
  }
  handleParams(obj) {
    this.mergePageParam(obj);
    //助力分享，记录分享
    visitRecordHandle.call(this, obj);
  }
  saveParams(obj){
    if (!this._paramsJson){
      this._paramsJson = {}
    }
    for (let i in obj){
      this._paramsJson[i] = obj[i];
    }
    console.log("paramsJson",obj)
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
      // console.log(ops, "savePageParam obj");
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
      "scence": options.scene || ""
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
      if (p_scene.staffCode || p_scene.staff_code){
        let staffCode = p_scene.staffCode || p_scene.staff_code || "";
        LM.buildDstbRelation(staffCode);
      }
      handleStoreStaffInfo.call(this, p_scene);
      this.isScanWXCodeLog = true;
      //
      let _time = setTimeout(function(){
        clearTimeout(_time);
        console.log("触发 SceneParamsChange");
        EB.call("SceneParamsChange", this);
      }.bind(this),350);
      //
      return Promise.resolve(options);
    }
    return Promise.resolve(options);
  })
}

function handleStoreStaffInfo(p_scene){
  let staffCode = p_scene.staffCode || p_scene.staff_code || "";
  if (!p_scene.staff_id){
    getStaffIdByStaffCode.call(this, staffCode).then(staffId=>{
      bindFromStaffId.call(this, staffCode, staffId);
    });
  }else{
    bindFromStaffId.call(this, staffCode, p_scene.staff_id);
  }
  bindFromStore.call(this, p_scene);
}
//
function getStaffIdByStaffCode(staffCode){
  if (!staffCode) return Promise.reject();
  return DstbApi.getStaffIdByStaffCode({
    params:{
      "brandCode": Conf.BRAND_CODE,
      "staffCode": staffCode
    },
    other:{
      isShowLoad: false
    }
  }).then( e=>{
    if(e.code == 1){
      if(e.data){
        this.saveParams({staff_id:e.data});
      }
      return Promise.resolve(e.data);
    }
    return Promise.reject(e)
  })
}
//
function bindFromStore(p_scene) {
  let store_id = p_scene.store_id || p_scene.storeId || 0;
  let store_code = p_scene.store_code || p_scene.storeCode || 0;
  store_id = parseInt(store_id);
  if (!LM.userToken || (!store_id && !store_code)) return;
  return UserApi.bindFromStore({
    data: {
      "storeCode": store_code,
      "storeId": store_id,
      "isWap": 0, //是否公众号二维码，0小程序二维码，1公众号二维码
    },
    other: {
      isShowLoad: false
    }
  }).then(e => {
    if (e.code == 1) {
      return Promise.resolve();
    }
    return Promise.reject("")
  })
}

//好友助力写log
function visitRecordHandle(obj) {
  let ops = obj.options || {};
  let query = ops.query || {};
  try {
    if (obj.fromUser || (ops.query && query.fromUser)) {
      // console.log(ops, "ops");
      let fromUser = obj.fromUser || query.fromUser;
      if (fromUser == LM.userToken) return;
      let page_id = obj.page_id || query.page_id || query.index_page_id;
      let activityId = obj.activityId || query.activityId
      let staffCode = obj.staffCode || obj.staff_code || query.staffCode || "";
      let saveOptions = this.paramsJson("options") || {};
      let scene = saveOptions.scene;
      LgMg.customPageVisitRecord(fromUser, page_id, activityId, LM.openId, staffCode, scene)
    }
  } catch (err) {
    console.log(err);
  }
}
//绑定所属店员
function bindFromStaffId(staffCode,staffId) {
  if (!LM.isLogin || !staffCode || !staffId) return;
  return UserApi.bindFromStaffId({
    data: {
      "staffCode": staffCode,
      "staffId": staffId,
    },
    other: {
      osShowLoad: true
    }
  })
}

export default ParamsManager.getInstance();
