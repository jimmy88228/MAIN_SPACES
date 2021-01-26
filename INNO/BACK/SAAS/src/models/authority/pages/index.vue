<template>
    <div class="cev-root bg-page spin-box">
        <div class="cev-root" v-bar>
            <div class="bg-shadow padding20 list-box">
                <div class="cev-toolbar">
                    <div class="left">
                        <!-- <Select
                            class="inputable selecter"
                            placeholder="类型"
                            v-model="adminType"
                            filterable
                            clearable
                            transfer
                        >
                            <Option :value="1">高级管理员</Option>
                            <Option :value="2">普通管理员</Option>
                        </Select>
                        <Select
                            class="inputable selecter"
                            placeholder="状态"
                            v-model="enable"
                            filterable
                            clearable
                            transfer
                        >
                            <Option :value="0">已关闭</Option>
                            <Option :value="1">已启用</Option>
                        </Select>
                        <DatePicker
                            class="inputable date-selecter-range"
                            type="datetimerange"
                            placeholder="创建时间"
                            v-model="dateRange"
                            split-panels
                            clearable
                            transfer
                        ></DatePicker> -->
                        <Input class="inputable" placeholder="账号" v-model="keywords" clearable/>
                        <Button type="primary" @click="e=>loadData()">
                            <i class="iconfont min r5 icon-search"></i>搜索
                        </Button>
                    </div>
                    <div class="right">
                        <Button type="primary" @click="showAddDialog" v-if="$store.state.authJson.btn_add_role">新建角色</Button>
                    </div>
                </div>


                <Table
                    ref="table"
                    class="table"
                    :columns="columns"
                    :data="list"
                    @on-sort-change="handleSortChange"
                    border
                >
                    <template slot="action" slot-scope="p">
                        <Button
                            class="item-table-action"
                            type="primary"
                            size="small"
                            @click="edit(p.index)"
                            v-if="$store.state.authJson.btn_edit_role"
                        >编辑</Button>
                        <Button
                            class="item-table-action"
                            type="success"
                            size="small"
                            @click="editAuthority(p.index)"
                            v-if="$store.state.authJson.btn_edit_role"
                        >编辑权限</Button>
                        <Poptip confirm title="确定删除该角色？" @on-ok="del(p.index)" transfer>
                            <Button
                                class="item-table-action"
                                type="error"
                                size="small"
                                v-if="p.row.adminType != 1 && $store.state.authJson.btn_remove_role"
                            >删除</Button>
                        </Poptip>
                    </template>
                </Table>
                <Page
                    v-if="showPage"
                    :total="count"
                    :current="pageIndex"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="e=>loadData(e)"
                    @on-page-size-change="handlePageSizeChange"
                    show-sizer
                    show-elevator
                    show-total
                    transfer
                ></Page>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
        <RoleEditDialog ref="editDialog" @on-edited="handleUpdate" @on-added="handleAdded"></RoleEditDialog>
    </div>
</template>

<script>
import StringHelper from "@/helper/utils/string-util";
import { MainApi } from "@/helper/manager/http-manager";
import RoleEditDialog from "../components/role-edit-dialog";
import ListPageMixin from "@/helper/mixin/list-page";
import Mixin from "./mixin";

export default {
    name: "Admins",
    mixins: [ListPageMixin, Mixin],
    components: { RoleEditDialog },
    data() {
        return {
            adminType: null,
            enable: null
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        showAddDialog() {
            this.$refs.editDialog.setData().show();
        },
        onClearOptions() {
            this.adminType = null;
            this.enable = null;
        },
        onLoadData(index, data) {
            if (this.adminType) {
                data.adminType = this.adminType;
            }
            if (this.enable !== null && this.enable !== undefined) {
                data.enable = this.enable;
            }
            this.loading = true;
            return MainApi.getRoleList({
                data: data
            })
                .then(res => {
                    if (res.code === "1") {
                        this.pageIndex = index;
                        this.data = res.data;
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "数据加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        change(index, enable) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            let _enable = enable ? 1 : 0;

            this.$nextTick(() => {
                item.enable = enable ? 0 : 1;
                return this.updateEnable(item.id, _enable).then(
                    e => e && (item.enable = _enable)
                );
            });
        },
        edit(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.$refs.editDialog.setData(index, { ...item }).show();
        },
        editAuthority(index){
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.$router.push({
                name: "SetAuthority",
                query: {
                    roleId: item.roleId,
                    roleName: item.roleName
                }
            })
        },
        del(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.loading = true;
            MainApi.deleteAdminRole({
                data: {
                    id: item.roleId
                }
            })
            .then(res => {
                if (res.code === "1") {
                    this.$Message.success("删除成功");
                    return this.handleUpdate();
                } else {
                    return Promise.reject(res.msg);
                }
            })
            .catch(msg => {
                this.$Message.error(msg || "删除失败");
            })
            .finally(() => {
                this.loading = false;
            });
        },
        updateEnable(id, enable) {
            this.loading = true;
            return MainApi.postAdminUpdate({
                data: {
                    id: id,
                    enable: enable
                }
            })
            .then(res => {
                if (res.code === "1") {
                    this.$Message.success("修改成功");
                    return true;
                } else {
                    return Promise.reject(res.msg);
                }
            })
            .catch(msg => {
                this.$Message.error(msg || "修改失败");
                return false;
            })
            .finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>
