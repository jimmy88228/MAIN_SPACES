<template> 
    <!-- <safe-area areaType="paddingBottom" class="btn-fixed"> -->
    <div class="btn-fixed" :class="{disabled:roomInfo.appointmentType == 'FINISH'}">
        <div class="tips-box flex-c-c">
            <image :src="staticAddress+'/common/phone.png'" class="img-phone" mode="aspectFit"></image>
            <div>如果无法进入咨询请拨打客服热线</div>
        </div>
        <div class="btn-box">
            <div class="btn flex-c-c" @click="enter">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import safeArea from "@/components/safe-area/index.vue"
import Wechat1v1Chat from "@/common/helper/wechat-1v1-chat.js"
const app = getApp();
const pageOption = Page.BaseComp({
    components: {
        safeArea,
    },
    props: {
        onlineInfo:{
            type:Object,
            default:()=>({})
        },
        roomInfo:{
            type:Object,
            default:()=>({})
        },
    },
    computed:{ 
    },
    data() {
        return { 
            enterLoading:false,
        }
    },
    methods: {
        enter(){
            if(this.enterLoading)return;
            this.setLoading(true);
            return Wechat1v1Chat.setEnable1v1Chat({},{isShowToast:true}).then(res=>{
                console.log('进来 setEnable1v1Chat then',res)
                if(!this.onlineInfo.openid){
                    app.SMH.showToast({title:"对方还不在房间内"});
                    return
                }
                let chatParams = {
                    caller:{
                        nickname:app.IM.userInfo.userName||"发起者",
                        openid:app.LM.openId||"",
                        headImage:app.IM.userInfo.profilePicture||""
                    },
                    listener:{
                        nickname:this.roomInfo.userName||"接收者",
                        openid:this.onlineInfo.openid||"",
                        headImage:this.roomInfo.profilePicture||""
                    },
                    roomType:this.roomInfo.serviceType||'video'
                }
                return Wechat1v1Chat.join1v1Chat(chatParams,{isShowToast:true}).then((res)=>{
                    console.log('进来 join1v1Chat then',res);
                    this.$emit('enter');
                    return res;
                }).catch(e=>{
                    return Promise.reject(e)
                })
            }).catch(e=>{
                return Promise.reject(e)
            }).finally(()=>{
                console.log('进来 finally');
                this.setLoading(false);
            })
            // this._checkLogin().then(()=>{
            // })
        },
        setLoading(bool){
            this.enterLoading = !!bool;
            app.SMH[bool?'showLoading':'hideLoading']();
        }
    },
})
export default pageOption
</script>

<style lang="scss" scoped>  
.btn-fixed{
    position: fixed;
    left: 0;
    bottom: 0;
}
.btn-box{
    padding: 30rpx;
    box-sizing: border-box;
    background:#FFFFFF; 
} 
.btn{
    width: 690rpx;
    height: 100rpx;
    border-radius: 10rpx;   
    background: #21B014;
    color: #fff;
    font-size: 32rpx;
}   
.disabled{
    .btn{
        color: #ACACAC;
        background: #F1F1F1;
        pointer-events: none;
    }
} 
.tips-box{
    padding: 12rpx 30rpx;
    box-sizing: border-box;
    font-size: 20rpx;
    color: #b2b2b2;
    background-color: rgba($color: #fff, $alpha: 0.78);
    width: 400rpx;
    height: 64rpx;
    border-radius: 60rpx;
    margin: 0 auto;
    margin-bottom: 18rpx;
}
.img-phone{
    width: 19rpx;
    height: 19rpx;
    margin-right: 10rpx;
}
</style> 
