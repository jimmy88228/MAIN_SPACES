<template>
    <rewrite-area class="flex-b-c">
        <div>
            <span v-for="(item, index) in structureInfo._parentName" :key="index">{{item}} / </span>{{structureInfo.title}}
        </div>
        <div class="flex">
            <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
                <div>
                    <FormItem :label-width="0">
                        <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>
                    </FormItem>
                </div>
                <Button @click="addMember()" type="primary" v-hasAction="'structure_member_add'">新增人员</Button>&nbsp;
                <Button @click="addMember(true)" v-hasAction="'structure_member_add'">批量新增</Button>&nbsp;
                <Button @click="removeMember(true)" v-hasAction="false">删除选中</Button>
            </Form>
        </div>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select/index.vue";
export default {
    name: "memberIndexSearchForm",
    components : { linkageSelect },
    data() {
        return {};
    },
    props: {
        structureInfo: {
            type: Object,
            default: ()=>{
                return {}
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
        addMember(isBatch) {
            this.$emit("addMember", { isBatch: isBatch });
        },
        removeMember(isBatch){
            this.$emit("removeMember", { isBatch: isBatch });
        }
    },
};
</script>

<style>
</style>