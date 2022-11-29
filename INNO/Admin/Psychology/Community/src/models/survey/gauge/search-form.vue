<template>
    <rewrite-area class="flex-b-c">
        <div>
            <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入量表名称搜索"></rewrite-search>
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
    },
};
</script>

<style>
</style>