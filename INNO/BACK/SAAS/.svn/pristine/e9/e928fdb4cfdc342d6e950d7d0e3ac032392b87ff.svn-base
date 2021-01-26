<template>
    <div class="cev-root bg-page spin-box">
        <div class="cev-root" v-bar>
            <div class="bg-shadow padding20 list-box">
                <div class="cev-toolbar">
                    <div class="left">
                        <Input
                            class="inputable"
                            placeholder="请输入搜索内容"
                            v-model="keywords"
                            clearable
                        />
                        <Button type="primary" @click="(e) => loadData()">
                            <i class="iconfont min r5 icon-search"></i>搜索
                        </Button>
                    </div>
                    <div class="right">
                        <Button type="primary" @click="exportClick" v-if="$store.state.authJson.btn_export_enroll_list">
                            <i class="iconfont min r5 icon-add"></i>导出名单
                        </Button>
                    </div>
                </div>
                <Table
                    ref="table"
                    class="table"
                    :columns="columns"
                    :data="list"
                    border
                >
                    <template slot="specs" slot-scope="p">
                        <div>{{ p.row.specsStr }}</div>
                    </template>
                    <!-- <template slot="action" slot-scope="p">
                        <div class="padding10"><Button class="item-table-action" type="primary" @click="checkDetail(p.row.id)" size="small" >查看</Button></div>
                    </template> -->
                </Table>
                <Page
                    v-if="showPage"
                    :total="count"
                    :current="pageIndex"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="(e) => loadData(e)"
                    @on-page-size-change="handlePageSizeChange"
                    show-sizer
                    show-elevator
                    show-total
                    transfer
                ></Page>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
        <progressView
            :viewShow="exportLoad"
            :animShow="exportClass"
            :percent="percentVal"
        ></progressView>
    </div>
</template>
<script>
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
import Mixin from "./mixin";
import exportExcelHelper from "@/support/exportExcel/exportExcel";
import progressView from "@/components/progress-view";
let model = 2,
    pSize = 5000;
export default {
    name: "EnrollList",
    mixins: [ListPageMixin, Mixin],
    components: {},
    data() {
        return {
            exportDataList: [],
            exportLoad: false,
            exportClass: false,
            percentVal: 10,
        };
    },
    components: {
        progressView,
    },
    mounted() {
        this.initParam();
        this.loadData();
    },
    computed: {},
    methods: {
        initParam() {
            let query = this.$route.query || {};
            this.actId = query.actId || 0;
        },
        onLoadData(index, data, type) {
            if (!(parseInt(this.actId) > 0)) {
                return Promise.reject();
            }
            type != "export" && (this.loading = true);
            data = {
                ...data,
                activityId: this.actId,
            };
            return MainApi.getEnrollInfoList({
                data: data,
            })
                .then((res) => {
                    if (res.code === "1") {
                        type != "export" && (this.pageIndex = index);
                        let data = res.data;
                        this.total || (this.total = data.count || 0);
                        let user_name = false, id_card = false, mobile_phone = false;
                        let columns = [];
                        for (let i = 0; i < data.list.length; i++) {
                            let specs = data.list[i].specs || "";
                            if (specs) {
                                specs = JSON.parse(specs);
                                data.list[i].specsStr = "";
                                for (let j in specs) {
                                    data.list[i].specsStr = data.list[i]
                                        .specsStr
                                        ? data.list[i].specsStr +
                                          "; " +
                                          specs[j]
                                        : specs[j];
                                }
                            }
                            if(data.list[i].user_name && !user_name){
                                columns.push({
                                    title: "报名人信息",
                                    align: "center",
                                    key: "user_name"
                                })
                                user_name = true;
                            }
                            if(data.list[i].id_card && !id_card){
                                columns.push({
                                    title: "身份证",
                                    align: "center",
                                    key: "id_card"
                                })
                                id_card = true;
                            }
                            if(data.list[i].mobile_phone && !mobile_phone){
                                columns.push({
                                    title: "手机号",
                                    align: "center",
                                    key: "mobile_phone"
                                })
                                mobile_phone = true;
                            }
                        }
                        if(columns.length > 0){
                            this.columns.splice(1,0,...columns);
                        }
                        type != "export" &&
                            (this.data = JSON.parse(JSON.stringify(data)));
                        return data.list;
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch((msg) => {
                    this.$Message.error(msg || "加载失败");
                    return Promise.reject(msg);
                })
                .finally(() => {
                    type != "export" && (this.loading = false);
                });
        },
        checkDetail(id) {},
        exportExcel() {
            let obj = {
                name: "报名表格",
                datas: this.exportDataList || this.list,
                colums: this.columns.filter((item) => {
                    return item.key !== "action";
                }),
            };
            exportExcelHelper.exportCsv(obj);
        },
        exportClick() { 
            let start = 0,
                end = model,
                total = this.total || 0;
            if (!total || this.exportLoad) return;
            if (this.exportDataList && this.exportDataList.length == total) {
                this.exportExcel();
                return;
            }
            exportExcelHelper
                .getList({
                    start,
                    end,
                    model,
                    pSize,
                    total,
                    fnc: this.promiseModel,
                    that: this,
                })
                .then((res) => {
                    this.exportDataList = res;
                    this.exportExcel();
                });
        },
        promiseModel({ start, end }) {
            let _arr = [];
            for (let i = start, len = end; i < len; i++) {
                let _params = {
                    activityId: this.actId,
                    keywords: "",
                    orderBy: "",
                    pageIndex: i + 1,
                    pageSize: pSize,
                    nonCount:1,
                };
                _arr.push(this.loadExcel(i, _params));
            }
            return _arr;
        },
        loadExcel(index, data) {
            if (!(parseInt(this.actId) > 0)) {
                return Promise.reject();
            }
            data = {
                ...data,
                activityId: this.actId,
            };
            return MainApi.getEnrollInfoList({
                data: data,
            })
                .then((res) => {
                    if (res.code === "1") {
                        let data = res.data||{};
                        let list = data.list||[];
                        this.total || (this.total = data.count || 0);
                        for (let i = 0; i < list.length; i++) {
                            let specs = list[i].specs || "";
                            if (specs) {
                                specs = JSON.parse(specs);
                                list[i].specsStr = "";
                                for (let j in specs) {
                                    list[i].specsStr = list[i].specsStr
                                        ? list[i].specsStr + "; " + specs[j]
                                        : specs[j];
                                }
                            }
                            data.list[
                                i
                            ].id_card = exportExcelHelper.csvTransform(
                                data.list[i].id_card
                            );
                            data.list[
                                i
                            ].mobile_phone = exportExcelHelper.csvTransform(
                                data.list[i].mobile_phone
                            );
                            data.list[
                                i
                            ].codes = exportExcelHelper.csvTransform(
                                data.list[i].codes
                            );
                        }
                        return list;
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch((msg) => {
                    return Promise.resolve([]);
                });
        },
    },
};
</script>