<template>
    <rewrite-area>
        <Form :label-width="40" class="no-tip flex-b-c" inline>
            <div>
                <FormItem :label-width="0">
                  <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名或学号进行搜索"></rewrite-search>
                </FormItem>
            </div>
            <div class="flex">
                <Button icon="md-add" @click="add()" v-hasAction="'student_management_add'">添加学生</Button>&nbsp;
                <Poptip :transfer="false" placement="bottom" class="operate-poptip" :width="125" v-hasAction="'student_management_batch_import'">
                    <Button >批量导出/导入</Button>
                    <div class="operate-links" slot="content">
                        <a class="operate-link" @click="batchImport">文件导入</a>
                        <a class="operate-link" @click="exportList" style="border-top: 1px solid #efefef;">导出名单</a>
                    </div>
                </Poptip>
                
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
        exportList(){
            this.$emit("exportList");
        },
        add(){
            this.$emit("add")
        },
        batchRemove() {
            this.$emit("batchRemove");
        },
    },
};
</script>
<style lang="less" scoped>
.operate-poptip{
    position:relative;
    z-index: 5 !important;
    /deep/.ivu-poptip-body{
        padding: 0px;
    }
    /deep/.ivu-poptip-popper{
        min-width:125px;
    }
}
.operate-links{
}
.operate-link{
    display: block;
    width: 125px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    text-align: center;
}
.operate-link:hover{
    color:#333;
    background-color:#EAF1F6;
}
</style>