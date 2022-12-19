<template>
    <rewrite-area class="flex-b-c">
        <div>
            <rewrite-search :isOpacotyBg="true" v-model="searchForm.searchq" @search="search" placeholder="请输入名称搜索"></rewrite-search>
        </div>
        <div>
            <Button @click="add" type="primary">新增人员</Button>
            <Button @click="setDistribute" >分配资源</Button>
        </div>
    </rewrite-area>
</template>

<script>
export default {
    name: "psychiatristSearchForm",
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
        stateKey: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        search() {
            this.$emit("search");
        },
        add(){
            this.$emit("add");
        },
        setDistribute(){
            this.$emit("setDistribute")
        }
    },
};
</script>

<style>
</style>