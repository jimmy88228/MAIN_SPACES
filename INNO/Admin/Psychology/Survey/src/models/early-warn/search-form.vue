<template>
    <rewrite-area>
        <Form :label-width="40" class="no-tip flex-b-c" inline>
            <div>
                <FormItem :label-width="0">
                  <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名或学号进行搜索"></rewrite-search>
                </FormItem>
                <linkageSelect :searchForm="searchForm" @on-change="search"></linkageSelect>
            </div>
            <div class="flex">
                <Button @click="batchImport()" v-hasAction="'student_file_batch_import'">批量导入</Button>&nbsp;
                <!-- <Button @click="batchChange()" v-hasAction="''">修改选中</Button>&nbsp; -->
                <Button @click="batchRemove()" v-hasAction="'student_file_batch_remove'">删除选中</Button>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
export default {
    name: "studentIndexSearchForm",
    components: { linkageSelect },
    data() {
        return {
            area_id: 0,
        };
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
        batchImport() {
            this.$emit("batchImport");
        },
        batchChange() {
            this.$emit("batchChange");
        },
        batchRemove() {
            this.$emit("batchRemove");
        },
    },
};
</script>

<style lang="less" scoped></style>