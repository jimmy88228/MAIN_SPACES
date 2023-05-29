<template>
    <rewrite-area>
        <Form :label-width="40" class="no-tip flex-b-c" inline>
            <div>
                <linkageSelect :isShowSchoolYear="true" :hideSelect="hideSelect" :searchForm="searchForm" @on-change="search"></linkageSelect>
            </div>
            <div class="flex">
                <Button @click="add()" class="m-r-10" icon="md-add" v-hasAction="pageQuery.schoolId ? true : 'class_maintenance_add'" >创建班级</Button>
                <Button @click="batchImport()" icon="md-cloud-upload" v-hasAction="pageQuery.schoolId ? true : 'class_maintenance_batch_import'">批量创建</Button>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
export default {
    name: "classIndexSearchForm",
    components: { linkageSelect },
    data() {
        return {
            area_id: 0,
        };
    },
    props: {
        hideSelect: {
           type: Array,
            default: () => [], 
        },
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        search() {
            this.$emit("search");
        },
        batchImport() {
            this.$emit("batchImport");
        },
        add(){
            this.$emit("add")
        },
    },
};
</script>
<style lang="less" scoped></style>