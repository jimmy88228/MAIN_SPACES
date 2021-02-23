import { BrandApi } from "../manager/http-manager.js"
import Conf from "../../conf.js"
import Promise from "../../libs/promise/promise";
import StorageH from "../../helper/handle/storageHandle"
class sysConfigManager {
  static getInstance() {
    if (!sysConfigManager.instance) {
      sysConfigManager.instance = new sysConfigManager();
    }
    return sysConfigManager.instance;
  }
  constructor() {
    this._sysConf = StorageH.get("sysConf") || {};
  }
  get sysConf(){
    return this._sysConf;
  }
  //
  confBeforeReqHandle(cfg_prop) {
    cfg_prop = cfg_prop || "default";
    let sysConf = this._sysConf;
    let dataCacheTime = Conf.dataCacheTime || 0;
    let nextDate = new Date();
    let pervDate = 0;
    if (cfg_prop && sysConf[cfg_prop]) {
      pervDate = sysConf[cfg_prop].cacheDate
    }
    if (pervDate) {
      let times = cfg_prop == "default" ? 3 : 1;
      if ((nextDate.getTime() - pervDate) < (dataCacheTime * 60 * 1000 * times)) {
        return Promise.resolve(sysConf[cfg_prop]);
      }
      if (cfg_prop == "default"){
        this.isAllLoad = false;
      }
    }
    return (cfg_prop == "default") ? getAllConfig.call(this) : getSingleConfig.call(this, cfg_prop);
  }
  //
  confDataHandle(cfg_prop, data) {
    let sysConf = this._sysConf;
    let nextDate = new Date();
    cfg_prop = cfg_prop || "default";
    sysConf[cfg_prop] = {
      cacheDate: nextDate.getTime(),
      ...data
    }
    try{
      StorageH.set("sysConf", sysConf);
    }catch(error){
      console.log("setStorageSync",error)
    }
  }
  //
  getSysConfig(params){
    return this.confBeforeReqHandle(params);
  }
}

//
function getAllConfig(){
  if (this.isAllLoad) return Promise.reject();
  this.isAllLoad = true;
  return BrandApi.getDefSystemConfig({
    params:{
    },
    other:{
      isShowLoad: false
    }
  }).then( e=>{
    if(e.code == 1){
      if(!e.data){
        e.data = {}
      }
      this.confDataHandle("default",e.data);
      return Promise.resolve(e.data);
    }
    return Promise.reject();
  })
}
//
function getSingleConfig(cfg_prop){
 return BrandApi.getSystemConfig({
    params:{
      cfg_prop: cfg_prop
    },
    other:{
      isShowLoad: true
    }
  }).then( e=>{
    if (e.code == 1) {
      if (!e.data) {
        e.data = {}
      }
      this.confDataHandle(cfg_prop,e.data);
      return Promise.resolve(e.data);
    }
    return Promise.reject();
  })
}

export default sysConfigManager.getInstance();