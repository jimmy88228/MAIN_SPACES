import { UserApi } from "../../../../../common/manager/http-manager/index";
import StorageH from "../../../../../common/helper/storage-handler/index";
class AddressHandle {
  static getInstance() {
    if (!AddressHandle.instance) {
      AddressHandle.instance = new AddressHandle();
    }
    return AddressHandle.instance;
  }

  getRegionListSync(showLoad = true) {
    if (this.regionList.length) return Promise.resolve(this.regionList);
    else if (this._getRegionListHandle) return this._getRegionListHandle;
    return this._getRegionListHandle = UserApi.getAllRegionList({
      other: {
        isShowLoad: showLoad
      }
    })
      .then(res => {
        if (res.code == 1) {
          let regionList = res.data || [];
          this.saveRegionList(regionList);
          return Promise.resolve(regionList);
        }
        return Promise.reject(res.msg || "获取地址列表失败");
      })
      .finally(() => {
        this._getRegionListHandle = null;
      })
  }

  saveRegionList(regionList = []) {
    if (regionList.length) {
      StorageH.set("regionList", regionList)
    }
    return regionList
  }

  get regionList(){
    return StorageH.get("regionList") || [];
  }
}

export default AddressHandle.getInstance()