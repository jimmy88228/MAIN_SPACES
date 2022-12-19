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
			StorageH.set("PAGE_PARAMS_JSON", this._appParams);
		}
		getParams(key){
			if(key){
				return this._appParams[key] || null;
			}
			return null;
		}
		get appParams(){
			return this._appParams;
		}
}
export default paramsManager.getInstance();