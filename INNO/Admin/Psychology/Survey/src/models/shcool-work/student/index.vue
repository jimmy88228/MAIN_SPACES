<template>
    <!--  -->
    <leftRightLayout>
        <classLinkageView ref="classLinkageViewRef" slot="left" @select="changeClass" ></classLinkageView>
        <hold-layout :isFull="true" slot="right">
            <searchForm class="m-b-10" :searchForm="searchForm" @search="search()" @exportList="exportList" @batchImport="batchImport"  @batchRemove="batchRemove" @add="addStudent"></searchForm>
            <rewrite-area class="m-b-10 flex-s-c w-break">
                <div class="f-shrink0">{{searchForm.class||""}}学生列表 <span class="bold">{{data.total||0}}位</span></div>
                <div class="grey-circle f-shrink0" v-show="admin_list.length > 0"></div>
                <div class="flex-s-c flex-wrap">
                        <div class="m-r-30 relative" v-for="(item,i) in admin_list" :key="i" v-show="i < 3">班主任：<span>{{item.user_name}}</span>
                        <Tooltip :transfer="true" placement="bottom-start" class="teacher-tooltip">
                            <div slot="content">
                                <div>{{item.user_name}}</div>
                                <div>{{item.mobile_phone}}</div>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </rewrite-area>
            <rewrite-table ref="myTable" class="full-table" :columns="columns" :data="list" :loading="tableLoading" @on-selection-change="selectDataEvent">
                <template slot="class_grade" slot-scope="{ row }">
                    <div class="operate-area">
                        <span >{{row.class_grade}}（{{row.school_year}}级）</span>
                    </div>
                </template>
                <template slot="handle" slot-scope="{ row, index }">
                    <div class="operate-area">
                        <a class="operate" @click="editStudentEvent(row)" v-hasAction="'student_management_update'">编辑</a>
                        <a class="operate" @click="migrateStudent(row, index)" >迁移</a>
                    </div>
                </template>
            </rewrite-table>
            <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
        </hold-layout>
        <div slot="modal">
            <editStudent ref="editStudentRef" :title="editTitle" @confirm="handleUpdate"></editStudent>
            <classLinkAgeModal ref="classLinkAgeModalRef" :multiple="true" @confirm="exportListConfirm"></classLinkAgeModal>
            <studentMigrate ref="studentMigrateRef" @confirm="loadData"></studentMigrate>
        </div>
    </leftRightLayout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editStudent from "./edit-student/index.vue";
import leftRightLayout from "@/components/view-components/hold-layout/left-right-layout.vue"
import classLinkageView from "@/components/view-components/class-linkage-view/index.vue"
import classLinkAgeModal from "@/components/view-components/class-linkage-view-modal/index.vue";
import studentMigrate from "./components/student-migrate/index.vue";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
export default {
    name: "studentIndex",
    mixins: [ListMixin, mixins],
    components: { leftRightLayout, classLinkageView, classLinkAgeModal, studentMigrate, searchForm, editStudent ,mpNotice},
    data() {
        return {
            data:{},
            searchForm: {
                searchq:"",
                // grade_id: 0,
                campus_id:"",
                school_year:"",
                grade_name:"",
                class_id:"",
                class:"",
            },
            jobIdCol:[],
            admin_list:[],
            selectData: [],
            editTitle: "学生信息编辑"
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
        changeClass(e){
            let selectData = e.selectData || {};
            let searchForm = JSON.parse(JSON.stringify(this.searchForm)) || {};
            // 如果selectData有相同字段则直接赋值，没有则赋值空字符串
            Object.keys(searchForm).forEach(key=>{
                searchForm[key] = typeof(selectData[key]) == 'undefined' ? "" : selectData[key]
            })
            searchForm.grade_name = selectData.grade || "";
            this.searchForm = searchForm
            this.loadData()
        },
        search(){
            // 关键词搜索清空左边班级请求参数
            if(this.searchForm.searchq){
                this.$refs["classLinkageViewRef"] && this.$refs["classLinkageViewRef"].intSelect();
                this.searchForm.campus_id = 0;
                this.searchForm.class = "";
                this.searchForm.class_id = "";
                this.searchForm.grade_name = "";
                this.searchForm.school_year = "";
            }
            this.loadData()
        },
        selectDataEvent(selectData) {
            this.selectData = selectData || [];
        },
        onLoadData(page, extraData) {
            if(!this.searchForm.class_id && !this.searchForm.searchq){
                this.data = {
                    total: 0,
                    list: [],
                };
                this.admin_list = [];
                return Promise.resolve()
            }
            return this.$MainApi
                .studentManagementList({
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
                        this.admin_list = data.admin_list;
                    }
                })
        },
        addStudent(){
            this.editTitle = "添加学生";
            let searchForm = this.searchForm || {};
            let classForm = {
                campus_id:searchForm.campus_id,
                school_year:searchForm.school_year,
                class_grade:searchForm.grade_name,
                class_id:searchForm.class_id,
                isAdd:1,
            }
            this.$refs["editStudentRef"] &&
                this.$refs["editStudentRef"].showDrawer(classForm);
        },
        editStudentEvent(row) {
            this.editTitle = "学生信息编辑";
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
        migrateStudent(row){
            this.$refs["studentMigrateRef"] && this.$refs["studentMigrateRef"].showModal({
                studentInfo: row
            });
        },
        batchImport(){
          this.$UIModule({
              mode: "batch-import",
              options: {
                  canCreate: { upload: true, download: true },
                  uploadUrl: "studentManagementBatchImport",
                  downloadData:[
                        {
                            icon: require("@/assets/images/file/add.png"),
                            title:"我要导入新的学生",
                            downloadUrl:"studentManagementBatchTpl",
                            extraData:{
                                import_type:1
                            },
                        },
                        {
                            icon: require("@/assets/images/file/upload.png"),
                            title:"我要更新学生信息",
                            downloadUrl:"studentManagementBatchTpl",
                            extraData:{
                                import_type:2
                            },
                        }
                  ],
              },
              success: () => {
                  this.loadData();
              },
          });
        },
        exportList(){
            let ref = "classLinkAgeModalRef"
            this.$refs[ref] && this.$refs[ref].showModal()
        },
        exportListConfirm(e){
            if(e instanceof Array && e.length>0){
                let class_ids = e.reduce((total, currentValue)=>{
                    if(typeof(currentValue.class_id) != 'undefined'){
                        return total.concat(currentValue.class_id)
                    }else{
                        return total
                    }
                },[])
                this.$MainApi.studentManagementExport({
                    data: {
                        class_ids
                    }
                }).then((res) => {
                    if(res.code && res.data){
                        let data = res.data;
                        this.jobIdCol.push(data);
                        this.$nextTick(() => {
                            this.$refs[`notice${data}`][0].showNotice(data);
                        });
                    }
                })
            }
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

<style lang="less" scoped>
    .grey-circle{
        margin: 0 9px 0 41px;
        width: 22px;
        height: 22px;
        background: #D8D8D8;
        border-radius: 50%;
    }
    .teacher-tooltip{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>