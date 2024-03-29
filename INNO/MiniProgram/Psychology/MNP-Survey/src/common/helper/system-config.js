import StorageH from "./storage-handler.js";
import {
	Apis
} from "../http/http.api.install.js";
import {
	Http
} from "../http/http.interceptor.js";
class sysConfigManager {
  static getInstance() {
    if (!sysConfigManager.instance) {
      sysConfigManager.instance = new sysConfigManager();
    }
    return sysConfigManager.instance;
  }
  constructor() {
    this._sysConf = {};
    this._sysPromise = {};
	this._loginConfig = {};
  }
  get sysConf(){
    return this._sysConf;
  }
	getSysConf(name){
		let nameValue = StorageH.get(name);
		this._sysConf[name] = nameValue;
		if(nameValue == undefined || !nameValue){
			return this.getSysConfReq(name);
		} else {
			return Promise.resolve(nameValue)
		}
	}
	getSysConfReq(name){
		if(this._sysPromise[name]) {
			return this._sysPromise[name];
		}
		return Http(Apis.getSystemConfig, {
			data: {
				name: name
			}
		}).then((res)=>{
			if(res.code){
				StorageH.set(name, res.data, 3);
				this._sysConf[name] = res.data;
				return res.data
			}
			return Promise.reject();
		}).finally(()=>{
			setTimeout(()=>{
				delete this._sysPromise[name];
			},1000);
		})
	}
	getLoginConfig(schoolId=0){
		// 暂时不做缓存，需要实时更新配置信息
		// if(this._loginConfig[schoolId])return Promise.resolve(this._loginConfig[schoolId]);
		return Http(Apis.getLoginConfig,{
			data:{
				schoolId
			},
		}).then(res=>{
			// this._loginConfig[schoolId] = res;
			return res;
		})
	}
}

export default sysConfigManager.getInstance();