<template>
    <rewrite-area>
        <Form :label-width="80" class="no-tip flex-b-c" inline>
            <div>
                <FormItem :label-width="0">
                    <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名进行搜索"></rewrite-search>
                </FormItem>
                <!-- <FormItem label="测评结果">
                    <Select class="base-select" @on-change="search" v-model="searchForm">
                        <Option v-for="item in resultList" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="审核状态">
                    <Select class="base-select" @on-change="search" v-model="searchForm.state">
                        <Option v-for="item in stateList" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </div>
            <div class="flex"></div>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "earlyWarnExamineSearchForm",
    components: {},
    data() {
        return {
            stateList: [
                {
                    id: -1,
                    name: "全部",
                },
                {
                    id: 0,
                    name: "未审核",
                },
                {
                    id: 1,
                    name: "审核通过",
                },
                {
                    id: 2,
                    name: "审核不通过",
                },
            ],
            // resultList: [
            //     {
            //         id: -1,
            //         name: "全部",
            //     },
            //     {
            //         id: 0,
            //         name: "未完成",
            //     },
            //     {
            //         id: 1,
            //         name: "已完成",
            //     },
            // ],
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
            console.log("searchForm", this.searchForm.state)
            this.$emit("search");
        },
    },
};
</script>

<style lang="less" scoped></style>