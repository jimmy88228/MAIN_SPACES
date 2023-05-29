import { BrandApi } from "../../manager/http-manager.js"
import Conf from "../../../conf.js"
import StorageH from "../handle/storageHandle.js";
let limitPage = {
  "pages/micro_mall/index/index": true,
  "pages/micro_mall/custom_page/custom_page": true
}
class WelcomeManager {
  static getInstance() {
    if (!WelcomeManager.instance) {
      WelcomeManager.instance = new WelcomeManager();
    }
    return WelcomeManager.instance;
  }
  constructor() {}
  checkWelcomeConf(page){
    page = page || getCurrentPages().pop();
    // 
    let welcomeConf = StorageH.get("welcomeConf");
    // let welcomeConf = this.welcomeConf;
    let p = new Promise((rs,rj)=>{
      if(!limitPage[page.route]){//不在指定页面内
       return rs();
      }
      if(welcomeConf){
        return rs();
      }else{
      return getStartPageConfigList.call(this).then(data=>{
          return rs(data.weapp_start_enable);
        }).catch(()=>{
          return rs();
        })
      }
    });
    return p;
  }
  activeCallback(callback){
    console.log(callback,typeof(callback));
    if(typeof(callback) == "function"){
      this._activeCallbackEvent = callback;
    }
  }
  activeCallbackEvent(){
    if(typeof(this._activeCallbackEvent) == "function"){
      this._activeCallbackEvent();
    }
  }
}
function getStartPageConfigList(){
  return BrandApi.getStartPageConfigList({
      params: {
          brandCode: Conf.BRAND_CODE,
      },
      other: {
          isShowLoad: true
      }
  }).then(res => {
      if (res.code == 1) {
          let data = res.data || {};
          this.welcomeConf = data;
          StorageH.set("welcomeConf",data, 60);
          return data
      }
      return Promise.reject();
  })
}

export default WelcomeManager.getInstance();