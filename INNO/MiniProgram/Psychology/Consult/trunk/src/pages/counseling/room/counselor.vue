<template>
    <div class="room flex flex-col">
        <page-nav>预约信息</page-nav>
        <reserve-detail :roomInfo="roomInfo"></reserve-detail>
        <div class="box">
            <div class="m-b-30">咨询者问题描述</div>
            <text>{{roomInfo.description||''}}</text>
        </div>
        <consultBtn @enter="enter">进入咨询</consultBtn>
    </div>
</template>

<script>
import reserveDetail from "./cps/reserve-detail.vue";
import consultBtn from "./cps/consult-btn.vue";
import safeArea from "@/components/safe-area/index.vue"
const pageOption = Page.BasePage({
    components:{
        reserveDetail,
        safeArea,
        consultBtn
    },
    data() {
        return {
            roomInfo:{},
        }
    },
    components: {
    },
    onShow(){
        this.roomInfo = {
            time:['18:00','19:30'],
            timeTip:"1小时30分钟",
            state:1,
            userInfo:{
                type:"counselor",
                name:"咨询者名字",
                pic:"",
                state:1,
            },
            description:"问题描述问题描述",
        }
    },
    methods: {
        enter() {
        }
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
@import url(./cps/common.scss);
</style>