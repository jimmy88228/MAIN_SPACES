<template>
<rewrite-area class="flex-b-c">
      <div class="flex">
        <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>
      </div>
      <div>
        <Button @click="create()" type="primary" v-hasAction="'structure_structure_add'">新增组织</Button>&nbsp;
        <Button @click="create(true)" v-hasAction="'structure_structure_add'">批量创建</Button>&nbsp;
        <!-- <Button @click="removeIds()" v-hasAction="'structure_structure_delete'">删除选中</Button> -->
      </div>
    </rewrite-area>
</template>

<script>
export default {
    name: "organizeIndexSearchForm",
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        search(data) {
            this.$emit("search", data);
        },
        create(isBatch) {
            this.$emit("create", { isBatch: isBatch });
        },
        removeIds() {
            this.$emit("removeIds");
        },
    },
};
</script>

<style>
</style>