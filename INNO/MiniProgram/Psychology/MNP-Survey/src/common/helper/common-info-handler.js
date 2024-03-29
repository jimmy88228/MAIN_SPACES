import StorageH from "../helper/storage-handler.js";
import { Apis } from "../http/http.api.install.js";
import { Http } from "../http/http.interceptor.js";
const STORAGE_CUSTOMER_INFO_KEY = "CUSTOMER_INFO";
class commonInfo {
    static getInstance() {
        if (!commonInfo.instance) {
            commonInfo.instance = new commonInfo();
        }
        return commonInfo.instance;
    }
    constructor() {
      this.initStorage();
    }
    initStorage(){
      this._customerInfo = StorageH.get(STORAGE_CUSTOMER_INFO_KEY)||{};
    }
    getCustomerInfo(){
      let customerInfo = this._customerInfo||{};
      // if(customerInfo && customerInfo.inited){
      //   return Promise.resolve(customerInfo);
      // }else{
        return getCustomerInfoApi().then(res=>{
          if(res.code == 1){
            customerInfo = Object.assign({},res.data||{},{inited:true});
            StorageH.set(STORAGE_CUSTOMER_INFO_KEY,customerInfo);
          }
          return customerInfo
        })
      // }
    }
    get commonInfo(){
      return this._commonInfo||{};
    }
}

function getCustomerInfoApi(){
  return Http(Apis.getCustomerInfo, {
    data: {},
  })
}

export default commonInfo.getInstance();