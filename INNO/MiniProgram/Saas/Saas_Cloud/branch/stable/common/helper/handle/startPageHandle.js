import Conf from "../../../conf";
import MyStr from "../../support/utils/string-util.js";
import storeH from '../../helper/handle/storeHandle'
class startPageHandle {
  static getInstance() {
    if (!startPageHandle.instance) {
      startPageHandle.instance = new startPageHandle();
    }
    return startPageHandle.instance;
  }
  constructor() {
    this._releasePage = true;
    this._jumped_startup_page = false;
  } 
  setReleasePage(bool=true){
    this._releasePage = bool||false;
  }
  startPageJump(page,params){
    if (page.route != Conf.STARTUP_PAGE && params.scene){ //旧码 //扫码场景1
      storeH.getStoreAsync().then(()=>{
        let paramsStr = MyStr.getPageParamsStr(params);
        console.log('(扫码途径)需要更新storeCode:',page.route,' 跳去中间页');
        this.setReleasePage(false);
        wx.redirectTo({
          url: "/" + Conf.STARTUP_PAGE + "?" + paramsStr, 
        })
      })
      return true;
    }else if(page.route == Conf.STARTUP_PAGE && params.scene){//扫码场景2
      this.setReleasePage(false); 
      return false;
    }
  }
  get releasePage(){
    return this._releasePage;
  }
} 

export default startPageHandle.getInstance();
