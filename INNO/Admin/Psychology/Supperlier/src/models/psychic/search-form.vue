<template>
    <rewrite-area>
        <Form :label-width="40" class="no-tip flex-b-c" inline>
            <div>
                <FormItem :label-width="0">
                  <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名"></rewrite-search>
                </FormItem>
                <FormItem label="组织">
                    <linkageSelect :searchForm="searchForm" @dismiss="search"></linkageSelect>
                </FormItem>
                <FormItem label="性别" >
                    <Select v-model="searchForm.sex" default-label="全部" @on-change="search" >
                        <Option v-for="item in selectList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
            </div>
            <div class="flex">
                <Button @click="batchImport()" v-hasAction="'student_file_batch_import'">批量修改</Button>&nbsp;
                <Button @click="batchImport()" v-hasAction="'student_file_batch_import'">批量导入</Button>&nbsp;
                <Button @click="batchRemove()" v-hasAction="'student_file_batch_remove'">删除选中</Button>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select/index.vue";
export default {
    name: "studentIndexSearchForm",
    components: { linkageSelect },
    data() {
        return {
            area_id: 0,
            selectList:[
                {
                    value:-1,
                    label:"全部"
                },
                {
                   value:0,
                   label:"保密"
                },
                {
                   value:1,
                   label:"男士"
                },
                {
                   value:2,
                   label:"女士"
                }]    
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