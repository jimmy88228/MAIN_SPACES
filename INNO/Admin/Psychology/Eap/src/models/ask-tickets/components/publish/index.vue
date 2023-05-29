<template>
    <hold-layout :isFull="true">
        <searchForm :searchForm="searchForm" :stateList="stateList" @search="loadData()" ></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
            
            <template slot="aim_count" slot-scope="{ row }">
                {{row.aim_count || '无'}}
            </template>
            <template slot="state_str" slot-scope="{ row }">
                <p class="m-b-5">{{row.state_str}}</p>
                <p class="notice C_B2">
                    <template v-if="row.is_state == 0 && row._begin_time">{{row._begin_time}} 开始</template>
                    <template v-else-if="row.is_state == 1 && row._end_time">{{row._end_time}} 结束</template>
                </p>
            </template>
            <template slot="handle" slot-scope="{ row }">
                <div class="operate-area">
                    <Poptip
                        confirm
                        placement="left"
                        :title="'是否' + (row.is_state == 2 ? '开启' : '关闭') + '该项？'"
                        @on-ok="switchTicket(row)">
                        <a class="operate" v-if="row.is_state < 3">
                            {{row.is_state == 2 ? '开启' : '关闭'}}
                        </a>
                    </Poptip>
                    <a class="operate" @click="copyTicket(row)">复制</a>
                    <a class="operate" v-if="row.is_state < 2" @click="shareTicket(row)">分享</a>
                </div>
                <div class="operate-area">
                    <a class="operate" @click="checkResult(row)">问券结果</a>
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
    name: "ticketsPublish",
    mixins: [ListMixin, mixins],
    components: {
        searchForm,
    },
    data() {
        return {
            stateList: [
                {
                    key: -1,
                    name: "全部"
                },
                {
                    key: 0,
                    name: "待开始"
                },
                {
                    key: 1,
                    name: "进行中"
                },
                {
                    key: 2,
                    name: "已关闭"
                },
                {
                    key: 3,
                    name: "已结束"
                }
            ],
            searchForm: {
                show_type: 1, //  1已发布，2草稿箱
                searchq: '',
                state: -1,
            },
            stating: false
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
                            if(item.begin_time){
                                item._begin_time = dateUtil.format(new Date(item.begin_time), "yyyy.MM.dd HH:mm")
                            }
                            if(item.end_time){
                                item._end_time = dateUtil.format(new Date(item.end_time), "yyyy.MM.dd HH:mm")
                            }
                        }
                        this.data = {
                            total: data.total,
                            list: items,
                        };
                    }
                });
        },
        switchTicket(row){
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
        shareTicket(row){
            this.$UIModule({
                mode: "code-view",
                props: {
                    codeTip: `<p class="big-tip">${row.title||""}</p>`
                },
                options: {
                    path: "pages/questionnaire/detail/detail",
                    params: {
                        id: row.id,
                    },
                    codeId: `questionnaire:${row.id}`
                }
            });
        },
        copyTicket(row){
            this.$router.push({
                name: "askTicketsDetail",
                query: {
                    copyId: row.id
                },
            })
        },
        checkResult(row){
            this.$router.push({
                name: "askTicketsResult",
                query: {
                    id: row.id
                },
            })
        }
    },
    mounted() {
    },
};
</script>

<style>
</style>