<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" :hideSelect="hideSelect" @search="loadData" @batchImport="batchCreate" @add="editClass"></searchForm>
        <rewrite-table ref="myTable" class="full-table"  :columns="columns" :data="list" :loading="tableLoading">
            <template slot="grade" slot-scope="{ row }">
                <p>
                    <span>{{row.grade}}（{{row.school_year}}）</span>
                </p>
            </template>
            <template slot="admin" slot-scope="{ row }">
                <p>
                    <span v-for="(item, index) in row.get_admin" :key="item.admin_id">{{item.get_user && item.get_user.user_name}}<template v-if="row.get_admin.length > 1 && index < (row.get_admin.length - 1)">，</template></span>
                    <span class="invalid" v-if="!row.get_admin || row.get_admin.length == 0">待绑定</span>
                </p>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <!-- <div class="operate-area">
                    <a class="operate" @click="editClass(row)" v-hasAction="'class_maintenance_edit'">编辑</a>
                    <Poptip
                        confirm
                        placement="left"
                        title="确定删除该班级吗？"
                        @on-ok="removeClass(row.id)"
                        v-hasAction="'class_maintenance_batch_remove'">
                        <a class="operate">删除</a>
                    </Poptip>
                    
                </div>
                <div class="operate-area" v-hasAction="'class_maintenance_bindadmin'">
                    <a class="operate" @click="bindAdmin(row, index)">绑定班主任</a>
                </div> -->
                <div class="operate-area">
                    <!-- <a class="operate" @click="editClass(row)" v-hasAction="'class_maintenance_edit'">编辑</a> -->
                    <a class="operate" @click="bindAdmin(row, index)" v-hasAction="searchForm.structure_id ? true : 'class_maintenance_bindadmin'">绑定班主任</a>
                </div>
            </template>
        </rewrite-table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <!-- <editClass ref="editClassRef" :title="editClassTitle" :gradeData="gradeData" @confirm="handleUpdate"></editClass> -->
        <editClass ref="editClassRef" :title="editClassTitle" @confirm="handleUpdate"></editClass>
        <bindAdmin ref="bindAdminRef"></bindAdmin>
    </hold-layout>
</template>

<script>
import searchForm from "./search-form.vue";
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import editClass from "./edit-class/index";
import bindAdmin from "./edit-class/bind-admin/index";
export default {
    name: "classMaint",
    components: {
        editClass,
        bindAdmin,
        searchForm,
    },
    mixins: [ListMixin, mixins],
    data() {
        return {
             searchForm: {
                pageSize: '',
                page: '',
                structure_id: '',
                campus_id:'',
                grade_type:'',
                grade_name: '',
                class_name: '',
                school_year: '',
            },
            editClassTitle: "",
            hideSelect: []
            // gradeData: [],
        };
    },
    methods: {
        init(){
            let schoolId = this.pageQuery.schoolId || 0;
            this.searchForm.structure_id = schoolId;
            this.searchForm.schoolId = schoolId;
            if(schoolId){
                this.hideSelect = ['area', 'street', 'school']
            }
            
        },
        editClass(row) {
            row = row || {
                school_id: this.pageQuery.schoolId || 0,
                school_name: this.pageQuery.schoolName || 0
            }
            this.editClassTitle = Number(row.class_id) ? "编辑班级" : "创建班级";
            this.$refs["editClassRef"].showDrawer(row);
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .classMaintList({
                    data: {
                        ...this.searchForm,
                        ...extraData,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        // this.gradeData = data.grade_data;
                        this.data = {
                            total: data.total,
                            list: data.items,
                        };
                    }
                });
        },
        batchCreate() {
            this.$UIModule({
                mode: "batch-import",
                props: {
                    upLoadPayLoad: {
                        school_id: this.pageQuery.schoolId || this._getReqStructureId || 0
                    },
                    downloadPayLoad: {
                        school_id: this.pageQuery.schoolId || this._getReqStructureId || 0
                    }
                },
                options: {
                    canCreate: { upload: true, download: true },
                    uploadUrl: "classMaintBatchImport",
                    downloadUrl: "classMaintBatchTpl",
                },
                success: () => {
                    this.loadData();
                },
            });
        },
        bindAdmin(row, index) {
            let classId = row.class_id || 0;
            this.$refs["bindAdminRef"] &&
                this.$refs["bindAdminRef"].showModal({
                    classId: row.class_id || 0,
                    className: row.class_name || '',
                    schoolYear: row.school_year || '',
                    confirm: (data) => { // 待处理
                        let adminList = [];
                        for(let i = 0; i < data.length; i++){
                            adminList.push({
                                admin_id: data[i].admin_id,
                                get_user: {
                                    user_name: data[i].admin_name
                                }
                            })
                        }
                        this.$set(this.data.list[index], "get_admin", adminList);
                    },
                });
        },
        removeClass() {
          this.$Message.warning("功能开发中....")
        },
    },
    mounted() {
        this.init();
        this.loadData();
    },
};
</script>

<style>
</style>