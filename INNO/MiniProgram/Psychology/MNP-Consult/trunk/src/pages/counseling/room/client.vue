<template>
    <div class="room flex flex-col">
        <page-nav isHideHome>预约信息</page-nav> 
        <ori-scroll-view v-show="isInited" class="flex1 scroll-view-box" @refresherrefresh="refresherrefresh">
            <reserve-detail ref="detail" :roomInfo="roomInfo" :onlineInfo="onlineInfo" :isPsyConsultant="options.isPsyConsultant"></reserve-detail>
        </ori-scroll-view>
        <consultBtn @enter="enter" :onlineInfo="onlineInfo" :roomInfo="roomInfo"  @membersChanged="membersChanged">{{btnText}}</consultBtn>
    </div>
</template>

<script>
import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue";
import reserveDetail from "./cps/reserve-detail.vue"
import consultBtn from "./cps/consult-btn.vue"; 
import mixin from './mixin.js';
const app = getApp();
const pageOption = Page.BasePage({
    mixins:[mixin],
    components:{
        reserveDetail,
        consultBtn,
        oriScrollView
    },
    data() {
        return {
        }
    },
    computed:{
        btnText(){
            return this.roomInfo.appointmentType == 'FINISH' ? '咨询已结束' : '进入咨询'
        }
    },
    onLoad(options){
        this.options = options; 
        this.options.roomKey && (this.options.roomKey = decodeURIComponent(this.options.roomKey));
        this.register();
    },
    methods: {
        enter() {
            // this.clearLoop();
            // this._checkLogin().then(login=>{
            //     console.log('loginlogin',login)
            // })
        },
        register(){ 
            if(this.options.mobilePhone && !app.LM.isLogin){
                return this._getTokenRegister(true,{ //静默注册
                    mobilePhone:this.options.mobilePhone,
                    name: "",
                }).then(()=>{
                    return this._checkLogin().then((isLogin)=>{
                        console.log('_checkLogin then',isLogin,app.LM.isLogin)
                        if(app.LM.isLogin){
                            app.IM.getAuthUserInfo();
                            return this.loadData();
                        }
                        return Promise.reject();
                    })
                });
            } else if(app.LM.isLogin) {
                return this.loadData();
            } else {
                return Promise.reject()
            }
        },
        refresherrefresh(){
            this.loadData();
        },
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
@import url(./cps/common.scss);
</style>