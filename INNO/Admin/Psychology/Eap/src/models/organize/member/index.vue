<template>
    <leftRightLayout @organize-change="organizeChange">
        <organizeView slot="left" ref="organizeRef" searchClick :isModal="false" :showCheckbox="false" :expandNode="false" @on-select-change="organizeChange"></organizeView>
        <searchForm slot="right-head" :structureInfo="selectStructure" :searchForm="searchForm" @search="loadData" @addMember="addMemberEvent" @removeMember="removeMembers"></searchForm>
        <hold-layout slot="right" >
            <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent" @on-select="onSelect">
                <template slot="gender" slot-scope="{ row }">
                    <span v-if="row.gender == 0">保密</span>
                    <span v-else-if="row.gender == 1">男</span>
                    <span v-else-if="row.gender == 2">女</span>
                    <span v-else>未知</span>
                </template>
                <template slot="handle" slot-scope="{ row }">
                    <div class="operate-area">
                        <a class="operate" @click="editMemberEvent(row)" v-hasAction="'structure_member_update'">编辑</a>
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
import organizeView from "@/components/view-components/organize-view/index"
export default {
    name: "memberManage",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
        editMember,
        leftRightLayout,
        organizeView
    },
    data() {
        return {
            searchForm: {
                ids: 0,
                is_register: 0, //0是所有, 1是已注册, 没有2
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
        init(){
            this.selectStructure.title = this._structureName;
            this.$refs["organizeRef"] && this.$refs["organizeRef"].getData([], { expandHold: true });
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .getStructureMemberList({
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
        organizeChange(detail){
            console.log("detail", detail)
            detail = detail || {};
            let row = detail.row;
            this.searchForm.ids = row.id;
            this.selectStructure = row || {};
            this.loadData();
        },
        selectDataEvent(selectData) {
            this.selectData = selectData || [];
            console.log('selectDataEvent',selectData)
        },
        onSelect(selectData,last) {
            // this.selectData = selectData || [];
            console.log('onSelect',selectData,last)
        },
        addMemberEvent(detail = {}) {
            if(detail.isBatch){
                this.$UIModule({
                    mode: "batch-import",
                    options: {
                        canCreate: { upload: true, download: true },
                        uploadUrl: "batchImportStructureMember",
                        downloadUrl: "batchTplStructureMember",
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