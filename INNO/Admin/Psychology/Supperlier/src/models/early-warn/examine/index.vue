<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" ></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="student" slot-scope="{ row, index }">
                {{row.get_record && row.get_record.member_name || '--'}}
            </template>
            <template slot="structure" slot-scope="{ row, index }">
                {{row.get_record && row.get_record.structure_name || '--'}}
            </template>
            <template slot="getrank" slot-scope="{ row, index }">
                {{row.getrank && row.getrank.level_name || '无'}}
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" @click="getPsychicFile(row)" v-hasAction="'forewarning_survey_check_view_file'">查看档案</a>
                    <a class="operate" @click="examine(row)" v-hasAction="[row.state == 0, 'forewarning_survey_sign_grade']">审核标记</a>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editExamine ref="editExamineRef" @confirm="handleUpdate"></editExamine>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editExamine from "./edit-examine/index.vue";
export default {
    name: "studentIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm, editExamine },
    data() {
        return {
            searchForm: {
                searchq: "",
                school_id: 0,
                state: -1 // -1 全部 0:未审核  1:审核通过  2:审核不通过
            },
        };
    },
    methods: {
        init(){
            let state = this.pageQuery.state;
            state = (state == 0 || state > 0) ? state : -1;
            console.log("state", state)
            this.searchForm.state = Number(state);
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .forewarningExamineList({
                    data: {
                        ...this.searchForm,
                        ...extraData,
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
        getPsychicFile(row) {
             this.$router.push({
                name: "memberPsychicFiles",
                query: {
                    userId: row.user_id || 0,
                    type: "earlyWarn"
                },
            });
        },
        examine(row){
            this.$refs["editExamineRef"] && this.$refs["editExamineRef"].showDrawer(row)
        },
        
        
    },
    mounted() {
        this.$nextTick(()=>{
            this.init();
            this.loadData();
        })
    },
};
</script>

<style>
</style>