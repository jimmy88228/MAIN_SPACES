<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" @batchImport="batchImport" @add="addTeacher" @batchRemove="batchRemove"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" @click="editTeacherEvent(row)" v-hasAction="'student_file_update'">编辑</a>
                    <!-- <a class="operate" @click="getPsychicFile(row)" v-hasAction="'student_file_psychology_files'">心理档案</a> -->
                    <!-- <a class="operate" @click="removeItem(row.user_id, index)" v-hasAction="'student_file_batch_remove'">删除</a> -->
                </div>
            </template>
            <template slot="state" slot-scope="{ row }">
                <i-switch v-model="row.state" size="large" :loading="row.stateLoading" :true-value="1" :false-value="0" :before-change="()=>{return beforeChangeState(index, row)}" v-hasAction="true">
                    <span slot="open">正常</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editTeacher ref="editTeacherRef" :title="editTitle" @confirm="handleUpdate"></editTeacher>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editTeacher from "./edit-teacher/index.vue";
export default {
    name: "teacherIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm, editTeacher },
    data() {
        return {
            searchForm: {
                searchq: "",
            },
            selectData: [],
            editTitle: "编辑老师"
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
                .teacherManagementList({
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
        addTeacher(){
            this.editTitle = "新增教师";
            this.$refs["editTeacherRef"] &&
                this.$refs["editTeacherRef"].showDrawer();
        },
        editTeacherEvent(row) {
            this.editTitle = "编辑教师";
            this.$refs["editTeacherRef"] &&
                this.$refs["editTeacherRef"].showDrawer(row);
        },
        getPsychicFile(row) {
            this.$router.push({
                name: "memberPsychicFiles",
                query: {
                    userId: row.user_id || 0
                },
            });
        },
        batchImport(){
          this.$UIModule({
              mode: "batch-import",
              options: {
                  canCreate: { upload: true, download: true },
                  uploadUrl: "teacherManagementBatchImport",
                  downloadUrl: "teacherManagementBatchTpl",
              },
              success: () => {
                  this.loadData();
              },
          });
        },
        beforeChangeState(index, row) {
            let id = row.id || 0;
            let state = row.state || 0;
            let set_state = state == 1 ? 0 : 1;
            this.$set(row, "stateLoading", true);
            return new Promise((rs, rj) => {
                this.setAdminState(id, set_state)
                    .then(() => {
                        this.$set(row, "stateLoading", false);
                        return rs();
                    })
                    .catch(() => {
                        this.$set(row, "stateLoading", false);
                        return rj();
                    })
                    // .finally(() => {
                    //     this.$nextTick(() => {
                    //         this.$set(
                    //             this.data.list[index],
                    //             "admin_state",
                    //             set_state
                    //         );
                    //     });
                    // });
            });
        },
        setAdminState(id, state) {
            if (!id) {
                this.$Message.warning("无效人员id");
                return Promise.reject();
            }
            return this.$MainApi
                .teacherManagementState({
                    data: {
                        id: id,
                        value: state,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "修改成功");
                        return Promise.resolve();
                    } else {
                        this.$Message.warning(res.message || "修改失败");
                        return Promise.reject();
                    }
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