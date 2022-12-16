<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" @addCaring="addCaring"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="student_name" slot-scope="{ row, index }">
                {{row.get_student && row.get_student.student_name || "--"}}
            </template>
            <template slot="student_number" slot-scope="{ row, index }">
                {{row.get_student && row.get_student.student_number || "--"}}
            </template>
            <template slot="student_sex" slot-scope="{ row, index }">
                {{row.get_student && row.get_student.student_sex_str || "--"}}
            </template>
            <template slot="class_name" slot-scope="{ row, index }">
                {{row.get_student && row.get_student.class_name || "--"}}
            </template>
            <template slot="school" slot-scope="{ row, index }">
                {{row.get_student && row.get_student.school_name || "--"}}
            </template>
            <template slot="school_year" slot-scope="{ row, index }">
                {{row.get_student && row.get_student.school_year || "--"}}
            </template>
            <template slot="get_rank" slot-scope="{ row, index }">
                {{row.getrank && row.getrank.level_name || '已解除'}}
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" @click="getPsychicFile(row)" v-hasAction="'forewarning_survey_view_file'">查看档案</a>
                    <a class="operate" @click="checkMeddle(row)" v-hasAction="'forewarning_survey_intervene_record'">干预记录</a>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editCaring ref="editCaringRef" @confirm="handleUpdate"></editCaring>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editCaring from "./edit-caring/index.vue";
export default {
    name: "studentIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm, editCaring },
    data() {
        return {
            searchForm: {
                level_state: 0
            },
        };
    },
    methods: {
        init(){
            let levelState = this.pageQuery.levelState || 0;
            this.searchForm.level_state = levelState;
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .forewarningPeopleList({
                    data: {
                        ...this.searchForm,
                        ...extraData,
                    },
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
        checkMeddle(row){
            this.$router.push({
                name: "earlyWarnMeddle",
                query: {
                    userId: row.user_id
                },
            });
        },
        getPsychicFile(row) {
            this.$UIModule({
                mode: "clause-view",
                success: () => {
                    this.$router.push({
                        name: "earlyWarnPsychicFiles",
                        query: {
                            userId: row.user_id,
                            type: "earlyWarn"
                        },
                    });
                }
            })
            
        },
        addCaring(){
           this.$refs["editCaringRef"] && this.$refs["editCaringRef"].showDrawer()
        }
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