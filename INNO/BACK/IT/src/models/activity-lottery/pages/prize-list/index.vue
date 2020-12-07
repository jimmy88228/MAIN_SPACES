<template>
    <div class="cev-root bg-page spin-box">
        <div class="cev-root" v-bar>
            <div class="bg-shadow padding20 list-box">
                <div class="cev-toolbar">
                    <div class="left">
                    </div>
                    <div class="right">
                        <Button type="primary" @click="exportClick">导出名单</Button>
                    </div>
                </div>
                <Table ref="table" class="table" :columns="columns" :data="list" border>
                    <template slot="action" slot-scope="p">
                        <div class="padding10"><Button class="item-table-action" type="primary" @click="delPrizeUser(p.row.id)" size="small" >移除</Button></div>
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
        <progressView :viewShow="exportLoad" :animShow="exportClass" :percent="percentVal"></progressView>
    </div>
</template>

<script>
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
import StringHelper from "@/helper/utils/string-util";
import Mixin from "./mixin";
import exportExcelHelper from "@/support/exportExcel/exportExcel";
import progressView from "@/components/progress-view";
let model = 5,pSize = 1000;
export default {
    name: "ActivityLottery",
    mixins: [ListPageMixin, Mixin],
    components: {},
    data() {
        return {
            exportDataList:[],
            exportLoad:false,
            exportClass:false,
            percentVal:10,
            keywords: ""
        };
    },
    components: {
        progressView,
    },
    mounted() {
        this.initParams();
        this.getListHead().finally(() => {
            this.loadData();
        });
    },
    methods: {
        initParams() {
            let query = this.$route.query || {};
            this.actId = query.actId || 0;
        },
        onLoadData(index, data,type) {
            if (!(parseInt(this.actId) > 0)) return new Promise.reject();
            type != 'export' && (this.loading = true);
            return MainApi.getLotteryUserList({
                data: {
                    activityId: this.actId,
                    stime: "",
                    etime: "",
                    keywords: this.keywords,
                    orderBy: "",
                    ...data
                }
            }).then(res => {
                    if (res.code === "1") {
                        type != 'export' && (this.pageIndex = index);
                        let data = res.data || {};
                        this.total || (this.total = data.count||0);
                        for (let i = 0; i < data.list.length; i++) {
                            let item = data.list[i];
                            for (let j = 0; j < item.items.length; j++) {
                                let markKey = item.items[j].markKey;
                                item[markKey] = item.items[j].value;
                                if(type == 'export'){
                                    markKey == "mobile_phone" && (item[markKey] = exportExcelHelper.csvTransform(item[markKey]));
                                    markKey == "id_card" && (item[markKey] = exportExcelHelper.csvTransform(item[markKey]));
                                }
                            }
                            for (let j = 0; j < item.specValList.length; j++) {
                                let specId = item.specValList[j].specId;
                                item["spec_" + specId] = item.specValList[j].specVal;
                            }; 
                            if(type == 'export'){
                                    item.enrollCode = exportExcelHelper.csvTransform(item.enrollCode);
                            }
                        }
                        type != 'export' && (this.data = JSON.parse(JSON.stringify(data)));
                        return data.list;
                    } else {
                        if(type == 'export'){
                            return Promise.resolve([]);
                        }
                        return Promise.reject(res.msg);
                    }
                }).catch(msg => {
                    if (msg && StringHelper.trim(msg)) {
                        this.$Message.error(msg || "加载失败");
                    };
                }).finally(() => {
                    type != 'export' && (this.loading = false);
                });
        },
        getListHead() {
            if (!(parseInt(this.actId))) {
                return Promise.reject();
            }
            return MainApi.getHeaderList({
                params: {
                    activityId: this.actId
                }
            }).then(res => {
                    if (res.code === "1") {
                        let data = res.data || {};
                        let questionCols = data.questionCols || [];
                        let specCols = data.specCols || [];
                        let installColumns = [];
                        let columnsL = this.columns.slice(0, 1);
                        let columnsR = this.columns.slice(1);
                        let columns = [];
                        for (let i = 0; i < questionCols.length; i++) {
                            installColumns.push({
                                title: questionCols[i].name,
                                align: "center",
                                key: questionCols[i].markKey,
                                minWidth: questionCols[i].markKey === "buy_store" ? 150 : "",
                                questionId: questionCols[i].questionId
                            });
                        }
                        installColumns.push({
                            title: "中签码",
                            align: "center",
                            key: "enrollCode"
                        });
                        columns = columnsL.concat(installColumns);
                        for (let i = 0; i < specCols.length; i++) {
                            columns.push({
                                title: specCols[i].name,
                                align: "center",
                                key: "spec_" + specCols[i].id,
                                specId: specCols[i].id
                            });
                        }
                        columns = columns.concat(columnsR);
                        this.columns = columns;
                    } else {
                        return Promise.reject(res.msg);
                    }
                }).catch(msg => {
                    this.$Message.error(msg || "加载失败");
                }).finally(() => {
                    this.loading = false;
                });
        },
        editAct(id) {
            if (!id) return;
            this.$router.push({
                name: "ActivityEdit",
                query: {
                    id: id
                }
            });
        },
        delPrizeUser(id) {
            this.$Modal.confirm({
                title: "提示",
                content: "是否确认删除",
                onOk: () => {
                    delPrizeReq.call(this, id);
                }
            });
        },
        exportExcel() {
            let obj = {
                name: "中奖名单",
                datas: this.exportDataList || this.list,
                colums: this.columns.filter(item => {
                    return item.key !== "action";
                })
            };
            exportExcelHelper.exportCsv(obj);
        }, 
        exportClick(){
            let start = 0, end=model, total = this.total||0;
            if(!total || this.exportLoad)return
            if(this.exportDataList && this.exportDataList.length == total){
                this.exportExcel();
                return
            }
            exportExcelHelper.getList({start,end,model,pSize,total,fnc:this.promiseModel,that:this}).then(res=>{
                this.exportDataList = res;
                this.exportExcel();
            });
        },
        promiseModel({start,end}){
            let _arr = [];
            for(let i = start,len=end;i<len;i++){
                let _params = {
                        activityId: this.actId,
                        keywords: "",
                        orderBy: "",
                        pageIndex:i+1,
                        pageSize: pSize,
                }
                _arr.push(this.onLoadData(i,_params,'export')); 
            }
            return _arr;
        },
        getHeadFilter(arr = [], except = []) {
            let filter = [];
            let header = [];
            for (let i = 0, len = arr.length; i < len; i++) {
                let checkEcp = false;
                for (let j = 0, lenEcp = except.length; j < lenEcp; j++) {
                    if (arr[i] && arr[i].key === except[j]) {
                        checkEcp = true;
                        break;
                    }
                }
                if (!checkEcp) {
                    filter.push(arr[i].key);
                    header.push(arr[i].title);
                }
            }
            return { filter, header };
        }
    }
};
function delPrizeReq(id) {
    this.loading = true;
    MainApi.delLotteryUser({
        data: {
            lotteryIds: [id]
        }
    })
    .then(res => {
        if (res.code === "1") {
            this.$Message.success("删除成功");
            return this.loadData();
        } else {
            return Promise.reject(res.msg);
        }
    })
    .catch(msg => {
        if (StringHelper.trim(msg)) {
            this.$Message.error(msg || "加载失败");
        }
    })
    .finally(() => {
        this.loading = false;
    });
}
</script>
