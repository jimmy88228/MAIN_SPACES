<template>
   <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
</template>
<script>
    export default{
        data(){
            return {
                isShowExtra: false
            }
        },
        methods:{
            showExtra(){
                this.isShowExtra = !this.isShowExtra;
            },
        }
    }
</script>
<style lang="less" >
    .select-module-area{
        .search_btn{
            line-height: 30px;
        }
    }
</style>