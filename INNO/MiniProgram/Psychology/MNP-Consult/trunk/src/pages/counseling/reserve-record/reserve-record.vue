<template>
    <div class="reserve-record flex flex-col">
        <page-nav>预约记录</page-nav>
        <search-box :sourceList="allSource" @sateChange="sateChange" @sourceChange="sourceChange"></search-box>
        <list class="list" :listData="listData" :isInited="isInited" @scrolltolower="scrolltolower" @refresherrefresh="refresherrefresh"></list>
    </div>
</template>

<script>
import searchBox from './cps/search-box.vue';
import list from "../person-info/cps/list.vue";
const app = getApp();
const pageOption = Page.BasePage({
    data() {
        return { 
            listData:[],
            pageIndex:1,
            pageSize:app.Conf.PAGE_SIZE,
            allSource:[],
            appointmentState:-1,
            source:"",
            isInited:false,
        }
    },
    components: {
        list,
        searchBox
    },
    methods: {
        init(){
            return this.getAllSource().then(res=>{
                if(res.code){
                    let data = res.data||[];
                    data && (this.allSource = data.map(item=>({
                        ...item,
                        id:item.customerId||"",
                        title:item.customerName||"",
                    })))
                    console.log('allSource',this.allSource)
                }
                return res;
            });
        },
        loadData() {
            return this.getConsultantAppointmentByPage().then(res=>{
                if(res.code){
                    let data = res.data||{};
                    let list = data.list || [];
                    this.listData = this.pageIndex == 1?list:this.listData.concat(list);
                    this.hasMore = this.pageIndex*this.pageSize<data.totalCount;
                    this.pageIndex += 1;
                    this.isInited = true;
                }
                return res
            })
        },
        sateChange(id){
            console.log('sateChange',id);
            this.appointmentState = id;
            this.isInited&&this.refresh();
        },
        sourceChange(id){
            console.log('sourceChange',id);
            this.source = id;
            this.isInited&&this.refresh();
        },
        getAllSource(){
            return this.$Http(this.$Apis.getAllSource,{
                data:{}
            })
        },
        getConsultantAppointmentByPage(){
            return this.$Http(this.$Apis.getConsultantAppointmentByPage,{
                data:{
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize, 
                    appointmentState:this.appointmentState,
                    source:this.source,
                },
                other:{
                    showLoading:true
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
    onLoad() {
        this.init().then(()=>{
            this.$nextTick(()=>{
                this.refresh();
            })
        })
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
.reserve-record{
    padding: 30rpx;
    box-sizing: border-box;
    height: 100vh;
    background: #F7F7F7;
    .msg-detail{ 
    }
    .list{
        flex: 1;
        overflow: hidden;
        padding-top: 25rpx;
        box-sizing: border-box;
    }
}
</style>