import AuthorizeSet from "./authorize-set.js"
import SMH from "@/common/helper/show-msg-handler.js";
import UniApi from "@/common/support/tools/uni-api-promise.js"
const SetEnableOptions = { 
    enable: true,
    minWindowType: 1,
}
const Join1v1ChatOptions = { 
    roomType:"video",
    // caller:{},
    // listener:{},
    // disableSwitchVoice:true,
}
const ErrCodeText = {
    '-20000':"未开通双人通话",
    '-20001':"当前设备不支持",
    '-20002':"正在通话中",
    '-20003':"其它小程序正在通话中",
    '-30000':"内部系统错误",
    '-30001':"微信缺失相机权限",
    '-30002':"微信缺失录音权限",
    '-30003':"小程序缺失录音权限",
    '-30004':"小程序缺失相机权限",
    '-1':"当前已在房间内",
    '-2':"录音设备被占用",
    '-3':"加入会话期间异常",
    '-1000':"系统错误",
};
const ScopeText = {
    'record':"麦克风",
    'camera':"摄像头",
}
class chat1v1Manager {
    static getInstance() {
        if (!chat1v1Manager.instance) {
            chat1v1Manager.instance = new chat1v1Manager();
        }
        return chat1v1Manager.instance;
    }
    constructor() { 
      this.SetEnableOptions = JSON.parse(JSON.stringify(SetEnableOptions));
      this.Join1v1ChatOptions = JSON.parse(JSON.stringify(Join1v1ChatOptions));
    } 
    setEnable1v1Chat(options,extra={}){ 
        let newOptions = this.SetEnableOptions;
        if(options){
            newOptions = {
                ...this.SetEnableOptions,
                ...options
            } 
            console.log('newOptions setEnable1v1Chat',newOptions)
        }
        return this.check('record',true).then(recordBool=>{
            if(recordBool){
                return this.check('camera',extra.isShowToast).then(cameraBool=>{
                    if(cameraBool){
                        return UniApi.getSetting().then(getSetting => {
                            let authSetting = getSetting.authSetting;
                            if (authSetting['scope.record'] != true) { //重新检测record
                                this.setEnable1v1Chat(options,extra={});
                                return Promise.reject()
                            }else{
                                return UniApi.setEnable1v1Chat(newOptions).then(res=>{
                                    console.log('setEnable1v1Chat',res)
                                    return res;
                                }).catch(e=>{
                                    console.log('setEnable1v1Chat catch',e)
                                    if(extra.isShowToast){ 
                                        this.showErr(e);
                                    }
                                    return Promise.reject(e);
                                })
                            }
                        })
                    }else{
                        return Promise.reject();
                    }
                })
            }else{
                return Promise.reject();
            }
        });
    }
    join1v1Chat(options,extra={}){
        let newOptions = this.Join1v1ChatOptions;
        if(options){
            newOptions = {
                ...this.Join1v1ChatOptions,
                ...options
            }
        }
        console.log('newOptions join1v1Chat',newOptions)
        return UniApi.join1v1Chat(newOptions).then(res=>{ 
            return res;
        }).catch(e=>{
            console.log('join1v1Chat catch',e)
            if(extra.isShowToast){ 
                this.showErr(e);
            }
            return Promise.reject(e);
        })
    }
    onVoIPChatSpeakersChanged(callBack){
        console.log('开始监听通话状态 onVoIPChatSpeakersChanged')
        uni.onVoIPChatSpeakersChanged((e)=>{
            // console.log('回调监听通话状态 onVoIPChatSpeakersChanged',e); //这个会一直回调
            callBack && typeof(callBack) == 'function' && callBack(e);
        })
    }
    onVoIPChatMembersChanged(callBack){
        console.log('开始监听成员变化 onVoIPChatMembersChanged');
        uni.onVoIPChatMembersChanged((e)=>{
            console.log('回调监听成员变化 onVoIPChatMembersChanged',e);
            callBack && typeof(callBack) == 'function' && callBack(e);
        })
    }
    onVoIPChatStateChanged(callBack){
        console.log('开始监听房间状态 onVoIPChatStateChanged')
        uni.onVoIPChatStateChanged((e)=>{
            console.log('回调监听房间状态 onVoIPChatStateChanged',e);
            callBack && typeof(callBack) == 'function' && callBack(e);
        })
    } 
    onVoIPVideoMembersChanged(callBack){
        console.log('开始监听视频状态 onVoIPVideoMembersChanged')
        uni.onVoIPVideoMembersChanged((e)=>{
            console.log('回调监听视频状态 onVoIPVideoMembersChanged',e);
            callBack && typeof(callBack) == 'function' && callBack(e);
        })
    } 
    onVoIPChatInterrupted(callBack){
        console.log('开始监听中断 onVoIPChatInterrupted')
        uni.onVoIPChatInterrupted((e)=>{
            console.log('回调监听中断 onVoIPChatInterrupted',e);
            callBack && typeof(callBack) == 'function' && callBack(e);
        })
    } 
    showErr(e){
        let errCode = e&&e.errCode||"";
        let err = errCode&&ErrCodeText[errCode] || e&&e.errMsg || "发起失败,请重新再试";
        SMH.showToast({title:err});
    }
    check(scope,isShowToast){
      let authorize = false;
      return AuthorizeSet.checkAuthorize(scope,
        (isAuthorize,isAlreadyAuthorize)=>{
            authorize = isAuthorize;
            if(!isAlreadyAuthorize){
                isShowToast && SMH.showToast({title:"授权成功"});
            }
        },
        ()=>{
            authorize = false;
            isShowToast && SMH.showToast({title:`请打开${ScopeText[scope]||''}授权`})
        },
        true,
      ).then(()=>{
        return authorize;
      })
    }
    
}
export default chat1v1Manager.getInstance();