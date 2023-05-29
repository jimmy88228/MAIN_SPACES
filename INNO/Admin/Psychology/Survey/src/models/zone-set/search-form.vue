<template>
    <rewrite-area class="flex-b-c">
        <Form inline class="no-tip flex" :label-width="50">
            <FormItem :label-width="0">
                <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键词"></rewrite-search>
            </FormItem>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
    data() {
        return {
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
        }
    },
};
</script>

<style>
</style>