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
                {{row.structure_type == 'edu_class' ? (row.getpname && row.getpname.p_name) : row.p_structure_name ? row.p_structure_name + ' / ' + row.structure_name : row.structure_name}}
            </template>
            <template slot="get_class" slot-scope="{ row }">
                {{row.get_class && (row.get_class.grade + row.get_class.class)}}
            </template>
            <template slot="handle" slot-scope="{ row }">
                <div class="operate-area">
                    <a class="operate" @click="editMemberEvent(row)" v-hasAction="[row.handle && row.handle.edit]">编辑</a>
                    <a class="operate" @click="resetPWD(row)">重置密码</a>
                    <Poptip confirm title="确定删除改人员吗？" placement="left" @on-ok="removeItem(row.admin_id, index)" v-hasAction="'people_management_remove'">
                        <a class="operate">删除</a>
                    </Poptip>

                </div>
            </template>
        </rewrite-table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <addMember ref="addMemberRef" @confirm="handleUpdate"></addMember>
        <editMember ref="editMemberRef" :title="editTitle" @confirm="handleUpdate"></editMember>
        <resetPwd ref="resetPwdRef"></resetPwd>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import editMember from "./edit-member/edit-member.vue";
import addMember from "./add-member/index.vue";
import resetPwd from "./reset-pwd/index";
export default {
    name: "memberManage",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
        editMember,
        addMember,
        resetPwd
    },
    data() {
        return {
            searchForm: {
                area_id: 0,
                school_id: 0,
                campus_id: 0,
                class_id: 0,
                searchq: "",
                role_type: "",
                state: -1,
            },
            editTitle: "",
        };
    },
    methods: {
        init(){
            let _columns = []
            let hasClass = this._structureType == "edu_class";
            let hasStructure = !this._structureLimit(['edu_school', 'edu_class']);
            this.columns.map((item)=>{
                let isAdd = false;
                if(item.slot == "get_class" && hasClass){
                    isAdd = true;
                } else if(item.slot == "structure" && hasStructure){
                    isAdd = true;
                } else if(item.slot != "get_class" && item.slot != "structure"){
                    isAdd = true;
                }
                if(isAdd){
                    _columns.push(item)
                }
            })
            this.columns = _columns || [];
        },
        onLoadData(page, extraData) {
            let searchForm = JSON.parse(JSON.stringify(this.searchForm));
            if(!this._structureLimit(['edu_area', 'edu_street'])){
                delete searchForm.school_id;
            } 
            return this.$MainApi
                .peopleList({
                    data: {
                        ...searchForm,
                        ...extraData,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let items = data.items || [];
                        for (let i = 0; i < items.length; i++) {
                            items[i].stateLoading = false;
                        }
                        this.data = {
                            total: data.total,
                            list: items,
                        };
                    }
                });
        },
        addMemberEvent() {
            this.editTitle = "新增管理人员";
            if(this._structureLimit(['edu_school', 'edu_class'])){
                this.$refs["addMemberRef"] &&
                this.$refs["addMemberRef"].showModal();
            } else {
                this.$refs["editMemberRef"] &&
                this.$refs["editMemberRef"].showDrawer({});
            }
            
        },
        editMemberEvent(row) {
            this.editTitle = "编辑管理人员";
            this.$refs["editMemberRef"] &&
                this.$refs["editMemberRef"].showDrawer({ adminInfo: row });
        },
        beforeChangeState(index, row) {
            let adminId = row.admin_id || 0;
            let admin_state = row.admin_state || 0;
            let set_admin_state = admin_state == 1 ? 0 : 1;
            this.$set(row, "stateLoading", true);
            return new Promise((rs, rj) => {
                this.setAdminState(adminId, set_admin_state)
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
                    //             set_admin_state
                    //         );
                    //     });
                    // });
            });
        },
        setAdminState(adminId, adminState) {
            if (!adminId) {
                this.$Message.warning("无效人员id");
                return Promise.reject();
            }
            return this.$MainApi
                .peopleState({
                    data: {
                        admin_id: adminId,
                        admin_state: adminState,
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
        removeItem(id, index) {
            this.batchRemoveActReq(id).then(() => {
                this.delItem(index);
            });
        },
        batchRemoveActReq(ids) {
            if (!(Number(ids) > 0)) {
                this.$Message.warning("请勾选删除项！");
                return Promise.reject();
            }
            this.tableLoading = true;
            return this.$MainApi
                .peopleRemove({
                    data: {
                        admin_id: ids,
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
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        resetPWD(row) {
            this.$refs["resetPwdRef"] &&
                this.$refs["resetPwdRef"].showDrawer({ adminInfo: row });
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