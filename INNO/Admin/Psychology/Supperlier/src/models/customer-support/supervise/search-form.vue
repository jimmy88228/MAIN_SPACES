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
                <FormItem label="预约状态" :label-width="100">
                  <Select class="base-select" v-model="searchForm.state" @on-change="search()">
                      <Option :value="item.key" v-for="(item, index) in subscribeState" :key="item.key">{{item.name}}</Option>
                  </Select>
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
    name: "superviseSearchForm",
    data() {
        return {
            subscribeState: [
                {
                    key: -1,
                    name: "全部"
                },
                {
                    key: 0,
                    name: "等待分配"
                },
                {
                    key: 1,
                    name: "已分配"
                },
                // {
                //     key: 2,
                //     name: "已完成"
                // }
            ]
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
        },
        batch(){
            this.$emit("batch")
        }
    },
};
</script>

<style>
</style>