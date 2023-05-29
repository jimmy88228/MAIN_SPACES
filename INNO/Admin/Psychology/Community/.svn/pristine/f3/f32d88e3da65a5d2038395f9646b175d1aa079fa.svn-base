<template>
    <rewrite-area class="flex-b-c">
        <Form inline class="no-tip flex" :label-width="50">
            <FormItem :label-width="0">
                <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键词"></rewrite-search>
            </FormItem>
            <FormItem label="课程状态" :label-width="100">
                <Select v-model="searchForm.state" style="width:120px;" @on-change="search()">
                    <Option v-for="item in stateList" :value="item.key" :key="item.key">{{item.name}}</Option>
                </Select>
            </FormItem>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
    data() {
        return {
            stateList: [
                {
                    key: -1,
                    name: "全部",
                },
                {
                    key: 0,
                    name: "未完成",
                },
                {
                    key: 1,
                    name: "已完成",
                },
            ],
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
        removeIds() {
            this.$emit("removeIds");
        },
    },
};
</script>

<style>
</style>