<template>
    <rewrite-area class="flex">
        <Form ref="searchForm" :model="searchForm" :label-width="50" inline class="no-tip flex-b-c">
            <div>
                <FormItem :label-width="0">
                    <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="searchForm.state" class="base-select" @on-change="search">
                        <Option :value="item.key" v-for="(item, index) in stateList" :key="item.key">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "ticketsPublishSearchForm",
    components : { },
    data() {
        return {};
    },
    props: {
        stateList: {
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
        addAdmin() {
            this.$emit("addAdmin");
        },
    },
};
</script>

<style>
</style>