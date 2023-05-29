<template>
    <rewrite-area class="flex">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline class="no-tip flex-b-c">
            <div>
                <FormItem :label-width="0">
                    <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>
                </FormItem>
                <linkageSelect :searchForm="searchForm" :isShowDefault="true" :hideSelect="hideSelect" @on-change="search"></linkageSelect>
                <FormItem label="用户角色" v-if="showRoleData">
                    <roleSelect valueKey="type" nameKey="role_name" :isShowDefault="true" :initCallback="initRoleData" v-model="searchForm.role_type" @change="search"></roleSelect>
                </FormItem>
                <FormItem label="用户状态">
                    <Select v-model="searchForm.state" class="base-select" @on-change="search">
                        <Option :value="-1">全部</Option>
                        <Option :value="0">关闭</Option>
                        <Option :value="1">正常</Option>
                    </Select>
                </FormItem>
            </div>
            <Button @click="addAdmin" icon="md-add" v-hasAction="'people_management_add'">添加管理员</Button>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select/index.vue";
import roleSelect from "@/components/view-components/role-select/index.vue";
export default {
    name: "memberIndexSearchForm",
    components : { linkageSelect, roleSelect },
    data() {
        return {
            showRoleData: true,
        };
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        hideSelect(){
            if(this._structureType == 'edu_customer'){
                return ['street','school', 'campus','grade-type', 'grade' ,'class']
            } else {
                return ['street', 'campus','grade-type', 'grade' ,'class']
            }
        },
    },
    methods: {
        initRoleData(data){
            this.showRoleData = !!data.length
        },
        search(data) {
            console.log("data", data)
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