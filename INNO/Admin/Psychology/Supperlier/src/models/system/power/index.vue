<template>
    <hold-layout :isFull="true" >
        <searchForm :searchForm="searchForm" @search="loadData" @addAdmin="addMemberEvent"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="state" slot-scope="{ row }">
                <i-switch v-model="row.state" size="large" :loading="row.stateLoading" :true-value="1" :false-value="2" :before-change="()=>{return beforeChangeState(index, row)}" v-hasAction="true">
                    <span slot="open">正常</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" @click="editMemberEvent(row)" v-hasAction="true">编辑</a>
                    <a class="operate" @click="resetPWD(row)" v-hasAction="true">重置密码</a>
                    <!-- <Poptip confirm title="确定删除改人员吗？" placement="left" @on-ok="removeItem(row.id, index)" v-hasAction="'admin_user_delete'">
                        <a class="operate">删除</a>
                    </Poptip> -->
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editMember ref="editMemberRef" :title="editTitle" @confirm="handleUpdate"></editMember>
        <resetPwd ref="resetPwdRef" @success="handleUpdate"></resetPwd>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import editMember from "./edit-member/edit-member.vue";
import resetPwd from "./reset-pwd/index";
export default {
    name: "memberManage",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
        editMember,
        resetPwd,
    },
    data() {
        return {
            searchForm: {
                searchq: "",
            },
            editTitle: "",
        };
    },
    methods: {
        onLoadData(page, extraData) {
            let searchForm = JSON.parse(JSON.stringify(this.searchForm));
            return this.$MainApi
                .adminSettingList({
                    data: {
                        ...searchForm,
                        ...extraData,
                    },
                    other: {
                        isErrorMsg: true
                    }
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
            this.editTitle = "新增人员";
            this.$refs["editMemberRef"] &&
                this.$refs["editMemberRef"].showModal({});
        },
        editMemberEvent(row) {
            this.editTitle = "编辑管理人员";
            this.$refs["editMemberRef"] &&
                this.$refs["editMemberRef"].showModal({ adminInfo: row });
        },
        beforeChangeState(index, row) {
            let id = row.id || 0;
            let state = row.state || 0;
            let set_admin_state = state == 1 ? 2 : 1;
            this.$set(row, "stateLoading", true);
            return new Promise((rs, rj) => {
                this.setAdminState(id, set_admin_state)
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
                    //             "state",
                    //             set_admin_state
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
                .adminSettingState({
                    data: {
                        admin_id: id,
                        admin_state: state,
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
        // removeItem(id, index) {
        //     this.batchRemoveActReq(id).then(() => {
        //         this.delItem(index);
        //     });
        // },
        // batchRemoveActReq(ids) {
        //     if (!(Number(ids) > 0)) {
        //         this.$Message.warning("请勾选删除项！");
        //         return Promise.reject();
        //     }
        //     this.tableLoading = true;
        //     return this.$MainApi
        //         .adminUserDelete({
        //             data: {
        //                 id: ids,
        //             },
        //         })
        //         .then((res) => {
        //             if (res.code) {
        //                 this.$Message.success(res.message || "删除成功");
        //                 return Promise.resolve();
        //             } else {
        //                 this.$Message.warning(res.message || "删除失败");
        //                 return Promise.reject();
        //             }
        //         })
        //         .finally(() => {
        //             this.tableLoading = false;
        //         });
        // },
        resetPWD(row) {
            this.$refs["resetPwdRef"] &&
                this.$refs["resetPwdRef"].showDrawer({ adminInfo: row });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>