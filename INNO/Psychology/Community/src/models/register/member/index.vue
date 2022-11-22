<template>
    <hold-layout :isFull="true">
        <searchForm :structureInfo="selectStructure" :searchForm="searchForm" @search="loadData"></searchForm>
        <Table class="full-table" ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent" @on-select="onSelect">
            <template slot="handle" slot-scope="{ row }">
                <div class="operate-area">
                    <a class="operate" @click="editMemberEvent(row)">查看详情</a>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editMember ref="editMemberRef" :title="editTitle" @confirm="handleUpdate"></editMember>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import editMember from "./edit-member/edit-member.vue";
export default {
    name: "memberManage",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
        editMember
    },
    data() {
        return {
            searchForm: {
                stucture_ids: [],
                searchq: ""
            },
            editTitle: "",
            selectStructure: {
                id: -1,
                title: ""
            },
            selectData: []
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
            let searchForm = this.searchForm || {};
            let stucture_id = (searchForm.stucture_ids && searchForm.stucture_ids.length) ? searchForm.stucture_ids.slice(-1)[0] : 0;
            return this.$MainApi
                .registeredUserList({
                    data: {
                        ...this.searchForm,
                        stucture_id: stucture_id,
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
                        this.data = {
                            total: data.total,
                            list: items,
                        };
                    }
                });
        },
        selectDataEvent(selectData) {
            this.selectData = selectData || [];
        },
        onSelect(selectData,last) {
        },
        editMemberEvent(row) {
            this.editTitle = "用户详情";
            this.$refs["editMemberRef"] &&
                this.$refs["editMemberRef"].showDrawer(row);
        },
        removeMembers(detail){
            let ids = this.ids;
            this.batchRemoveActReq(ids).then(()=>{
                this.handleUpdate();
            })
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
<style lang="less" scoped>
</style>