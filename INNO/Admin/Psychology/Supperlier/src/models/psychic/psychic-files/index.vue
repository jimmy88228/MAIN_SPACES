<template>
    <div class="psychic-files">
        <div class="file-detail">
            <div class="detail-l text-flow">
                <div class="m-item">
                    <div class="m-cont">
                        <div class="user-info">
                            <div class="user-header">{{memberInfo.member_name && memberInfo.member_name.slice(-2)}}</div>
                            <p class="user-name">{{memberInfo.member_name}}</p>
                        </div>
                        <div class="info-area">
                            <p class="info-row">
                                <span class="row-tip">所在组织</span>
                                <span class="row-cont">{{memberInfo.structure_name}}</span>
                            </p>
                            <p class="info-row">
                                <span class="row-tip">手机号</span>
                                <span class="row-cont">{{memberInfo.mobile_phone}}</span>
                            </p>
                            <p class="info-row">
                                <span class="row-tip">其他信息</span>
                                <span class="row-cont">
                                    <span class="row-cont-class">{{memberInfo.marriage_str}}</span>
                                    <span class="row-cont-sex" :class="{'is-female' : memberInfo.student_sex == 2}">{{memberInfo.gender_str}}</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="m-item meddle-m-item text-flow">
                    <div class="m-cont meddle-area " @click.stop="getMeddle">
                        <span class="arrow-radius"></span>
                        <div class="fs-18 m-b-15">干预记录</div>
                        <div class="meddle-record">
                            <div v-for="(item, index) in meddleRecord" :key="index" class="record-item">
                                <div class="">
                                    <p class="text-flow">{{item.assess_suggest}}</p>
                                </div>
                                <div class="text-flow">
                                    <span>{{item.intervention_time}}</span>
                                    <span>{{item.intervention_str}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="has-no-data" v-if="meddleRecord.length == 0">
                            暂无数据
                        </div>
                    </div>
                </div>
            </div>
            <div class="survey-group detail-r">
                <div class="m-item" :class="setPointClass(pIndex)" v-for="(pItem, pIndex) in pointView" :key="pIndex">
                    <template v-if="hasMorePoint && pIndex == 3">
                        <div class="m-group-area m-cont" @click="checkMorePoint()">
                            <div class="m-item-tip">其他量表</div>
                            <div class="s-m-item flex-b-c" v-for="(mItem, mIndex) in morePointView" :key="mIndex">
                                <div>{{mItem.model_name}}</div>
                                <div class="points">{{mItem.points}}</div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="m-cont" @click="checkPoint(pItem)">
                            <div class="m-item-tip">{{pItem.model_name}}</div>
                            <div class="m-item-cont">
                                <div>
                                    <template v-if="pItem.complete_time">
                                        <p>{{pItem.points}}</p>
                                        <span>{{pItem.complete_time}}测评得分</span>
                                    </template>
                                    <template v-else>
                                        <div class="no-assess">未测评</div>
                                    </template>
                                </div>
                            </div>
                            <span class="arrow-radius"></span>
                        </div>
                    </template>
                </div>
                <div v-if="pointView.length == 0" class="m-item">
                    <div class="m-cont no-survey-area">暂无量表数据</div>
                </div>
            </div>
        </div>
        <div class="activity-record">
            <Tabs value="actRecord" :animated="false">
                <TabPane label="活动记录" name="actRecord">
                    <actTable :type="pageQuery.type" :userId="userId"></actTable>
                </TabPane>
                <TabPane label="心理轨迹" name="psychicTravel">
                    <psychicTable :userId="userId"></psychicTable>
                </TabPane>
            </Tabs>

        </div>
        <moreModel ref="moreModelRef" :memberInfo="memberInfo" :type="pageQuery.type"></moreModel>
    </div>
</template>

<script>
// import answer from "@/models/survey/activity/assess/answer/index";
import moreModel from "./more-model/index";
import actTable from "./act-table/index";
import psychicTable from "./psychic-table/index";
export default {
    components: { moreModel, actTable, psychicTable },
    data() {
        return {
            memberInfo: {},
            modePoints: [],
            // actReport: [],
            meddleRecord: [],
            userId: 0,
        };
    },
    computed: {
        pointView() {
            let modePoints = this.modePoints || [];
            return modePoints.slice(0, 4) || [];
        },
        morePointView() {
            let modePoints = this.modePoints || [];
            return modePoints.slice(3, 6) || [];
        },
        hasMorePoint() {
            let modePoints = this.modePoints || [];
            return modePoints.length > 4 || false;
        },
    },
    methods: {
        init() {
            this.userId = Number(this.pageQuery.userId) || 0;
        },
        loadPsychicData() {
            this.$store.commit("setPageLoading", true);
            this.$MainApi
                .psychologyFiles({
                    data: {
                        user_id: this.userId,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.memberInfo = data.member_Info;
                        this.modePoints = data.member_mode_points;
                        // this.actReport = data.student_activity_report;
                    }
                })
                .finally(() => {
                    this.$store.commit("setPageLoading", false);
                });
        },
        getMeddleRecord() {
            let userId = Number(this.pageQuery.userId) || 0;
            if (!userId) return;
            this.$MainApi
                .forewarningInterveneRecord({
                    data: {
                        user_id: this.userId,
                        pageSize: 3,
                        page: 1,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.meddleRecord = data.items || [];
                    }
                })
                .finally(() => {
                    this.$store.commit("setPageLoading", false);
                });
        },
        setPointClass(index) {
            let pointView = this.pointView;
            let pointL = pointView.length;
            let classStr = "";
            if (pointL == 1) {
                if (index == 0) classStr = "is-only";
            } else {
                if ((pointL == 3 && index < 2) || pointL >= 4) {
                    classStr = "cube";
                } else {
                    classStr = "cuboid";
                }
            }
            return classStr;
        },
        checkPoint(item) {
            if (!item.complete_time) return;
            this.$router.push({
                name: this.pageQuery.type == 'earlyWarn' ? "earlyWarnPsychicFilesDetail" : "psychicFilesDetail",
                query: {
                    modelId: Number(item.model_id),
                    userId: this.memberInfo.user_id + "",
                    type: this.pageQuery.type || ""
                },
            });
        },
        checkMorePoint() {
            this.$refs["moreModelRef"] &&
                this.$refs["moreModelRef"].showModule({
                    modelList: this.modePoints,
                });
        },
        getMeddle(){
            this.$router.push({
                name: "earlyWarnMeddle",
                query: {
                    userId: this.userId,
                },
            });
        }
    },
    mounted() {
        this.init();
        if (this.userId > 0) {
            this.loadPsychicData();
            this.getMeddleRecord();
        }
    },
};
</script>

<style lang="less" scoped>
.psychic-files {
    padding-right: 10px;
    .file-detail {
        display: flex;
        margin-bottom: 10px;
        .detail-l {
            flex: 1;
            display: flex;
        }
        .detail-r {
            flex: 1;
        }
        .m-item {
            flex: 1;
            padding-right: 10px;
            .m-cont {
                background-color: #fff;
                padding: 15px;
                width: 100%;
                min-height: 100%;
                border-radius: 10px;
                position: relative;
            }
            .m-cont:hover {
                box-shadow: 0px 0px 10px #e0e0e0;
            }
            .no-survey-area {
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #b2b2b2;
            }
        }
        .survey-group {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            margin-bottom: -10px;
            .m-item {
                width: 100%;
                flex-shrink: 0;
                flex: unset;
                margin-bottom: 10px;
                .m-cont {
                    display: flex;
                    cursor: pointer;
                }
                .m-item-tip {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #333333;
                    margin-bottom: 5px;
                }
                .m-item-cont {
                    text-align: center;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 30px 0px;
                    p {
                        font-family: PingFangSC-Medium;
                        color: #13b1a6;
                        letter-spacing: 1px;
                        font-size: 40px;
                        line-height: 56px;
                        min-height: 56px;
                        margin-bottom: 3px;
                    }
                    span {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #b2b2b2;
                    }
                }
                .no-assess {
                    font-family: PingFangSC-Regular;
                    font-size: 28px;
                    color: #b2b2b2;
                }
            }
            /*仅有一个*/
            .is-only {
                .m-cont {
                    flex-direction: column;
                }
                .m-item-tip {
                    font-size: 18px;
                }
                .m-item-cont {
                    p {
                        font-size: 66px;
                        letter-spacing: 1.65px;
                        margin-bottom: 11px;
                    }
                    span {
                        font-size: 18px;
                    }
                }
            }
            /*正方体*/
            .cube {
                width: 50%;
                .m-cont {
                    flex-direction: column;
                }
            }
            /*长方体*/
            .cuboid {
                width: 100%;
                .m-cont {
                    align-items: center;
                }
                .m-item-tip {
                    padding: 0px 15px;
                }
            }
            .m-group-area {
                .s-m-item {
                    width: 100%;
                    margin: 6px 0px;
                    height: 38px;
                    background-color: #f4f4f4;
                    border-radius: 6px;
                    padding: 0px 10px;
                    .points {
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: #13b1a6;
                        letter-spacing: 0.4px;
                    }
                }
            }
        }
        .user-info {
            border-bottom: 1px solid #efefef;
            text-align: center;
            padding: 20px 0px;
            .user-header {
                border-radius: 50%;
                width: 65px;
                height: 65px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 10px auto;
                background-color: #a27466;
                color: #fff;
                font-weight: bold;
                font-size: 20px;
            }
            .user-name {
                font-size: 16px;
            }
        }
        .info-area {
            padding: 20px 10px;
            font-size: 16px;
            .info-row {
                padding: 8px 0px;
                display: flex;
                span {
                    display: block;
                }
                .row-tip {
                    flex-shrink: 0;
                    color: #b2b2b2;
                    width: 80px;
                    text-align: justify;
                    padding-right: 10px;
                }
                .row-tip:after {
                    display: inline-block;
                    width: 100%;
                    content: "";
                }
                .row-cont {
                    color: #222222;
                    line-height: 27px;
                    .row-cont-class {
                        display: inline-block;
                        color: #5d964d;
                        background: #e5f4e5;
                        border-radius: 6px;
                        padding: 0px 10px;
                        margin-bottom: 5px;
                    }
                    .row-cont-sex {
                        display: inline-block;
                        background: #c3e0fd;
                        color: #399dff;
                        border-radius: 6px;
                        padding: 0px 10px;
                        margin-bottom: 5px;
                    }
                    .is-female {
                        background: #f9ede8;
                        color: #e58989;
                        border-radius: 6px;
                        padding: 0px 10px;
                    }
                }
                .row-cont:after {
                    display: inline-block;
                    width: 100%;
                    content: "";
                }
            }
        }
        .meddle-m-item {
            // flex-shrink: 0;
            // width: 50%;
            .meddle-area {
                .arrow-radius {
                    top: 15px;
                    right: 15px;
                    left: auto;
                    bottom: auto;
                }
                .meddle-record {
                    .record-item {
                        background: #fafafa;
                        border-radius: 8px;
                        padding: 10px 13px;
                        margin-bottom: 12px;
                        height: 80px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        cursor: pointer;
                        p {
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #333333;
                            line-height: 22px;
                            display: block;
                            height: 22px;
                        }
                        span {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #7f7f7f;
                            line-height: 20px;
                            margin-right: 5px;
                        }
                    }
                    .record-item:hover {
                        box-shadow: 0px 0px 10px #e0e0e0;
                    }
                }
            }
        }

        .has-no-data {
            font-size: 16px;
            text-align: center;
            color: #b2b2b2;
            padding-top: 140px;
        }
    }

    .activity-record {
        padding: 20px;
        margin-right: 10px;
        border-radius: 5px;
        background-color: #fff;
    }
}
</style>