<template>
    <div class="file-detail">
        <div class="detail-l text-flow"> 
            <div class="m-item trans-pre-box" style="width:50%;" :class="{animActive:animLoading}">
                <div class="m-cont trans-main-box" :class="{active:moreActive}">
                    <div class="trans-box trans-box-front" :class="{active:!moreActive}">
                        <div class="user-info">
                            <div class="user-header">{{memberInfo.member_name && memberInfo.member_name.slice(-2)}}</div>
                            <p class="user-name w-break">{{memberInfo.member_name}}</p>
                        </div>
                        <div class="info-area" style="padding-bottom: 0px;">
                            <p class="info-row">
                                <span class="row-tip">所在组织</span>
                                <span class="row-cont">{{memberInfo.structure_name}}</span>
                            </p>
                            <p class="info-row">
                                <span class="row-tip">联系方式</span>
                                <span class="row-cont">{{memberInfo.mobile_phone}}</span>
                            </p>
                            <div class="info-row">
                                <span class="row-tip">其他信息</span>
                                <div class="flex-b-c row-cont-box">
                                    <span class="row-cont flex-s-c" style="display:flex;">
                                        <span class="row-cont-sex" :class="{'is-female' : memberInfo.student_sex == 2}">{{memberInfo.gender_str}}</span>
                                        <span class="row-cont-class">{{memberInfo.marriage_str}}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="more-box flex-e-c pointer p-t-10 more-point" @click="moreInfo">
                                <span>更多</span>
                                <div class="more-icon flex-c-c"></div>
                            </div>
                        </div>
                    </div>
                    <div class="trans-box trans-box-behind" :class="{active:moreActive}">
                        <div class="detail-box">
                            <div class="more-box flex-s-c pointer back-point" @click="moreInfo">
                                <div class="more-icon flex-c-c"></div>
                                <span>返回</span>
                            </div>
                            <div class="header-box">
                                <div class="user-header">{{memberInfo.member_name && memberInfo.member_name.slice(-2)}}</div>
                            </div>
                            <div class="msg-box">
                                <div class="msg-item">
                                    <div class="msg-tip">所在组织</div>
                                    <div class="msg-content">{{memberInfo.structure_name||"未知"}}</div>
                                </div>
                                <div class="msg-item">
                                    <div class="msg-tip">联系方式</div>
                                    <div class="msg-content">{{memberInfo.mobile_phone||"未知"}}</div>
                                </div>
                                <div class="msg-item">
                                    <div class="msg-tip">性别</div>
                                    <div class="msg-content">{{memberInfo.gender_str||"未知"}}</div>
                                </div>
                                <div class="msg-item">
                                    <div class="msg-tip">年龄</div>
                                    <div class="msg-content">{{memberInfo.age||"未知"}}</div>
                                </div>
                                <div class="msg-item">
                                    <div class="msg-tip">婚姻</div>
                                    <div class="msg-content">{{memberInfo.marriage_str||"未知"}}</div>
                                </div>
                                <div class="msg-item">
                                    <div class="msg-tip">生育</div>
                                    <div class="msg-content">{{memberInfo.bear||"未知"}}</div>
                                </div>
                                <div class="msg-item">
                                    <div class="msg-tip">学历</div>
                                    <div class="msg-content">{{memberInfo.qualification||"未知"}}</div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>

            <div class="m-item meddle-m-item text-flow" style="width:50%;">
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
                                <template v-if="pItem.record_id">
                                    <p>{{pItem.points}}</p>
                                    <span>
                                        {{pItem.t_is_main > 0 ? pItem.complete_time + '测评得分' : '维度得分：' + pItem.rule_name}}
                                    </span>
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
        <moreModel ref="moreModelRef" :memberInfo="memberInfo" :type="pageQuery.type"></moreModel>
    </div>
</template>

<script>
import moreModel from "./more-model.vue";
    export default {
        components: {
            moreModel,
        },
        data() {
            return {
                memberInfo:{},
                modePoints:[],
                userId:0,
                meddleRecord: [],
                moreActive:false,
                animLoading:false,
            }
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
                        other: {
                            isErrorMsg: true
                        }
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
                    name: this.pageQuery.type == 'earlyWarn' ? "earlyWarnMeddle" : "psychicFilesMeddle",
                    query: {
                        userId: this.userId,
                        name:this.memberInfo.member_name||""
                    },
                });
            },
            moreInfo(){
                if(this.animLoading)return;
                this.animLoading = true;
                setTimeout(() => {
                    this.moreActive = !!!this.moreActive;
                }, 100);
                setTimeout(() => {
                    this.animLoading = false;
                }, 1150);
                
            },
        }, 
        mounted() {
            this.init();
            if (this.userId > 0) {
                this.loadPsychicData();
                this.getMeddleRecord();
            }
        },
    }
