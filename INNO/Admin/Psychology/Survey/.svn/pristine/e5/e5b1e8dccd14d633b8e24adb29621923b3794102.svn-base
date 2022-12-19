<template>
    <rewrite-area class="flex-s-c">
        <div>
            <!-- <rewrite-search :isOpacotyBg="true" v-model="searchForm.searchq" @search="search" placeholder="请输入名称搜索"></rewrite-search> -->
        </div> 
        <Form class="m-l-20 no-tip inline flex-s-c">
            <div class="flex">
                <FormItem label="时间"  :label-width="50" style="width:180px;">
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

<style>
</style>