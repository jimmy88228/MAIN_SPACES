<template>
    <rewrite-area>
        <Form class="no-tip flex-b-c" inline>
            <div class="flex">
                <FormItem :label-width="0">
                  <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入名称搜索"></rewrite-search>
                </FormItem>
                <FormItem label="来源主体" :label-width="100">
                  <data-select :isGroup="true" groupLabelKey="customer_type" groupListKey="customer_info" v-model="searchForm.customer_id" type="customer" valueKey="customer_id" nameKey="customer_name" @change="search()">
                      <Option slot="default-option" :value="0">全部</Option>
                  </data-select>
                </FormItem>
                <FormItem label="资费方式" :label-width="100">
                    <Select v-model="searchForm.pay_type" @on-change="search()">
                        <Option :value="item.key" v-for="(item, index) in payList" :key="item.key">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "subscribeSearchForm",
    data() {
        return {
            payList: [
                {
                    key: -1,
                    name: "全部"
                },
                {
                    key: 0,
                    name: "报销"
                },
                {
                    key: 1,
                    name: "自费"
                }
            ]
        };
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