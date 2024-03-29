<template>
    <div class="psychic-report-list-box" :id="'reportPDFView' + currModelId">
        <div class="report-export-btn">
            <Button @click="exportPDF" icon="md-cloud-download">导出PDF</Button>
        </div>
        <div class="report-cont" :id="'reportPDF' + currModelId">
            <div class="report-name text-c">{{userInfo.model_name}}</div>
            <div class="report-time text-c">完成时间：{{modelTime}}</div>
            <div class="report-item">
                <div class="item-header">个人信息</div>
                <div class="item-content flex-s-c">
                    <div class="cont-item flex1">
                        <span class="bold cont-l m-r-10">测评对象：</span><span>{{modelInfo.member_name}}</span>
                    </div>
                    <div class="cont-item flex1">
                        <span class="bold cont-l m-r-10">手机：</span><span>{{mobilePhone}}</span>
                    </div>
                    <div class="cont-item flex1">
                        <span class="bold cont-l m-r-10">性别：</span><span>{{modelInfo.gender_str}}</span>
                    </div>
                </div>
            </div>
            <div class="report-item">
                <div class="item-header">维度表</div>
                <div class="item-content" style="padding:0px;border: 0 none;">
                    <Table class="factor-table" ref="myTable" :columns="columns" :data="reportItems" border>
                        <template slot="points" slot-scope="{ row }">
                            {{row.coefficient_points}}
                        </template>
                        <template slot="range_name" slot-scope="{ row }">
                            <p class="bold" :class="row.is_red ? 'warn-notice' : ''">{{row.range_name}}</p>
                        </template>
                        
                    </Table>
                </div>
            </div>
            <div class="report-item">
                <div class="item-header">测评分析</div>
                <div class="">
                    <div v-for="(item, index) in reportAnalyseList" :key="index" style="margin-bottom: 15px;">
                        <div class="item-tip">
                            <span>{{item.rule_name}}({{item.coefficient_points || "-"}}{{ruleTypeKey[item.rule_type]}})</span>
                        </div>
                        <div class="item-content result-content" style="display: block;">
                            <p class="tip" :class="item.is_red == 1 ? 'warn-notice' : ''">{{item.short_desc}}</p>
                            <div class="desc bold">
                                <p class="row m-b-20">{{item.description}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-c footer-tip">（本报告仅供临床参考，不作诊断证明之用）</div>
            <div class="report-marker" >
                <div class="report-marker-cont" :style="'background-image: url(' + waterMarkerImg + ');transform:translate(-50%, -50%) rotate(' + markerRotate + 'deg)'"></div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "./mixins.js";
import { getPdf } from "@/helper/utils/export-pdf.js";
import watermarkerH from "@/helper/handler/watermarker.js"
export default {
    mixins: [ mixins ],
    data() {
        return {
            reportItems: [],
            reportAnalyseList: [],
            userInfo: {},
            modelInfo: {},
            modelTime: "",
            req: {
                default: "appraisalScheduleReport",
                task: "assessmentTaskReport",
                psychic: "psychologyReport",
                earlyWarn: "psychologyReport",
                register: "appraisalScheduleReport"
            },
            ruleTypeKey: {
                dimension: "分", // 维度统计
                total: "分", // 总分统计
                average: "分", // 总均分
                whole_positive: "项", // 整体阳性项目数
                whole_negative: "项", // 整体阴性项目数
                whole_positive_average: "分", // 整体阳性症状均分
            },
            inited:false,
            currModelId: 0
        };
    },
    computed:{
        mobilePhone(){
            let modelInfo = this.modelInfo || {};
            if(modelInfo.mobile_phone){
                return modelInfo.mobile_phone.substr(0, 3) + "****" + modelInfo.mobile_phone.substr(7);
            } else {
                return "--";
            }
        },
        modelType(){
            return "RUTTER"
        },
        waterMarkerImg(){
            return watermarkerH.imgSrc;
        },
        markerRotate(){
            return watermarkerH.translateR;
        }
    },
    methods: {
        loadData({recordId,modelId}) {
            if(this.inited)return Promise.resolve()
            // let recordId = this.pageQuery.recordId || "";
            modelId = Number(modelId);
            this.currModelId = modelId;
            let userId = Number(this.pageQuery.userId);
            let type = (this.pageQuery.type || "default") || this.pageQuery.default;
            let req = this.req[type];
            return this.$MainApi[req]({
                    data: {
                        model_id: modelId,
                        record_id: recordId + "",
                        user_id: userId,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.reportItems = data.report_items || [];
                        this.userInfo = data.user_info || {};
                        this.reportAnalyseList = data.report_analyse_list || [];
                        this.modelInfo = this.userInfo.get_view_member || {};
                        this.modelTime = this.userInfo.complete_time;
                        this.inited = true;
                    }
                });
        },
        exportPDF(){
            let modelInfo = this.modelInfo;
            let userInfo = this.userInfo;
            let memberName = modelInfo.member_name ? modelInfo.member_name + '-' : '';
            let name = memberName + userInfo.model_name;
            getPdf(name, 'reportPDF' + this.currModelId, {
                width: 1200,
                parentId: "reportPDFView" + this.currModelId
            });
        }
    }, 
};
</script>

<style lang="less">
.psychic-report-list-box { 
    width:100%;
    position: relative;
    font-size: 16px;
    .report-export-btn{
        position: absolute;
        top:-10px;
        right:35px;
        z-index:2;
    }
    .report-cont{
        padding: 20px 35px;
        padding-top: 30px;
        background-color: #fff;
        position:relative;
    }
    .report-marker{
        overflow: hidden;
        position:absolute;
        top: 0px;
        left: 0px; 
        width: 100%; 
        height: 100%;
        opacity: 0.5;
        pointer-events: none;
    }
    .report-marker-cont{
        position:absolute;
        top: 50%;
        left: 50%; 
        width: 300%; 
        height: 300%;
        opacity: 0.15;
        pointer-events: none;
    }
    .report-name {
        position: relative;
        margin-bottom: 50px;
        font-weight: bold;
        font-size: 2em;
    }
    .report-time {
        font-size: 16px;
        padding: 10px;
    }
    .report-item {
        padding: 20px 0px;
        .item-tip {
            span {
                display: inline-block;
                min-width: 150px;
                text-align: center;
                line-height: 40px;
                padding: 0 20px;
                border-radius: 10px 10px 0 0;
                background-color: #ededed !important;
                color: rgba(16, 16, 16, 0.54);
                font-weight: bold;
                margin-left: 5px;
            }
        }
        .item-header {
            position: relative;
            font-size: 20px;
            padding-left: 20px;
            line-height: 50px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .item-header::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 6px;
            height: 30px;
            border-radius: 10px;
            background: #006cff;
        }
        .item-content {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px 30px;
            line-height: 28px;
            text-align: justify;
            .tip {
                margin-bottom: 10px;
                font-weight: bold;
            }
            .factor-table{
                border-color: #ddd;
                
                .ivu-table:before{
                    background-color: #ddd;
                }
                .ivu-table-header{
                    table{
                        width:100% !important;
                    }
                    th{
                        background-color:#F5F5F5;
                        color:#333;
                        border-right: 1px solid #ddd;
                        border-color:#ddd;
                        font-size: 16px;
                    }
                }
                .ivu-table-body{
                    table{
                        width:100% !important;
                    }
                    td{
                        border-right: 1px solid #ddd;
                        border-color:#ddd;
                        font-size: 16px;
                    }
                }
            }
            .cont-item{
                color: #333;
                font-weight: bold;
                .cont-l{
                    color: #7F7F7F;
                    // font-weight: normal;
                }
            }
        }
        .result-content {
            border: 1px dashed #bbb;
            border-radius: 5px;
            padding: 20px 30px;
             .tip {
                margin-bottom: 10px;
                font-weight: bold;
            }
        }
    }
    .footer-tip {
        padding: 20px 40px;
    }
}
</style>
<style lang="less" scoped>
.report-cont *{
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
}
</style>