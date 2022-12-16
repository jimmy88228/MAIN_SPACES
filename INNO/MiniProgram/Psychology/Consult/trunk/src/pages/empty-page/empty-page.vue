<template>
    <div class="empty-page flex-c-c flex-col">
        <image class="img-empty m-r-10" mode="aspectFit" :src="staticAddress + '/common/empty-page.png'"></image>
        <div class="tip">房间已过期，请重新选择房间进入</div>
    </div>
</template>

<script>
const pageOption = Page.BasePage({
    data() {
        return { 
        }
    },
    components: {
    },
    methods: {
        jump(){
            this.redirectAction('/pages/startup/startup')
        }
    },
})
export default pageOption
</script>
<style lang="scss">
page{
    background:#f7f7f7;
}
</style>
<style lang="scss" scoped>
.empty-page{
    height: 90vh;
    .tip{
        color: #b2b2b2;
    }
    .img-empty{
        width: 240rpx;
        height: 240rpx;
        margin-bottom: 60rpx;
    }
    .btn{
        position:fixed;
        left:50%;
        bottom:50rpx;
        width: 400rpx;
        height: 100rpx;
        border-radius: 10rpx;
        transform:translateX(-50%);
        background:#21B014;
        color:#fff; 
    }
}
</style>