import LM from "@/common/manager/login-manager.js";
import Wechat1v1Chat from "@/common/helper/wechat-1v1-chat.js"
const StateText = {
    "UNSTART":"未开始",
    "STARTING":"已开始",
    "FINISH":"已结束",  
}
const LoopState = {
    'clear':'clearLoop',
    'start':'checkLoop',
}
export default {
    data() {
        return { 
            isInited:false,
            roomInfo:{},
            onlineInfo:{},
            checkLoopTimer:null,
            LoopTime:3000,
            wechat1v1ChatInit:false,
        }
    },
    methods: { 
        loadData(){
            let params = {
                mobilePhone : this.options.mobilePhone||"",
                roomKey : this.options.roomKey||"",
                isPsyConsultant:this.options.isPsyConsultant == 1
            }
            console.log('loadData',params)
            return (this.$refs.detail && this.$refs.detail.loadData(params).then(data=>{
                if(data){
                    data.stateText = StateText[data.appointmentType]||"";
                    data.timeFrameArr = data.timeFrame && data.timeFrame.split && data.timeFrame.split('-') || [];
                    this.roomInfo = data;
                }
                return data
            }).finally(()=>{
                this.isInited = true;
                this.changeRoomUserState(true);
                this.checkLoop();
            }));
        }, 
        checkRoomUserState(){
            return this.$Http(this.$Apis.checkRoomUserState,{
                data:{
                    isPsyConsultant:this.options.isPsyConsultant == 1,
                    mobilePhone: this.options.mobilePhone||"",
                    roomKey : this.options.roomKey||"",
                }
            }).then(res=>{
                if(res.code){
                    let data = res.data||{};
                    this.onlineInfo = data;
                }
                return res;
            })
        },
        changeRoomUserState(online=false){
            return this.$Http(this.$Apis.changeRoomUserState,{
                data:{
                    isPsyConsultant:this.options.isPsyConsultant == 1,
                    mobilePhone: this.options.mobilePhone||"",
                    roomKey : this.options.roomKey||"",
                    online
                }
            })
        },
        checkLoop(){
            this.clearLoop();
            this.checkRoomUserState().finally(()=>{
                if(this.roomInfo.appointmentType == 'FINISH')return
                this.checkLoopTimer = setTimeout(() => {
                    this.checkLoop();
                }, this.LoopTime);
            });
        },
        clearLoop(){
            clearTimeout(this.checkLoopTimer);
        },
        membersChanged(e){
            console.log('membersChanged',e);
            let state = e&&e.loopState||"";
            LoopState[state] && this[LoopState[state]] && this[LoopState[state]]();
        },
        offListen(listener){
            listener && uni.offVoIPVideoMembersChanged(listener);
            !listener && uni.offVoIPVideoMembersChanged();
        }
    },  
    onShow(){
        if(LM.isLogin){
            this.isInited && this.loadData();
            setTimeout(() => {
                !this.wechat1v1ChatInit && Wechat1v1Chat.setEnable1v1Chat({},{isShowToast:true}).then(()=>{
                    console.log('开始进行监听')
                    Wechat1v1Chat.onVoIPChatMembersChanged((e)=>{
                        
                    });
                    Wechat1v1Chat.onVoIPChatInterrupted((e)=>{
                        
                    });
                    Wechat1v1Chat.onVoIPChatSpeakersChanged((e)=>{
                        
                    });
                    Wechat1v1Chat.onVoIPChatStateChanged((e)=>{
                        
                    }); 
                });
                !this.wechat1v1ChatInit && (this.wechat1v1ChatInit = true);
            }, 1000);
        }
    },
    onHide(){
        console.log('onHide');
        this.changeRoomUserState();
        this.clearLoop();

    },
    onUnload(){
        console.log('onUnload')
        this.changeRoomUserState();
        this.clearLoop();
    },
}