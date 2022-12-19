<template>
    <rewrite-area class="flex-b-c">
        <Form inline class="no-tip flex" :label-width="50">
            <FormItem :label-width="0">
                <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键词"></rewrite-search>
            </FormItem>
        </Form>
        <div class="flex">
            <Button type="primary" icon="md-add" @click="create()">机构录入</Button>&nbsp;
            <!-- <Button type="default" @click="removeIds()">删除选中</Button> -->
        </div>
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
                    name: "关闭",
                },
                {
                    key: 1,
                    name: "未开始",
                },
                {
                    key: 2,
                    name: "进行中",
                },
                {
                    key: 3,
                    name: "已结束",
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
        create() {
            this.$emit("create");
        },
        removeIds() {
            this.$emit("removeIds");
        },
    },
};
</script>

<style>
</style>