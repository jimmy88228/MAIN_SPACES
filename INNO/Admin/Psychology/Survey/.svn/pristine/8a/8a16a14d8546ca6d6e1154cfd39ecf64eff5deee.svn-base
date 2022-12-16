<template>
    <div class="psychic-detail">
        <div class="act-report-area bg-page area-box">
            <div class="act-report-title">{{modelName}}</div>
            <div class="act-report-list flex-a-c">
                <div class="report-item">
                    <p class="item-point" style="font-size: 40px;">{{modeRecently.coefficient_points}}</p>
                    <p class="item-tip">最近一次测评结果</p>
                    <p class="item-tip">{{modeRecently.complete_time}}</p>
                </div>
                <div class="report-item report-range">
                    <p class="item-point">{{modeRecently.range_name || '--'}}</p>
                    <p class="item-tip">最近一次测评结果</p>
                    <p class="item-tip">{{modeRecently.complete_time}}</p>
                </div>
                <div class="report-item">
                    <p class="item-point" style="font-size: 40px;">{{modeRecently.total_count || 0}}</p>
                    <p class="item-tip">参与测评次数</p>
                </div>
            </div>
        </div>
        <div class="bg-page area-box survey-psychic-chart">
            <div class="chart-title">量表结果心理走势图</div>
            <div class="chart-area" id="psychic-chart">

            </div>
        </div>

        <div class="bg-page area-box">
            <div style="padding: 20px 0px;font-size:18px;">量表测评记录</div>
            <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading">
                <template slot="model_name" slot-scope="{ row, index }">
                    {{modelName}}
                </template>
                <template slot="handle" slot-scope="{ row, index }">
                    <div class="operate-area" :class="{'invalid': row.state != 3}">
                        <a class="operate" v-hasAction="[row.state > 1]" @click="checkReport(row)">查看报告</a>
                        <a class="operate" v-hasAction="[row.state > 1]" @click="checkAnswer(row)">查看答案</a>
                    </div>
                </template>
            </Table>
            <rewrite-page :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        </div>
        
    </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
// import echarts from "echarts";
import * as echarts from 'echarts'; // 5.0以上版本
export default {
    name: "psychic-detail",
    mixins: [ListMixin, mixins],
    data() {
        return {
            modelName: "",
            actReport: [],
            modeRecently: {},
            studentTrend: [],
            psychicChart: null,
        };
    },
    methods: {
        getPsychicDetail() {
            let modelId = Number(this.pageQuery.modelId) || 0;
            let userId = this.pageQuery.userId;
            this.$store.commit("setPageLoading", true);
            this.$MainApi
                .psychologyDetails({
                    data: {
                        model_id: modelId,
                        user_id: userId,
                        pageSize: 20,
                        page: 1,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.modeRecently = data.student_mode_recently[0] || {};
                        this.studentTrend = data.student_trend || [];
                        this.modelName = data.model_name;
                        this.initChart(this.studentTrend);
                    }
                })
                .finally(() => {
                    this.$store.commit("setPageLoading", false);
                });
        },
        onLoadData(page, extraData) {
            let modelId = Number(this.pageQuery.modelId) || 0;
            let userId = this.pageQuery.userId;
            return this.$MainApi
                .psychologyDetailsActivity({
                    data: {
                        model_id: modelId,
                        user_id: userId,
                        ...extraData
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.data = {
                            total: data.total,
                            list: data.items,
                        };
                    }
                })
        },
        initChart(data) {
            if (!this.psychicChart) {
                this.psychicChart =
                    this.psychicChart ||
                    echarts.init(document.getElementById("psychic-chart"));
            }
            let xName = [],
                viewData = [];
            for (let i = 0; i < data.length; i++) {
                xName.unshift(data[i].complete_time || "--");
                viewData.unshift(data[i].coefficient_points || "--");
            }
            let option = {
                tooltip: {
                    trigger: "item",
                },
                grid: {
                    top: "5%",
                    left: "0%",
                    right: "0%",
                    bottom: "5%",
                    containLabel: true,
                },
                xAxis: {
                    data: xName,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: "#ACACAC" 
                        }
                    },
                    axisLabel: {
                        color: "#ACACAC",
                    },
                    z: 10,
                },
                yAxis: [
                    {
                        show: true,
                        type: "value",
                        name: "量表心理走势",
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: "#ACACAC" 
                            }
                        },
                        axisLabel: {
                            show: true,
                            lineStyle: {
                                color: "#ACACAC" 
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: "#ddd",
                                width: 1,
                                type: "dotted",
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: "量表心理走势",
                        type: "line",
                        stack: "Total",
                        itemStyle: {
                            color: "#14B0AB",
                            borderWidth: 10,
                        },
                        lineStyle: {
                            color: "#14B0AB",
                        },
                        data: viewData,
                    },
                ],
            };
            this.psychicChart.setOption(option);
        },
        checkFinish(row,text){
            //记录状态(0:未填写;1:填写中;2:填写完未计分;3:已计算完得分)
            if(row.state == 3){
                return true
            } else {
                this.$Message.warning( text + "生成中...");
                return false;
            }
        },
        checkReport(row) {
            if(!this.checkFinish(row, '报告')){
                return;
            }
            this.$router.push({
                name: this.pageQuery.type == "earlyWarn" ? "earlyWarnPsychicFilesReport" : "psychicFilesReport",
                query: {
                    modelId: Number(this.pageQuery.modelId),
                    recordId: row.record_id + "",
                    type: this.pageQuery.type || 'psychic',
                    modelTime: this.modeRecently.complete_time,
                    userId: this.pageQuery.userId + ""
                }
            })
        },
        checkAnswer(row) {
            if(!this.checkFinish(row, '答案')){
                return;
            }
            this.$router.push({
                name: this.pageQuery.type == 'earlyWarn' ? "earlyWarnPsychicFilesAnswer" : "psychicFilesAnswer",
                query: {
                    modelName: this.modelName,
                    modelId: Number(this.pageQuery.modelId) || 0,
                    recordId: row.record_id + "",
                    type: this.pageQuery.type || 'psychic',
                }
            })
        },
    },
    mounted() {
        this.getPsychicDetail();
        this.loadData();
    },
};
</script>

<style lang="less" scoped>
.psychic-detail {
    .act-report-area {
        .act-report-title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #333333;
        }
        .act-report-list {
            margin-top: 30px;
            margin-bottom: 15px;
            align-items: flex-start;
            .report-item {
                text-align: center;
                flex-shrink: 0;
            }
            .report-range{
                flex: 1;
            }
            .item-point {
                font-family: PingFangSC-Medium;
                font-size: 30px;
                color: #13b1a6;
                letter-spacing: 1px;
                line-height: 56px;
                min-height: 56px;
                margin-bottom: 11px;
                padding: 0px 10%;
            }
            .item-tip {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #b2b2b2;
                margin-bottom: 3px;
                white-space: nowrap;
            }
        }
    }
    .survey-psychic-chart {
        .chart-title {
            margin-bottom: 30px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #000000;
        }
        .chart-area {
            width: 100%;
            height: 300px;
        }
    }
    .area-box {
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 20px;
        padding: 30px;
    }
}
</style>