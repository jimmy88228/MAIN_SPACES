<template>
    <rewrite-area>
        <div class="flex-b-c">
            <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入量表名称搜索"></rewrite-search>
            <Button @click="add" type="primary" class="m-r-20">新增</Button>
        </div>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
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
        add() {
            this.$emit("add");
        },
    },
};
</script>

<style>
</style>