<template>
    <rewrite-area class="flex">
        <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
            <div>
                <FormItem label="问题类型" :label-width="70">
                    <Select v-model="searchForm.type" @on-change="search">
                        <Option :value="0">全部</Option>
                        <Option v-for="(item, index) in questionType" :key="item.type" :value="item.number">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="统计类型">
                    <Select v-model="searchForm.total_type" @on-change="search">
                        <Option :value="1">用户去重</Option>
                        <Option :value="2">总回收份数</Option>
                    </Select>
                </FormItem>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import ticketsConf from "../edit-ask-tickets/config/tickets.js";
export default {
    name: "ticketResultSearchForm",
    components : {
        
     },
    data() {
        return {};
    },
    computed: {
        questionType(){
            return ticketsConf.questionType || []
        }
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