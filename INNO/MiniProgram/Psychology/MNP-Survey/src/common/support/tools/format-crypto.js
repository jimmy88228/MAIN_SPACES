import CryptoJS from "crypto-js";
import strH from "@/common/support/utils/string-util.js";

export default {
  decryptAES(paramsKey) {
    console.log("decryptAES", paramsKey);
    let decodeURIParamsKey = decodeURIComponent(paramsKey)
    let paramsStr = CryptoJS.AES.decrypt(decodeURIParamsKey, 'paramsKey').toString(CryptoJS.enc.Utf8);
    paramsStr.indexOf("?") == -1 && (paramsStr = "?" + paramsStr);
    let params = strH.getUrlParam(paramsStr.replace(/\"/g, ''));
    return params;
  },
  encryptAES(url) {
    let {path,params} = strH.getUrlParam(url,true)
    let pathParams = ""
    for (let i in params) {
      pathParams = pathParams ? pathParams + "&" + i + "=" + params[i] : i + "=" + params[i];
    }
    console.log("params", params);
    if(!pathParams){
      return url;
    }
    let AESpathParams = CryptoJS.AES.encrypt(pathParams.toString(), 'paramsKey').toString();
    path = path + "?paramsKey=" + encodeURIComponent(AESpathParams);
    return path;
  }
}