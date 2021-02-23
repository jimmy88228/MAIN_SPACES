 

import WxApi from "../../../../helper/wx-api-helper";
class DocumentManager {
  constructor (){}
  static getInstance(){
    if(!DocumentManager.instance){
      DocumentManager.instance = new DocumentManager();
    }
    return DocumentManager.instance
  }
  downFile(src=""){
    let p = new Promise((rs,rj)=>{
      WxApi.downloadFile({
        url:src||""
      }).then(res=>{
        console.log('downloadFile',res);
        rs(res);
      }).catch(e=>{
        console.log('downloadFile',e);
        rj(e);
      })
    })
    return p;
  }
  openFile(src=""){
    let p = new Promise((rs,rj)=>{
      WxApi.openDocument({
        filePath:src||"",
      }).then(res=>{
        console.log('openFile',res);
        rs(res);
      }).catch(e=>{
        console.log('openFile',e);
        rj(e);
      })
    })
    return p;
  }
  previewFile(src=""){
    return this.downFile(src).then(res=>{
      let path =  res.tempFilePath || "";
      return this.openFile(path).then(resOpen=>{
        let result = {
          ...resOpen,
          tempFilePath:path
        };
        return Promise.resolve(result);
      });
    });
  }
}
export default DocumentManager.getInstance();
