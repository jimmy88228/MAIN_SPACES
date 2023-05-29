<template>
<rewrite-area class="flex-b-c">
    <Form :label-width="50" class="no-tip flex-b-c" inline>
      <div class="flex-c-c">
        <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>&nbsp;
        <FormItem label="区" v-if="_structureLimit(['edu_customer'])">
            <data-select ref="areaSelectRef" v-model="searchForm.structure_id" style="max-width:150px;" type="adminArea" valueKey="area_id" nameKey="area_name" :initCallback="initAreaData" @changeData="changeArea"></data-select>
        </FormItem>
      </div>
      <div class="flex-c-c">
        <Button @click="create()" icon="md-add" v-hasAction="'street_maintenance_add'">创建街道</Button>&nbsp;
        <Button @click="create(true)" icon="md-cloud-upload" v-hasAction="'street_maintenance_batch_import'">批量创建</Button>
        <Button @click="removeIds()" v-hasAction="'street_maintenance_batch_remove'">删除选中</Button>
      </div>
    </Form>
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
        changeArea(data){
            this.searchForm.structure_type = data.structure_type || '';
            this.search();
        },
        initAreaData(data){
            // 设置默认
            // if(data.length){
            //     this.searchForm.structure_id = data[0].area_id || 0;
            //     this.searchForm.structure_type = data[0].structure_type || '';
            //     this.search();
            // }
        }
    },
};
</script>

<style>
</style>