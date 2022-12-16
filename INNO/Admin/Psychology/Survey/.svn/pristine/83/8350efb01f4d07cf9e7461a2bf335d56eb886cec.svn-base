<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" @batchImport="batchImport"  @batchRemove="batchRemove" @add="addStudent"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" @click="editStudentEvent(row)" v-hasAction="'student_file_update'">编辑</a>
                    <a class="operate" @click="getPsychicFile(row)" v-hasAction="'student_file_psychology_files'">心理档案</a>
                    <a class="operate" @click="removeItem(row.user_id, index)" v-hasAction="'student_file_batch_remove'">删除</a>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editStudent ref="editStudentRef" :title="editTitle" @confirm="handleUpdate"></editStudent>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editStudent from "./edit-student/index.vue";
export default {
    name: "studentIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm, editStudent },
    data() {
        return {
            searchForm: {
                searchq: "",
                school_id: 0,
                campus_id: 0,
                grade_id: 0,
                class_is: 0,
                sex: -1,
                school_year: ''
            },
            selectData: [],
            editTitle: "编辑档案"
        };
    },
    computed: {
        ids() {
            let selectData = this.selectData || [];
            let ids = [];
            if (selectData instanceof Array) {
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].user_id) {
                        ids.push(selectData[i].user_id);
                    }
                }
            }
            return ids;
        },
    },
    methods: {
        selectDataEvent(selectData) {
            this.selectData = selectData || [];
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .studentList({
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
        addStudent(){
            this.editTitle = "新增档案";
            this.$refs["editStudentRef"] &&
                this.$refs["editStudentRef"].showDrawer();
        },
        editStudentEvent(row) {
            this.editTitle = "编辑档案";
            this.$refs["editStudentRef"] &&
                this.$refs["editStudentRef"].showDrawer(row);
        },
        getPsychicFile(row) {
            this.$UIModule({
                mode: "clause-view",
                success: () => {
                    this.$router.push({
                        name: "memberPsychicFiles",
                        query: {
                            userId: row.user_id || 0
                        },
                    });
                }
            })
        },
        batchImport(){
          this.$UIModule({
              mode: "batch-import",
              options: {
                  canCreate: { upload: true, download: true },
                  uploadUrl: "studentBatchImport",
                  downloadUrl: "studentBatchTpl",
              },
              success: () => {
                  this.loadData();
              },
          });
        },
        removeItem(id) {
            if (!id) {
                this.$Message.warning("无效ID");
                return Promise.reject();
            }
            this.removeReq([id]).then(() => {
                this.delItem(index);
            });
        },
        batchRemove() {
            this.removeReq(this.ids).then(() => {
                this.delItems(this.ids);
            });
        },
        removeReq(ids) {
          console.log("ids", ids)
            if (!ids[0] || ids.length == 0) {
                this.$Message.warning("请选择删除项！");
                return Promise.reject();
            }
            return this.$MainApi
                .studentBatchRemove({
                    data: {
                        ids: ids,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "删除成功");
                        return Promise.resolve();
                    } else {
                        this.$Message.warning(res.message || "删除失败");
                        return Promise.reject();
                    }
                });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>