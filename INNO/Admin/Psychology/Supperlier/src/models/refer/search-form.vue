<template>
    <rewrite-area>
        <Form class="no-tip flex-b-c" inline>
            <div class="flex">
                <FormItem :label-width="0">
                  <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入名称搜索"></rewrite-search>
                </FormItem>
            </div>
            <!-- <div class="flex">
                <Button @click="batch" v-hasAction="true">批量处理</Button>
            </div> -->
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
        // batch(){
        //     this.$emit("batch")
        // }
    },
};
</script>

<style>
</style>