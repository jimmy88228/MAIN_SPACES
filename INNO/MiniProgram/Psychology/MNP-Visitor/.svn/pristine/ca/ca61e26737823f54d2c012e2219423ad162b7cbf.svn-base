import AuthorizeSet from "./authorize-set.js"
import SMH from "@/common/helper/show-msg-handler.js";
const Options = {
  // duration: 10000,
  // numberOfChannels: 1,
  format: 'mp3',
  frameSize:50,
}
class recorderManager {
    static getInstance() {
        if (!recorderManager.instance) {
            recorderManager.instance = new recorderManager();
        }
        return recorderManager.instance;
    }
    constructor() { 
      // this._recordM = null;
      this.options = JSON.parse(JSON.stringify(Options));
		}
    // get recordM(){
    //   return this._recordM;
    // }
    getRecorder(options={},extra={}){
      if(options){
        for(let key in options){
          this.options[key] = options[key];
        }
      }
      let _result = {},_authorize=false;
      return AuthorizeSet.checkAuthorize('record',(authorize, result)=>{
        extra.isShowToast && SMH.showToast({title:"开始录制语音"})
        _authorize=authorize
        _result = result;
      },()=>{
        extra.isShowToast && SMH.showToast({title:"授权失败,无法录音",icon:'fail'})
      },true).then(()=>{
        if(_authorize){
          if(!_result.isReAuth){
            let recordM = wx.getRecorderManager();
            recordM.onInterruptionBegin(()=>{
              recordM.stop();
            })
            recordM.onError((result)=>{
              console.log('onError',result)
              let errMsg = result.errMsg || '';
              if(errMsg){
                if(errMsg.indexOf('permission denied') != -1){
                  SMH.showToast({title: "请开启手机的录音权限"})
                } else {
                  SMH.showToast({title: "录音未授权,请开启权限"})
                }
              }
            })
            return {recordM,options:this.options};
          } else {
            SMH.showToast({title:"已授权, 请重新录音"})
            return Promise.reject();
          }
        }
      })
    }
    check(isShowToast){
      let authorize = true;
      return AuthorizeSet.checkAuthorize('record',(isAuthorize,isAlreadyAuthorize)=>{
        if(!isAlreadyAuthorize){
          isShowToast && SMH.showToast({title:"授权成功"});
        }
      },()=>{
        authorize = false;
        isShowToast && SMH.showToast({title:"授权失败,无法录音",icon:'fail'})
      }).then(()=>{
        return authorize;
      })
    }
    
}
export default recorderManager.getInstance();