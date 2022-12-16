<template>
    <rewrite-area>
        <Form class="no-tip flex-b-c" inline>
            <div class="flex-s-c">
                <FormItem :label-width="0">
                  <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入名称搜索"></rewrite-search>
                </FormItem>
                <FormItem label="来源主体" :label-width="100">
                    <data-select class="base-320" v-model="searchForm.source_id" type="supervisorSourceList" valueKey="targetId" nameKey="targetName" @change="search">
                        <Option slot="default-option" :value="0">全部</Option>
                    </data-select>
                </FormItem>
                <FormItem label="预约状态" :label-width="100">
                  <Select v-model="searchForm.state" @on-change="search()">
                      <Option :value="item.state" v-for="(item, index) in subscribeState" :key="item.key">{{item.name}}</Option>
                  </Select>
                </FormItem>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "superviseSearchForm",
    data() {
        return {
            
        };
    },
    props: {
        subscribeState: {
            type: Array,
            default(){
                return [];
            }
        },
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