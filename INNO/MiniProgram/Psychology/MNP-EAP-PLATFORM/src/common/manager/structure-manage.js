import {
  Apis
} from "../http/http.api.install.js";
import {
  Http
} from "../http/http.interceptor.js";
import IM from "./identity-manager";
import StorageH from "../helper/storage-handler";

const STORAGE_STRUCTURE_KEY = "STORAGE_STRUCTURE_KEY"

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


  getStructureList() {
    return Http(Apis.getAdminStructureList, {
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

  getStructureByAct(activityId) {
    let structureInfo = StorageH.get(STORAGE_STRUCTURE_KEY) || {}
    return Http(Apis.getActivityStructureList, {
      data: {
        structureId: structureInfo.structureId,
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
    StorageH.set(STORAGE_STRUCTURE_KEY, structureInfo)
  }
}

const Func = {
  _initStorage() {
    this._structureInfo = StorageH.get(STORAGE_STRUCTURE_KEY) || {};
  },
}

export default structureManager.getInstance();