<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" @addRecord="addRecord"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" >
            <template slot="admin" slot-scope="{ row, index }">
                {{row.getadmin && row.getadmin.user_name || "--"}}
            </template>
            <template slot="student" slot-scope="{ row, index }">
                {{row.get_member && row.get_member.member_name || "--"}}
            </template>
            <template slot="getrank" slot-scope="{ row, index }">
                {{row.getrank && row.getrank.level_name || "已解除"}}
            </template>
            <template slot="model" slot-scope="{ row, index }">
                {{row.model_name && row.model_name || "--"}}
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" @click="checkRecord(row)" v-hasAction="'forewarning_survey_view'">查看</a>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editMeddle ref="editMeddleRef" @confirm="handleUpdate"></editMeddle>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editMeddle from "./edit-meddle/index.vue";
export default {
    name: "studentIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm, editMeddle },
    data() {
        return {
            searchForm: {
                user_id: 0,
                startTime: "",
                endTime: ""
            },
        };
    },
    methods: {
        onLoadData(page, extraData) {
            let userId = this.pageQuery.userId || 0;
            this.searchForm.user_id = userId;
            return this.$MainApi
                .forewarningInterveneRecord({
                    data: {
                        ...this.searchForm,
                        ...extraData
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.data = {
                            total: data.total,
                            list: data.items,
                        };
                    }
                });
        },
        addRecord(){
            this.$refs["editMeddleRef"] && this.$refs["editMeddleRef"].showDrawer({userId: this.searchForm.user_id,name:this.pageQuery.name||""});
        },
        checkRecord(row){
            this.$Modal.info({
                title: "评估建议",
                content: row.assess_suggest,
                closable: true
            });
        }
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>