import LM from "../../manager/login-manager/index";
import Utils from "../../utils/normal/index";
import storeH from "../../helper/store-helper/index.js" 
function defaultSet(page) {
    if(page && page.onShareAppMessage){
        return {
            onShareAppMessage : function (...args){
                let shareData = page.onShareAppMessage.call(this, ...args)||{};
                if (LM.isLogin && LM.shareCode) {
                    shareData = {...shareData,fromUser:LM.shareCode};
                }
                let staffInfo = LM.staffInfo||{};
                let storeInfo = storeH.storeInfo||{};
                let staffCode = storeInfo.staffCode||staffInfo.staffCode,storeCode=storeInfo.storeCode;
                if (staffCode) {
                    shareData = {...shareData,staffCode} 
                }
                if(storeCode){
                    shareData = {...shareData,storeCode} 
                }
                let path = (shareData.path||this.route) + '?' + Utils.getPageParamsStr(shareData);
                shareData.path = path;
                console.log('shareData',shareData)
                return (shareData || {})
            }
        }
    }else{
        return {};
    }
}

export {
    defaultSet
}