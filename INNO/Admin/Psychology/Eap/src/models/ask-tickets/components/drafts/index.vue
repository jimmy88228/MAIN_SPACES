<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" @search="loadData" ></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="state" slot-scope="{ row }">
                <i-switch v-model="row.admin_state" size="large" :loading="row.stateLoading" :true-value="1" :false-value="0" :before-change="()=>{return beforeChangeState(index, row)}" v-hasAction="'people_management_state'">
                    <span slot="open">正常</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </template>
            <template slot="handle" slot-scope="{ row }">
                <div class="operate-area">
                    <a class="operate" @click="preViewTicket(row)">预览</a>
                    <a class="operate" @click="editDrafts(row)">编辑</a>
                    <Poptip
                        confirm
                        placement="left"
                        :title="'是否发布该草稿问券？'"
                        @on-ok="publishTicket(row)">
                        <a class="operate">发布</a>
                    </Poptip>
                    <Poptip
                        confirm
                        placement="left"
                        :title="'是否移除该草稿问券？'"
                        @on-ok="removeDrafts(row)">
                        <a class="operate">删除</a>
                    </Poptip>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import dateUtil from "@/helper/utils/date-util.js";
export default {
    name: "ticketsDrafts",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
    },
    data() {
        return {
            searchForm: {
                show_type: 2, //  1已发布，2草稿箱
                searchq: '',
                state: -1,
            },
            stating: false,
            removing: false
        };
    },
    methods: {
        init(){
            this.loadData();
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .questionnaireList({
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
                            let item = items[i] || {};
                            if(item.update_time){
                                item._update_time = dateUtil.format(new Date(item.update_time), "yyyy年MM月dd日 HH:mm")
                            }
                        }
                        this.data = {
                            total: data.total,
                            list: items,
                        };
                    }
                });
        },
        publishTicket(row){
            if(!parseInt(row.id)){
                this.$Message.warning("无效ID");
                return;
            }
            if(this.stating){ return; }
            this.stating = true;
            this.$MainApi.questionnaireState({
                data: {
                    id: row.id
                },
                other: {
                    isMsg: true
                }
            }).then((res)=>{
                if(res.code){
                    this.handleUpdate()
                }
            }).finally(()=>{
                this.stating = false;
            })
        },
        removeDrafts(row){
            if(this.removing){ return; }
            this.removing = true;
            return this.$MainApi
                .questionnaireDelete({
                    data: {
                        id: row.id
                    },
                    other: {
                        isMsg: true
                    }
                }).then((res)=>{
                    if(res.code){
                        this.handleUpdate()
                    }
                }).finally(()=>{
                    this.removing = false;
                })
        },
        editDrafts(row){
            this.$router.push({
                name: "askTicketsDetail",
                query: {
                    id: row.id
                }
            })
        },
        preViewTicket(row){
            this.$UIModule({
                mode: "code-view",
                props: {
                    codeTip: `<p class="big-tip">${row.title||""}</p>`,
                    hideTab: true
                },
                options: {
                    path: "pages/questionnaire/answer/answer",
                    params: {
                        id: row.id,
                    },
                    codeId: `questionnaire:${row.id}`
                }
            });
        }
    },
    mounted() {
    },
};
</script>

<style>
</style>