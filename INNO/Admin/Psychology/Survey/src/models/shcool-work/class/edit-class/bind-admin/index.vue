<template>
    <div>
        <Modal v-model="modalShow" :width="1100" class="hide-close class-bind-admin-modal">
            <searchForm :searchForm="searchForm" @search="loadData" @addAdmin="addAdmin" @batchAdd="batchAdd"></searchForm>
            <Table ref="myTable" :columns="columns" height="500" :data="list" border :loading="tableLoading">
                <template slot="school" slot-scope="{ row, index }">
                    {{_structureName}}
                </template>
                <template slot="class" slot-scope="{ row, index }">
                    <span v-for="(_item, _index) in row.get_sa" :key="_index">
                        {{_item.get_name && _item.get_name.structure_name}}
                        <template v-if="row.get_sa.length > (_index + 1)">,</template>
                    </span>
                </template>
                <template slot="state" slot-scope="{ row, index }">
                    <i-switch v-model="row.admin_state" :before-change="()=>{return beforeChangeState(index, row)}" :true-value="1" :false-value="0" size="large" :loading="row.stateLoading" v-hasAction="'class_maintenance_adminstate'">
                        <span slot="open">正常</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </template>
                <template slot="handle" slot-scope="{ row, index }">
                    <div class="operate-area">
                        <a class="operate" @click="editAdmin(row)" v-hasAction="'class_maintenance_adminupdate'">编辑</a>
                        <Poptip confirm title="确定删除该管理员？" placement="left" @on-ok="removeItem(row.admin_id, index)" v-hasAction="'class_maintenance_adminremove'">
                            <a class="operate">删除</a>
                        </Poptip>
                        <a class="operate" @click="resetPAW(row.admin_id)" v-hasAction="'class_maintenance_adminrest'">重置密码</a>
                    </div>
                </template>
            </Table>
            <rewrite-page :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
            <div slot="footer">
                <!-- <Button @click="modalShow = false">取消</Button> -->
                <Button type="primary" @click="confirmBindAdmin">确定</Button>
            </div>
        </Modal>
        <editAdmin ref="editAdminRef" :title="editTitle" @confirm="updateAdmin"></editAdmin>
    </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import editAdmin from "../edit-admin/edit-admin-drawer.vue";
import mixins from "./mixins";
export default {
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
        editAdmin,
    },
    data() {
        return {
            modalShow: false,
            searchForm: {
                class_id: 0,
                class_name: "",
                searchq: "",
                state: -1,
            },
            editTitle: "",
            confirmCallback: null,
        };
    },
    methods: {
        showModal({ classId, className, confirm }) {
            this.modalShow = true;
            this.searchForm.class_id = Number(classId) || 0;
            this.searchForm.class_name = className || 0;
            this.confirmCallback = confirm;
            this.loadData();
            console.log("searchForm", this.searchForm);
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .classMaintBindAdmin({
                    data: {
                        ...this.searchForm,
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
        updateAdmin() {
            this.handleUpdate();
        },
        addAdmin() {
            this.editTitle = "添加人员";
            let classId = this.searchForm.class_id;
            let className = this.searchForm.class_name;
            this.$refs["editAdminRef"] &&
                this.$refs["editAdminRef"].showModal({ classId, className });
        },
        editAdmin(row) {
            this.editTitle = "编辑人员";
            let classId = this.searchForm.class_id;
            let className = this.searchForm.class_name;
            this.$refs["editAdminRef"] &&
                this.$refs["editAdminRef"].showModal({
                    adminId: row.admin_id,
                    classId,
                    className,
                    isRegister: row.is_register
                });
        },
        batchAdd() {
            this.$Message.warning("功能开发中...");
        },
        removeItem(adminId, index) {
            if (!adminId) {
                this.$Message.warning("无效人员id");
                return Promise.reject();
            }
            return this.$MainApi
                .classMaintAdminRemove({
                    data: {
                        admin_id: adminId,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.delItem(index);
                        this.$Message.success(res.message || "删除成功");
                    } else {
                        this.$Message.warning(res.message || "删除失败");
                    }
                });
        },
        resetPAW(adminId) {
            if (!adminId) {
                this.$Message.warning("无效人员id");
                return Promise.reject();
            }
            return this.$MainApi
                .classMaintAdminRest({
                    data: {
                        admin_id: adminId,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "重置成功");
                        return Promise.resolve();
                    } else {
                        this.$Message.warning(res.message || "重置失败");
                        return Promise.reject();
                    }
                });
        },
        setAdminState(adminId, adminState) {
            if (!adminId) {
                this.$Message.warning("无效人员id");
                return Promise.reject();
            }
            return this.$MainApi
                .classMaintAdminState({
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
        confirmBindAdmin() {
            let list = this.data.list || [];
            let bindAdmins = list.filter((item) => {
                return item.admin_state == 1;
            });
            this.modalShow = false;
            typeof this.confirmCallback == "function" &&
                this.confirmCallback(bindAdmins);
        },
    },
};
</script>

<style lang="less">
.class-bind-admin-modal{
    .ivu-modal-mask{
    z-index: 1002 !important;
  }
  .ivu-modal-wrap{
    z-index: 1002 !important;
  }
}
</style>