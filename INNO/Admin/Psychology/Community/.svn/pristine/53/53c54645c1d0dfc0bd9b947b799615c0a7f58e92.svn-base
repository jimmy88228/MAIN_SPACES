<template>
    <leftRightLayout>
        <groupView type="member" slot="left" @change="changeGroupPoint"></groupView>
        <searchForm slot="right-head" :groupInfo="groupInfo" :searchForm="searchForm" @search="loadData" @addMember="addMemberEvent" @removeMember="removeMembers"></searchForm>
        <hold-layout slot="right" >
            <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent" @on-select="onSelect">
                <template slot="handle" slot-scope="{ row }">
                    <div class="operate-area">
                        <a class="operate" @click="editMemberEvent(row)">编辑</a>
                        <Poptip confirm title="确定删除该人员吗？" placement="left" @on-ok="removeItem(row.id, index)" v-hasAction="false">
                            <a class="operate">删除</a>
                        </Poptip>
                    </div>
                </template>
            </Table>
            <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
            <editMember ref="editMemberRef" :title="editTitle" @confirm="handleUpdate"></editMember>
        </hold-layout>
    </leftRightLayout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import editMember from "./edit-member/edit-member.vue";
import leftRightLayout from "@/components/view-components/layout/left-right-layout.vue"
import groupView from "@/models/components/group-view/index.vue";
export default {
    name: "memberManage",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
        editMember,
        leftRightLayout,
        groupView
    },
    data() {
        return {
            searchForm: {
                group_id: 0,
                searchq: ""
            },
            editTitle: "",
            groupInfo: {
                group_id: 0,
                group_name: "全部"
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
        init(){},
        onLoadData(page, extraData) {
            return this.$MainApi
                .getStructureGroupMemberList({
                    data: {
                        ...this.searchForm,
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
        changeGroupPoint(detail){
            this.searchForm.group_id = detail.group_id;
            this.groupInfo = detail || {};
            this.loadData();
        },
        selectDataEvent(selectData) {
            this.selectData = selectData || [];
            console.log('selectDataEvent',selectData)
        },
        onSelect(selectData,last) {
            // this.selectData = selectData || [];
        },
        addMemberEvent(detail = {}) {
            if(detail.isBatch){
                this.$UIModule({
                    mode: "batch-import",
                    options: {
                        canCreate: { upload: true, download: true },
                        uploadUrl: "batchImportGroupMember",
                        downloadUrl: "downloadBatchTplGroupMember",
                    },
                    success: () => {
                        this.loadData();
                    },
                });
            } else {
                this.editTitle = "新增人员";
                this.$refs["editMemberRef"] &&
                    this.$refs["editMemberRef"].showDrawer();
            }
            
        },
        editMemberEvent(row) {
            this.editTitle = "编辑人员";
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
        this.init();
        this.loadData();
    },
};
</script>
<style lang="less" scoped>
</style>