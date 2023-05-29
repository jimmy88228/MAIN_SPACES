<template>
    <rewrite-area class="flex-s-c rewrite-area">
        <Form class="no-tip inline flex-s-c">
            <div class="flex">
                <FormItem label="时间"  :label-width="46">
                    <date-time type="datetimerange" v-model="searchForm.time" placeholder="筛选时间" @change="search()"></date-time>
                </FormItem>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "operateLogSearchForm",
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        }
    },
    methods: {
        search() {
            this.$emit("search");
        }
    },
};
</script>

<style lang="less">
.rewrite-area{
    line-height: 1;
}
</style>