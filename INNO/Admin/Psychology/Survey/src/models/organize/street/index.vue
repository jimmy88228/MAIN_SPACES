<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" @create="createStreet" @removeIds="batchRemoveItem()"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
            <template slot="contact_way" slot-scope="{ row }">
                <div class="p-5">
                    <p>{{row.contact}}</p>
                    <p class="p-b-5"></p>
                    <p>{{row.contact_way}}</p>
                </div>
            </template>
            <template slot="admin" slot-scope="{ row }">
                <p >
                    <span v-for="(item, index) in row.get_admin" :key="item.admin_id">{{item.get_user && item.get_user.user_name}}<template v-if="row.get_admin.length > 1 && index < (row.get_admin.length - 1)">，</template></span>
                    <span class="invalid" v-if="!row.get_admin || row.get_admin.length == 0">待绑定</span>
                </p>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" @click="editStreet(row.id)" v-hasAction="'street_maintenance_update'">编辑</a>
                    <a class="operate" @click="removeItem(row.id, index)" v-hasAction="'street_maintenance_batch_remove'">删除</a>
                </div>
                <div class="operate-area">
                    <a class="operate" @click="bindAdmin(row, index)" v-hasAction="'street_maintenance_bindadmin'">绑定管理员</a>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editStreet ref="editStreetRef" :title="editStreetTitle" @confirm="handleUpdate"></editStreet>
        <bindAdmin ref="bindAdminRef"></bindAdmin>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editStreet from "./edit-street/index";
import bindAdmin from "./edit-street/bind-admin/index";
export default {
    name: "classMaint",
    components: {
        editStreet,
        searchForm,
        bindAdmin,
    },
    mixins: [ListMixin, mixins],
    data() {
        return {
            searchForm: {
                searchq: "",
            },
            editStreetTitle: "",
            selectData: [],
        };
    },
    computed: {
        ids() {
            let selectData = this.selectData || [];
            let ids = [];
            if (selectData instanceof Array) {
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].id) {
                        ids.push(selectData[i].id);
                    }
                }
            }
            return ids;
        },
    },
    methods: {
        onLoadData(page, extraData) {
            return this.$MainApi
                .streetMaintList({
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
        selectDataEvent(data) {
            this.selectData = data || [];
        },
        createStreet(detail) {
            if (detail.isBatch) {
                this.$UIModule({
                    mode: "batch-import",
                    options: {
                        canCreate: { upload: true, download: true },
                        uploadUrl: "batchImportStreetMaint",
                        downloadUrl: "batchTplStreetMaint",
                    },
                    success: () => {
                        this.loadData();
                    },
                });
            } else {
                this.editStreet();
            }
        },
        editStreet(id) {
            this.editStreetTitle = id ? "编辑街道" : "创建街道";
            this.$refs["editStreetRef"].showDrawer({ id: id });
        },
        bindAdmin(row, index) {
            let streetId = row.id || 0;
            this.$refs["bindAdminRef"] &&
                this.$refs["bindAdminRef"].showModal({
                    streetId: streetId,
                    confirm: (data) => {
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
        removeItem(id, index) {
            this.batchRemoveActReq([id]).then(() => {
                this.delItem(index);
            });
        },
        batchRemoveItem() {
            this.batchRemoveActReq(this.ids).then(() => {
                this.delItems(this.ids);
            });
        },
        batchRemoveActReq(ids) {
            if (ids.length == 0 || !ids[0]) {
                this.$Message.warning("请勾选删除项！");
                return Promise.reject();
            }
            this.tableLoading = true;
            return this.$MainApi
                .batchRemoveStreetMaint({
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
                })
                .finally(() => {
                    this.tableLoading = false;
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