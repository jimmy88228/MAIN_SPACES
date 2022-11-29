<template>
    <rewrite-area class="flex">
        <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
            <div>
                <FormItem :label-width="0">
                    <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入名称搜索"></rewrite-search>
                </FormItem>
            </div>
            <Button @click="addAdmin" type="primary" v-hasAction="true">添加人员</Button>
            <!-- <Button type="default" v-hasAction="true">删除选中</Button> -->
        </Form>
    </rewrite-area>
</template>

<script>
// import linkageSelect from "@/models/components/linkage-select/index.vue";
export default {
    name: "memberIndexSearchForm",
    // components : { linkageSelect },
    data() {
        return {};
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
        addAdmin() {
            this.$emit("addAdmin");
        },
    },
};
</script>

<style>
</style>