const STORE_KEY = "STORE_INFO"
import Http from "../../manager/http-manager/index";
import StorageH from "../storage-handler/index";
import LM from "../../manager/login-manager/index"
class storeManager {
    static getInstance() {
      if (!storeManager.instance) {
        storeManager.instance = new storeManager();
      }
      return storeManager.instance;
    }

    constructor() { 
      let storeInfo = StorageH.get(STORE_KEY);
      if(storeInfo){
        this._storeInfo = storeInfo;
      }
    }
    getVisitStoreByLogin(){
        console.log('getVisitStoreByLogin')
        return LM.loginAsync().ignore(()=>{
            return this.getVisitStore(true);
        })
    }
    getVisitStore(cache, options){
        if(cache && this._storeInfo){
            return Promise.resolve(this._storeInfo);
        }
        return Http.QT_UserApi.getVisitStore({
            params: {
              staffCode: options.staffCode || ""
            }
        }).then(res=>{
            if(res.code == 1){
                this.setStoreInfo(res.data);
            }
            return res;
        })
    }

    changeVisitStore(params){
        // params.staffCode = "KL011";
        let {staffCode,storeCode}=params;
        if(staffCode||storeCode){
            return Http.QT_UserApi.changeVisitStore({
                data: {
                    staffCode,
                    storeCode,
                },
            })
        }
        return Promise.reject("无分销码或店铺码");
    }
    
    setStoreInfo(info){
        this._storeInfo = info||{};
        StorageH.set(STORE_KEY,this._storeInfo);
    }

    get storeInfo(){
        return this._storeInfo || {};
    }
}

export default storeManager.getInstance();