</script>

<style lang="less" scoped>
@-moz-document url-prefix(){ 
    .file-detail{
        .detail-l{
            .trans-main-box{
                overflow: unset; //兼容:火狐动画结束后显示模糊
            }
            .trans-pre-box{ 
                -moz-transform-style:preserve-3d; //兼容:火狐动画结束后整个消失
            } 
        }
    }
}
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
                flex-direction: column;
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
        padding: 60px 0 44px 0px;
        .user-header {
            border-radius: 50%;
            width: 65px;
            height: 65px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px auto;
            background-color: #0083CE;
            // background-color: #a27466;
            color: #fff;
            font-weight: bold;
            font-size: 20px;
        }
        .user-name {
            margin-top: 15px;
            font-size: 16px;
        }
    }
    .info-area {
        padding: 20px 10px;
        font-size: 14px;
        .info-row {
            padding: 8px 0px;
            display: flex;
            span {
                display: block;
            }
            .row-tip {
                flex-shrink: 0;
                color: #b2b2b2;
                min-width: 96px;
                text-align: justify;
                padding-right: 30px;
            }
            .row-tip:after {
                display: inline-block;
                width: 100%;
                content: "";
            }
            .row-cont-box{
                width: 100%;
            }
            .row-cont {
                color: #222222;
                line-height: 20px;
                white-space: pre-wrap;
                .row-cont-class,.row-cont-sex {
                    display: inline-block;
                    color: #5d964d;
                    background: #e5f4e5;
                    border-radius: 6px;
                    padding: 0px 10px; 
                    flex-shrink: 0;
                }
                .row-cont-sex { 
                    background: #c3e0fd;
                    color: #399dff;
                    margin-right: 5px;
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
.more-box{
    color: #b2b2b2;
    font-size: 14px;
}
.more-icon{
    background: rgba(216,216,216,0.2);
    width: 22px;
    height: 22px;
    border-radius: 50%;
    // margin-left: 8px;
    &::after{
        content:"";
        width: 5px;
        height: 5px;
        border-right: 1px solid #4E5969;
        border-bottom: 1px solid #4E5969;
        transform: rotate(-45deg);
    }
}
.more-point{
    margin-right: -10px;
}

.trans-pre-box{
    min-width: 250px;
    &.animActive{
        transform-style:preserve-3d;
        perspective: 1000px;
    }
}
.trans-main-box{
    min-height: 420px !important;
    transform: rotateY(0); 
    overflow: hidden;
    transition: transform 1s; 
    display: flex;
    padding: 0px !important;
    &.active{
        transform: rotateY(180deg); 
    }
}
.trans-box{
    position: absolute;
    background-color:#fff; 
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
    transition: all 1s;
    padding: 15px;
    .info-area{
        padding: 25px 5px;
    }
} 
.trans-box-front{
        z-index: 1;
}
.trans-box-behind{ 
    z-index: 1;
    transform: rotateY(180deg); 
}
.trans-box-front.active{
    z-index: 2;
    position: relative;
}
.trans-box-behind.active{
    z-index: 2;
    position: relative;
}
.detail-box{
    padding: 15px;
    font-size: 14px;
    .user-header{
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center; 
        background-color: #0083CE;
        // background-color: #a27466;
        color: #fff;
        font-weight: bold;
    }
    .msg-box{
        margin-top: 16px;
        .msg-item{ 
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            &:last-child{
                margin-bottom: 0;
            }
            .msg-tip{
                min-width: 80px;
                padding-right: 20px;
                color:#7F7F7F;
            }
        }
        .msg-content{
            white-space: pre-wrap;
        }
    } 
    .more-box{
        margin-bottom: 30px;
    }
    .more-icon{
        transform: rotate(180deg);
        margin-left: 0;
        // margin-right: 8px;
    }
    .back-point{
        margin-left: -10px;
    }
} 
</style>