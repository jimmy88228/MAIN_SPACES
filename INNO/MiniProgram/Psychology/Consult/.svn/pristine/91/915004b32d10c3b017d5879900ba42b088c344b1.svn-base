<template>
    <div class="room flex flex-col">
        <page-nav isHideHome>预约信息</page-nav>
        <ori-scroll-view v-show="isInited" class="flex1 scroll-view-box" @refresherrefresh="refresherrefresh">
            <reserve-detail ref="detail" :roomInfo="roomInfo" :onlineInfo="onlineInfo" :isPsyConsultant="options.isPsyConsultant||''"></reserve-detail>
            <div class="box" v-if="roomInfo.psychologicalDescription">
                <div class="m-b-30">咨询者问题描述</div>
                <text>{{roomInfo.psychologicalDescription||''}}</text>
            </div>
        </ori-scroll-view>
        <consultBtn :onlineInfo="onlineInfo" :roomInfo="roomInfo" @enter="enter" @membersChanged="membersChanged">{{btnText}}</consultBtn>
    </div>
</template>

<script>
import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue";
import reserveDetail from "./cps/reserve-detail.vue";
import consultBtn from "./cps/consult-btn.vue";
import safeArea from "@/components/safe-area/index.vue"
import mixin from './mixin.js';
const pageOption = Page.BasePage({
    mixins:[mixin],
    computed:{
        btnText(){
            return this.roomInfo.appointmentType == 'FINISH'? '咨询已结束' : '进入咨询'
        }
    },
    components:{
        reserveDetail,
        safeArea,
        consultBtn,
        oriScrollView
    },
    data() {
        return {
        }
    },
    onLoad(options){
        this.options = options; 
        this.options.roomKey && (this.options.roomKey = decodeURIComponent(this.options.roomKey));
        console.log('this.optionsthis.options',this.options)
        this.loadData()
    }, 
    methods: {
        enter() {
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