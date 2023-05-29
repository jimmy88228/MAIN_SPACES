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
      this.lastShareInfo = {};
      if(storeInfo){
        this._storeInfo = storeInfo;
      }
    }

    initShareInfo(){
      let options = PH.paramsJson('options') || {};
      let {staffCode} = options.query||{};
      staffCode && (this.lastShareInfo.staffCode = staffCode); //有新的staffCode才赋值
      return this.lastShareInfo.staffCode;
    }

    getVisitStore(){
        return Http.QT_UserApi.getVisitStore({
            params: {
              staffCode : this.initShareInfo() || ""
            }
        }).then(res=>{
            if(res.code == 1){
              let data = res.data||{};
              this.setStoreInfo(data); //保存当前店铺信息
              let {needChange,staffCode} = data;
              if(needChange){ //需要调change接口
                this.lastShareInfo.staffCode = staffCode;
                return this.changeVisitStore(staffCode);
              }else{
                return res;
              }
            }
            return res;
        })
    }

    changeVisitStore(staffCode,storeCode){
        if(LM.isLogin && (staffCode||storeCode)){
            return Http.QT_UserApi.changeVisitStore({
                data: {
                    staffCode,
                    storeCode,
                },
            })
        }
        return Promise.reject(`无分销码或店铺码或未登录${LM.isLogin,staffCode,storeCode}`);
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