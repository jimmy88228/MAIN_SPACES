import {
  Apis
} from "../http/http.api.install.js";
import {
  Http
} from "../http/http.interceptor.js";
import IM from "./identity-manager";
import LM from "./login-manager";
import StorageH from "../helper/storage-handler";
import SMH from "../helper/show-msg-handler.js";

const STORAGE_CLASSID_KEY = "STORAGE_CLASSID_KEY"

//structureManager记录组织列表 组织id 
class structureManager {
  static getInstance() {
    if (!structureManager.instance) {
      structureManager.instance = new structureManager();
    }
    return structureManager.instance;
  }
  constructor() {
    Func._initStorage.call(this);
  }

  get structureInfo() {
    return this._structureInfo || {}
  }
  get structureList() {
    return this._classList || []
  }


  getStructureList() {
    console.log('this._classList',this._classList)
    // if(this._classList && this._classList.length>0)return Promise.resolve(this._classList); 
    return IM.getTeacherUserInfo().then((data)=>{
      console.log('getTeacherUserInfo',data)
      // if(LM.recordId>0){
        this._classList = data.classList||[];
      // }
      return data.classList
    }).catch(()=>{
      SMH.showToast({
        title:"账号已禁用，请退出重新登录"
      })
      setTimeout(() => {
        LM.logout("all")
        uni.redirectTo({
          url: "/pages/startup/startup"
        })
      }, 1500)
      return Promise.reject()
    })
  }

  getStructureByAct(activityId) {
    return Http(Apis.getClazzList, {
      data: {
        activityId
      },
      other: {
        isShowLoad: true
      }
    }).then((res) => {
      if (res.code == 1) {
        let data = res.data || [];
        return data
      }
    }).catch(err => {
      return Promise.reject(err)
    });
  }

  saveStructureInfo(structureInfo) {
    this._structureInfo = structureInfo || {};
    StorageH.set(STORAGE_CLASSID_KEY, structureInfo)
  }
}

const Func = {
  _initStorage() {
    this._structureInfo = StorageH.get(STORAGE_CLASSID_KEY) || {};
    this._classList = [];
  },
}

export default structureManager.getInstance();