import LM from "../../manager/login-manager.js";
import Conf from "../../../conf";
import { BarCodeApi, DstbApi, UserApi } from "../../manager/http-manager.js";
import LgMg from "../../manager/log-manager.js";
import EB from "../../support/tools/event-bus.js";
import StorageH from "../handle/storageHandle";
import { SceneChannel } from "../../manager/log-map";
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
  isfromSceneChannel(channel){
    try{
      if (!channel) return false
      let paramsJson = this._paramsJson || {};
      let options = paramsJson.options || {};
      let scene = options.scene || (options.query && options.query.scene) || "";
      if (scene && SceneChannel[scene] && SceneChannel[scene].channel === channel) return true;
      return false
    } catch (error) {
      console.log("payHandle->orderIsfromVideoLive->error", error)
      return false
    }
  }
  handleStoreStaffInfo(p_scene){ // 只是挂载作用
    handleStoreStaffInfo.call(this, p_scene)
  }
}
function scanWXCodeLog(options = {}) {
  if (!options.barCodeId && !options.scene) return Promise.resolve(options);
  return BarCodeApi.scanWXCodeLog({
    data: {
      "brandCode": Conf.BRAND_CODE,
      "userToken": LM.userToken || "",
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
        LM.buildDstbRelation(staffCode); //绑定分销关系
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

// 绑定店员关系
function handleStoreStaffInfo(p_scene){
  // let staffCode = p_scene.staffCode || p_scene.staff_code || "";
  let staffCode = p_scene.staff_code || "";
  if (!p_scene.staff_id){
    getStaffIdByStaffCode.call(this, staffCode).then(staffId=>{
      bindFromStaffId.call(this, staffCode, staffId);
    });
    getStaffIdByStoreStaffCode.call(this, staffCode)
  }else{
    bindFromStaffId.call(this, staffCode, p_scene.staff_id);
  }
  bindFromStore.call(this, p_scene);
}
// 店员code换店员ID
function getStaffIdByStoreStaffCode(storeStaffCode){
  if (!storeStaffCode) return Promise.reject();
  return UserApi.getStoreStaffByCode({
    params:{
      "brandCode": Conf.BRAND_CODE,
      "staffCode": storeStaffCode
    },
    other:{
      isShowLoad: false
    }
  }).then(e=>{
    if(e.code == 1){
      if(e.data){
        this.saveParams({store_staff_id:e.data.staff_id || 0});
      }
      return Promise.resolve(e.data.staff_id);
    }
    return Promise.reject(e)
  })
}

//分销员code换店员id
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
  LM.handleBindFromStore(p_scene, "set")
  if (!LM.userToken || (!store_id && !store_code)) return;
  return UserApi.bindFromStore({
    data: {
      "userToken": LM.userToken,
      "storeCode": store_code,
      "storeId": store_id,
      "brandCode": Conf.BRAND_CODE,
      "isWap": 0, //是否公众号二维码，0小程序二维码，1公众号二维码
    },
    other: {
      isShowLoad: false
    }
  }).then(e => {
    if (e.code == 1) {
      LM.handleBindFromStore("", "del")
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
      const postVisitRecordP = LgMg.customPageVisitRecord(fromUser, page_id, activityId, LM.openId, staffCode, scene);
      if (activityId && activityId > 0) { // 分享有礼才进行
        postVisitRecordP.then((res = {}) => {
          console.log("助力结果: ", res)
          let code = res.code;
          if (code == 1 || code == 2) { // 助力成功 或 其他原因导致助力不成功
            EB.call("visitRecord", res)
          } else {
            console.log("助力失败: ", res)
          }
        })
        .catch(err => {
          console.log("助力异常: ", err)
        })
      }
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
      "brandCode": Conf.BRAND_CODE,
      "staffCode": staffCode,
      "staffId": staffId,
      "userToken": LM.userToken
    },
    other: {
      osShowLoad: true
    }
  })
}

export default ParamsManager.getInstance();
