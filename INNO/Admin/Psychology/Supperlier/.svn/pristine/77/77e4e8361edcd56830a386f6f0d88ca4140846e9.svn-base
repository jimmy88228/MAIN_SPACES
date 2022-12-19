<template>
    <rewrite-area>
        <div class="flex-b-c">
            <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入量表名称搜索"></rewrite-search>
            <div>
                <Button @click="importData" class="m-r-5" icon="md-cloud-upload">导入量表</Button>
                <Button @click="add" type="primary" >新增</Button>
            </div>
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
        importData(){
            this.$emit("import")
        }
    },
};
</script>

<style>
</style>