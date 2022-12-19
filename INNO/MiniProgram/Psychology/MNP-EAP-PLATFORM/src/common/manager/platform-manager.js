import {
  Apis
} from "../http/http.api.install.js";
import {
  Http
} from "../http/http.interceptor.js";
import LM from "./login-manager";
import SSXI from "@/common/manager/showSXIndex-manager.js";
import StorageH from "../helper/storage-handler";

const STORAGE_PLATFORM_KEY = "STORAGE_PLATFORM_KEY"

//platformManager记录主体列表 所选主体信息
class platformManager {
  static getInstance() {
    if (!platformManager.instance) {
      platformManager.instance = new platformManager();
    }
    return platformManager.instance;
  }
  constructor() {
    Func._initStorage.call(this);
  }

  get platformInfo() {
    return this._platformInfo || StorageH.get(STORAGE_PLATFORM_KEY)
  }


  getPlatformList(mobilePhone = "",showLoading) {
    return Http(Apis.checkUserCustomerPlatform, {
      data: {
        mobilePhone
      },
      other:{
        isShowLoad:showLoading
      }
    }).then((res) => {
      if (res.code == 1) {
        let data = res.data || [];
        return Promise.resolve(data)
      } else {
        return Promise.reject(res)
      }
    }).catch(err => {
      return Promise.reject(err)
    });
  }

  setLastLoginCustomer() {
    return LM.getWxSessionIdAsync().then(sessionId => {
      return Http(Apis.getLastLoginCustomerPlatform, {
        data: {
          sessionId: sessionId || LM.sessionId || 0
        },
        other: {
          isShowLoad: true
        }
      }).then((res) => {
        if (res.code == 1) {
          let data = res.data || {};
          this.savePlatformInfo(res.data)

          return data
        } else {
          return Promise.reject(res)
        }
      }).catch(err => {
        return Promise.reject(err)
      });
    })
  }

  setCustomerInfo() {
    return Http(Apis.getCustomerInfo).then((res) => {
      if (res.code == 1) {
        let data = res.data || {};
        this.savePlatformInfo(res.data)

        return Promise.resolve(data)
      } else {
        return Promise.reject(res)
      }
    }).catch(err => {
      return Promise.reject(err)
    });
  }

  savePlatformInfo(platformInfo = {}) {
    this._platformInfo = {
      appCode: this._platformInfo.appCode,
      ...platformInfo
    } || {};
    StorageH.set(STORAGE_PLATFORM_KEY, platformInfo)
		SSXI.getShowSXIndexConfig( { isRefresh: true })
    uni.$emit("changeSXIndexConfig")
  }

}

const Func = {
  _initStorage() {
    this._platformInfo = StorageH.get(STORAGE_PLATFORM_KEY) || {};
  },
}

export default platformManager.getInstance();