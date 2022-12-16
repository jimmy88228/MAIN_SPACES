<template>
    <rewrite-area class="flex-s-c">
        <div>
            <rewrite-search :isOpacotyBg="true" v-model="searchForm.searchq" @search="search" placeholder="请输入名称搜索"></rewrite-search>
        </div> 
        <Form class="m-l-20 no-tip inline flex-s-c">
            <div class="flex">
                <FormItem label="来源" :label-width="50" style="width:180px;">
                    <data-select v-model="searchForm.source_id" type="psychologicalSourceList" valueKey="supplierId" nameKey="supplierName" @change="search">
                        <Option slot="default-option" :value="0">全部</Option>
                    </data-select>
                </FormItem>
            </div>
        </Form>
        <!-- <div>
            <Button @click="add" type="primary">新增人员</Button>
        </div> -->
    </rewrite-area>
</template>

<script>
export default {
    name: "psychiatristSearchForm",
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
        add(){
            this.$emit("add");
        }
    },
};
</script>

<style>
</style>