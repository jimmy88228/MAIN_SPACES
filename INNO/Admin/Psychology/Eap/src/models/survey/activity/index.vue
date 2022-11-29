<template>
    <hold-layout :isFull="true">
        <searchForm @search="loadData" @create="editAct()" @removeIds="batchRemoveItem()" :searchForm="searchForm" @batchCode="batchCreateCode"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectAct">
            <template slot="time" slot-scope="{ row }">
                 <template v-if="row.limit_time==0">
                    不限制
                </template>
                <template v-else>
                    <div class="time-p flex-s-c">
                        <p class="t-item">{{row.start_time}}</p>~<p class="t-item">{{row.end_time}}</p>
                    </div>
                </template>
            </template>
            <template slot="state" slot-scope="{ row }">
                <Tag type="dot" :color="stateKey[row.state].type">{{row.state_str}}</Tag>
            </template>
            <template slot="extend" slot-scope="{ row }">
                <div class="operate-area">
                    <p class="operate-line">
                        <a class="operate create-code" @click="createCode(row)" v-hasAction="'appraisal_activity_qr_code'">活动码</a>
                        <a class="operate" @click="showOrgn(row)" v-hasAction="[row.handle.organizational,'appraisal_activity_organizational']">组织码</a>
                    </p>
                    <rewrite-tooltip theme="light" v-hasAction="'assessment_tasks_school_link'">
                        <a class="operate" slot="_tip">生成链接</a>
                        <div slot="_content" class="flex-s-c">
                            <div class="text-flow m-r-10" style="width:auto;">{{row.h5Link}}</div>
                            <a @click="createLink(row)">复制</a>
                        </div>
                    </rewrite-tooltip>
                </div>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <p class="operate-line">
                        <a class="operate" @click="editAct(row.id)" v-hasAction="[row.handle.edit,'appraisal_activity_update']">编辑</a>
                        <a class="operate" @click="checkProgress(row.id)" v-hasAction="'appraisal_activity_schedule'">活动概括</a>
                    </p>
                    <p class="operate-line">
                        <a class="operate" @click="removeItem(row.id, index)" v-hasAction="'appraisal_activity_remove'">删除</a>
                    </p>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <!--异步处理导出excel组件-->
        <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import searchForm from "./search-form.vue";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
export default {
    name: "gaugeIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm , mpNotice},
    data() {
        return {
            jobIdCol:[],
            searchForm: {
                searchq: "",
                startTime: "",
                endTime: "",
                state: -1,
                time: [],
                structure_id: this._structureId,
                limitTime: -1
            },
            selectData: [],
            stateKey: {
                "-1": {
                    name: "全部",
                    type: "primary",
                },
                0: {
                    name: "关闭",
                    type: "error",
                },
                1: {
                    name: "未开始",
                    type: "primary",
                },
                2: {
                    name: "进行中",
                    type: "success",
                },
                3: {
                    name: "已结束",
                    type: "warning"
                },
            },
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
            return this.$MainApi.appraisalActList({
              data: {
                  ...this.searchForm,
                  startTime: this.searchForm.time[0] || "",
                  endTime: this.searchForm.time[1] || "",
                  state: parseInt(this.searchForm.state),
                  structure_id: this._structureId,
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
                    items.map((item)=>{
                        item._checked = false;
                        item.h5Link = this.h5Admin + "/pages/startup/startup?id="+ item.id;
                    })
                    this.data = {
                        total: data.total,
                        list: data.items,
                    };
              }
          });
        },
        selectAct(selectData) {
          console.log("selectData", selectData)
            this.selectData = selectData || [];
        },
        editAct(id) {
            this.$router.push({
                name: id?"editSurveyActivity":"addSurveyActivity",
                query: {
                    id: id || 0,
                },
            });
        },
        showOrgn(row) {
            // this.$refs.organizeForm.showModal(row); 
            this.$UIModule({
                mode: "organize-code-view",
                options: {
                    info:row,
                    type:"surveyAct"
                }
            });
        },
        checkProgress(id) {
            this.$router.push({
                name: "assessOverview",
                query: {
                    activityId: id || 0,
                },
            });
        },
        checkResult(id) {
            this.$router.push({
                name: "assessResult",
                query: {
                    activityId: id || 0,
                },
            });
        },
        removeItem(id, index){
          this.batchRemoveActReq([id]).then(()=>{
            this.delItem(index);
          })
        },
        batchRemoveItem(){
          this.batchRemoveActReq(this.ids).then(()=>{
            this.delItems(this.ids);
          })
        },
        batchRemoveActReq(ids) {
            if (ids.length == 0 || !ids[0]) {
                this.$Message.warning("请勾选删除项！");
                return Promise.reject(); 
            }
            this.tableLoading = true;
            return this.$MainApi.appraisalActRemove({
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
        batchCreateCode() {
            this.createCodeReq(this.ids);            
        },
        createCodeReq(ids) {
            return this.checkIds(ids).then(() => {
                return this.$MainApi
                    .batchQrCode({
                        data: {
                            ids,
                            type:1,
                        },
                        other: { isShowMsg: true },
                    })
                    .then((res) => {
                        let data = res.data;
                        if (ids.length > 0 && data) {
                            this.jobIdCol.push(data);
                            this.$nextTick(() => {
                                this.$refs[`notice${data}`][0].showNotice(data);
                            });
                        }
                        return data || {};
                    });
            });
        },
        checkIds(ids) {
            return new Promise((rs, rj) => {
                let warn = "";
                if (ids.length == 0 || !ids[0]) {
                    warn = "请选择操作项";
                }
                if (warn) {
                    this.$Message.warning(warn);
                    rj();
                } else {
                    rs();
                }
            });
        },
        createCode(row) {
            this.$UIModule({
                mode: "code-view",
                props: {
                    codeTip: `<p class="big-tip">${row.activity_name}</p>`
                },
                options: {
                    path: "pages/activities/evaluating/detail/detail",
                    params: {
                        activityId: row.id,
                        // structureId: row.structure_id,
                    },
                    codeId: `surveya:${row.id}`
                }
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