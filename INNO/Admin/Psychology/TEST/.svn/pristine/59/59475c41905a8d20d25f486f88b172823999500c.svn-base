<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" @addAdmin="addMemberEvent"></searchForm>
        <rewrite-table ref="myTable" class="full-table" :columns="columns" :data="list" :loading="tableLoading">
            <template slot="state" slot-scope="{ row }">
                <i-switch v-model="row.admin_state" size="large" :loading="row.stateLoading" :true-value="1" :false-value="0" :before-change="()=>{return beforeChangeState(index, row)}" v-hasAction="'people_management_state'">
                    <span slot="open">正常</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </template>
            <template slot="structure" slot-scope="{ row }">
                {{row.structure_type == 'edu_class' ? (row.getpname && row.getpname.p_name) : row.structure_name}}
            </template>
            <template slot="get_class" slot-scope="{ row }">
                {{row.get_class && (row.get_class.grade + row.get_class.class)}}
            </template>
            <template slot="handle" slot-scope="{ row }">
                <div class="operate-area">
                    <a class="operate">关闭</a>
                    <a class="operate">复制</a>
                    <a class="operate">分享</a>
                    <a class="operate">问券结果</a>
                </div>
            </template>
        </rewrite-table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
export default {
    name: "memberManage",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
    },
    data() {
        return {
            stateList: {

            },
            searchForm: {
                area_id: 0,
                school_id: 0,
                campus_id: 0,
                class_id: 0,
                searchq: "",
                state: -1,
            },
            editTitle: "",
        };
    },
    methods: {
        
    },
    mounted() {
    },
};
</script>

<style>
</style>