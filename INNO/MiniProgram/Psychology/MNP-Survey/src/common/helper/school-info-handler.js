import StorageH from "./storage-handler.js";
import PM from "./params-handler";
import { Apis } from "../http/http.api.install.js";
import { Http } from "../http/http.interceptor.js";
const STORAGE_SCHOOL_INFO_KEY = "SCHOOL_INFO";
class schoolInfo {
    static getInstance() {
        if (!schoolInfo.instance) {
            schoolInfo.instance = new schoolInfo();
        }
        return schoolInfo.instance;
    }
    constructor() {
      this.initStorage();
    }
    initStorage(){
        this._schoolInfo = {};
    //   this._schoolInfo = StorageH.get(STORAGE_SCHOOL_INFO_KEY)||{};
    }
    getSchoolInfo(schoolId){
        let schoolInfo = this._schoolInfo||{}; 
        return getSchoolInfo.call(this,schoolId).then(res=>{
            if(res.code == 1){
                schoolInfo = Object.assign({},res.data||{},{inited:true});
                StorageH.set(STORAGE_SCHOOL_INFO_KEY,schoolInfo);
            }
            return schoolInfo
        }) 
    }
    get schoolInfo(){
      return this._schoolInfo||{};
    }
    get schoolId(){
        let schoolId = PM.getParams('schoolId') || 0;
        return schoolId || 0
    }
}

function getSchoolInfo(schoolId) {
	if (!Number(schoolId)) return Promise.reject();
	if(this._schoolInfo.schoolId == schoolId){
		return Promise.resolve(this._schoolInfo);
	}
	return Http(Apis.getSchoolInfo, {
		data: {
			schoolId: schoolId
		}
	})
}

export default schoolInfo.getInstance();