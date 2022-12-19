import StorageH from "./storage-handler.js";
import ScanCode from "./scan-code-handler.js";
class paramsManager {
    static getInstance() {
        if (!paramsManager.instance) {
            paramsManager.instance = new paramsManager();
        }
        return paramsManager.instance;
    }
    constructor() {
			this._appParams = StorageH.get("PAGE_PARAMS_JSON") || {};
			console.log('进来 params初始化',this._appParams)
		} 
		initParams(key, data){
			this.setParams(key, data);
		}
		setParams(key, data){
			this._appParams = this._appParams || {};
			this._appParams[key] = data;
			this.saveParams();
		}
		saveParams(){
			console.log('saveParams',this._appParams)
			StorageH.set("PAGE_PARAMS_JSON", this._appParams);
		}
		getParams(key){
			if(key){
				console.log('getParams',key,this._appParams[key])
				return this._appParams[key] || null;
			}
			return null;
		}

		get appParams(){
			return this._appParams;
		}
}
export default paramsManager.getInstance();