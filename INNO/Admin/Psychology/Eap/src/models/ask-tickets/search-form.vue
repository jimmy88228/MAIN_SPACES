<template>
    <rewrite-area class="flex">
        <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
            <div>
                <FormItem :label-width="0">
                    <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>
                </FormItem>
                <linkageSelect :searchForm="searchForm" :hideSelect="['campus','grade-type', 'grade' ,'class']" @on-change="search"></linkageSelect>
                <FormItem label="用户状态">
                    <Select v-model="searchForm.state" class="base-select" @on-change="search">
                        <Option :value="-1">全部</Option>
                        <Option :value="0">关闭</Option>
                        <Option :value="1">正常</Option>
                    </Select>
                </FormItem>
            </div>
            <Button @click="addAdmin" icon="md-add" v-hasAction="'people_management_add'">添加人员</Button>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select/index.vue";
export default {
    name: "memberIndexSearchForm",
    components : { linkageSelect },
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