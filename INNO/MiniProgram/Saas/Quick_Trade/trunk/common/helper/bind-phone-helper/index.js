import LM from "../../../common/manager/login-manager/index";
import {QT_RegApi} from "../../../common/manager/http-manager/index";
import SMH from "../../../common/helper/show-message-helper/index"
class BindPhoneHelper{ 
    constructor() { 
    }
    static getInstance() {
      if (!BindPhoneHelper.instance) {
        BindPhoneHelper.instance = new BindPhoneHelper();
      }
      return BindPhoneHelper.instance;
    }  
    getPhoneNumber(e) {
        let detail = e.detail||{};
        if (detail.errMsg && detail.errMsg.indexOf("ok") == -1){return Promise.reject()};
        return bindWxPhone.call(this, detail); 
    }
    changePhoneNumber(e){
        let detail = e.detail||{};
        if (detail.errMsg && detail.errMsg.indexOf("ok") == -1){return Promise.reject()};
        return changeWxPhone.call(this, detail);
    } 
    refreshSession(e){
        let msg = e&&e.msg||"";
        let title = msg == '未知错误' ? "会话已更新，请重试":msg; 
        return new Promise((rs,rj)=>{
            setTimeout(function () {
                LM.createWxSessionId().ignore(() => {
                    SMH.showToast({
                        title
                    });
                    return rj(e)
                }) 
            }, 600); 
        })
    }
  }

  
function bindWxPhone(params) {
    return QT_RegApi.bindWxPhone({
      data: {
        encryptedData: params.encryptedData,
        iv: params.iv,
        sessionId: LM.sessionId,
      },
      other: {
        isShowLoad: true
      }
    }).then(res => {
      if (res.code == 1 && res.data) {
        return LM.reSetSimpleInfo();
      }
      return Promise.reject(res);
    }).catch(e => {
        return this.refreshSession(e);
    })
}
//
function changeWxPhone(params){
  return QT_RegApi.changeWxPhone({
    data: {
      encryptedData: params.encryptedData,
      iv: params.iv,
      sessionId: LM.sessionId,
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1 && res.data) {
      return LM.reSetSimpleInfo();
    }
    return Promise.reject(res);
  }).catch(e => { 
    return this.refreshSession(e);
  })
}
export default BindPhoneHelper.getInstance();