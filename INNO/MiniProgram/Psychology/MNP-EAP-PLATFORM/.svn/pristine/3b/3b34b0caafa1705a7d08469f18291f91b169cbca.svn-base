import Sysm from "@/common/helper/system-config.js";
import StorageH from "../helper/storage-handler";
import PLM from "@/common/manager/platform-manager.js";

const STORAGE_SHOW_SUPPLIER_HOMEPAG = "show_supplier_homepag";

//
class ShowSXIndexManager {
  static getInstance() {
    if (!ShowSXIndexManager.instance) {
      ShowSXIndexManager.instance = new ShowSXIndexManager();
    }
    return ShowSXIndexManager.instance;
  }
  constructor() {
    Func._initStorage.call(this);
  }
  get showSXIndex() {
    let _showSXIndex = this._showSXIndex || StorageH.get(STORAGE_SHOW_SUPPLIER_HOMEPAG)
    return _showSXIndex;
  }
  getShowSXIndexConfig(config = {}){
    config = config || {};
    let { isRefresh = false } = config;
    if(isRefresh){
      this.getConfigHold = null;
    }
    if(!PLM.platformInfo.appCode){
      this.getConfigHold = null;
      return Promise.reject()
    }
    if(this.getConfigHold) return this.getConfigHold.then(()=>{
      if (config.isHome) {
        Func._pageTarget(this._showSXIndex)
      }
      return this._showSXIndex
    })
    this.getConfigHold =  Sysm.getSysConfByCustomer("show_supplier_homepage",true).then((res)=>{
        this._showSXIndex = res;
        if (config.isHome) {
          Func._pageTarget(this._showSXIndex)
        }
        return res
    })
    return this.getConfigHold
  }
}
const Func = {
  _initStorage() {
    this._showSXIndex = "";
  },
  _pageTarget(showSXIndex){
    let url = showSXIndex == 1 ? '/pages/index/index' : '/pages/platform-index/platform-index'
    uni.redirectTo({
      url: url,
      fail: (error)=>{
        uni.switchTab({
          url: url
        })
      }
    })
  }
}
export default ShowSXIndexManager.getInstance();