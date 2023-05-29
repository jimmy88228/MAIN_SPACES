<template>
    <hold-layout :isFull="true">
        <rewrite-screen :searchForm="searchForm" :base="screenData.base" :extra="screenData.extra" @search="loadData()">
            <div slot="extra">
                <Poptip trigger="click" placement="left">
                    <Button icon="md-add" type="primary">新增活动</Button>
                    <p slot="title">选择新增类型</p>
                    <p slot="content" class="lines-type">
                        <a class="line-type-item" @click="editLectures(null, item.key)" v-if="item.id != -1" v-for="(item, index) in linesType" :key="item.id">{{item.name}}</a>
                    </p>
                </Poptip>
            </div>
        </rewrite-screen>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" >
            <template slot="info" slot-scope="{ row }">
                <p>{{row.name}}</p>
                <p class="m-t-5 m-b-5 C_B2" v-if="row.start_time && row.end_time">
                    <span class="t-item" >{{row.start_time}}</span>-<span class="t-item">{{row.end_time}}</span>
                </p>
            </template>
            <template slot="time" slot-scope="{ row }">
                <template v-if="row.limit_time==0">
                    不限制
                </template>
                <template v-else>
                    <p class="t-item">{{row.start_time}}</p>~<p class="t-item">{{row.end_time}}</p>
                </template>
            </template>
            <template slot="organizer" slot-scope="{ row }">
                {{ row.organizer || '--' }}
            </template>
            <template slot="join_count" slot-scope="{ row }">
                <div class="flex-c-c">
                    {{!row.get_limit || (row.get_limit && !row.get_limit.total_count) ? '-': row.get_limit.used_count + '/' + row.get_limit.total_count }}
                </div>
                <div v-if="row.get_limit && row.get_limit.is_return &&  row.get_limit.total_count > row.get_limit.used_count" style="color:#21B014;">已释放{{Number(row.get_limit.total_count) - Number(row.get_limit.used_count)}}次</div>
            </template>
            <template slot="state" slot-scope="{ row }">
                <i-switch size="large" v-model="row.state" :loading="row.stateLoading" :true-value="1" :false-value="0" :disabled="!(row.handle && row.handle.edit)" :before-change="()=>{return beforeChangeState(index, row)}">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </template>
            <template slot="extend" slot-scope="{ row }">
                <div class="operate-area flex-s-c">
                    <p class="operate-line">
                        <a class="operate create-code" @click="createCode(row)" v-hasAction="'appraisal_activity_qr_code'">活动码</a>
                        <a class="operate create-code" v-if="row.handle && row.handle.organizational" @click="showOrgn(row)" >组织码</a>
                        <rewrite-tooltip theme="light" :maxWidth="550">
                            <a class="operate" slot="_tip">生成链接</a>
                            <div slot="_content" class="flex-s-c">
                                <div class="text-flow m-r-10" style="width:auto;">{{row.appletLink}}</div>
                                <a @click="createLink(row)">复制</a>
                            </div>
                        </rewrite-tooltip>
                    </p>
                    
                </div>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <p class="operate-line">
                        <a class="operate" @click="editLectures(row.id)" v-hasAction="[row.handle.edit,'appraisal_activity_update']">编辑</a>
                        <!-- <a class="operate" @click="checkComment(row.id)" v-hasAction="'appraisal_activity_schedule'">评价管理</a> -->
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
import dataUtil from "@/helper/utils/date-util.js"
export default {
    name: "gaugeIndex",
    mixins: [ListMixin, mixins],
    components: { },
    data() {
        return {
            jobIdCol:[],
            searchForm: {
                type: -1
            },
            selectData: [],
            onlineAppletBase: "pages/course-lecture/course-details/course-details",
            offlineAppletBase: "pages/attendance-book/attendance-book"
        };
    },
    computed: {
    },
    methods: {
        onLoadData(page, extraData) {
            return this.$MainApi.specialLectureList({
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
                    items.map((item)=>{
                        item._checked = false;
                        let appletLink = "";
                        if(item.type == "online"){
                            appletLink = "/" + this.onlineAppletBase + "?courseActivityId="+ item.id;
                        } else {
                            appletLink = "/" + this.offlineAppletBase + "?id="+ item.id;
                        }
                        item.appletLink = appletLink;
                        item.stateLoading = false;
                        if(item.start_time){
                            item.start_time = dataUtil.format(new Date(item.start_time), "yyyy.MM.dd")
                        }
                        if(item.end_time){
                            item.end_time = dataUtil.format(new Date(item.end_time), "yyyy.MM.dd")
                        }
                    })
                    this.data = {
                        total: data.total,
                        list: data.items,
                    };
              }
          });
        },
        beforeChangeState(index, row) {
            let id = row.id || 0;
            let state = row.state || 0;
            let set_state = state == 1 ? 0 : 1;
            this.$set(row, "stateLoading", true);
            return new Promise((rs, rj) => {
                this.setLecturesState(id, set_state)
                    .then(() => {
                        this.$set(row, "stateLoading", false);
                        return rs();
                    })
                    .catch(() => {
                        this.$set(row, "stateLoading", false);
                        return rj();
                    })
            });
        },
        setLecturesState(id, state) {
            if (!id) {
                this.$Message.warning("无效ID");
                return Promise.reject();
            }
            return this.$MainApi.specialLectureStatus({
                data: {
                    id,
                    state
                },
                other: {
                    isMsg: true
                }
            })
            .then((res) => {
                if (res.code) {
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            });
        },
        editLectures(id, type) {
            this.$router.push({
                name: id ? "edit-lectures" : "add-lectures",
                query: {
                    id: id || 0,
                    type: type
                },
            });
        },
        createLink(row) {
            this.$utils.copyText(row.appletLink);
        },
        checkComment(id) {
            // this.$router.push({
            //     name: "assessOverview",
            //     query: {
            //         activityId: id || 0,
            //     },
            // });
        },
        showOrgn(row) {
            this.$UIModule({
                mode: "organize-code-view",
                options: {
                    info:row,
                    type:"lecturesList"
                }
            });
        },
        createCode(row) {
            let params = {};
            if(row.type == "online"){
                params.courseActivityId = row.id
            } else {
                params.id = row.id
            }
            this.$UIModule({
                mode: "code-view",
                props: {
                    codeTip: `<p class="big-tip">${row.name}</p>`
                },
                options: {
                    path: row.type == "online" ? this.onlineAppletBase : this.offlineAppletBase,
                    params: params,
                    codeId: `lectures:${row.id}`
                }
            });
        },
        // batchCreateCode() {
        //     this.createCodeReq(this.ids);            
        // },
        // createCodeReq(ids) {
        //     return this.checkIds(ids).then(() => {
        //         return this.$MainApi
        //             .batchQrCode({
        //                 data: {
        //                     ids,
        //                     type:1,
        //                 },
        //                 other: { isErrorMsg: true },
        //             })
        //             .then((res) => {
        //                 let data = res.data;
        //                 if (ids.length > 0 && data) {
        //                     this.jobIdCol.push(data);
        //                     this.$nextTick(() => {
        //                         this.$refs[`notice${data}`][0].showNotice(data);
        //                     });
        //                 }
        //                 return data || {};
        //             });
        //     });
        // },
        // checkIds(ids) {
        //     return new Promise((rs, rj) => {
        //         let warn = "";
        //         if (ids.length == 0 || !ids[0]) {
        //             warn = "请选择操作项";
        //         }
        //         if (warn) {
        //             this.$Message.warning(warn);
        //             rj();
        //         } else {
        //             rs();
        //         }
        //     });
        // },
        
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style lang="less" scoped>
.lines-type{

}
.line-type-item{
    display: inline-block;
    width: 120px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    background-color: #EBF7FF;
    margin: 0px 3px;
}
.line-type-item:hover{
    background-color: #EBF7FF;
}
</style>