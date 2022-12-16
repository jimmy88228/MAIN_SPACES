<template>
    <rewrite-area class="flex-e-c" :isOpacityBg="true">
        <div>
            <rewrite-search :isOpacotyBg="true" v-model="searchForm.searchq" @search="search" placeholder="请输入视频名称搜索"></rewrite-search>
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