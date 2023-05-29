const STORE_KEY = "STORE_INFO"
import Http from "../../manager/http-manager/index";
import StorageH from "../storage-handler/index";
import LM from "../../manager/login-manager/index";
import PH from "../../helper/params-handler/index";
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
    getVisitStore(cache){
        if(cache && this._storeInfo){
            return Promise.resolve(this._storeInfo);
        }
        let options = PH.paramsJson('options') || {};
        console.log('getVisitStore',options)
        let {staffCode=""} = options.query||{};
        return Http.QT_UserApi.getVisitStore({
            params: {
              staffCode
            }
        }).then(res=>{
            if(res.code == 1){
                this.setStoreInfo(res.data);
            }
            return res;
        })
    }

    changeVisitStore(){
        let options = PH.paramsJson('options') || {};
        let {staffCode,storeCode} = options.query||{};
        console.log('changeVisitStore',options)
        if(LM.isLogin && (staffCode||storeCode)){
            return Http.QT_UserApi.changeVisitStore({
                data: {
                    staffCode,
                    storeCode,
                },
            })
        }
        return Promise.reject("无分销码或店铺码或未登录");
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