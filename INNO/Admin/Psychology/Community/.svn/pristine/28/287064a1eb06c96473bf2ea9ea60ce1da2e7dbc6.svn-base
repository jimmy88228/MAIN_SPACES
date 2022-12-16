<template>
    <rewrite-area>
        <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-s-c">
            <FormItem :label-width="0">
                <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>
            </FormItem>
            <FormItem :label-width="50" label="组织">
                <data-cascader placeholder="选择组织" ref="organizeCascader" class="base-320" type="organize" v-model="searchForm.stucture_ids" valueKey="id" labelKey="structure_name" @dismiss="search()"></data-cascader>
            </FormItem>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "memberIndexSearchForm",
    components : { },
    data() {
        return {};
    },
    props: {
        structureInfo: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        search() {
            this.$emit("search");
        }
    },
};
</script>

<style>
</style>