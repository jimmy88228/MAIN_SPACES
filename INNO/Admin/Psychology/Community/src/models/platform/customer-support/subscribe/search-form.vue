<template>
    <rewrite-area>
        <Form class="no-tip flex-b-c" inline>
            <div>
                <FormItem :label-width="0">
                  <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名或学号进行搜索"></rewrite-search>
                </FormItem>
                <FormItem label="平台" :label-width="50">
                  <data-select></data-select>
                </FormItem>
                <FormItem label="心理咨询师" :label-width="100">
                  <data-select></data-select>
                </FormItem>
            </div>
            <div class="flex">
                <Button @click="" v-hasAction="true">批量处理</Button>
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
        stateKey: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        search() {
            this.$emit("search");
        },
    },
};
</script>

<style>
</style>