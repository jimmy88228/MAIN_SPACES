<template>
    <rewrite-area>
        <Form :label-width="80" class="no-tip flex-b-c" inline>
            <div class="flex-s-c">
                <FormItem :label-width="0">
                    <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名进行搜索"></rewrite-search>
                </FormItem>
                <FormItem label="组织">
                    <data-cascader placeholder="请筛选组织" ref="organizeCascader" class="base-320" type="organize" v-model="searchForm.prent_structure_ids" valueKey="id" labelKey="structure_name" @dismiss="visibleChange"></data-cascader>
                </FormItem>
                <FormItem label="审核状态">
                    <Select class="base-select" @on-change="search" v-model="searchForm.state">
                        <Option v-for="item in stateList" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <gauge-range :searchForm="searchForm" @on-change="search"></gauge-range>
            </div>
            <div>
                <Button @click="exportHandle"><Icon type="md-cloud-download" /> 导出结果</Button>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import gaugeRange from "./cps/gauge-range.vue";
export default {
    name: "earlyWarnExamineSearchForm",
    components: {gaugeRange},
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => ({}),
        },
        stateList: {
            type: Array,
            default:()=>{
                return []
            }
        }
    },
    methods: {
        search() {
            this.$emit("search");
        },
        visibleChange(){
          this.searchForm.structure_id = this.searchForm.prent_structure_ids.slice(-1)[0]
          this.search();
        },
        exportHandle(){
          this.$emit("exportHandle")
        }
    },
};
</script>

<style lang="less" scoped></style>