<template>
    <hold-layout :isFull="true">
        <searchForm @search="loadData" @create="editAct()" @removeIds="batchRemoveItem()" :searchForm="searchForm"></searchForm>
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
            <template slot="page_link" slot-scope="{ row }">
                <a class="operate" @click="createCode(row)" v-if="_structureType == 'edu_school'">生成二维码</a>
                &nbsp;
                <rewrite-tooltip theme="light" >
                    <a class="operate" slot="_tip">生成链接</a>
                    <div slot="_content" class="flex-s-c">
                        <div class="w-break m-r-10" style="width:auto;">{{row.pageLink}}</div>
                        <a @click="createLink(row)">复制</a>
                    </div>
                </rewrite-tooltip>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <p class="operate-line m-b-10">
                        <a class="operate" @click="editAct(row.id)" v-hasAction="'appraisal_activity_update'">编辑活动</a>
                        
                        <!-- <a class="operate" @click="checkProgress(row.id)" v-hasAction="'appraisal_activity_schedule'">测评进度</a> -->
                        
                    </p>
                    <p class="operate-line m-b-10">
                        <a class="operate" @click="setRelate(row)" v-hasAction="'appraisal_activity_school'">设置关联</a>
                    </p>
                    <p class="operate-line m-b-10">
                        <a class="operate" @click="checkProgress(row.id)" v-hasAction="'appraisal_activity_schedule'">活动概况</a> 
                    </p>
                    <p class="operate-line">
                        <a class="operate" @click="removeItem(row.id, index)" v-hasAction="'appraisal_activity_remove'">删除</a>
                    </p>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import searchForm from "./search-form.vue";
export default {
    name: "gaugeIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm },
    data() {
        return {
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
            pageLink: "pages/activities/evaluating/detail/detail"
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
                  for(let i = 0; i < items.length; i++){
                      items[i].pageLink = "/" + this.pageLink + "?activityId=" + items[i].id;
                  }
                  this.data = {
                      total: data.total,
                      list: data.items
                  };
              }
          });
        },
        createCode(row){
            this.$UIModule({
                mode: "code-view",
                props: {
                    codeTip: `<p class="big-tip">${row.activity_name || ""}</p>`
                },
                options: {
                    path: "/" + this.pageLink,
                    listParams: {
                        structure_id: row.structure_id,
                        structure_type: row.structure_type
                    },
                    params: {
                        courseActivityId: row.id,
                    },
                    codeId: `courseActivity:${row.id}`
                }
            });
        },
        createLink(row) {
            this.$utils.copyText(row.pageLink);
        },
        selectAct(selectData) {
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
        setRelate(row) {
            this.$router.push({
                name: "relateSchool",
                query: {
                    activityId: row.id || 0,
                    activityTimeState: row.state || 0
                },
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
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>