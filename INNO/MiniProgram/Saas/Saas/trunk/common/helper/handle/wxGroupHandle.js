import LM from "../../manager/login-manager.js";
import Conf from "../../../conf";
import { RegApi } from "../../manager/http-manager.js";
import Wxapi from "../../helper/wx-api-helper.js"
import EB from "../../support/tools/event-bus.js";
class WxGroupManager {
  static getInstance() {
    if (!WxGroupManager.instance) {
      WxGroupManager.instance = new WxGroupManager();
    }
    return WxGroupManager.instance;
  }
  constructor() {
    
  }
  get groupId(){
    return this._groupId || 0;
  }
  get isGetGroupId(){
    return this._isGetGroupId || false;
  }
  getShareTicket(ops){
    this._isGetGroupId = false;
    ops = ops || {};
    this.shareTicket = ops;
    return LM.getWxSessionIdAsync().then(res=>{
      return this.handleTicket(this.shareTicket).then((GId)=>{
        this._groupId = GId || 0;
        this._isGetGroupId = true;
        EB.call("GroupMsgChange", this);
        return GId;
      })
    });
  }
  handleTicket(shareTicket, callback){
    return new Promise((rs, rj)=>{
      if (shareTicket) {
        let that = this;
        Wxapi.getShareInfo({
          shareTicket: shareTicket,
        }).then(res => {
          let encryptedData = res.encryptedData || "";
          let iv = res.iv || "";
          return getGroupUserInfo.call(that, encryptedData, iv, rs)
        }).catch(e => {
          console.log('报错getShareInfo--catch',e)
          return rs(0);
        })
      }else{
        return rs(0);
      }
    })
  }
  initStatus(){
    this._isGetGroupId = false;
  }

}
function getGroupUserInfo(encryptedData, iv, rs) {
  return RegApi.getGroupUserInfo({
    data: {
      "sessionId": LM.sessionId,
      "encryptedData": encryptedData,
      "iv": iv
    },
    other: {
      isShowLoad: false
    }
  }).then(res=>{
    let data = res.data || {};
    let id = data && data.openGId || 0;
    console.log("获取群ID",id)
    if(typeof rs == 'function'){
      return rs(id);
    }
    return Promise.resolve(id);
  }).catch(()=>{
    if (typeof rs == 'function') {
      return rs(0);
    }
    return Promise.resolve(0);
  })
}

export default WxGroupManager.getInstance();
