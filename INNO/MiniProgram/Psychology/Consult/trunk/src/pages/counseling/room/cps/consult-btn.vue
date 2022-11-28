<template> 
    <safe-area areaType="paddingBottom" class="btn-fixed">
        <div class="tips-box flex-c-c">
            <image :src="staticAddress+'/common/phone.png'" class="img-phone" mode="aspectFit"></image>
            <div>如果无法进入咨询请拨打客服热线</div>
        </div>
        <div class="btn-box">
            <div class="btn flex-c-c" @click="enter">
                <slot></slot>
            </div>
        </div>
    </safe-area>
</template>

<script>
import safeArea from "@/components/safe-area/index.vue"
const pageOption = Page.BaseComp({
    components: {
        safeArea,
    },
    props: {
    },
    computed:{ 
    },
    data() {
        return { 
        }
    },
    methods: {
        enter(){
            this.$emit('enter');
        },
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
