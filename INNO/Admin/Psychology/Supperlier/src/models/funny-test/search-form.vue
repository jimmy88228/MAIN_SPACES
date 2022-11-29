<template>
    <rewrite-area class="flex-b-c">
        <div>
            <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入标题进行搜索"></rewrite-search>
        </div>
        <div>
            <Button type="primary" @click="add">新增测试</Button>
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
        isLimit: Boolean,
        limitLoading: Boolean
    },
    methods: {
        search(){
            this.$emit("search");
        },
        add(){
            this.$emit("add");
        }
    },
};
</script>

<style>
</style>