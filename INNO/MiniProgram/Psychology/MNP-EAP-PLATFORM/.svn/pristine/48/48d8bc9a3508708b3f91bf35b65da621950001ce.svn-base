import StorageH from "./storage-handler.js";
import PLM from "@/common/manager/platform-manager.js"
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

	get sysConf() {
		return this._sysConf;
	}

	get isTest() {
		return this._isTest
	}
	// 供应商给主体的权限配置
	getSysConfByCustomer(name, refresh = false) {
		// refresh为true时立刻刷新缓存
		let nameValue = StorageH.get(name);
		this._sysConf[name] = nameValue;
		if (refresh || typeof (nameValue) == 'undefined' || !nameValue) {
			return this.getSysConfReq(name, "customer");
		} else {
			return Promise.resolve(nameValue)
		}
	}
	// 供应商自己的权限配置
	getSysConf(name, refresh = false) {
		// refresh为true时立刻刷新缓存
		let nameValue = StorageH.get(name);
		this._sysConf[name] = nameValue;
		if (refresh || typeof (nameValue) == 'undefined' || !nameValue) {
			return this.getSysConfReq(name, "platform");
		} else {
			return Promise.resolve(nameValue)
		}
	}

	getSysConfReq(name, type) {
		if (this._sysPromise[name]) {
			return this._sysPromise[name];
		}
		let api = "";
		let formData = {}
		switch (type) {
			case "customer":
				api = Apis.getCustomerConfigPlatform;
				formData = {
					appCode:PLM.platformInfo.appCode,
					configKey:name
				}
				break
			default:
				api = Apis.getSupplierConfigPlatform;
				formData = {
					name
				}
				break
		}
		return Http(api, {
			data: {
				...formData
			}
		}).then((res) => {
			if (res.code) {
				StorageH.set(name, res.data, 3);
				this._sysConf[name] = res.data;
				return res.data
			}
			return Promise.reject();
		}).finally(() => {
			setTimeout(() => {
				delete this._sysPromise[name];
			}, 1000);
		})
	}

	setIsTest(isTest = true) {
		this._isTest = isTest
		StorageH.set("ISTEST", isTest);
	}
}

export default sysConfigManager.getInstance();