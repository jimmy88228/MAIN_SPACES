<template>
    <div class="person-info flex flex-col">
        <page-nav isHideHome></page-nav>
        <msg-detail class="msg-detail"></msg-detail>
        <list type="counselor" class="list" :listData="listData" :isInited="isInited" emptyTip="今日暂无预约" @scrolltolower="scrolltolower" @refresherrefresh="refresherrefresh"></list>
    </div>
</template>

<script>
import MsgDetail from "./cps/msg-detail.vue";
import list from "./cps/list.vue";
const app = getApp();
const pageOption = Page.BasePage({
    data() {
        return { 
            listData:[],
            pageIndex:1,
            pageSize:app.Conf.PAGE_SIZE,
            isInited:false,
            hasMore:true, 
        }
    },
    components: {
        list,
        MsgDetail
    },
    methods: {
        loadData() {
            this.getCurConsultantAppointmentByPage().then(res=>{
                if(res.code){
                    let data = res.data||{};
                    let list = data.list || [];
                    this.listData = this.pageIndex == 1?list:this.listData.concat(list);
                    this.hasMore = this.pageIndex*this.pageSize<data.totalCount;
                    this.pageIndex += 1;
                    this.isInited = true;
                }
            })
        },
        getCurConsultantAppointmentByPage(){
            return this.$Http(this.$Apis.getCurConsultantAppointmentByPage,{
                data:{
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize,
                },
                other:{
                    showLoading:!this.isInited
                }
            })
        },
        scrolltolower(){
            if(this.hasMore){
                this.loadData();
            }
        },
        refresherrefresh(){
            this.refresh();
        },
        refresh(){
            this.pageIndex = 1;
            return this.loadData();
        },
    },
    onShow() {
        this.refresh();
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
.person-info{
    height: 100vh;
    background: #F7F7F7;
    .msg-detail{ 
    }
    .list{
        flex: 1;
        padding: 25rpx;
        box-sizing: border-box;
        overflow: hidden;
    }
}
</style>