<template>
    <div class="reserve-setting flex flex flex-col">
        <page-nav>设置</page-nav>
        <div class="title p-l-20 m-b-30">接受咨询类型</div>
        <ori-scroll-view class="scroll-view flex1" @refresherrefresh="refresherrefresh">
            <div class="list-box">
                <div class="list m-b-10 flex-b-c" v-for="(item) in listData" :key="item.serviceId">
                    <div class="msg-box flex-c-c">
                        <image :src="staticAddress + (keyType[item.serviceType].img || '')" class="img-logo m-r-30" mode="aspectFit"></image>
                        <div>{{item.serviceName}}</div>
                    </div>
                    <div class="switch-area"  @click="toggle(item)">
                        <div class="switch-box" :class="{active:item.isActive == 1}">
                            <div class="switch"></div>
                        </div>
                    </div>
                </div>
            </div>
        </ori-scroll-view>
    </div>
</template>

<script> 
import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue";
const app = getApp(); 
const pageOption = Page.BasePage({
    components: {
        oriScrollView,
    },
    data() {
        return {
            toggleLoading:false,
            listData:[],   
            keyType:{
                video:{
                    img:"/common/camera-v2.png"
                },
                voice:{
                    img:"/common/voice-v2.png"
                },
                offline:{
                    img:"/common/offline-v2.png"
                },
            },
        }
    },
    components: { 
    },
    onLoad(){
        this.refresh();
    },
    methods: {
        loadData(){
            this.getServiceTypeById();
        },
        getServiceTypeById(){
            this.$Http(this.$Apis.getServiceTypeById, {
                data:{},
                other:{
                    showLoading:true
                }
            }).then(res=>{
                if(res.code){
                    let list = res.data||[];
                    this.listData = list;
                }
                return res;
            }) 
        },
        refresherrefresh(){
            this.refresh();
        },
        refresh(){
            return this.loadData();
        },
        updateServiceType(item){
            let consultantId = app.IM.userInfo.id || "";
            let isActive = item.isActive == 1?0:1;
            return this.$Http(this.$Apis.updateServiceType, {
                data:{
                    consultantId,
                    isActive,
                    serviceId:item.serviceId,
                },
                other:{
                    showLoading:true
                }
            })
        },
        toggle(e) { 
            if(this.toggleLoading)return
            this.setLoading(true)
            this.updateServiceType(e).then(res=>{
                if(res.code){
                    app.SMH.showToast({title:"设置成功"})
                    return this.refresh().finally(()=>{
                        this.setLoading(false)
                    });
                }
                this.setLoading(false)
            }).catch(()=>{
                this.setLoading(false)
            })
        },
        setLoading(bool){
            if(bool){
                this.toggleLoading = true;
            }else{
                setTimeout(() => {
                   this.toggleLoading = false;
                }, 500);
            }
        }
    },
})
export default pageOption
</script>

<style lang="scss" scoped> 
.reserve-setting{
    height: 100vh;
    background-color: #f7f7f7;
    padding: 30rpx;
    box-sizing: border-box;
    .list-box{
        height: 100%;
        .list{
            width: 100%;
            height: 100rpx;
            background: #FFFFFF;
            border-radius: 10rpx;
            padding:0 14rpx 0 44rpx;
            box-sizing: border-box;
        }
        .img-logo{
            width: 32rpx;
            height: 32rpx;
        }
        .switch-area{
            padding: 30rpx;
        }
        .switch-box{
            width: 50rpx;
            height: 28rpx;
            border-radius: 14rpx;
            border: 2rpx solid;
            box-sizing: border-box;
            border-color: #ccc;
            background: #ccc;
            transition: all 300ms;
            position: relative;
            &.active{
                background: #21B014;
                border-color: #21B014;
                .switch{
                    left: 22rpx;
                }
            }
            .switch{
                width: 24rpx;
                height: 24rpx;
                border-radius: 50%;
                background: #FFFFFF;
                border: 2rpx solid transparent;
                position: absolute;
                left: 0;
                top: 0;
                box-sizing: border-box;
                transition: left 200ms;
            }
        }
    }
    .scroll-view{
        overflow: hidden;
    }
} 
</style>
