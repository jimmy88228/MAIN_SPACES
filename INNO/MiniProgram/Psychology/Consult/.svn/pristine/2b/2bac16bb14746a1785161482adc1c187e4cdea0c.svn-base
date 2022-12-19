<template>
    <div class="room flex flex-col">
        <page-nav></page-nav>
        <reserve-detail :roomInfo="roomInfo"></reserve-detail>
        <div class="btn-box flex-c-c">
            <div class="btn flex-c-c" @click="enter">发起咨询</div>
        </div>
    </div>
</template>

<script>
import reserveDetail from "./cps/reserve-detail.vue"
const pageOption = Page.BasePage({
    components:{
        reserveDetail
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
                name:"咨询师名字",
                pic:"",
                state:0,
            },
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