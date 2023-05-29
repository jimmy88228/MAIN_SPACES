<template>
    <rewrite-area class="flex">
        <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
            <div>
                <FormItem label="问题类型" :label-width="70">
                    <Select>
                        <Option></Option>
                    </Select>
                </FormItem>
                <FormItem label="统计类型">
                    <Select>
                        <Option>用户去重</Option>
                        <Option>总回收份数</Option>
                    </Select>
                </FormItem>
            </div>
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