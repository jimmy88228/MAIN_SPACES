import StorageH from "../handle/storageHandle.js";

class requestLogManager {
  static getInstance() {
    if (!requestLogManager.instance) {
      requestLogManager.instance = new requestLogManager();
    }
    return requestLogManager.instance;
  }
  constructor() {
    this._logsInThisCircle = {};
  }
  
  saveRequestInfo(req, resp) {
    let url = req && req.url || "";
    if (url.indexOf("ChangeVisitStore") != -1) {this.saveOneReqInfo("ChangeVisitStore", resp)}
    else if (url.indexOf("GetVisitStore") != -1) {this.saveOneReqInfo("GetVisitStore", resp)}
    console.log(req, resp)
  }

  saveOneReqInfo(url, resp){
    this._logsInThisCircle[url] ? 
    this._logsInThisCircle[url].push(resp):
    this._logsInThisCircle[url] = [resp]
  }

  get logsInThisCircle() {
    return this._logsInThisCircle || {}
  }
}
export default requestLogManager.getInstance(); 