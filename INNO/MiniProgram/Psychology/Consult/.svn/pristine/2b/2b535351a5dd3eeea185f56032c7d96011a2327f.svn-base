<template>
    <div class="reserve-info flex flex-col">
        <page-nav isHideHome></page-nav>
        <msg-detail class="msg-detail"></msg-detail>
        <list type="counselor" class="list" :listData="listData"></list>
    </div>
</template>

<script>
import MsgDetail from "./cps/msg-detail.vue";
import list from "./cps/list.vue";
const pageOption = Page.BasePage({
    data() {
        return {
            listData:[{
                type:"video",
                time:"2022年12月12日 12:00-13:00",
                source:"白云居民心理关爱1",
                state:2,
            },{
                type:"video",
                time:"2022年12月12日 12:00-13:00",
                source:"白云居民心理关爱2",
                state:1,
            },{
                type:"audio",
                time:"2022年12月12日 12:00-13:00",
                source:"白云居民心理关爱3",
                state:2,
            }]
        }
    },
    components: {
        list,
        MsgDetail
    },
    mounted() {
        console.log('看看',this.staticAddress)
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
.reserve-info{
    height: 100vh;
    background: #F7F7F7;
    .msg-detail{ 
    }
    .list{
        flex: 1;
        padding: 25rpx;
        box-sizing: border-box;
    }
}
</style>