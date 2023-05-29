import Conf from "../../../conf";
import MyStr from "../../support/utils/string-util.js";

class startPageHandle {
  static getInstance() {
    if (!startPageHandle.instance) {
      startPageHandle.instance = new startPageHandle();
    }
    return startPageHandle.instance;
  }
  constructor() {
    this._releasePage = true;
  } 
  setReleasePage(bool=true){
    this._releasePage = bool||false;
  }
  startPageJump(page,params){
    if (page.route != Conf.STARTUP_PAGE && params.scene){ //旧码
      let paramsStr = MyStr.getPageParamsStr(params);
      console.log('页面',page.route,' 跳去中间页');
      this.setReleasePage(false);
      wx.redirectTo({
        url: "/" + Conf.STARTUP_PAGE + "?" + paramsStr, 
      })
      return true;
    }else{
      if(page.route == Conf.STARTUP_PAGE && params.scene){
        this.setReleasePage(false);
      }
      return false;
    }
  }
  get releasePage(){
    return this._releasePage;
  }
} 

export default startPageHandle.getInstance();
