<template>
<rewrite-area class="flex-b-c">
      <div class="flex">
        <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>&nbsp;
      </div>
      <div>
        <Button @click="create()" icon="md-add" v-hasAction="'area_maintenance_add'">创建区</Button>&nbsp;
        <!-- <Button @click="create(true)" icon="md-cloud-upload" v-hasAction="'area_maintenance_batch_import'">批量创建</Button> -->
        <!-- <Button @click="removeIds()" v-hasAction="'area_maintenance_batch_remove'">删除选中</Button> -->
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
    },
    methods: {
        search() {
            this.$emit("search");
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