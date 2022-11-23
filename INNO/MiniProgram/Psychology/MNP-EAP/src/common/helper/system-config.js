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
  }

  get sysConf(){
    return this._sysConf;
  }

	get isTest(){
		return this._isTest
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
		return Http(Apis.getCustomerConfig, {
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

	setIsTest(isTest = true){
		this._isTest = isTest
		StorageH.set("ISTEST",isTest);
	}
}

export default sysConfigManager.getInstance();