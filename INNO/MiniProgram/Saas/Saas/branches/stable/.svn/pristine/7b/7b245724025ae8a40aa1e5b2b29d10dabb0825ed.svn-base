import { BrandApi } from "../../manager/http-manager.js"
import Conf from "../../../conf.js"
// import Promise from "../../libs/promise/promise";
import StorageH from "../handle/storageHandle"
class sysConfigManager {
  static getInstance() {
    if (!sysConfigManager.instance) {
      sysConfigManager.instance = new sysConfigManager();
    }
    return sysConfigManager.instance;
  }
  constructor() {
    this._sysConf = StorageH.get("sysConf") || {};
    this._onceConf = {};
    this._sysPromise = {};
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
  getOnceSysConfig(params){ 
    if(this._onceConf[params]){
      return Promise.resolve(this._onceConf[params]);
    }
    return getSingleConfig.call(this,params,'once').then(data=>{
      this._onceConf[params] = data;
      return data;
    });
  }
  trimSysConfig(cfg){
    let cfgProps = "";
    if(cfg && Array.isArray(cfg)){
      cfgProps = cfg.join(',');
    }else if(cfg){
      cfgProps = cfg;
    }else{
      return Promise.resolve([]);
    }
    return BrandApi.getSystemConfigList({
      params:{
        cfgProps,
        brandCode:Conf.BRAND_CODE
      }
    }).then(res=>{
      console.log('trimSysConfig then',res);
      return res;
    })
    // let apiArr = [];
    // for(let i = 0,len=arr.length;i<len;i++){
    //   apiArr.push(this.getSysConfig(arr[i]));
    // } 
    // return Promise.all(apiArr).then(res=>{
    //   console.log('trimSysConfig then',res);
    //   return res;
    // })
  }
}

//
function getAllConfig(){
  // if (this.isAllLoad) return Promise.reject();
  // this.isAllLoad = true;
  if(this._sysPromise['default']){
    return this._sysPromise['default']
  }
  this._sysPromise['default'] = BrandApi.getDefSystemConfig({
    params:{
      brandCode: Conf.BRAND_CODE
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
  }).finally(()=>{
    setTimeout(()=>{
     delete this._sysPromise['default']
    },500);
  })
  return this._sysPromise['default'];
}
//
function getSingleConfig(cfg_prop,fromType="normal"){
  if(this._sysPromise[cfg_prop]){
    return this._sysPromise[cfg_prop]
  }
  this._sysPromise[cfg_prop] = BrandApi.getSystemConfig({
    params:{
      brandCode: Conf.BRAND_CODE,
      cfg_prop: cfg_prop
    },
    other:{
      isShowLoad: true
    }
  }).then(e=>{
    if (e.code == 1) {
      if (!e.data) {
        e.data = {}
      }
      fromType == 'normal' && this.confDataHandle(cfg_prop,e.data);
      return Promise.resolve(e.data);
    }
    return Promise.reject(e);
  }).finally(()=>{
    setTimeout(()=>{
      delete this._sysPromise[cfg_prop]
     },500);
  })
  return this._sysPromise[cfg_prop];
}

export default sysConfigManager.getInstance();